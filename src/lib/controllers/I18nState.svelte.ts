import { en } from "../i18n/locales/en";
import { enUS } from "../i18n/locales/en-us";
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
import { bcp47, DEFAULT_LANGUAGE, langPath, textDirection } from "$lib/i18n/routing";
import type { Translations } from "$lib/i18n/schema";

/**
 * "en" is British English and "en-us" American. The region subtag is lowercase
 * because this doubles as the URL segment, and /CV/en-us/ has to resolve on
 * case-sensitive static hosting — `bcp47()` in i18n/routing spells it back the
 * canonical way for `lang` and `hreflang` attributes.
 */
export type Language =
	| "en" | "en-us" | "uk" | "ja" | "es" | "fr" | "pt" | "it" | "de" | "nl" | "be"
	| "pl" | "cs" | "sk" | "bg" | "hr" | "sl" | "mk" | "ro" | "sv" | "no" | "da" | "is"
	| "ca" | "fi" | "el" | "ga" | "cy" | "et" | "lv" | "lt" | "crh" | "ka" | "sq" | "ko" | "tr" | "he" | "mt"
	| "chk" | "pon" | "kos" | "yap";

export const SUPPORTED_LANGUAGES: readonly Language[] = [
	"en", "en-us", "uk", "ja", "es", "fr", "pt", "it", "de", "nl", "be",
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
			/*
			 * `?lang=` — тепер КОНТРАКТ, а не лише перехідник для старих посилань.
			 *
			 * Він з'явився як міграція з `?lang=` на шляхи. Лишається з другої
			 * причини, яка не мине: сусідні сайти автора шлють сюди мову, якою
			 * читав відвідувач ТАМ, а англійську вони не можуть покласти в шлях —
			 * `/CV/en/` свідомо не існує, бо типова мова тут без префікса
			 * (I18N-v8 § 3.1). Без параметра відвідувач, що прийшов з англійської
			 * сторінки Slovko, отримав би тут ту мову, яку цей сайт запам'ятав із
			 * минулого візиту. Таблиця, з якої будуються ті посилання, —
			 * `src/lib/siblings.ts`.
			 *
			 * Вище за збережений вибір навмисно: параметр каже про ЦЕЙ перехід,
			 * збережене — про попередні. У сховище не пишеться: візит не
			 * перекреслює свідомого вибору, зробленого тут.
			 *
			 * `SvelteURLSearchParams` тут ні до чого: об'єкт живе кілька рядків
			 * усередині `init()`, і на нього ніхто не підписаний.
			 */
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const params = new URLSearchParams(window.location.search);
			const asked = params.get("lang");
			if (isLanguage(asked)) {
				this.current = asked;
				logService.info("i18n", `Language taken from ?lang=${asked}`);

				/*
				 * Типова мова лишається в параметрі, решта переїжджає в шлях.
				 *
				 * `/CV/en/` не існує, тож прибрати `?lang=en` означало б лишити
				 * голу адресу — тобто «вибору не зроблено», — і наступне
				 * перезавантаження віддало б сторінку збереженій мові. Решта
				 * параметрів їде разом зі шляхом: губити чужі параметри при
				 * переписуванні адреси — окремий клас дефекту, і сусідній
				 * DigitalWorkshop на ньому вже стояв.
				 */
				if (asked !== DEFAULT_LANGUAGE) {
					params.delete("lang");
					const rest = params.toString();
					// eslint-disable-next-line svelte/no-navigation-without-resolve
					goto(`${langPath(asked)}${rest ? `?${rest}` : ""}`, {
						replaceState: true,
						noScroll: true,
						keepFocus: true
					});
				}
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

		// `dir` іде поруч із `lang` скрізь, де той виставляється. Розійшовшись,
		// вони дають найгірший варіант: документ оголошений івритом і
		// розкладений зліва направо (I18N-v8 § 6).
		document.documentElement.lang = bcp47(this.current);
		document.documentElement.dir = textDirection(this.current);
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
				document.documentElement.lang = bcp47(lang);
				document.documentElement.dir = textDirection(lang);
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

export const translations: Record<Language, Translations> = {
	en, "en-us": enUS, uk, ja, es, fr, pt, it, de, nl, be,
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
	get ui() {
		return translations[language.current].ui;
	},
	get common() {
		return translations[language.current].common;
	},
	get scrollbar() {
		return translations[language.current].scrollbar;
	},
	get errorPage() {
		return translations[language.current].errorPage;
	},
	get ai() {
		return translations[language.current].ai;
	}
};
