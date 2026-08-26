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
 * ЧОМУ НЕ ZOD. Тут стояв `z.object()` на 126 рядків із приміткою
 * «не виконується жодного разу: з неї береться лише тип через `z.infer`» — і
 * поруч `eslint-disable` на `no-unused-vars`, бо змінна справді ніде не
 * читалася. Примітка була правдива, а висновок із неї — ні: для бандлера
 * `z.object({...})` це виклик функції з можливими побічними ефектами, тож
 * трясіння дерева його не прибирає, і `zod` їхав у браузер відвідувача
 * ЦІЛКОМ — 103 КБ вихідного коду, 30 КБ gzip. Схема, що не виконується, все
 * одно коштувала 12% бюджету JS сторінки.
 *
 * Обміняно рівно нічого: `.optional()` став `?`, `z.record(z.string(),
 * z.string())` — `Record<string, string>`, решта — `string`. Рантаймової
 * перевірки не було й до того.
 *
 * Кожен локальний словник анотований `: Translations` — саме анотація, а не
 * присвоєння, робить бракуючий ключ помилкою `svelte-check`. Без неї
 * TypeScript виведе форму самого об'єкта, файл скомпілюється, і брак ключа
 * побачить відвідувач у вигляді `undefined` на сторінці. За наявністю анотації
 * стежить `src/i18n-canon.test.ts`.
 */
/**
 * Картка проєкту в розділі «Проєкти та портфоліо».
 *
 * Увесь розділ `projects` мав тип `z.record(z.string(), z.any())`, тобто не
 * мав типу зовсім: у 42 словниках форму карток не перевіряло НІЩО. Забутий
 * `url` або `image` не був би помилкою збірки — він став би порожнім
 * посиланням і битою картинкою рівно в тій мові, якою ніхто не відкриває
 * сайт. Тепер це помилка `svelte-check` у тому файлі, де вона зроблена.
 *
 * `category` лишається рядком, а не об'єднанням літералів: перелік категорій
 * живе поруч у `categories`, і сплести їх типом означало б, що додати
 * категорію не можна без правки схеми.
 */
export interface ProjectItem {
	id: string;
	title: string;
	description: string;
	button: string;
	url: string;
	category: string;
	image: string;
	tech: string;
	/** Показує значок «Featured». Є лише в тих карток, які його мають. */
	featured?: boolean;
}

export interface Translations {
	lastUpdate: string;
	title: string[];
	title_mobile: string;
	nav: {
		about: string;
		experience: string;
		education: string;
		skills: string;
		projects: string;
		additional: string;
		contact: string;
		bottom_nav_label: string;
	};
	hero: {
		greeting: string;
		description: string;
		contactMe: string;
		downloadCV: string;
		emailCopied: string;
		openMailClient: string;
	};
	about: {
		title: string;
		location: string;
		content: string;
		hobbiesTitle: string;
		philosophyTitle?: string;
		philosophyItems?: Record<string, string>;
	};
	experience: {
		title: string;
		showNonIT: string;
		hideNonIT: string;
		present: string;
		companies?: Record<string, string>;
		roles: Record<string, string>;
		descriptions: Record<string, string>;
	};
	education: {
		title: string;
		institutions: Record<string, string>;
		descriptions: Record<string, string>;
	};
	skills: {
		title: string;
		showMore: string;
		hideMore: string;
		platforms: {
			desktop: string;
			web: string;
			mobile: string;
		};
		categories: Record<string, string>;
		items: Record<string, string>;
	};
	other: {
		title: string;
		iq: string;
		olympics: string;
		driver: string;
		languages: {
			title: string;
			uk: string;
			en: string;
			ru: string;
		};
		hobbies: string[];
	};
	projects: {
		title: string;
		featuredBadge: string;
		categories: Record<string, string>;
		items: Record<string, ProjectItem>;
	};
	pdf_modal: {
		title: string;
		ats: string;
		dark: string;
		light: string;
	};
	common: {
		close: string;
		sound: string;
	};
	scrollbar: {
		title: string;
		standard: string;
		custom: string;
		minimap: string;
		minimapFull: string;
	};
	/**
	 * Texts for +error.svelte and for the per-section boundary fallback.
	 *
	 * Required, not optional: a missing key here is caught by svelte-check in
	 * every one of the 42 locale files before anything runs, which is the whole
	 * reason the dictionaries are typed `.ts` rather than JSON.
	 */
	errorPage: {
		notFoundTitle: string;
		notFoundText: string;
		genericTitle: string;
		genericText: string;
		backHome: string;
	};
	/**
	 * AI Job Matcher. The product name itself is not here — "AI Job Matcher"
	 * stays as it is in every locale, the same way the job titles in the hero do.
	 */
	ai: {
		subtitle: string;
		jobPlaceholder: string;
		analyze: string;
		analyzing: string;
		newAnalysis: string;
		newAnalysisHint: string;
		rawTitle: string;
		rawNote: string;
		summaryTitle: string;
		matchLabel: string;
		strengths: string;
		gaps: string;
		followUpTitle: string;
		chatPlaceholder: string;
		thinking: string;
		modelTitle: string;
		modelAuto: string;
		bannerSub: string;
		open: string;
		statusNoKey: string;
		statusCooldown: string;
		statusAnswered: string;
		statusReady: string;
		tooltipAnswered: string;
		tooltipWillTry: string;
		pinHint: string;
		emptyAnswer: string;
	};
}
