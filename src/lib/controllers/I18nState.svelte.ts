import { z } from "zod";
import { en } from "../i18n/locales/en";
import { uk } from "../i18n/locales/uk";
import { ja } from "../i18n/locales/ja";
import { es } from "../i18n/locales/es";
import { ca } from "../i18n/locales/ca";
import { fr } from "../i18n/locales/fr";
import { pt } from "../i18n/locales/pt";
import { it } from "../i18n/locales/it";
import { de } from "../i18n/locales/de";
import { nl } from "../i18n/locales/nl";
import { be } from "../i18n/locales/be";
import { pl } from "../i18n/locales/pl";
import { cs } from "../i18n/locales/cs";
import { sk } from "../i18n/locales/sk";
import { bg } from "../i18n/locales/bg";
import { hr } from "../i18n/locales/hr";
import { sl } from "../i18n/locales/sl";
import { mk } from "../i18n/locales/mk";
import { ro } from "../i18n/locales/ro";
import { sv } from "../i18n/locales/sv";
import { no } from "../i18n/locales/no";
import { da } from "../i18n/locales/da";
import { is } from "../i18n/locales/is";
import { fi } from "../i18n/locales/fi";
import { el } from "../i18n/locales/el";
import { ga } from "../i18n/locales/ga";
import { cy } from "../i18n/locales/cy";
import { et } from "../i18n/locales/et";
import { lv } from "../i18n/locales/lv";
import { lt } from "../i18n/locales/lt";
import { crh } from "../i18n/locales/crh";
import { ka } from "../i18n/locales/ka";
import { sq } from "../i18n/locales/sq";
import { ko } from "../i18n/locales/ko";
import { tr } from "../i18n/locales/tr";
import { he } from "../i18n/locales/he";
import { mt } from "../i18n/locales/mt";
import { chk } from "../i18n/locales/chk";
import { pon } from "../i18n/locales/pon";
import { kos } from "../i18n/locales/kos";
import { yap } from "../i18n/locales/yap";
import { browser } from "$app/environment";
import { storage } from "$lib/services/storage";
import { logService } from "$lib/services/logService.svelte";
import { track } from "$lib/services/analytics";
import { goto } from "$app/navigation";
import { langPath } from "$lib/i18n/routing";

export type Language =
	| "en" | "uk" | "ja" | "es" | "fr" | "pt" | "it" | "de" | "nl" | "be"
	| "pl" | "cs" | "sk" | "bg" | "hr" | "sl" | "mk" | "ro" | "sv" | "no" | "da" | "is"
	| "ca" | "fi" | "el" | "ga" | "cy" | "et" | "lv" | "lt" | "crh" | "ka" | "sq" | "ko" | "tr" | "he" | "mt"
	| "chk" | "pon" | "kos" | "yap";

export const SUPPORTED_LANGUAGES: readonly Language[] = [
	"en", "uk", "ja", "es", "fr", "pt", "it", "de", "nl", "be",
	"pl", "cs", "sk", "bg", "hr", "sl", "mk", "ro", "sv", "no", "da", "is",
	"ca", "fi", "el", "ga", "cy", "et", "lv", "lt", "crh", "ka", "sq", "ko", "tr", "he", "mt",
	"chk", "pon", "kos", "yap"
];

export function isLanguage(value: string | null | undefined): value is Language {
	return !!value && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

class LanguageState {
	current = $state<Language>("en");
	isChanging = $state(false);

	constructor() {}

	/**
	 * @param routeLanguage the /[[lang]]/ segment, or undefined at the bare path.
	 *
	 * Priority is explicit: an address that names a language wins, then the
	 * saved choice, then English. The bare path deliberately counts as "no
	 * choice made", so a returning visitor still lands in their own language;
	 * /en/ is an explicit request for English and overrides the saved one.
	 */
	init(routeLanguage?: Language) {
		if (!browser) return;

		if (routeLanguage) {
			this.current = routeLanguage;
			logService.info("i18n", `Initializing language from route: ${routeLanguage}`);
		} else {
			// ?lang= links are already out in the world from before the move to
			// paths, so honour them once and rewrite the address.
			const legacy = new URLSearchParams(window.location.search).get("lang");
			if (isLanguage(legacy)) {
				this.current = legacy;
				logService.info("i18n", `Migrating legacy ?lang=${legacy} to a path`);
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				goto(langPath(legacy), { replaceState: true, noScroll: true, keepFocus: true });
			} else {
				const saved = storage.get("lang");
				if (isLanguage(saved)) {
					this.current = saved;
					logService.info("i18n", `Initializing language from storage: ${saved}`);
					// eslint-disable-next-line svelte/no-navigation-without-resolve
					goto(langPath(saved), { replaceState: true, noScroll: true, keepFocus: true });
				}
			}
		}

		document.documentElement.lang = this.current;
	}

	set(lang: Language) {
		if (this.current === lang) return;

		// Deliberate switches only — init() assigns this.current directly, so
		// restoring a saved language does not count as a choice.
		track("language_change", { language: lang });

		this.isChanging = true;
		logService.info("i18n", `Changing language to: ${lang}...`);

		setTimeout(() => {
			this.current = lang;
			if (browser) {
				storage.set("lang", lang);
				document.documentElement.lang = lang;
			}
			// Same route id (/[[lang]]) with only the parameter changing, so
			// SvelteKit updates in place instead of remounting — the switch stays
			// as seamless as it was with ?lang=.
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			goto(langPath(lang), { noScroll: true, keepFocus: true });
			setTimeout(() => {
				this.isChanging = false;
			}, 50);
		}, 200);
	}
}

export const language = new LanguageState();

/**
 * Pluralization helper for Slavic and Germanic languages.
 * @param n Number to pluralize
 * @param forms [one, few, many] for UK, [one, other] for EN
 */
export function plural(n: number, forms: string[]): string {
	const lang = language.current;
	const abs = Math.abs(n);

	if (lang === "uk") {
		const mod100 = abs % 100;
		const mod10 = abs % 10;
		if (mod100 > 10 && mod100 < 20) return forms[2]; // 11-19: років
		if (mod10 > 1 && mod10 < 5) return forms[1]; // 2-4: роки
		if (mod10 === 1) return forms[0]; // 1: рік
		return forms[2]; // 0, 5-9: років
	}

	// Default to English-style (Germanic)
	return abs === 1 ? forms[0] : forms[1];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TranslationSchema = z.object({
	lastUpdate: z.string(),
	title: z.array(z.string()),
	title_mobile: z.string(),
	nav: z.object({
		about: z.string(),
		experience: z.string(),
		education: z.string(),
		skills: z.string(),
		projects: z.string(),
		additional: z.string(),
		contact: z.string(),
		bottom_nav_label: z.string()
	}),
	hero: z.object({
		greeting: z.string(),
		description: z.string(),
		contactMe: z.string(),
		downloadCV: z.string(),
		emailCopied: z.string(),
		openMailClient: z.string()
	}),
	about: z.object({
		title: z.string(),
		location: z.string(),
		content: z.string(),
		hobbiesTitle: z.string(),
		philosophyTitle: z.string().optional(),
		philosophyItems: z.record(z.string(), z.string()).optional()
	}),
	experience: z.object({
		title: z.string(),
		showNonIT: z.string(),
		hideNonIT: z.string(),
		present: z.string(),
		roles: z.record(z.string(), z.string()),
		descriptions: z.record(z.string(), z.string())
	}),
	education: z.object({
		title: z.string(),
		institutions: z.record(z.string(), z.string()),
		descriptions: z.record(z.string(), z.string())
	}),
	skills: z.object({
		title: z.string(),
		showMore: z.string(),
		hideMore: z.string(),
		platforms: z.object({
			desktop: z.string(),
			web: z.string(),
			mobile: z.string()
		}),
		categories: z.record(z.string(), z.string()),
		items: z.record(z.string(), z.string())
	}),
	other: z.object({
		title: z.string(),
		iq: z.string(),
		olympics: z.string(),
		driver: z.string(),
		languages: z.object({
			title: z.string(),
			uk: z.string(),
			en: z.string(),
			ru: z.string()
		}),
		hobbies: z.array(z.string())
	}),
	projects: z.record(z.string(), z.any()),
	pdf_modal: z.object({
		title: z.string(),
		ats: z.string(),
		dark: z.string(),
		light: z.string()
	}),
	common: z.object({
		close: z.string(),
		sound: z.string()
	}),
	scrollbar: z.object({
		title: z.string(),
		standard: z.string(),
		custom: z.string(),
		minimap: z.string(),
		minimapFull: z.string()
	})
});

export type Translations = z.infer<typeof TranslationSchema>;

export const translations: Record<Language, Translations> = {
	en, uk, ja, es, fr, pt, it, de, nl, be,
	pl, cs, sk, bg, hr, sl, mk, ro, sv, no, da, is,
	ca, fi, el, ga, cy, et, lv, lt, crh, ka, sq, ko, tr, he, mt,
	chk, pon, kos, yap
};

/**
 * Global reactive translations object.
 * Uses getters to maintain reactivity across components.
 */
export const t = {
	get lastUpdate() {
		return translations[language.current].lastUpdate;
	},
	get title() {
		return translations[language.current].title;
	},
	get title_mobile() {
		return translations[language.current].title_mobile;
	},
	get nav() {
		return translations[language.current].nav;
	},
	get hero() {
		return translations[language.current].hero;
	},
	get about() {
		return translations[language.current].about;
	},
	get experience() {
		return translations[language.current].experience;
	},
	get education() {
		return translations[language.current].education;
	},
	get skills() {
		return translations[language.current].skills;
	},
	get other() {
		return translations[language.current].other;
	},
	get projects() {
		return translations[language.current].projects;
	},
	get pdf_modal() {
		return translations[language.current].pdf_modal;
	},
	get common() {
		return translations[language.current].common;
	},
	get scrollbar() {
		return translations[language.current].scrollbar;
	}
};
