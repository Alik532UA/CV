import { base } from "$app/paths";
import type { Language } from "$lib/controllers/I18nState.svelte";

/**
 * English is the site's default and lives at the bare path, because a CV is
 * expected in English first. /en/ still resolves — it is generated so every
 * language has an explicit address — but it points its canonical at the bare
 * path so search engines treat the two as one page rather than duplicates.
 *
 * The default is the British text; American English is its own locale at
 * /en-us/ (see the Language type in controllers/I18nState.svelte.ts).
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
export const INDEXED_LANGUAGES: readonly Language[] = ["en", "en-us", "uk", "ja"];

export function isIndexed(lang: Language): boolean {
	return INDEXED_LANGUAGES.includes(lang);
}

/**
 * The tag form for `lang` and `hreflang`. URL segments stay lowercase so a
 * hand-typed /CV/en-us/ resolves on case-sensitive static hosting, while the
 * attribute gets the canonical spelling — language lowercase, region uppercase.
 *
 * "en" stays generic on purpose rather than becoming "en-GB": a plain "en"
 * alternate is what search engines fall back to for every English region that
 * is not the US, which is exactly the job the British text does here.
 */
export function bcp47(lang: Language): string {
	return lang.replace(/-([a-z]{2})$/, (_, region: string) => `-${region.toUpperCase()}`);
}

/**
 * og:locale wants the underscore form. Only the reviewed languages are worth
 * spelling out; the rest are noindex machine translations, so they report the
 * site's default English rather than each carrying a hand-written entry.
 */
const OG_LOCALES: Partial<Record<Language, string>> = {
	en: "en_GB",
	"en-us": "en_US",
	uk: "uk_UA",
	ja: "ja_JP"
};

export function ogLocale(lang: Language): string {
	return OG_LOCALES[lang] ?? "en_GB";
}

/** Path for a language, with the trailing slash this site serves. */
export function langPath(lang: Language): string {
	return lang === DEFAULT_LANGUAGE ? `${base}/` : `${base}/${lang}/`;
}

/** Absolute form, for canonical and hreflang tags. */
export function langUrl(origin: string, lang: Language): string {
	return lang === DEFAULT_LANGUAGE ? `${origin}/CV/` : `${origin}/CV/${lang}/`;
}
