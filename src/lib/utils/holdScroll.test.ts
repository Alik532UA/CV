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

/** Опція увімкнена — щоб випадки про reduced-motion міряли саме її. */
const on = () => true;

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
		const hold = new HoldScroll(geometry, on);

		hold.aim(10);
		expect(frame, "відлік іще не минув — рух не мав початися").not.toHaveBeenCalled();
		vi.advanceTimersByTime(1100);
		expect(frame, "після затримки рух мусив початися").toHaveBeenCalled();

		hold.stop();
	});

	it("з prefers-reduced-motion: reduce рух не починається взагалі", () => {
		stubReducedMotion(true);
		const frame = frameSpy();
		const hold = new HoldScroll(geometry, on);

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
		const hold = new HoldScroll(geometry, on);

		stubReducedMotion(true);
		hold.aim(10);
		vi.advanceTimersByTime(5000);
		expect(frame).not.toHaveBeenCalled();
	});
});

/**
 * Друга причина не рухатися — опція вимкнена (HOLD-SCROLL § 1.1).
 *
 * Ці випадки живуть тут, а не в e2e, з тієї ж причини, що й сусідні: у
 * браузерній перевірці «не поїхало» однаково зелене і коли опція вимкнена, і
 * коли механіка зламана. Тут стан задається явно й окремо від геометрії.
 */
describe("hold-scroll і перемикач опції", () => {
	it("вимкнена опція не дає руху", () => {
		stubReducedMotion(false);
		const frame = frameSpy();
		const hold = new HoldScroll(geometry, () => false);

		hold.aim(10);
		vi.advanceTimersByTime(5000);
		expect(
			frame,
			"сторінка їде, хоча опцію вимкнено — це типовий стан, і в ньому вона мусить стояти"
		).not.toHaveBeenCalled();
	});

	it("перемикач читається на кожен рух, а не запам'ятовується при створенні", () => {
		// Чекбокс перемикають при відкритому меню, не перестворюючи компонент.
		// Запам'ятоване при створенні значення пережило б перемикання, і
		// щойно ввімкнена опція не працювала б до перезавантаження сторінки.
		stubReducedMotion(false);
		const frame = frameSpy();
		let enabled = false;
		const hold = new HoldScroll(geometry, () => enabled);

		hold.aim(10);
		vi.advanceTimersByTime(5000);
		expect(frame, "опція ще вимкнена").not.toHaveBeenCalled();

		enabled = true;
		hold.aim(10);
		vi.advanceTimersByTime(1100);
		expect(frame, "опцію ввімкнули — рух мусив початися").toHaveBeenCalled();

		hold.stop();
	});

	it("вимкнення посеред відліку скасовує рух, що мав початися", () => {
		// Інакше between-станів вистачало б, щоб сторінка поїхала вже ПІСЛЯ
		// того, як галочку зняли: таймер на секунду вже висить.
		stubReducedMotion(false);
		const frame = frameSpy();
		let enabled = true;
		const hold = new HoldScroll(geometry, () => enabled);

		hold.aim(10);
		vi.advanceTimersByTime(500);
		enabled = false;
		hold.aim(10);
		vi.advanceTimersByTime(5000);
		expect(frame, "рух почався після зняття галочки").not.toHaveBeenCalled();
	});
});
