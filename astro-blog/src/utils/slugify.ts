/**
 * Reproduce the Hexo tag URL rule so migrated tag pages keep their live URLs.
 *
 * Hexo builds `/tags/<name>/` with hexo-util `slugize` and the default
 * `filename_case: 0`, which preserves case and CJK. The character class and
 * the collapse/trim order below match `hexo-util/dist/slugize.js` exactly.
 *
 *   "GA4 證照"        -> "GA4-證照"
 *   "Antigravity 2.0" -> "Antigravity-2-0"
 *   "AI"              -> "AI"
 *
 * Do not swap this for a generic slug library. `lodash.kebabcase` splits on
 * the letter/digit boundary ("GA4" -> "ga-4") and `slugify` lowercases; both
 * change URLs that search engines already index.
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
    .replace(/^-+|-+$/g, "");

export const slugifyAll = (arr: string[]) => arr.map(str => slugifyStr(str));
