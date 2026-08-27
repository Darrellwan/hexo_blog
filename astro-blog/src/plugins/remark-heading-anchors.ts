/**
 * Heading anchor ids.
 *
 * Astro assigns ids with github-slugger, which deletes punctuation instead of
 * folding it into the separator: `1.100.0 Pre-release` becomes `11000-pre-release`
 * where Hexo produced `1-100-0-Pre-release`. Every migrated post therefore pins
 * `legacyAnchors: true` and keeps its published ids byte for byte, because a URL
 * fragment never reaches the server and no redirect can repair a broken one.
 *
 * Posts written from here on use the modern rule (see `slugizeModern`), and any
 * heading can override it with an explicit anchor:
 *
 *     ## 為什麼要用 Merge 節點 {#why-merge}
 *
 * This runs as a remark plugin so the id lands on the mdast node; Astro's own
 * `rehypeHeadingIds` only fills in headings that have no id yet, and the table
 * of contents reads whatever id ends up on the element.
 */
import type { Plugin } from "unified";
import type { Heading, Root, RootContent } from "mdast";
import { visit } from "unist-util-visit";
import { HeadingSlugger } from "../utils/headingSlug";

/**
 * `{#custom-slug}` at the end of a heading. Restricted to characters that need
 * no percent-encoding, which is the whole point of writing one by hand.
 */
const EXPLICIT_ANCHOR = /\s*\{#([A-Za-z][A-Za-z0-9._-]*)\}$/;

/**
 * Hexo's `anchors.level: 2` in main.yml: h1 never received an id. Legacy posts
 * keep that boundary so the collision counter counts exactly what it counted
 * before; their h1 ids are assigned afterwards, off the published contract.
 */
const LEGACY_MIN_DEPTH = 2;

/**
 * Heading text the way markdown-it assembles it, by concatenating the content
 * of every inline token. Raw HTML contributes its markup, which is how the live
 * site ended up with ids such as `span-id-setup-安裝與連線設定-span`.
 */
function headingText(nodes: readonly RootContent[]): string {
  let text = "";
  for (const node of nodes) {
    if (node.type === "text" || node.type === "inlineCode" || node.type === "html") {
      text += node.value;
    } else if (node.type === "image") {
      text += node.alt ?? "";
    } else if ("children" in node) {
      text += headingText(node.children as RootContent[]);
    }
  }
  return text;
}

/** Read and remove a trailing `{#id}`, so it never reaches the rendered text. */
function takeExplicitAnchor(heading: Heading): string | undefined {
  const last = heading.children.at(-1);
  if (!last || last.type !== "text") return undefined;

  const match = EXPLICIT_ANCHOR.exec(last.value);
  if (!match) return undefined;

  last.value = last.value.slice(0, match.index);
  if (last.value === "") heading.children.pop();
  return match[1];
}

/**
 * `hProperties` reaches the rendered element through mdast-util-to-hast, which
 * declares it by module augmentation. That augmentation is not in scope here,
 * so name the shape locally rather than depend on a transitive type.
 */
type HastProperties = Record<string, unknown>;

function assignId(heading: Heading, id: string): void {
  const data = (heading.data ??= {}) as { hProperties?: HastProperties };
  data.hProperties = { ...data.hProperties, id };
}

const remarkHeadingAnchors: Plugin<[], Root> = () => {
  return (tree, file) => {
    const frontmatter =
      (file.data as { astro?: { frontmatter?: Record<string, unknown> } }).astro
        ?.frontmatter ?? {};
    const legacy = frontmatter.legacyAnchors === true;

    const headings: Heading[] = [];
    visit(tree, "heading", (heading: Heading) => {
      headings.push(heading);
    });

    const explicitAnchors = new Map<Heading, string>();
    for (const heading of headings) {
      const explicit = takeExplicitAnchor(heading);
      if (explicit !== undefined) explicitAnchors.set(heading, explicit);
    }

    const slugger = new HeadingSlugger();
    // Claim hand-written ids first so a generated one can never collide with an
    // anchor an author is already linking to.
    for (const id of explicitAnchors.values()) slugger.reserve(id);

    const inContract = (heading: Heading) =>
      !legacy || heading.depth >= LEGACY_MIN_DEPTH;

    for (const pass of [inContract, (h: Heading) => !inContract(h)]) {
      for (const heading of headings) {
        if (!pass(heading)) continue;
        const explicit = explicitAnchors.get(heading);
        assignId(
          heading,
          explicit ?? slugger.slug(headingText(heading.children), legacy)
        );
      }
    }
  };
};

export default remarkHeadingAnchors;
