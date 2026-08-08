import { expect, test } from "@playwright/test";

/**
 * Рантайм-доповнення до src/testid-conventions.test.ts (§ 1.9.2 v8).
 *
 * Статична перевірка бачить кожен testid у джерелах, але не знає, скільки разів
 * компонент опиниться на сторінці. Саме це тут і перевіряється — на справжньому
 * DOM, по одній сторінці на кожну індексовану мову.
 *
 * Межа методу: видно лише стан одразу після goto(). Модалка вибору PDF і мовне
 * меню закриті, тож їхні testid цією перевіркою не покриті — щоб покрити, їх
 * треба відкрити явно.
 */

const PAGES = ["/CV/", "/CV/uk/", "/CV/ja/"];

for (const path of PAGES) {
	test(`unique data-testid on ${path}`, async ({ page }) => {
		await page.goto(path);
		const ids = await page.$$eval("[data-testid]", (els) =>
			els.map((el) => el.getAttribute("data-testid"))
		);
		const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
		expect(dupes, `Duplicate data-testid: ${dupes.join(", ")}`).toEqual([]);
	});
}
