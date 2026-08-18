import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Як у storage.test.ts: гілка браузера — це весь предмет цих випадків, а тихий
// `false` дав би зелений прогін, у якому не виконалося нічого.
vi.mock("$app/environment", () => ({ browser: true, dev: false }));

const { ThemeState } = await import("./UiState.svelte");
// Читаємо через фасад, а не через голий `localStorage`: перевіряти треба рівно
// ту умову, від якої залежить код (`storage.get("theme")` в `init()`), а не її
// переказ. Заразом не доводиться розширювати список винятків
// `no-restricted-globals` — префікс має власні тести у storage.test.ts.
const { storage } = await import("$lib/services/storage");

/**
 * Тема йде за системою рівно доти, доки користувач не вибрав сам
 * (SVELTE-CORE-v8 § 1.9, § 2.2).
 *
 * ЧОМУ ЦЕЙ ФАЙЛ З'ЯВИВСЯ. У `init()` стояв виклик `set()`, який ЗАПИСУЄ в
 * сховище. Тобто перший же візит записував туди тему, виведену з
 * `prefers-color-scheme`, і далі вона читалася як явний вибір користувача — у
 * тому числі скриптом першого кадру в `app.html`. Наслідків два, і обидва
 * невидимі в коді:
 *
 *   1. відвідувач, який ніколи не торкався перемикача, більше ніколи не бачив,
 *      як сайт іде за системною темою;
 *   2. підписка на `prefers-color-scheme` мала умову `!storage.get("theme")`,
 *      хибну після того самого `set()` ЗАВЖДИ. Тіло не виконувалося жодного
 *      разу — недосяжна гілка, яка виглядає як реалізована фіча.
 *
 * Обидва випадки нижче червоніють, якщо повернути `set()` на місце `apply()`.
 */

/** Мінімальний `Storage` у пам'яті — той самий підхід, що в storage.test.ts. */
function fakeStorage(): Storage {
	const map = new Map<string, string>();
	return {
		get length() {
			return map.size;
		},
		key: (i: number) => [...map.keys()][i] ?? null,
		getItem: (k: string) => map.get(k) ?? null,
		setItem: (k: string, v: string) => void map.set(k, v),
		removeItem: (k: string) => void map.delete(k),
		clear: () => map.clear()
	} as Storage;
}

/**
 * `matchMedia` у jsdom не реалізований зовсім. Справжній `EventTarget` тут не
 * зручність, а вимога: `on()` зі `svelte/events` кличе `addEventListener`, і
 * підробка з двома `vi.fn()` довела б лише те, що функцію викликали.
 */
class FakeMediaQueryList extends EventTarget {
	matches: boolean;

	constructor(matches: boolean) {
		super();
		this.matches = matches;
	}

	flipTo(matches: boolean) {
		this.matches = matches;
		this.dispatchEvent(Object.assign(new Event("change"), { matches }));
	}
}

let media: FakeMediaQueryList;

beforeEach(() => {
	vi.stubGlobal("localStorage", fakeStorage());
	vi.stubGlobal("sessionStorage", fakeStorage());
	media = new FakeMediaQueryList(true); // системна тема — темна
	vi.stubGlobal("matchMedia", () => media);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("тема без явного вибору йде за системою", () => {
	it("init() не записує в сховище тему, виведену з системи", () => {
		const theme = new ThemeState();
		const teardown = theme.init();

		expect(theme.current).toBe("dark");
		expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
		expect(
			storage.get("theme"),
			"системна тема записана як вибір користувача — далі сайт за системою вже не піде"
		).toBeNull();

		teardown();
	});

	it("зміна системної теми доїжджає до сторінки", () => {
		const theme = new ThemeState();
		const teardown = theme.init();

		media.flipTo(false);

		expect(theme.current, "підписка на prefers-color-scheme не спрацювала").toBe("light");
		expect(document.documentElement.getAttribute("data-theme")).toBe("light");

		teardown();
	});
});

describe("явний вибір користувача сильніший за систему", () => {
	it("set() записує вибір і система його більше не перебиває", () => {
		const theme = new ThemeState();
		const teardown = theme.init();

		theme.set("light");
		expect(storage.get("theme")).toBe("light");

		media.flipTo(true); // система стала темною

		expect(theme.current, "вибір користувача перебито системною темою").toBe("light");

		teardown();
	});
});

describe("підписка знімається", () => {
	it("після teardown зміна системної теми нічого не робить", () => {
		const theme = new ThemeState();
		const teardown = theme.init();

		teardown();
		media.flipTo(false);

		expect(theme.current, "слухач пережив teardown — на кожен init() ще один").toBe("dark");
	});
});
