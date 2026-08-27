import { describe, expect, it } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Static invariant for FLUID-SIZING-v8 § 1.
 *
 * `repeat(auto-fit, minmax(320px, 1fr))` reads as "at least 320px, then grow",
 * but the 320px is a floor the column never goes below — not even when the
 * container is narrower. The card then sticks out of its grid and the whole page
 * gets a horizontal scrollbar.
 *
 * This one declaration set the CV's minimum width to 360px on its own; at the
 * 375px of an iPhone SE that left 15px of headroom, which is exactly the width
 * of a desktop scrollbar. Narrow a desktop window to 375px and the site scrolled
 * sideways. `body { overflow-x: hidden }` hid it in Chrome and iOS Safari panned
 * anyway, so nothing in the build, the types or the tests ever saw it.
 *
 * The fix is `minmax(min(320px, 100%), 1fr)`: the same wrap threshold on a wide
 * screen, a column that follows the container below it.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(ROOT, p), "utf8");

/** This file quotes the pattern it forbids, so it excludes itself. */
function styleSources(): string[] {
	return globSync("src/**/*.{svelte,css}", { cwd: ROOT }).map((p) => p.replace(/\\/g, "/"));
}

/** An absolute length as the minimum of a minmax(), not wrapped in min(). */
const HARD_FLOOR = /minmax\(\s*(?!min\()[\d.]+(?:px|rem|em|ch)\s*,/g;

/**
 * A fixed column count whose track is a bare `1fr` — `repeat(3, 1fr)`.
 *
 * `auto-fit`/`auto-fill` are excluded on purpose: those are § 1.1's case, and
 * `minmax(0, 1fr)` is the WRONG fix for them — with a zero floor the columns
 * stop wrapping and a wide screen gets N thin ones instead of two.
 */
const BARE_FR = /repeat\(\s*\d+\s*,\s*1fr\s*\)/g;

/**
 * Comments are not code. A comment explaining the anti-pattern has to quote it,
 * and a scanner that reads comments then fails on its own documentation — the
 * first run of this test did exactly that, on the comment added with the fix.
 *
 * Newlines are kept so the reported line number still points at the real match.
 */
function withoutComments(text: string): string {
	const blank = (m: string) => m.replace(/[^\n]/g, " ");
	return text.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/<!--[\s\S]*?-->/g, blank);
}

describe("fluid sizing canon § 1 — a grid column may not have a hard floor", () => {
	it("scans the stylesheets it claims to scan", () => {
		// Canary (CODE-QUALITY-v8 § 3.5): a glob that matches nothing would make
		// the check below pass for the rest of the project's life.
		const files = styleSources();
		expect(files.length).toBeGreaterThan(20);
		expect(files).toContain("src/lib/components/sections/ProjectsSection.svelte");
	});

	it("finds the pattern when it is there", () => {
		// The regex is the whole test; a silently broken one reports success.
		expect("grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));").toMatch(HARD_FLOOR);
		expect("grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));").not.toMatch(
			HARD_FLOOR
		);
		expect(withoutComments("/* minmax(320px, 1fr) */\n.g { gap: 0 }")).not.toMatch(HARD_FLOOR);
	});

	it("finds a bare 1fr track list when it is there", () => {
		expect("grid-template-columns: repeat(3, 1fr);").toMatch(BARE_FR);
		expect("grid-template-columns: repeat(3, minmax(0, 1fr));").not.toMatch(BARE_FR);
		// `repeat(auto-fit, …)` is the other rule's business (§ 1.1) and is not
		// fixed by minmax(0): with it the columns stop wrapping altogether.
		expect("grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));").not.toMatch(
			BARE_FR
		);
		expect(withoutComments("/* repeat(3, 1fr) */\n.g { gap: 0 }")).not.toMatch(BARE_FR);
	});

	it("no fixed column count uses a bare 1fr", () => {
		const offenders: string[] = [];
		for (const file of styleSources()) {
			if (file.endsWith("fluid-sizing-canon.test.ts")) continue;
			const text = withoutComments(read(file));
			for (const m of text.matchAll(BARE_FR)) {
				const line = text.slice(0, m.index).split("\n").length;
				offenders.push(`${file}:${line}  ${m[0]}`);
			}
		}
		expect(
			offenders,
			"`1fr` — це `minmax(auto, 1fr)`: колонка не стане вужчою за min-content свого " +
				"вмісту, хоч би скільки місця лишилось. Для колонок із картками потрібне " +
				`\`minmax(0, 1fr)\` і \`min-width: 0\` на самій картці:\n${offenders.join("\n")}`
		).toEqual([]);
	});

	it("no minmax() takes an absolute minimum directly", () => {
		const offenders: string[] = [];
		for (const file of styleSources()) {
			if (file.endsWith("fluid-sizing-canon.test.ts")) continue;
			const text = withoutComments(read(file));
			for (const m of text.matchAll(HARD_FLOOR)) {
				const line = text.slice(0, m.index).split("\n").length;
				offenders.push(`${file}:${line}  ${m[0]}`);
			}
		}
		expect(
			offenders,
			`wrap the minimum in min(…, 100%) so the column can follow a narrow container:\n${offenders.join("\n")}`
		).toEqual([]);
	});
});

/**
 * FS-CONTAINER (§ 7A, HIGH) — компонент міряє СЕБЕ, а не вікно.
 *
 * Канон називає спосіб пошуку прямо: `grep -rn "@media" src/lib/components/`.
 * Тут їх 21, з них 17 прив'язані до розміру ВІКНА, і жодного `@container`.
 *
 * ЧОМУ ЦЕ НЕ ПРИДИРКА — ЗАМІРЯНО В ЖИВІЙ СТОРІНЦІ. Ширина `.platforms-grid`
 * у `SkillsSection` за шириною вікна:
 *
 *     вікно 1440 → сітка 1080     вікно 1024 → сітка  657
 *     вікно 1280 → сітка  920     вікно  768 → сітка  721
 *
 * Послідовність НЕ монотонна: на вікні 768 сітка ШИРША, ніж на 1024, бо бічна
 * панель на 280px зникає раніше, ніж вікно встигає звузитися на ту саму
 * величину. Тобто медіазапит ранжує компоненти не в тому порядку, у якому їм
 * насправді тісно: `max-width: 1024px` спрацьовує там, де місця 657px, і там,
 * де його 721px, однаково — а різницю між цими двома станами не бачить.
 *
 * ЧОМУ ПЕРЕВІРКА, А НЕ ПРАВКА. Заміна `@media` на `@container` — не переклад
 * синтаксису: контейнер вужчий за вікно на 280px там, де є бічна панель, і
 * дорівнює йому там, де її немає, тож КОЖНЕ число доводиться обирати заново.
 * `@container (max-width: 1024px)` спрацював би на вікні ~1300px, тобто зламав
 * би розкладку на десктопі. Це продуктове рішення з видимими наслідками, а не
 * рефакторинг; поки воно не ухвалене, борг має бути ВИМІРЯНИЙ, а не описаний
 * словами «частина законна, решта ні» (v8 README: правило, яке не можна
 * перевірити, — це побажання).
 *
 * Пропозиція міграції з числами — у PROJECT-CONTEXT.md.
 */
describe("FS-CONTAINER § 7A — межа боргу медіазапитів у компонентах", () => {
	/** Умови, що НЕ про доступне місце: пристрій, преференція, друк. */
	const SIZE_KEYED = /\b(?:min|max)-(?:width|height)\b/;

	/**
	 * Скільки запитів за розміром вікна лишається в кожному компоненті.
	 * Число може лише спадати — і спадає воно переїздом на `@container`
	 * або зникненням самого правила.
	 */
	const WINDOW_KEYED: Record<string, number> = {
		// Показ і приховування самих блоків розкладки — це справді про ВІКНО:
		// на вузькому екрані бічна панель поступається нижньому меню. Канон це
		// прямо дозволяє (§ 7A: «кількість колонок сторінки, показ бічної
		// панелі»). Ці три — не борг, а межа: вони мають лишитися @media.
		"src/lib/components/BottomNav.svelte": 1,
		"src/lib/components/SidebarNav.svelte": 1,
		"src/lib/components/HeaderSection.svelte": 1,
		// Плаваюча кнопка прибита до вікна, а не до вмісту.
		"src/lib/components/ui/FloatingAiButton.svelte": 1,
		// Оболонки вікон: розмір модалки задає вікно, і це законно. Але правила
		// ВСЕРЕДИНІ них (відступи, колонки) мають міряти саму модалку.
		"src/lib/components/ui/BaseModal.svelte": 1,
		"src/lib/components/ui/PdfModal.svelte": 4,
		"src/lib/components/ui/Toast.svelte": 1,
		// Справжні кандидати на @container: усе це живе в колонці вмісту, яка на
		// 280px вужча за вікно там, де є бічна панель.
		"src/lib/components/sections/HeroSection.svelte": 3,
		"src/lib/components/sections/SkillsSection.svelte": 2,
		"src/lib/components/ui/AiMatchModal.svelte": 1,
		"src/lib/components/ui/Section.svelte": 1
	};

	function windowKeyed(): Record<string, number> {
		const found: Record<string, number> = {};
		for (const file of globSync("src/lib/components/**/*.svelte", { cwd: ROOT })) {
			const path = file.replace(/\\/g, "/");
			const code = withoutComments(read(path));
			for (const m of code.matchAll(/@media([^{]+)\{/g)) {
				if (SIZE_KEYED.test(m[1])) found[path] = (found[path] ?? 0) + 1;
			}
		}
		return found;
	}

	it("перевірка жива: медіазапити в компонентах узагалі знайдено", () => {
		const total = Object.values(windowKeyed()).reduce((a, b) => a + b, 0);
		expect(total, "жодного @media — сканер шукає не там").toBeGreaterThan(5);
	});

	it("розрізняє запит за місцем і запит за пристроєм", () => {
		// Регулярка — це весь тест.
		expect("(max-width: 768px)").toMatch(SIZE_KEYED);
		expect("(max-height: 620px)").toMatch(SIZE_KEYED);
		expect(" print").not.toMatch(SIZE_KEYED);
		expect("(prefers-reduced-motion: reduce)").not.toMatch(SIZE_KEYED);
		expect("(hover: none)").not.toMatch(SIZE_KEYED);
	});

	it("жоден компонент не додає нового запиту за розміром вікна", () => {
		const grown = Object.entries(windowKeyed())
			.filter(([file, n]) => n > (WINDOW_KEYED[file] ?? 0))
			.map(([file, n]) => `${file}: ${n}, дозволено ${WINDOW_KEYED[file] ?? 0}`);
		expect(
			grown,
			"новий @media у компоненті — майже завжди мав бути @container (§ 7A):\n" + grown.join("\n")
		).toEqual([]);
	});

	it("список не тримає числа, які вже не потрібні", () => {
		const found = windowKeyed();
		const stale = Object.entries(WINDOW_KEYED)
			.filter(([file, n]) => (found[file] ?? 0) < n)
			.map(([file, n]) => `${file}: ${found[file] ?? 0}, записано ${n}`);
		expect(
			stale,
			`підтягнути число вниз — запас дозволить відрости назад:\n${stale.join("\n")}`
		).toEqual([]);
	});
});
