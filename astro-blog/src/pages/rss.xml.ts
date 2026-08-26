import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPath } from "@/utils/getPath";
import postFilter from "@/utils/postFilter";
import { SITE } from "@/config";

const escapeXml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    character =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[character] ?? character
  );

export async function GET() {
  const posts = await getCollection("blog");
  const sortedPosts = posts
    .filter(postFilter)
    .sort(
      (left, right) =>
        right.data.pubDatetime.getTime() - left.data.pubDatetime.getTime()
    );
  const feedURL = new URL("rss.xml", SITE.website).href;
  const latestPubDate = sortedPosts[0]?.data.pubDatetime;

  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    xmlns: { atom: "http://www.w3.org/2005/Atom" },
    customData: [
      `<atom:link href="${escapeXml(feedURL)}" rel="self" type="application/rss+xml"/>`,
      latestPubDate ? `<pubDate>${latestPubDate.toUTCString()}</pubDate>` : "",
    ].join(""),
    items: sortedPosts.map(({ data, filePath }) => {
      const canonicalPath = getPath(filePath);
      const canonicalURL = new URL(canonicalPath, SITE.website).href;
      const link = `${canonicalURL}?utm_source=rss_feed&utm_medium=rss`;
      const categories = [
        ...(data.categories ?? []),
        ...data.tags,
      ].filter(category => category.trim().length > 0);

      return {
        link,
        title: data.title,
        description: data.description,
        pubDate: data.pubDatetime,
        categories,
        commentsUrl: `${canonicalURL}#disqus_thread`,
        customData: [
          `<guid>${escapeXml(canonicalURL)}</guid>`,
          data.bgImage
            ? `<customImage>${escapeXml(
                new URL(
                  `${canonicalPath}${data.bgImage.replace(/^\/+/, "")}`,
                  SITE.website
                ).href
              )}</customImage>`
            : "",
        ].join(""),
      };
    }),
  });
}
