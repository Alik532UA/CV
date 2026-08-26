import { z } from "zod";

/**
 * Форма словника — і єдине, що тримає паритет 42 мов.
 *
 * ЧОМУ ОКРЕМИЙ ФАЙЛ. Схема жила в `I18nState.svelte.ts` разом із контролером
 * мови, вибором мови з адреси, плюралізацією й гетерами `t`. На 305 рядків
 * коду це був найбільший борг § 7 серед контролерів, і борг, що ріс від кожного
 * нового рядка інтерфейсу: додати ключ означало збільшити файл, у якому лежить
 * логіка перемикання мови. Тепер один файл описує ФОРМУ, другий — ПОВЕДІНКУ,
 * і зростання від нових ключів більше не торкається другого.
 *
 * ЧОМУ ZOD, ЯКЩО НІЩО НЕ ПАРСИТЬСЯ. Схема не виконується жодного разу: з неї
 * береться лише тип через `z.infer`, і саме тому поруч стоїть
 * `no-unused-vars`. Це навмисно — словники пишуться руками, а не приходять із
 * мережі, тож валідувати в рантаймі нема чого. Перевагу перед голим
 * `interface` дає одне: `.optional()` видно в тому ж рядку, що й ключ, і
 * додати необов'язковий розділ (як `philosophyItems`) не означає правити
 * структуру у 42 файлах.
 *
 * Кожен локальний словник анотований `: Translations` — саме анотація, а не
 * присвоєння, робить бракуючий ключ помилкою `svelte-check`. Без неї
 * TypeScript виведе форму самого об'єкта, файл скомпілюється, і брак ключа
 * побачить відвідувач у вигляді `undefined` на сторінці. За наявністю анотації
 * стежить `src/i18n-canon.test.ts`.
 */
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
		companies: z.record(z.string(), z.string()).optional(),
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
	}),
	/**
	 * Texts for +error.svelte and for the per-section boundary fallback.
	 *
	 * Required, not optional: a missing key here is caught by svelte-check in
	 * every one of the 42 locale files before anything runs, which is the whole
	 * reason the dictionaries are typed `.ts` rather than JSON.
	 */
	errorPage: z.object({
		notFoundTitle: z.string(),
		notFoundText: z.string(),
		genericTitle: z.string(),
		genericText: z.string(),
		backHome: z.string()
	}),
	/**
	 * AI Job Matcher. The product name itself is not here — "AI Job Matcher"
	 * stays as it is in every locale, the same way the job titles in the hero do.
	 */
	ai: z.object({
		subtitle: z.string(),
		jobPlaceholder: z.string(),
		analyze: z.string(),
		analyzing: z.string(),
		newAnalysis: z.string(),
		newAnalysisHint: z.string(),
		rawTitle: z.string(),
		rawNote: z.string(),
		summaryTitle: z.string(),
		matchLabel: z.string(),
		strengths: z.string(),
		gaps: z.string(),
		followUpTitle: z.string(),
		chatPlaceholder: z.string(),
		thinking: z.string(),
		modelTitle: z.string(),
		modelAuto: z.string(),
		bannerSub: z.string(),
		open: z.string(),
		statusNoKey: z.string(),
		statusCooldown: z.string(),
		statusAnswered: z.string(),
		statusReady: z.string(),
		tooltipAnswered: z.string(),
		tooltipWillTry: z.string(),
		pinHint: z.string(),
		emptyAnswer: z.string()
	})
});

export type Translations = z.infer<typeof TranslationSchema>;
