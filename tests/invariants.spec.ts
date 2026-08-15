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
