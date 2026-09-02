import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Як у theme.test.ts і holdScroll.test.ts: гілка браузера — це весь предмет цих
// випадків, а тихий `false` дав би зелений прогін, у якому не виконалося нічого.
vi.mock("$app/environment", () => ({ browser: true, dev: false }));

const { migrateStorageKeys } = await import("./storageMigration");
const { STORAGE_PREFIX } = await import("$lib/config/storage");

/**
 * Міграція легасі-ключів не ламає сайт і не чіпає чужого
 * (STORAGE-NAMESPACE-v8 Крок 4; `DBG-HARD-RESET` — про ту саму межу з іншого боку).
 *
 * ЧОМУ ЦЕЙ ФАЙЛ З'ЯВИВСЯ. `storageMigration.ts` — єдиний модуль проєкту, якому
 * канон дозволяє ходити в `localStorage` повз фасад, і рівно він не мав ані
 * тесту, ані `try`. Дві ціни цього були виміряні читанням, а не здогадкою:
 *
 *   1. **Падіння забирало ВЕСЬ клієнтський запуск.** Виклик стоїть першим у
 *      `onMount` у `+layout.svelte`, перед `theme.init()`, `scrollbar.init()`,
 *      `language.init()`, `initAnalytics()` і `shortcuts.init()`. Старий охоронець
 *      `typeof localStorage === "undefined"` перевіряв ВІДСУТНІСТЬ, а браузер із
 *      забороненими даними сайту кидає `SecurityError` на ЧИТАННЯ властивості —
 *      тобто на самому `typeof`. Сторінка при цьому малюється (вона prerendered)
 *      і не робить нічого: ні теми, ні мови, ні скорочень, ні смуги.
 *   2. **`removeItem` стирав ключ, який може бути не наш.** Origin спільний на
 *      шість застосунків, а `theme` / `lang` / `backgroundType` — рівно ті імена,
 *      якими користувалися всі. `as5.odesa.ua/src/app.html` читає
 *      `localStorage.getItem(prefix + 'theme') || localStorage.getItem('theme')`:
 *      голий ключ — його запасний варіант. Відкритий CV цей запасний варіант
 *      видаляв.
 *
 * ЗВОРОТНИЙ ЕКСПЕРИМЕНТ (AI-AGENT-PITFALLS-v8 § 1.1), виконаний 2026-09-02:
 * повернення `localStorage.removeItem(key)' у тіло циклу валить «голий ключ
 * лишається сусідам»; заміна `try` на старий `typeof`-охоронець валить «читання,
 * що кидає, не виходить назовні». Обидва рази названо саме той випадок.
 */

/** Мінімальний `Storage` у пам'яті — той самий підхід, що в storage.test.ts. */
function fakeStorage(seed: Record<string, string> = {}): Storage {
	const map = new Map(Object.entries(seed));
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

beforeEach(() => {
	vi.stubGlobal("localStorage", fakeStorage());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("міграція легасі-ключів", () => {
	it("перевірка жива: значення переїжджає під префікс", () => {
		vi.stubGlobal("localStorage", fakeStorage({ theme: "dark", lang: "uk" }));

		migrateStorageKeys();

		expect(localStorage.getItem(STORAGE_PREFIX + "theme")).toBe("dark");
		expect(localStorage.getItem(STORAGE_PREFIX + "lang")).toBe("uk");
		// Без цього рядка весь файл лишився б зеленим і на міграції, яка не
		// робить нічого (CODE-QUALITY-v8 § 3.5).
		expect(localStorage.getItem(STORAGE_PREFIX + "__migrated")).toBe("true");
	});

	it("голий ключ лишається сусідам по origin", () => {
		vi.stubGlobal("localStorage", fakeStorage({ theme: "dark" }));

		migrateStorageKeys();

		// Саме той рядок, який читає перший кадр `as5.odesa.ua`. Копія — так,
		// переїзд — ні: видалення тут коштує теми чужого сайту.
		expect(localStorage.getItem("theme"), "видалено чужий запасний ключ").toBe("dark");
	});

	it("наявне префіксоване значення сильніше за легасі", () => {
		vi.stubGlobal(
			"localStorage",
			fakeStorage({ theme: "dark", [STORAGE_PREFIX + "theme"]: "light" })
		);

		migrateStorageKeys();

		expect(localStorage.getItem(STORAGE_PREFIX + "theme")).toBe("light");
	});

	it("прапорець зупиняє другий прогін", () => {
		vi.stubGlobal(
			"localStorage",
			fakeStorage({ theme: "dark", [STORAGE_PREFIX + "__migrated"]: "true" })
		);

		migrateStorageKeys();

		expect(localStorage.getItem(STORAGE_PREFIX + "theme")).toBeNull();
	});

	it("сховище без легасі-ключів лишає префікс порожнім", () => {
		migrateStorageKeys();

		expect(localStorage.getItem(STORAGE_PREFIX + "theme")).toBeNull();
		expect(localStorage.getItem(STORAGE_PREFIX + "__migrated")).toBe("true");
	});
});

describe("міграція не виходить назовні жодною помилкою", () => {
	/**
	 * Найдорожчий випадок: не «сховища немає», а «читання властивості кидає».
	 * Саме так поводиться браузер, налаштований блокувати дані сайту, і саме цього
	 * не бачив старий охоронець `typeof localStorage === "undefined"`.
	 */
	it("читання, що кидає, не виходить назовні", () => {
		const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
		Object.defineProperty(globalThis, "localStorage", {
			configurable: true,
			get() {
				throw new DOMException("Access is denied for this document.", "SecurityError");
			}
		});

		try {
			expect(() => migrateStorageKeys(), "падіння тут забирає весь onMount").not.toThrow();
		} finally {
			if (original) Object.defineProperty(globalThis, "localStorage", original);
			else Reflect.deleteProperty(globalThis, "localStorage");
		}
	});

	it("запис, що кидає, не виходить назовні", () => {
		const store = fakeStorage({ theme: "dark" });
		vi.stubGlobal("localStorage", {
			...store,
			getItem: (k: string) => store.getItem(k),
			setItem: () => {
				throw new DOMException("QuotaExceededError", "QuotaExceededError");
			}
		});

		expect(() => migrateStorageKeys()).not.toThrow();
	});
});
