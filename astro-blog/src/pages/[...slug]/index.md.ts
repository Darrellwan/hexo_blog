import { readFile } from "node:fs/promises";
import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { getPath } from "@/utils/getPath";

type MarkdownProps = {
  post: CollectionEntry<"blog">;
};

export async function getStaticPaths() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: getPath(post.filePath).replace(/^\//, "") },
    props: { post },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as MarkdownProps;

  if (!post?.filePath) {
    return new Response("Markdown source is unavailable.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const source = await readFile(post.filePath, "utf-8");
  return new Response(source, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
