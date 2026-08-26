/**
 * Validation script: Compare Hexo build output vs Astro build output
 * Checks that custom tag CSS classes and img counts match between the two.
 */

import * as fs from "fs";
import * as path from "path";
import * as cheerio from "cheerio";

// ============================================
// Configuration
// ============================================

// Paths resolve from this script, so the tool validates whichever checkout it runs in
// (git worktrees included). Override with env vars when comparing across checkouts.
const ASTRO_ROOT = path.resolve(import.meta.dirname, "..");
const HEXO_PUBLIC = process.env.HEXO_PUBLIC ?? path.resolve(ASTRO_ROOT, "../public");
const ASTRO_DIST = process.env.ASTRO_DIST ?? path.resolve(ASTRO_ROOT, "dist");
// Article URLs are canonical at /{slug}/. Set this only for an explicitly
// selected fixture with a different, documented output prefix.
const ASTRO_POSTS_PREFIX = process.env.ASTRO_POSTS_PREFIX ?? "";

// These tags do not all produce CSS classes. Keep the names explicit so a
// newly handled tag cannot silently fall outside validation coverage.
const CUSTOM_TAGS_TO_CHECK: Record<string, string> = {
  video: "Video tag",
  raw: "Raw block",
};

// CSS classes to check (class name → display label)
const CLASSES_TO_CHECK: Record<string, string> = {
  "dn-note": "Callout (dn-note)",
  "faq-container": "FAQ container",
  "faq-item": "FAQ item",
  "term-tooltip": "Term tooltip",
  "data-table-wrapper": "Data table",
  "quick-nav": "Quick nav",
  "article-card": "Article card",
  "template-card": "Template card",
  "blog-images": "Blog image (figure)",
  "dn-cta": "CTA card",
};

// ============================================
// Helpers
// ============================================

function getPostSlugs(hexoDir: string): string[] {
  const entries = fs.readdirSync(hexoDir, { withFileTypes: true });
  const slugs: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const indexHtml = path.join(hexoDir, entry.name, "index.html");
    if (fs.existsSync(indexHtml)) {
      slugs.push(entry.name);
    }
  }
  return slugs;
}

function countClass(html: string, className: string): number {
  const $ = cheerio.load(html);
  return $(`.${className}`).length;
}

function countImgs(html: string): number {
  const $ = cheerio.load(html);
  return $("img").length;
}

function hasAnyCustomClass(html: string): boolean {
  for (const cls of Object.keys(CLASSES_TO_CHECK)) {
    if (html.includes(cls)) return true;
  }
  for (const tagName of Object.keys(CUSTOM_TAGS_TO_CHECK)) {
    if (tagName === "video" && /<video\b/i.test(html)) return true;
  }
  return false;
}

function findResidualHexoTags(html: string): string[] {
  const residual = new Set<string>();
  for (const match of html.matchAll(/\{%\s*([A-Za-z][A-Za-z0-9_-]*)/g)) {
    residual.add(match[1]);
  }
  return [...residual].sort();
}

/** Find the one exact Astro output path for a canonical Hexo slug. */
function findAstroHtml(slug: string): string | null {
  const relativeDir = ASTRO_POSTS_PREFIX
    ? path.join(ASTRO_POSTS_PREFIX, slug)
    : slug;
  const exactPath = path.join(ASTRO_DIST, relativeDir, "index.html");
  return fs.existsSync(exactPath) ? exactPath : null;
}

// ============================================
// Main validation
// ============================================

interface ClassResult {
  className: string;
  label: string;
  hexoCount: number;
  astroCount: number;
  status: "pass" | "warn" | "fail";
}

interface PostResult {
  slug: string;
  found: boolean;
  astroPath: string | null;
  classes: ClassResult[];
  imgHexo: number;
  imgAstro: number;
  imgStatus: "pass" | "warn" | "fail";
  hasCustomTags: boolean;
  residualTags: string[];
}

function validatePost(slug: string): PostResult {
  const hexoHtmlPath = path.join(HEXO_PUBLIC, slug, "index.html");
  const hexoHtml = fs.readFileSync(hexoHtmlPath, "utf-8");
  const hasCustom = hasAnyCustomClass(hexoHtml);

  const astroPath = findAstroHtml(slug);

  if (!astroPath) {
    return {
      slug,
      found: false,
      astroPath: null,
      classes: [],
      imgHexo: 0,
      imgAstro: 0,
      imgStatus: "pass",
      hasCustomTags: hasCustom,
      residualTags: [],
    };
  }

  const astroHtml = fs.readFileSync(astroPath, "utf-8");
  const residualTags = findResidualHexoTags(astroHtml);

  // Compare classes
  const classes: ClassResult[] = [];
  for (const [cls, label] of Object.entries(CLASSES_TO_CHECK)) {
    const hexoCount = countClass(hexoHtml, cls);
    const astroCount = countClass(astroHtml, cls);

    if (hexoCount === 0 && astroCount === 0) continue; // skip irrelevant

    let status: "pass" | "warn" | "fail";
    if (hexoCount === astroCount) {
      status = "pass";
    } else if (hexoCount > 0 && astroCount === 0) {
      status = "fail"; // Hexo has it, Astro doesn't
    } else {
      status = "warn"; // counts differ but both exist
    }

    classes.push({ className: cls, label, hexoCount, astroCount, status });
  }

  // Compare img counts
  const imgHexo = countImgs(hexoHtml);
  const imgAstro = countImgs(astroHtml);
  let imgStatus: "pass" | "warn" | "fail" = "pass";
  if (imgHexo > 0 && imgAstro === 0) {
    imgStatus = "fail";
  } else if (imgHexo !== imgAstro) {
    imgStatus = "warn";
  }

  return {
    slug,
    found: true,
    astroPath,
    classes,
    imgHexo,
    imgAstro,
    imgStatus,
    hasCustomTags: hasCustom,
    residualTags,
  };
}

function main() {
  // Verify directories exist
  if (!fs.existsSync(HEXO_PUBLIC)) {
    console.error(`❌ Hexo public/ not found: ${HEXO_PUBLIC}`);
    console.error("   Run: cd /Users/darrellwang/Darrell/code/blog && npx hexo generate");
    process.exit(1);
  }
  if (!fs.existsSync(ASTRO_DIST)) {
    console.error(`❌ Astro dist/ not found: ${ASTRO_DIST}`);
    console.error("   Run `npm run build` in this checkout, or set ASTRO_DIST");
    process.exit(1);
  }

  const slugs = getPostSlugs(HEXO_PUBLIC);
  console.log(`\n📋 Found ${slugs.length} Hexo posts\n`);
  console.log(
    `📋 Custom tag coverage: ${Object.entries(CUSTOM_TAGS_TO_CHECK)
      .map(([tag, label]) => `${tag} (${label})`)
      .join(", ")}\n`
  );

  // Build Astro slug index for quick lookup
  const astroPostSlugs = new Set<string>();
  const astroPostsDir = path.join(ASTRO_DIST, ASTRO_POSTS_PREFIX);
  if (fs.existsSync(astroPostsDir)) {
    for (const entry of fs.readdirSync(astroPostsDir, { withFileTypes: true })) {
      if (entry.isDirectory()) astroPostSlugs.add(entry.name);
    }
  }
  console.log(`📋 Found ${astroPostSlugs.size} Astro posts\n`);

  let totalPassed = 0;
  let totalWarnings = 0;
  let totalFailed = 0;
  let totalMissing = 0;
  let totalSkipped = 0;

  const failedPosts: PostResult[] = [];
  const warningPosts: PostResult[] = [];
  const missingPosts: string[] = [];

  for (const slug of slugs) {
    const result = validatePost(slug);

    if (!result.found) {
      if (result.hasCustomTags) {
        totalMissing++;
        missingPosts.push(slug);
      } else {
        totalSkipped++;
      }
      continue;
    }

    if (!result.hasCustomTags && result.classes.length === 0) {
      totalSkipped++;
      continue;
    }

    const hasFail =
      result.classes.some(c => c.status === "fail") ||
      result.imgStatus === "fail" ||
      result.residualTags.length > 0;
    const hasWarn = result.classes.some(c => c.status === "warn") || result.imgStatus === "warn";

    if (hasFail) {
      totalFailed++;
      failedPosts.push(result);
    } else if (hasWarn) {
      totalWarnings++;
      warningPosts.push(result);
    } else {
      totalPassed++;
    }
  }

  // ============================================
  // Report
  // ============================================

  // Failures
  if (failedPosts.length > 0) {
    console.log("=" .repeat(60));
    console.log("❌ FAILURES");
    console.log("=" .repeat(60));
    for (const r of failedPosts) {
      console.log(`\n  📄 ${r.slug}`);
      for (const c of r.classes) {
        const icon = c.status === "fail" ? "❌" : c.status === "warn" ? "⚠️" : "✅";
        console.log(`     ${icon} ${c.label}: Hexo=${c.hexoCount} Astro=${c.astroCount}`);
      }
      if (r.imgStatus !== "pass") {
        const icon = r.imgStatus === "fail" ? "❌" : "⚠️";
        console.log(`     ${icon} Images: Hexo=${r.imgHexo} Astro=${r.imgAstro}`);
      }
      if (r.residualTags.length > 0) {
        console.log(`     ❌ Residual Hexo tags: ${r.residualTags.join(", ")}`);
      }
    }
    console.log();
  }

  // Warnings
  if (warningPosts.length > 0) {
    console.log("=" .repeat(60));
    console.log("⚠️  WARNINGS");
    console.log("=" .repeat(60));
    for (const r of warningPosts) {
      console.log(`\n  📄 ${r.slug}`);
      for (const c of r.classes) {
        if (c.status === "warn") {
          console.log(`     ⚠️  ${c.label}: Hexo=${c.hexoCount} Astro=${c.astroCount}`);
        }
      }
      if (r.imgStatus === "warn") {
        console.log(`     ⚠️  Images: Hexo=${r.imgHexo} Astro=${r.imgAstro}`);
      }
    }
    console.log();
  }

  // Missing posts with custom tags
  if (missingPosts.length > 0) {
    console.log("=" .repeat(60));
    console.log("🔍 MISSING IN ASTRO (has custom tags in Hexo)");
    console.log("=" .repeat(60));
    for (const s of missingPosts) {
      console.log(`     ${s}`);
    }
    console.log();
  }

  // Summary
  console.log("=" .repeat(60));
  console.log("📊 SUMMARY");
  console.log("=" .repeat(60));
  console.log(`  ✅ Passed:   ${totalPassed}`);
  console.log(`  ⚠️  Warnings: ${totalWarnings}`);
  console.log(`  ❌ Failed:   ${totalFailed}`);
  console.log(`  🔍 Missing:  ${totalMissing} (Hexo posts not in Astro)`);
  console.log(`  ⏭️  Skipped:  ${totalSkipped} (no custom tags or not in Astro)`);
  console.log(`  📋 Total:    ${slugs.length}`);
  console.log();

  if (totalFailed > 0 || totalMissing > 0) {
    console.log("❌ Validation FAILED — see failures or missing posts above");
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log("⚠️  Validation passed with warnings");
  } else {
    console.log("✅ All validations passed!");
  }
}

main();
