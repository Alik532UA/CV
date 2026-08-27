import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Аварійне скидання стирає ЛИШЕ СВОЄ (DEBUGGING-v8 `DBG-HARD-RESET`, CRITICAL).
 *
 * ЧОМУ ЦЕЙ ФАЙЛ З'ЯВИВСЯ. `resetService.ts` — єдиний модуль проєкту, який
 * викликає API, що повертають дані ВСЬОГО origin: `caches.keys()` віддає імена
 * кешів усіх шести застосунків на `alik532ua.github.io`, а
 * `serviceWorker.getRegistrations()` — усі їхні реєстрації. Фільтр за префіксом
 * і за `scope` — це вся різниця між «скинути цей сайт» і «скинути домен».
 *
 * І саме цей модуль не мав жодного тесту: замір покриття показав `resetService.ts
 * 0%` при 85% решти теки `services/`. Тобто найдорожча помилка проєкту —
 * знищення чужих даних — трималася на прозі докблоку. Канон називає це прямо:
 * правило, яке не можна перевірити, — це побажання (README v8), а `checkedBy`
 * для `DBG-HARD-RESET` вимагає саме перевірки фільтрів.
 *
 * ЩО САМЕ ТУТ ПЕРЕВІРЯЄТЬСЯ — три твердження докблоку, кожне з яких сьогодні
 * істинне лише тому, що його ніхто не переписав:
 *
 *   1. кеші й реєстрації сусідів лишаються на місці;
 *   2. половини скидання незалежні — збій однієї не скасовує наступних;
 *   3. скидання не кидає ВЗАГАЛІ: його кличуть, коли вже щось зламано.
 *
 * Кожен випадок будує ПОВНИЙ набір origin — свої записи ПЛЮС сусідські, — бо
 * перевірка «наше видалено» проходить і на фільтрі, якого немає.
 */

vi.mock("$app/paths", () => ({ base: "/CV" }));

const { hardReset, RESET_PRESSES_DEV, RESET_PRESSES_PROD } = await import("./resetService");
const { STORAGE_PREFIX } = await import("$lib/config/storage");

const ORIGIN = "https://alik532ua.github.io";

/** Імена кешів усього origin: два наші, чотири сусідські. */
const ALL_CACHES = [
	`${STORAGE_PREFIX}assets-v1`,
	`${STORAGE_PREFIX}pages-v1`,
	"mindstep_assets-v1",
	"slovko_pages-v1",
	"digitalworkshop_assets",
	"workbox-precache-v2"
];

/** Реєстрації всього origin: одна наша, три сусідські. */
const ALL_SCOPES = [
	`${ORIGIN}/CV/`,
	`${ORIGIN}/MindStep/`,
	`${ORIGIN}/Slovko/`,
	`${ORIGIN}/DigitalWorkshop/`
];

let deletedCaches: string[];
let unregisteredScopes: string[];
let reloaded: number;
let cookieWrites: string[];

/** Підставний Cache Storage усього origin. `throwOn` валить названу операцію. */
function fakeCaches(throwOn?: "keys" | "delete") {
	return {
		keys: async () => {
			if (throwOn === "keys") throw new DOMException("blocked", "SecurityError");
			return [...ALL_CACHES];
		},
		delete: async (name: string) => {
			if (throwOn === "delete") throw new DOMException("blocked", "SecurityError");
			deletedCaches.push(name);
			return true;
		}
	};
}

/** Підставний ServiceWorkerContainer усього origin. */
function fakeServiceWorker(throwOn?: "getRegistrations" | "unregister") {
	return {
		getRegistrations: async () => {
			if (throwOn === "getRegistrations") throw new DOMException("blocked", "SecurityError");
			return ALL_SCOPES.map((scope) => ({
				scope,
				unregister: async () => {
					if (throwOn === "unregister") throw new DOMException("blocked", "SecurityError");
					unregisteredScopes.push(scope);
					return true;
				}
			}));
		}
	};
}

/**
 * `document.cookie` у jsdom — акумулятор, а не журнал: перечитати ЩО саме
 * записано, не можна. Тому властивість підмінюється парою «геттер віддає
 * початковий набір, сетер веде журнал»: перевіряти треба саме форму запису
 * (`expires` у минулому і правильний `path`), а не наслідок.
 */
function stubCookies(initial: string) {
	Object.defineProperty(document, "cookie", {
		configurable: true,
		get: () => initial,
		set: (value: string) => {
			cookieWrites.push(value);
		}
	});
}

beforeEach(() => {
	deletedCaches = [];
	unregisteredScopes = [];
	cookieWrites = [];
	reloaded = 0;

	vi.stubGlobal("confirm", () => true);
	vi.stubGlobal("caches", fakeCaches());
	vi.stubGlobal("navigator", { serviceWorker: fakeServiceWorker() });
	// `location.reload` у jsdom кидає «Not implemented», тож замінюється цілий
	// об'єкт: `origin` потрібен для `new URL(base, origin)` у фільтрі scope.
	Object.defineProperty(window, "location", {
		configurable: true,
		value: { origin: ORIGIN, href: `${ORIGIN}/CV/`, reload: () => void reloaded++ }
	});
	stubCookies("theme=dark; cv-svelte_seen=1");
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("перевірка жива", () => {
	it("набір origin містить і наші записи, і сусідські", () => {
		// Канарка (CODE-QUALITY-v8 § 3.5): якби в наборі лежали лише наші імена,
		// перевірка фільтра проходила б і БЕЗ фільтра.
		expect(ALL_CACHES.filter((n) => n.startsWith(STORAGE_PREFIX)).length).toBe(2);
		expect(ALL_CACHES.filter((n) => !n.startsWith(STORAGE_PREFIX)).length).toBe(4);
		expect(ALL_SCOPES.filter((s) => s.includes("/CV/")).length).toBe(1);
		expect(ALL_SCOPES.length).toBeGreaterThan(1);
	});

	it("пороги жесту різні для dev і продакшну", () => {
		// Однакові числа означали б, що продакшн скидається так само дешево, як
		// dev, — а ціна помилки там інша (DBG-KEY-SEQUENCE).
		expect(RESET_PRESSES_DEV).toBeLessThan(RESET_PRESSES_PROD);
	});
});

describe("скидання не виходить за межі свого застосунку", () => {
	it("видаляє лише кеші з префіксом проєкту", async () => {
		await hardReset(false);
		expect(
			deletedCaches.sort(),
			"`caches.keys()` віддає імена ВСЬОГО origin — без фільтра це скидання домену"
		).toEqual([`${STORAGE_PREFIX}assets-v1`, `${STORAGE_PREFIX}pages-v1`]);
	});

	it("знімає лише реєстрації свого scope", async () => {
		await hardReset(false);
		expect(
			unregisteredScopes,
			"`getRegistrations()` повертає реєстрації сусідів теж — саме так уже " +
				"зняли чужий service worker у сусідньому проєкті"
		).toEqual([`${ORIGIN}/CV/`]);
	});

	it("scope звіряється як URL, а не як рядок", async () => {
		// `base` — це шлях (`/CV`), а `scope` завжди абсолютний
		// (`https://host/CV/`). Пряме `startsWith` не збіглося б НІКОЛИ, і
		// фільтр мовчки не зняв би нічого — включно зі своїм.
		await hardReset(false);
		expect(unregisteredScopes.length).toBe(1);
	});

	it("гасить кукі на шляху проєкту, а не на кореневому", async () => {
		await hardReset(false);
		expect(cookieWrites.length, "кожна кука отримує запис на видалення").toBe(2);
		for (const write of cookieWrites) {
			expect(write, `path мусить збігтися з тим, під яким куку поставлено: ${write}`).toContain(
				"path=/CV"
			);
			expect(write).toContain("expires=Thu, 01 Jan 1970");
		}
	});
});

describe("підтвердження", () => {
	it("відмова не чіпає нічого", async () => {
		vi.stubGlobal("confirm", () => false);
		await hardReset(true);
		expect(deletedCaches).toEqual([]);
		expect(unregisteredScopes).toEqual([]);
		expect(cookieWrites).toEqual([]);
		expect(reloaded, "сторінка не мусить перезавантажуватись після «Скасувати»").toBe(0);
	});

	it("згода проводить скидання до кінця", async () => {
		await hardReset(true);
		expect(deletedCaches.length).toBe(2);
		expect(reloaded).toBe(1);
	});
});

describe("половини скидання незалежні", () => {
	it("збій кук не скасовує кеші й реєстрації", async () => {
		Object.defineProperty(document, "cookie", {
			configurable: true,
			get: () => "theme=dark",
			set: () => {
				throw new DOMException("blocked", "SecurityError");
			}
		});

		await hardReset(false);

		expect(deletedCaches.length, "кеші мали скинутись попри збій кук").toBe(2);
		expect(unregisteredScopes.length).toBe(1);
		expect(reloaded).toBe(1);
	});

	it("збій Cache API не скасовує реєстрації й перезавантаження", async () => {
		vi.stubGlobal("caches", fakeCaches("keys"));

		await hardReset(false);

		expect(unregisteredScopes.length).toBe(1);
		expect(reloaded).toBe(1);
	});

	it("збій реєстрацій не скасовує перезавантаження", async () => {
		vi.stubGlobal("navigator", { serviceWorker: fakeServiceWorker("getRegistrations") });

		await hardReset(false);

		expect(deletedCaches.length).toBe(2);
		expect(reloaded, "без перезавантаження скидання не видно користувачеві").toBe(1);
	});
});

describe("аварійний шлях не кидає", () => {
	it("браузер без Cache API", async () => {
		vi.stubGlobal("caches", undefined);
		await expect(hardReset(false)).resolves.toBeUndefined();
		expect(reloaded).toBe(1);
	});

	it("браузер без service worker", async () => {
		vi.stubGlobal("navigator", {});
		await expect(hardReset(false)).resolves.toBeUndefined();
		expect(reloaded).toBe(1);
	});

	it("окремий кеш, що відмовляється видалятись", async () => {
		vi.stubGlobal("caches", fakeCaches("delete"));
		await expect(hardReset(false)).resolves.toBeUndefined();
		expect(reloaded).toBe(1);
	});

	it("реєстрація, що відмовляється зніматись", async () => {
		vi.stubGlobal("navigator", { serviceWorker: fakeServiceWorker("unregister") });
		await expect(hardReset(false)).resolves.toBeUndefined();
		expect(reloaded).toBe(1);
	});
});
