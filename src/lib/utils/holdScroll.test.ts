import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Як у theme.test.ts: гілка браузера — це весь предмет цих випадків, а тихий
// `false` дав би зелений прогін, у якому не виконалося нічого.
vi.mock("$app/environment", () => ({ browser: true, dev: false }));

const { HoldScroll } = await import("./holdScroll.svelte");

/**
 * Прокрутка від наведення вимикається настройкою `prefers-reduced-motion`
 * (HOLD-SCROLL-v8 § — «рух, що не зупиняється при prefers-reduced-motion», HIGH).
 *
 * ЧОМУ САМЕ ТУТ, А НЕ В E2E. Спершу цей випадок писався як сценарій Playwright
 * із `test.use({ reducedMotion: "reduce" })`. Емуляція в цьому оточенні до
 * сторінки НЕ доїжджає: `matchMedia("(prefers-reduced-motion: reduce)").matches`
 * лишається `false`, тобто «зелений» сценарій міряв би звичайний режим двічі й
 * не доводив нічого (AI-AGENT-PITFALLS-v8 § 1: перевірка, яка не бачить того,
 * що обіцяє). Тут медіазапит підставляється явно, тож перевіряється рівно та
 * умова, від якої залежить код.
 *
 * ЩО САМЕ БУЛО ЗЛАМАНО. Обидва малювальники — власна смуга й мінімапа —
 * читали `prefers-reduced-motion`, але застосовували його лише до пружини
 * ПОЯВИ смуги. Сам `HoldScroll` про настройку не знав, тож сторінка їхала
 * однаково. Побачити це очима майже неможливо: слово в компоненті є, і
 * виглядає воно як виконана вимога.
 */

/** Геометрія, за якої точка y = 10 гарантовано лежить ВИЩЕ повзунка. */
const geometry = () => ({ markerTop: 100, markerHeight: 40, pxPerScroll: 0.5 });

/**
 * Ознака «прогін почався» — виклик `requestAnimationFrame`, а не поле `holding`.
 *
 * У jsdom сторінка не має висоти, тож перший же кадр бачить `remaining === 0`,
 * вважає, що доїхав, і зупиняється сам: `holding` встигає стати `true` і одразу
 * повертається в `false`. Тобто поле тут не відрізняє «не почалося» від
 * «почалося й миттєво завершилося» — а це рівно те, що треба відрізнити.
 */
function frameSpy() {
	return vi.spyOn(globalThis, "requestAnimationFrame").mockImplementation(() => 1);
}

function stubReducedMotion(reduce: boolean) {
	vi.stubGlobal(
		"matchMedia",
		vi.fn((query: string) => ({
			matches: reduce && query.includes("prefers-reduced-motion: reduce"),
			media: query,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn()
		}))
	);
}

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("hold-scroll і prefers-reduced-motion", () => {
	it("перевірка жива: без настройки рух ЗАПУСКАЄТЬСЯ", () => {
		// Без цього випадку наступний був би зеленим і тоді, коли механіка
		// зламана назовсім: «не поїхало» — це і успіх, і повна відмова.
		stubReducedMotion(false);
		const frame = frameSpy();
		const hold = new HoldScroll(geometry);

		hold.aim(10);
		expect(frame, "відлік іще не минув — рух не мав початися").not.toHaveBeenCalled();
		vi.advanceTimersByTime(1100);
		expect(frame, "після затримки рух мусив початися").toHaveBeenCalled();

		hold.stop();
	});

	it("з prefers-reduced-motion: reduce рух не починається взагалі", () => {
		stubReducedMotion(true);
		const frame = frameSpy();
		const hold = new HoldScroll(geometry);

		hold.aim(10);
		vi.advanceTimersByTime(5000);
		expect(
			frame,
			"сторінка їде сама попри настройку — саме від цього руху вона й захищає"
		).not.toHaveBeenCalled();
	});

	it("настройка читається на кожен рух, а не запам'ятовується при створенні", () => {
		// Її міняють посеред сесії; запам'ятоване значення пережило б зміну.
		stubReducedMotion(false);
		const frame = frameSpy();
		const hold = new HoldScroll(geometry);

		stubReducedMotion(true);
		hold.aim(10);
		vi.advanceTimersByTime(5000);
		expect(frame).not.toHaveBeenCalled();
	});
});
