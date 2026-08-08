import { base } from "$app/paths";
import type { Language } from "$lib/controllers/I18nState.svelte";

/**
 * English is the site's default and lives at the bare path, because a CV is
 * expected in English first. /en/ still resolves — it is generated so every
 * language has an explicit address — but it points its canonical at the bare
 * path so search engines treat the two as one page rather than duplicates.
 */
export const DEFAULT_LANGUAGE: Language = "en";

/**
 * Only these get hreflang and are allowed into the index. The rest are machine
 * translations that no native speaker has reviewed, and Google treats bulk
 * unreviewed translation as low-quality content — indexing forty of them could
 * cost the domain more than the extra reach is worth. They stay fully usable:
 * real URLs, real prerendered content, just marked noindex.
 *
 * Promoting a language is a one-line change here once someone has read it over.
 */
export const INDEXED_LANGUAGES: readonly Language[] = ["en", "uk", "ja"];

export function isIndexed(lang: Language): boolean {
	return INDEXED_LANGUAGES.includes(lang);
}

/** Path for a language, with the trailing slash this site serves. */
export function langPath(lang: Language): string {
	return lang === DEFAULT_LANGUAGE ? `${base}/` : `${base}/${lang}/`;
}

/** Absolute form, for canonical and hreflang tags. */
export function langUrl(origin: string, lang: Language): string {
	return lang === DEFAULT_LANGUAGE ? `${origin}/CV/` : `${origin}/CV/${lang}/`;
}
