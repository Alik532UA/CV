import { base } from "$app/paths";
import { SITE_BASE } from "$lib/config/site.js";
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
 * Languages written right to left. Hebrew is the only one this site ships;
 * Arabic, Persian and Urdu would belong here too if they were ever added
 * (I18N-v8 § 6).
 *
 * WHY THIS EXISTS AT ALL. `he` was in the language list from the start and
 * `dir="rtl"` appeared nowhere in the project — so the Hebrew version rendered
 * left to right: punctuation at the wrong end of every line, and a document the
 * browser and screen reader both believed was LTR. PROJECT-CONTEXT.md carried
 * the debt as "either do it or drop `he` from the list"; this is doing it.
 *
 * A Set rather than a string comparison, because the mistake to avoid here is
 * `lang.startsWith("he")` — that also matches nothing today but would quietly
 * catch a future `he-IL` and miss `iw`, the deprecated tag some systems still
 * emit.
 */
const RTL_LANGUAGES: ReadonlySet<Language> = new Set<Language>(["he"]);

/**
 * The `dir` attribute for `<html>`. Used in two places that must not disagree:
 * `hooks.server.ts` bakes it into every prerendered page, and `I18nState.set()`
 * updates it when the visitor switches language without a reload.
 */
export function textDirection(lang: Language): "ltr" | "rtl" {
	return RTL_LANGUAGES.has(lang) ? "rtl" : "ltr";
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

/**
 * Absolute form, for canonical and hreflang tags.
 *
 * The base path comes from `config/site.js` rather than being spelled `/CV`
 * here: it was the third copy of that string in the project, and the one
 * nobody would think to look at when the site moves to its own domain.
 */
export function langUrl(origin: string, lang: Language): string {
	return lang === DEFAULT_LANGUAGE
		? `${origin}${SITE_BASE}/`
		: `${origin}${SITE_BASE}/${lang}/`;
}

/**
 * Маршрути, які існують, працюють, але не призначені пошуку
 * (BETA-CHECKLIST-v8 § 4, SEO-v8 § 1).
 *
 * Один механізм на три вимоги, як і `isIndexed` вище: сторінка звідси не
 * отримує `canonical`, не отримує `hreflang` і не потрапляє в sitemap — бо
 * sitemap перелічує лише те, у чого canonical є. Трьох окремих правок для
 * кожного нового службового маршруту не потрібно.
 *
 * Це НЕ таємниця. Сайт статичний і зібраний з відкритого репозиторію, довжина
 * шляху не додає до захисту нічого, адреса працює завжди і дається посиланням
 * тому, хто погодився допомогти. Прихованість тут означає рівно одне: сторінка
 * не конкурує з резюме у видачі й не приводить туди тих, хто прийшов читати CV.
 *
 * Значення — id маршруту в тій самій формі, у якій його повідомляє SvelteKit
 * (`page.route.id`), щоб порівняння не залежало від base path.
 */
export const HIDDEN_ROUTES: readonly string[] = ["/beta-test-checklists"];

export function isHiddenRoute(routeId: string | null): boolean {
	return routeId !== null && HIDDEN_ROUTES.includes(routeId);
}
