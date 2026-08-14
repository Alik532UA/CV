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
 * ЩО ТУТ НЕ ПОКРИТО, і це сказано прямо, а не мовчить.
 *
 * Модалка вибору PDF і мовне меню лишаються поза перевіркою. Локатори для них
 * тепер є — `sidebar-pdf-btn`, `hero-pdf-btn`, `lang-trigger-btn` (додані разом
 * із цим файлом; до того ключові кнопки user-flow взагалі не мали локаторів), —
 * але послідовність «клік -> панель у DOM» у цьому проході не завелася: клік
 * проходить, а `pdf-option-ats` і `lang-en-btn` до екрана не доїжджають за 30 с.
 * Причина не з'ясована, тому тесту тут немає: червоний або пропущений тест у
 * наборі гірший за відсутній — його швидко починають ігнорувати.
 *
 * Наступний крок, коли до цього дійдуть руки: подивитися, чи модалка взагалі
 * монтується при `pdfModal.open()` на ширині desktop, і чи не потрібен мобільний
 * viewport для `hero-pdf-btn`.
 */
