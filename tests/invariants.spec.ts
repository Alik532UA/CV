import { expect, test } from "@playwright/test";

/**
 * Рантайм-доповнення до src/testid-conventions.test.ts (§ 1.9.2 v8).
 *
 * Статична перевірка бачить кожен testid у джерелах, але не знає, скільки разів
 * компонент опиниться на сторінці. Саме це тут і перевіряється — на справжньому
 * DOM.
 *
 * Межа методу з § 1.9.2 — «видно лише стан одразу після goto()» — тут закрита
 * явно: модалка вибору PDF і мовне меню відкриваються кліком окремими тестами.
 * Доки цього не було, у комментарі до файлу стояло, що вони не покриті, і так
 * воно й лишалося.
 */

const PAGES = ["/CV/", "/CV/uk/", "/CV/ja/"];

/**
 * Кожна перевірка починається з того, що їй є що перевіряти. Без цього
 * порожня сторінка (зламаний білд, змінений base path) давала б «дублікатів
 * немає» — зелений тест на непрацюючому сайті (AI-AGENT-PITFALLS-v8 § 1).
 */
async function collectIds(page: import("@playwright/test").Page, where: string) {
	const ids = await page.$$eval("[data-testid]", (els) =>
		els.map((el) => el.getAttribute("data-testid") ?? "")
	);
	expect(ids.length, `${where}: жодного data-testid — перевірка мертва`).toBeGreaterThan(10);
	return ids;
}

function expectUnique(ids: string[], where: string) {
	const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
	expect(dupes, `${where}: duplicate data-testid: ${dupes.join(", ")}`).toEqual([]);
}

for (const path of PAGES) {
	test(`unique data-testid on ${path}`, async ({ page }) => {
		await page.goto(path);
		expectUnique(await collectIds(page, path), path);
	});
}

/**
 * ЩО БУЛО НЕ ПОКРИТО — і чому тепер покрито.
 *
 * Тут стояв запис: «клік проходить, а `pdf-option-ats` і `lang-en-btn` до
 * екрана не доїжджають за 30 с. Причина не з'ясована». Причина з'ясувалася на
 * чотирьох тестах `ai-matcher.spec.ts`, які падали точно так само й з тієї ж
 * причини: клік одразу після `goto()` потрапляє в кнопку, яку намалював
 * prerender, але обробник `onclick` до гідрації ще не навішаний. Клік минає
 * повз застосунок і не каже про це нічого — а падає потім очікування панелі,
 * тобто симптом вказує зовсім не туди, де причина.
 *
 * Ліки канонічні: пара «клік + очікування» під `toPass`, доки застосунок не
 * оживе (CODE-QUALITY-v8 § 5.3). Модалка й меню працюють — це перевірено
 * вручну на зібраному сайті через `npm run preview`.
 */
async function clickUntilVisible(
	page: import("@playwright/test").Page,
	trigger: string,
	appears: string
) {
	const target = page.getByTestId(appears);
	await expect(async () => {
		await page.getByTestId(trigger).click();
		await expect(target).toBeVisible({ timeout: 1000 });
	}).toPass({ timeout: 15000 });
	return target;
}

test("unique data-testid with the PDF modal open", async ({ page }) => {
	await page.goto("/CV/");
	await clickUntilVisible(page, "sidebar-pdf-btn", "pdf-option-ats");
	expectUnique(await collectIds(page, "PDF modal"), "PDF modal");
});

test("unique data-testid with the language menu open", async ({ page }) => {
	await page.goto("/CV/");
	await clickUntilVisible(page, "lang-trigger-btn", "lang-en-btn");
	expectUnique(await collectIds(page, "language menu"), "language menu");
});

/**
 * Скільки юніт-перевірок vitest справді добирає — питається З ІНШОГО РАННЕРА.
 *
 * ЧОМУ НЕ У VITEST. Той самий інваріант стоїть у `src/test-runners.test.ts`, і
 * в нього є сліпа пляма, яку не прибрати зсередини: звузити `include` до
 * `src/lib/**` — і файл, що стереже глоб, першим і випадає з набору. Заміряно:
 * прогін лишався зеленим, 12 файлів зі 34, 126 тестів із 304, і жоден рядок
 * звіту не казав, що двадцять два файли не виконувалися.
 *
 * Playwright має власний конфіг і власний перелік файлів, тож звузити обидва
 * одним недоглядом неможливо. Тут не запускається жоден із тих тестів —
 * перевіряється лише те, що раннер їх БАЧИТЬ.
 *
 * Число — підлога, а не точна кількість: новий файл перевірки не має валити
 * прогін. Валить його зникнення набору, і саме це тут єдина мета.
 */
test("vitest бачить увесь набір юніт-перевірок @static", async () => {
	const { globSync, readFileSync } = await import("node:fs");

	const raw = readFileSync("vitest.config.ts", "utf8");

	/*
	 * ДВА РІЗНІ ТЕКСТИ, І ЦЕ НЕ ПРИДИРКА.
	 *
	 * `passWithNoTests` шукається у тексті БЕЗ коментарів: конфіг пояснює, чому
	 * цей прапорець звідти прибрано, і перевірка, яка читає власну
	 * документацію, падає на ній. Перший прогін цього тесту зробив саме так.
	 *
	 * `include` натомість читається із СИРОГО тексту, бо зняття коментарів його
	 * псує: у глобі `src/**` лежить послідовність `/*`, а в `**\/` — `*\/`,
	 * тож регулярка блокових коментарів з'їдає шматок самого шаблону і лишає
	 * `src*.{test,spec}`, який не добирає нічого. Другий прогін зробив саме це,
	 * і виглядало воно як «набір зник» — тобто перевірка звинувачувала проєкт
	 * у власній помилці. Літерал `include: ['` у коментарі не з'явиться.
	 */
	const stripped = raw.replace(/^\s*\/\/.*$/gm, "").replace(/^\s*\*.*$/gm, "");
	expect(stripped, "passWithNoTests повертає нулю статус успіху").not.toMatch(
		/passWithNoTests:\s*true/
	);

	const pattern = /include:\s*\[\s*'([^']+)'/.exec(raw)?.[1];
	expect(pattern, "у vitest.config.ts більше немає include — перевірка мертва").toBeTruthy();

	const collected = globSync(pattern!, { cwd: process.cwd() });
	expect(
		collected.length,
		`глоб «${pattern}» добирає ${collected.length} файлів — набір зник або звузився`
	).toBeGreaterThanOrEqual(30);
});
