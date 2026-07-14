import { z } from "zod";
import { en } from "../i18n/locales/en";
import { uk } from "../i18n/locales/uk";
import { browser } from "$app/environment";
import { storage } from "$lib/services/storage";
import { logService } from "$lib/services/logService.svelte";

export type Language = "en" | "uk";

class LanguageState {
	current = $state<Language>("en");
	isChanging = $state(false);

	constructor() {}

	init() {
		if (browser) {
			const params = new URLSearchParams(window.location.search);
			const lang = params.get("lang") as Language;
			if (lang === "en" || lang === "uk") {
				this.current = lang;
				logService.info("i18n", `Initializing language from URL: ${lang}`);
			} else {
				const saved = storage.get("lang") as Language;
				if (saved === "en" || saved === "uk") {
					this.current = saved;
					logService.info("i18n", `Initializing language from storage: ${saved}`);
				}
			}

			// Sync HTML lang attribute
			document.documentElement.lang = this.current;

			// Sync to URL reactively using native history API
			$effect.root(() => {
				$effect(() => {
					const lang = this.current;
					const url = new URL(window.location.href);

					// Sync HTML lang attribute reactively
					document.documentElement.lang = lang;

					if (url.searchParams.get("lang") !== lang) {
						url.searchParams.set("lang", lang);
						window.history.replaceState(null, "", url.toString());
						logService.info("i18n", `Language synced to URL: ${lang}`);
					}
				});
			});
		}
	}

	set(lang: Language) {
		if (this.current === lang) return;

		this.isChanging = true;
		logService.info("i18n", `Changing language to: ${lang}...`);

		setTimeout(() => {
			this.current = lang;
			if (browser) {
				storage.set("lang", lang);
				document.documentElement.lang = lang;
			}
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
		hobbiesTitle: z.string()
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
		categories: z.object({
			it: z.string(),
			design3d: z.string(),
			video: z.string(),
			tools: z.string()
		}),
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
	projects: z.object({
		slovko: z.object({
			title: z.string(),
			description: z.string(),
			button: z.string()
		}),
		mindstep: z.object({
			title: z.string(),
			description: z.string(),
			button: z.string()
		}),
		cv3d: z.object({
			title: z.string(),
			description: z.string(),
			button: z.string()
		})
	}),
	pdf_modal: z.object({
		title: z.string(),
		ats: z.string(),
		dark: z.string(),
		light: z.string()
	})
});

export type Translations = z.infer<typeof TranslationSchema>;

export const translations: Record<Language, Translations> = { en, uk };

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
	}
};
