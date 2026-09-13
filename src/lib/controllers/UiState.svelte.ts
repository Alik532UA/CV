import { browser } from "$app/environment";
import { on } from "svelte/events";
import { storage } from "$lib/services/storage";
import { logService } from "$lib/services/logService.svelte";

/** Експортується заради тестів: синглтон нижче не дає зібрати чистий екземпляр. */
export class ThemeState {
	current = $state("dark");
	isChanging = $state(false);

	/**
	 * Тема, яку показуємо «на пробу» під курсором, або `null`
	 * (THEME-SWITCHER § 2.1).
	 *
	 * ОКРЕМО від `current`, і причин тут дві. Перша спільна для всіх проєктів:
	 * `current` означає «що обрано», ним світиться `.active`, і якби прев'ю
	 * писало в нього, підсвітка їхала б за курсором. Друга місцева й гірша —
	 * `init()` тримає `$effect`, який синхронізує `current` З АДРЕСОЮ: курсор,
	 * що просто перетнув панель, переписував би `?theme=` у рядку браузера.
	 */
	previewed = $state<string | null>(null);

	/** Знімає клас плавного переходу, коли той доїхав (§ 5). */
	private shiftTimer: ReturnType<typeof setTimeout> | null = null;

	constructor() {}

	/**
	 * @returns teardown, як у `sound.init()` і `shortcuts.init()`.
	 *
	 * Форма `init()` + cleanup у споживача — не канонічна для НОВОГО коду
	 * (SVELTE-CORE-v8 § 2.9 віддає перевагу `createSubscriber`), але тут вона
	 * лишається свідомо: `createSubscriber` вмикає підписку, коли геттер
	 * уперше читають у реактивному контексті, а ця підписка мусить бути живою
	 * незалежно від того, чи хтось читає — вона ЗАСТОСОВУЄ тему до
	 * `documentElement`, а не віддає значення. Канонічним лишається інше:
	 * підписка знімається, а не живе вічно.
	 */
	init(): () => void {
		if (!browser) return () => {};

		// Одноразове читання адреси під час `init()`, не реактивне джерело:
		// `SvelteURLSearchParams` дав би реактивність, на яку ніхто не підписаний.
		// Той самий виняток із тією ж причиною стоїть у +layout.svelte.
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const themeParam = new URLSearchParams(window.location.search).get("theme");
		const saved = storage.get("theme");

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const systemTheme = mediaQuery.matches ? "dark" : "light";

		const initialTheme = themeParam || saved || systemTheme;

		logService.info(
			"ui",
			`Initializing theme: ${initialTheme} (source: ${themeParam ? "URL" : saved ? "storage" : "system"})`
		);
		// APPLY, А НЕ SET — і це вся суть правки нижче.
		//
		// Доти `init()` викликав `set()`, який ЗАПИСУЄ в сховище. Тобто перший
		// же візит записував туди тему, виведену з `prefers-color-scheme`, і
		// вона ставала «явним вибором користувача» назавжди: скрипт першого
		// кадру в app.html читає саме цей ключ. Відвідувач, який ніколи не
		// торкався перемикача, більше ніколи не бачив, як сайт іде за системою.
		//
		// Тим самим записом убивалася й підписка нижче: її умова
		// `!storage.get("theme")` після `set()` хибна ЗАВЖДИ, тож тіло не
		// виконувалося жодного разу. Код виглядав як реалізована фіча, а був
		// недосяжною гілкою (PROJECT-STRUCTURE-v8 § 4.3 про той самий клас).
		//
		// Адреса теж не є вибором: `?theme=` — це перегляд за посиланням, а не
		// налаштування. Пише в сховище тільки `toggle()`, тобто сам користувач.
		this.apply(initialTheme);

		const offSystemTheme = on(mediaQuery, "change", (e: MediaQueryListEvent) => {
			if (storage.get("theme")) return; // явний вибір користувача сильніший
			const newTheme = e.matches ? "dark" : "light";
			logService.info("ui", `System theme changed to: ${newTheme}`);
			this.apply(newTheme);
		});

		// Sync to URL reactively using native history API
		const destroyUrlSync = $effect.root(() => {
			$effect(() => {
				const theme = this.current;
				// Локальний буфер для складання адреси, а не стан: живе рівно
				// один прогін ефекту й одразу віддається в replaceState.
				// eslint-disable-next-line svelte/prefer-svelte-reactivity
				const url = new URL(window.location.href);
				if (url.searchParams.get("theme") !== theme) {
					url.searchParams.set("theme", theme);
					// history.replaceState doesn't trigger reactive dependencies,
					// but we use untrack to be architecturally consistent
					window.history.replaceState(null, "", url.toString());
					logService.info("ui", `Theme synced to URL: ${theme}`);
				}
			});
		});

		return () => {
			offSystemTheme();
			destroyUrlSync();
		};
	}

	async toggle() {
		this.isChanging = true;
		logService.info("ui", "Toggling theme...");
		await new Promise((r) => setTimeout(r, 50));

		setTimeout(() => {
			const next = this.current === "dark" ? "light" : "dark";
			this.set(next);

			setTimeout(() => {
				this.isChanging = false;
			}, 300);
		}, 200);
	}

	/**
	 * Показати тему. Нічого не запам'ятовує — це не вибір користувача.
	 *
	 * СХЕМУ ОГОЛОШУЄ CSS, а не цей метод. Тут стояв рядок
	 * `document.documentElement.style.colorScheme = theme` — і він робив рівно
	 * те, від чого застерігає коментар у `src/app.html`: інлайновий стиль
	 * перебиває будь-яку таблицю стилів, тож звуження
	 * `:root[data-theme='light'] { color-scheme: only light }` у `app.css`
	 * ставало недосяжним, а сторінка оголошувала голе `light`. Саме за ним
	 * Android Chrome вмикає Auto Dark Theme й перемальовує світлу тему
	 * (UI-UX-v9 `UIUX-ONLY-LIGHT`, HIGH).
	 *
	 * Скрипт першого кадру цей рядок утратив раніше, а контролер — ні, і гейт
	 * `src/color-scheme-canon.test.ts` цього не бачив, бо читав два джерела з
	 * трьох. Заміряно в браузері: `getComputedStyle(:root).colorScheme`
	 * віддавав `light` і після завантаження, і після перемикання теми, тобто
	 * `only light` не діяв ніколи.
	 *
	 * Атрибута `data-theme` тут досить: обидві теми мають свій блок у
	 * `app.css` (`dark` і `only light`), і саме він тепер визначає схему.
	 */
	apply(theme: string) {
		this.current = theme;
		this.previewed = null;
		this.startThemeShift();
		if (browser) {
			document.documentElement.setAttribute("data-theme", theme);
		}
	}

	/** Вибір користувача: показати й запам'ятати. */
	set(theme: string) {
		this.apply(theme);
		if (browser) storage.set("theme", theme);
	}

	/**
	 * Показує тему «на пробу», поки курсор на її кнопці; `null` — вертає обрану
	 * (THEME-SWITCHER § 2.2).
	 *
	 * Нічого не зберігає і не чіпає `current`: малює документ напряму. Тому й
	 * `?theme=` в адресі лишається тим, що людина справді обрала.
	 *
	 * `isChanging` гасить прев'ю: `toggle()` тримає цей прапорець 550 мс, і за
	 * цей час курсор зазвичай іде з кнопки — `previewTheme(null)` повернув би
	 * СТАРУ тему поверх щойно обраної.
	 */
	previewTheme = (theme: string | null) => {
		if (!browser || this.isChanging) return;
		this.previewed = theme;
		this.startThemeShift();
		document.documentElement.setAttribute("data-theme", theme ?? this.current);
	};

	/**
	 * Вмикає плавний перехід кольорів на час зміни теми (§ 5).
	 *
	 * Тривалість із ЗАПАСОМ над 0,56 с із `app.css`: клас мусить дожити до кінця
	 * переходу, інакше останні кадри стрибнуть. Запас, а не те саме число, — щоб
	 * не тримати копію тривалості у двох місцях.
	 *
	 * Знімає клас ЛИШЕ таймер. Зняття в самому обробнику обривало б перехід на
	 * половині: вибір теми ховає панель, її прибирання кличе `previewTheme(null)`.
	 */
	private startThemeShift() {
		if (!browser) return;
		document.documentElement.classList.add("theme-shifting");
		if (this.shiftTimer) clearTimeout(this.shiftTimer);
		this.shiftTimer = setTimeout(() => {
			document.documentElement.classList.remove("theme-shifting");
			this.shiftTimer = null;
		}, 900);
	}
}

function getInitialBackgroundType(): 0 | 1 | 2 | 3 {
	if (browser) {
		const saved = storage.get("backgroundType");
		if (saved && ["0", "1", "2", "3"].includes(saved)) {
			return parseInt(saved) as 0 | 1 | 2 | 3;
		}
	}
	return 1;
}

function getSavedNumber(key: string, fallback: number): number {
	if (browser) {
		const saved = storage.get(key);
		if (saved) {
			const parsed = parseInt(saved, 10);
			if (!isNaN(parsed)) return parsed;
		}
	}
	return fallback;
}

class BackgroundState {
	type = $state<0 | 1 | 2 | 3>(getInitialBackgroundType());
	particlesCount = $state<number>(getSavedNumber("bgParticlesCount", 128));
	wavesCount = $state<number>(getSavedNumber("bgWavesCount", 4));
	shapesLineWidth = $state<number>(getSavedNumber("bgShapesLineWidth", 256));

	constructor() {}

	init() {
		if (browser) {
			const saved = storage.get("backgroundType");
			if (saved && ["0", "1", "2", "3"].includes(saved)) {
				this.type = parseInt(saved) as 0 | 1 | 2 | 3;
				logService.info("ui", `Initializing background type: ${this.type}`);
			}
			this.particlesCount = getSavedNumber("bgParticlesCount", 128);
			this.wavesCount = getSavedNumber("bgWavesCount", 4);
			this.shapesLineWidth = getSavedNumber("bgShapesLineWidth", 256);
		}
	}

	set(type: 0 | 1 | 2 | 3) {
		this.type = type;
		if (browser) {
			storage.set("backgroundType", type.toString());
			logService.info("ui", `Background type changed: ${type}`);
		}
	}

	setParticlesCount(count: number) {
		this.particlesCount = count;
		if (browser) storage.set("bgParticlesCount", count.toString());
	}

	setWavesCount(count: number) {
		this.wavesCount = count;
		if (browser) storage.set("bgWavesCount", count.toString());
	}

	setShapesLineWidth(width: number) {
		this.shapesLineWidth = width;
		if (browser) storage.set("bgShapesLineWidth", width.toString());
	}

	/** For the B shortcut: four options, so it steps rather than toggles. */
	cycle() {
		this.set((((this.type + 1) % 4) as 0 | 1 | 2 | 3));
	}
}

/**
 * The language panel's open flag, lifted out of HeaderSection so the L shortcut
 * can reach it. The panel's other concerns — the search query, closing the
 * background dropdown — stay in the component.
 */
class LangMenuState {
	isOpen = $state(false);

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	toggle() {
		this.isOpen = !this.isOpen;
	}
}

/**
 * Which section is in view, and how to move between them.
 *
 * `active` is written by the layout's IntersectionObserver, so the shortcuts
 * step from whatever the navs are highlighting rather than from a second,
 * possibly disagreeing idea of "current".
 */
class SectionState {
	active = $state("about");

	/** While a jump is in flight, see observed(). */
	private settleUntil = 0;

	/**
	 * Called by the layout's IntersectionObserver, and ignored mid-jump. A smooth
	 * scroll crosses every section between here and the target, and letting those
	 * report themselves would leave a second PageDown stepping from wherever the
	 * animation happened to have reached.
	 */
	observed(id: string) {
		if (performance.now() < this.settleUntil) return;
		this.active = id;
	}

	/**
	 * Read from the DOM on each use. The sidebar and the bottom nav each keep
	 * their own copy of this list already; a third would be one more thing to
	 * drift out of step with the page.
	 */
	ids(): string[] {
		if (!browser) return [];
		return [...document.querySelectorAll("section[id]")].map((el) => el.id);
	}

	/** @returns whether the move happened, so a no-op stays silent. */
	go(id: string): boolean {
		if (!browser) return false;
		const el = document.getElementById(id);
		if (!el) return false;

		// Section.svelte sets scroll-margin-top: 80px and <html> is
		// scroll-behavior: smooth, so the header offset and the animation are
		// already handled here.
		el.scrollIntoView();
		this.active = id;
		// Long enough to cover the smooth scroll; manual scrolling takes over
		// again once it lapses.
		this.settleUntil = performance.now() + 700;
		logService.info("ui", `Section navigated: ${id}`);
		return true;
	}

	step(delta: number): boolean {
		const ids = this.ids();
		const from = ids.indexOf(this.active);
		const next = (from === -1 ? 0 : from) + delta;
		// Clamped rather than wrapped: PageDown at the last section should stop,
		// not jump the visitor back to the top.
		if (next < 0 || next >= ids.length || next === from) return false;
		return this.go(ids[next]);
	}

	goByIndex(oneBased: number): boolean {
		const ids = this.ids();
		if (oneBased < 1 || oneBased > ids.length) return false;
		return this.go(ids[oneBased - 1]);
	}
}

export const theme = new ThemeState();
export const background = new BackgroundState();
export const langMenu = new LangMenuState();
export const section = new SectionState();
