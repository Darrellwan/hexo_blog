import { fileURLToPath } from "node:url";
import { readFile, readdir, rename, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { AstroIntegration } from "astro";
import { defineConfig, envField, fontProviders } from "astro/config";
import { unified } from "@astrojs/markdown-remark";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import remarkHexoTags, { preprocessMarkdownSource, remarkHexoPreprocess, derivePostSlug } from "./src/plugins/remark-hexo-tags";
import remarkHeadingAnchors from "./src/plugins/remark-heading-anchors";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";

const PAGEFIND_ENTRYPOINTS = [
  "n8n-tutorial-resources/index.html",
  "tools/n8n_template/models.html",
  "n8n-expert/index.html",
] as const;
const PAGEFIND_LOW_WEIGHT_CLASSES = ["bottom-cta", "sidebar-wrapper"] as const;

const findHTMLFiles = async (directory: string): Promise<string[]> => {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findHTMLFiles(path));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(path);
  }
  return files;
};

/**
 * @astrojs/sitemap writes an index plus one or more chunks. The public site
 * has one stable sitemap URL, so promote the one generated chunk after the
 * sitemap integration has completed. A second chunk is a hard failure: a
 * silent rename would publish an incomplete sitemap.
 */
const postprocessBuildOutput: AstroIntegration = {
  name: "darrelltw-build-output",
  hooks: {
    "astro:build:done": async ({ dir, logger }) => {
      const outputDir = fileURLToPath(dir);
      const outputNames = await readdir(outputDir);
      const sitemapIndexName = "sitemap-index.xml";
      const sitemapChunks = outputNames.filter(name =>
        /^sitemap-\d+\.xml$/.test(name)
      );

      if (!outputNames.includes(sitemapIndexName)) {
        throw new Error(
          `Expected ${sitemapIndexName} from @astrojs/sitemap, but it was not created.`
        );
      }
      if (sitemapChunks.length !== 1) {
        throw new Error(
          `Expected exactly one root sitemap chunk, found ${sitemapChunks.length}: ${sitemapChunks.join(", ") || "none"}.`
        );
      }

      const sitemapIndexPath = join(outputDir, sitemapIndexName);
      const sitemapIndex = await readFile(sitemapIndexPath, "utf8");
      const indexLocations = [
        ...sitemapIndex.matchAll(/<loc>([^<]+)<\/loc>/g),
      ].map(match => match[1]);
      if (
        indexLocations.length !== 1 ||
        !indexLocations[0].endsWith(`/${sitemapChunks[0]}`)
      ) {
        throw new Error(
          `Expected the sitemap index to reference only ${sitemapChunks[0]}, found: ${indexLocations.join(", ") || "none"}.`
        );
      }

      const canonicalSitemapPath = join(outputDir, "sitemap.xml");
      if (outputNames.includes("sitemap.xml")) {
        throw new Error("Refusing to overwrite an existing root sitemap.xml.");
      }
      await rename(join(outputDir, sitemapChunks[0]), canonicalSitemapPath);
      await unlink(sitemapIndexPath);
      logger.info("Promoted the single sitemap chunk to /sitemap.xml.");

      // Pagefind indexes only data-pagefind-body regions once a site has one.
      // These three legacy standalone entry pages are intentionally included;
      // other public HTML (tools, retired pages, and search) stays excluded.
      for (const relativePath of PAGEFIND_ENTRYPOINTS) {
        const pagePath = join(outputDir, relativePath);
        const html = await readFile(pagePath, "utf8");
        const mainTags = html.match(/<main\b[^>]*>/gi) ?? [];
        if (mainTags.length !== 1) {
          throw new Error(
            `Expected exactly one <main> in ${relativePath}, found ${mainTags.length}.`
          );
        }
        if (mainTags[0].includes("data-pagefind-body")) continue;
        const updatedHtml = html.replace(
          /<main\b/,
          "<main data-pagefind-body"
        );
        await writeFile(pagePath, updatedHtml, "utf8");
      }
      logger.info(
        `Annotated ${PAGEFIND_ENTRYPOINTS.length} standalone pages for Pagefind.`
      );

      // Shared conversion CTAs and sidebars can make unrelated n8n queries
      // match every article. Keep them searchable at a zero Pagefind weight;
      // this preserves article text while preventing shared copy from winning
      // the top-three relevance gate.
      let weightedSections = 0;
      for (const pagePath of await findHTMLFiles(outputDir)) {
        const html = await readFile(pagePath, "utf8");
        if (!html.includes("data-pagefind-body")) continue;
        let updatedHtml = html;
        for (const className of PAGEFIND_LOW_WEIGHT_CLASSES) {
          const classPattern = new RegExp(
            `<div(?=[^>]*\\bclass="[^"]*\\b${className}\\b[^"]*")[^>]*>`,
            "g"
          );
          updatedHtml = updatedHtml.replace(classPattern, tag =>
            tag.includes("data-pagefind-weight")
              ? tag
              : tag.replace("<div", '<div data-pagefind-weight="0"')
          );
        }
        if (updatedHtml !== html) {
          await writeFile(pagePath, updatedHtml, "utf8");
          weightedSections += 1;
        }
      }
      logger.info(`Applied low Pagefind weight to ${weightedSections} article pages.`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
      customPages: [
        new URL("n8n-expert/", SITE.website).href,
        new URL("tools/n8n_template/models.html", SITE.website).href,
      ],
    }),
    postprocessBuildOutput,
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [
        remarkHexoPreprocess,
        remarkHexoTags,
        remarkHeadingAnchors,
        remarkToc,
        [remarkCollapse, { test: "Table of contents" }],
      ],
    }),
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    plugins: [
      tailwindcss(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {
        name: "vite-plugin-hexo-tags-preprocess",
        transform(code: string, id: string) {
          if (!id.endsWith(".md")) return;
          if (!code.includes("{%")) return;
          const postSlug = derivePostSlug(id);
          return { code: preprocessMarkdownSource(code, postSlug), map: null };
        },
      } as any,
    ],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  fonts: [
    {
      name: "Google Sans Code",
      cssVariable: "--font-google-sans-code",
      provider: fontProviders.google(),
      fallbacks: ["monospace"],
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
    },
  ],
});
