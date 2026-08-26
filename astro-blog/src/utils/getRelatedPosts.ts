import type { CollectionEntry } from "astro:content";

type BlogPost = CollectionEntry<"blog">;

/** Normalize tags before comparing them, including full-width text and case. */
export function normalizeTag(tag: string): string {
  return tag.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

const uniqueNormalizedTags = (post: BlogPost): Set<string> =>
  new Set((post.data.tags ?? []).map(normalizeTag).filter(Boolean));

/**
 * Return the most tag-relevant published posts, preserving the input order for
 * ties so getSortedPosts remains the date tie-breaker.
 */
export function getRelatedPosts(
  currentPost: BlogPost,
  posts: BlogPost[],
  limit = 3
): BlogPost[] {
  const currentTags = uniqueNormalizedTags(currentPost);
  if (!currentTags.size || limit <= 0) return [];

  return posts
    .map((candidate, index) => {
      const candidateTags = uniqueNormalizedTags(candidate);
      const score = [...currentTags].filter(tag =>
        candidateTags.has(tag)
      ).length;
      return { candidate, index, score };
    })
    .filter(
      ({ candidate, score }) =>
        score > 0 && !candidate.data.draft && candidate.id !== currentPost.id
    )
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
