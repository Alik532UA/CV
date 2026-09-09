// @vitest-environment node
import { describe, expect, it } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Lighthouse міряє сторінки, які є (OBSERVABILITY-v9 § 2.2.1,
 * `OBS-LHCI-REAL-PAGES`, MEDIUM).
 *
 * Крок `npx @lhci/cli autorun` стоїть у `deploy.yml` між збіркою й
 * вивантаженням і має пороги-`error`, тобто це БЛОКУЮЧИЙ гейт. А перелік
 * адрес у `lighthouserc.cjs` написаний руками — один рядок, `index.html`.
 *
 * Канон називає два способи отримати зелений Lighthouse, нічого не виміривши,
 * і обидва заміряні в сусідньому проєкті пакета 2026-08-27: перелік `url`
 * розійшовся з переліком маршрутів (шість адрес, і жодної з нових), а сервер
 * піднявся без базового шляху — сім сторінок мірялися БЕЗ CSS, JS і
 * зображень, і мали за це чудові бали продуктивності.
 *
 * ЩО ПЕРЕВІРЯЄТЬСЯ ТУТ, А ЩО В `check:build`. Тут — розбіжність переліків:
 * новий КЛАС маршруту, якого Lighthouse не бачить, мусить бути або в переліку
 * адрес, або в `NOT_MEASURED` із причиною. Канарку «сторінка приїхала з CSS і
 * JS» перевіряє `scripts/check-build.mjs`: для неї потрібен `build/`, якого в
 * юніт-прогоні немає, а вигадати його — це рівно той хибний зелений, від
 * якого правило й стоїть.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(ROOT, p), "utf8");
const CONFIG = read("lighthouserc.cjs");

/** Адреси з `collect.url` — те, що LHCI справді відкриє. */
function measuredPaths(): string[] {
	const list = /url:\s*\[([\s\S]*?)\]/.exec(CONFIG);
	if (!list) return [];
	return [...list[1].matchAll(/['"`]([^'"`]+)['"`]/g)].map((m) =>
		m[1].replace(/^https?:\/\/[^/]+/, "")
	);
}

/**
 * Класи маршрутів проєкту, зведені до шляху в `build/`.
 *
 * `[[lang=lang]]` — необовʼязковий параметр, тобто той САМИЙ клас сторінки:
 * голий шлях і 41 мовний префікс віддають ту саму розмітку іншою мовою. Тому
 * він дає рівно один клас — корінь.
 */
function routeClasses(): string[] {
	return globSync("src/routes/**/+page.svelte", { cwd: ROOT })
		.map((f) => f.replace(/\\/g, "/"))
		.map((f) => f.replace(/^src\/routes\/?/, "").replace(/\+page\.svelte$/, ""))
		.map((dir) =>
			dir
				.split("/")
				.filter((seg) => seg.length > 0 && !/^\[\[.*\]\]$/.test(seg))
				.join("/")
		)
		.map((dir) => (dir === "" ? "/index.html" : `/${dir}/index.html`))
		.sort();
}

/**
 * Класи, які Lighthouse НЕ міряє, і чому. Порожній перелік читався б як
 * «міряємо все» — тут це неправда, і причина не в лінощах.
 */
const NOT_MEASURED: Record<string, string> = {
	"/beta-test-checklists/index.html":
		"сторінка навмисно `noindex` (BETA-HIDDEN-PAGE), а аудит SEO у Lighthouse " +
		"саме за це й знімає бали: «Page is blocked from indexing». Поріг " +
		"`categories:seo` тут стоїть на error, тож додати цю адресу означало б " +
		"або червоний деплой, або окрему матрицю порогів на один службовий екран"
};

describe("Lighthouse міряє сторінки, які є (OBS-LHCI-REAL-PAGES)", () => {
	it("перевірка жива: конфіг прочитано, адреси й маршрути знайдено", () => {
		expect(CONFIG.length, "lighthouserc.cjs порожній").toBeGreaterThan(200);
		expect(measuredPaths().length, "у конфізі немає жодної адреси — LHCI шукав би сам").toBeGreaterThan(
			0
		);
		expect(routeClasses().length, "маршрутів не знайдено — сканер читає не те").toBeGreaterThan(1);
		// Розбір адрес справді знімає фіктивний хост, а не лишає його.
		expect(measuredPaths().every((p) => p.startsWith("/"))).toBe(true);
	});

	/**
	 * Адреса вказана ЯВНО, і це не уточнення, а виправлення: без неї LHCI сам
	 * шукає HTML у `staticDistDir`, а там лежить і `404.html` — SPA-фолбек без
	 * пререндереного вмісту, який не вміє завантажитися з кореня сервера. Вибір
	 * падав саме на нього, Chrome не малював жодного кадру, і крок, що стоїть
	 * ПЕРЕД викладенням артефакту, блокував увесь деплой.
	 */
	it("автопошук сторінок вимкнений явним переліком адрес", () => {
		expect(CONFIG, "немає `url:` — LHCI піде шукати HTML сам і знайде 404.html").toMatch(
			/url:\s*\[/
		);
		expect(CONFIG, "`staticDistDir` мусить вказувати на теку, яка їде на хостинг").toMatch(
			/staticDistDir:\s*['"`]\.\/build['"`]/
		);
	});

	it("кожен клас маршруту або міряється, або названий у NOT_MEASURED", () => {
		const measured = new Set(measuredPaths());
		const uncovered = routeClasses().filter(
			(route) => !measured.has(route) && !(route in NOT_MEASURED)
		);
		expect(
			uncovered,
			"клас маршруту, якого Lighthouse не відкриває жодного разу: гейт зелений, а\n" +
				"сторінка не зміряна ніколи. Додати адресу в `lighthouserc.cjs` або запис у\n" +
				"NOT_MEASURED із причиною:\n" + uncovered.join("\n")
		).toEqual([]);
	});

	it("NOT_MEASURED не тримає маршрутів, яких уже немає або які вже міряються", () => {
		const routes = new Set(routeClasses());
		const measured = new Set(measuredPaths());
		const stale = Object.keys(NOT_MEASURED).filter((r) => !routes.has(r) || measured.has(r));
		expect(stale, `прибрати з NOT_MEASURED:\n${stale.join("\n")}`).toEqual([]);
	});

	/**
	 * Поріг, вищий за фактичний бал, тримається до першого прогону — а потім
	 * його вимикають (той самий аргумент, що для нуля в axe і `off` в ESLint).
	 * Тут перевіряється не саме число, а те, що воно ОГОЛОШЕНЕ: категорія без
	 * порога — це аудит, результат якого ніхто не читає.
	 */
	it("кожна категорія має оголошений поріг", () => {
		for (const category of ["performance", "accessibility", "best-practices", "seo"]) {
			expect(CONFIG, `немає порога для categories:${category}`).toContain(
				`'categories:${category}'`
			);
		}
	});
});
