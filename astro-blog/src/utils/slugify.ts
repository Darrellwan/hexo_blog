/**
 * Build tag URLs from the Hexo separator rule, lowercased.
 *
 * Keep the Hexo separator rule so tag URLs stay recognisable, then lowercase.
 * The character class and the collapse/trim order match
 * `hexo-util/dist/slugize.js`; only the final lowercase step differs.
 *
 *   "GA4 證照"        -> "ga4-證照"
 *   "Antigravity 2.0" -> "antigravity-2-0"
 *   "ChatGPT"         -> "chatgpt"
 *
 * Lowercasing is deliberate (2026-08-26): it merges tags that differ only by
 * case, which the live site splits into two half-empty pages.  `public/_redirects`
 * sends every legacy mixed-case tag URL here with a 308.
 *
 * Do not swap this for a generic slug library. `lodash.kebabcase` splits on the
 * letter/digit boundary ("GA4 證照" -> "ga-4-證照"), which is a different tag.
 */
const CONTROL_CHARACTERS = /[\u0000-\u001f]/g;
const SEPARATOR_CHARACTERS = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'<>,.?/]+/g;
const COMBINING_MARKS = /[\u0300-\u036f]/g;

export const slugifyStr = (str: string): string =>
  str
    // Strip Latin diacritics the way hexo-util's escapeDiacritic does. NFC
    // recomposition keeps Hangul and other decomposable scripts intact.
    .normalize("NFD")
    .replace(COMBINING_MARKS, "")
    .normalize("NFC")
    .replace(CONTROL_CHARACTERS, "")
    .replace(SEPARATOR_CHARACTERS, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
