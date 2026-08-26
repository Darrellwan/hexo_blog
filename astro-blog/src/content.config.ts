import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";
// Note: image() helper removed since ogImage is now a plain string field

export const BLOG_PATH = "src/data/blog";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: () =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      // Hexo `no_ads`: suppresses the in-article AdSense unit on a single post.
      no_ads: z.boolean().optional(),
      // Preserved Hexo metadata; consumers can adopt these fields incrementally.
      sticky: z.coerce.number().optional(),
      ai_assistance: z.string().optional(),
      include: z.array(z.string()).optional(),
      preload: z.array(z.string()).optional(),
      socialText: z.string().optional(),
      "twitter-id": z.string().optional(),
      comments: z.boolean().optional(),
      cover: z.string().optional(),
      coverImage: z.string().optional(),
      darrell_structured_data: z
        .object({
          type: z.string().optional(),
          question: z.array(z.string()).optional(),
          answer: z.array(z.string()).optional(),
        })
        .optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: z.string().optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      // Extra Hexo fields
      categories: z.array(z.string()).optional(),
      slug: z.string().optional(),
      id: z.string().optional(),
      bgImage: z.string().optional(),
      page_type: z.string().optional(),
    }),
});

export const collections = { blog };
