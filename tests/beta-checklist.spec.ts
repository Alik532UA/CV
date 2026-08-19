import { expect, test, type Page } from "@playwright/test";

/**
 * Сторінка чеклиста в браузері (BETA-CHECKLIST-v8 § 3.1, § 6).
 *
 * Інваріанти над даними (`src/beta-checklist-canon.test.ts`) доводять, що
 * пункти не збрехали. Тут доводиться інше — що сама сторінка робить свою
 * роботу: позначка переживає перезавантаження, позначка з чужої версії не
 * рахується, а звіт не зникає, коли буфер обміну відмовив. Жодне з трьох не
 * видно в джерелах: усе це поведінка сховища й буфера в рантаймі.
 */

const PATH = "/CV/beta-test-checklists/";
const KEY = "cv-svelte_betaChecklist";

/** Перший пункт першої вкладки — id стабільний назавжди (§ 2.2). */
const CHECK = "theme-1";

/**
 * Клік одразу після `goto()` не робить нічого: кнопку намалював prerender, а
 * `onclick` до гідрації не навішаний — див. пастку в PROJECT-CONTEXT.md.
 */
async function clickWhenLive(page: Page, testId: string, expected: string) {
	await expect(async () => {
		await page.getByTestId(testId).click();
		await expect(page.getByTestId(testId)).toHaveAttribute("aria-pressed", expected, {
			timeout: 2000
		});
	}).toPass({ timeout: 20_000 });
}

test("позначка переживає перезавантаження", async ({ page }) => {
	await page.goto(PATH);
	await expect(page.getByTestId("beta-progress-value")).toBeVisible();

	await clickWhenLive(page, `beta-vote-${CHECK}-ok-btn`, "true");
	await expect(page.getByTestId("beta-progress-value")).toContainText("1/");

	await page.reload();
	await expect(page.getByTestId(`beta-vote-${CHECK}-ok-btn`)).toHaveAttribute(
		"aria-pressed",
		"true"
	);
	await expect(page.getByTestId("beta-progress-value")).toContainText("1/");
});

test("позначка з іншої версії видима, але в поступі не рахується", async ({ page }) => {
	// Засівається СИРИЙ ключ: підробити стару версію інакше нічим, а саме її
	// поведінку тут і треба довести (§ 3.1, BETA-VERSION-STAMP).
	await page.goto(PATH);
	await page.evaluate(
		([key, id]) =>
			localStorage.setItem(key, JSON.stringify({ [id]: { vote: "ok", version: "0.0.1" } })),
		[KEY, "theme_1"]
	);
	await page.reload();

	await expect(page.getByTestId(`beta-check-${CHECK}-stale-hint`)).toBeVisible();
	await expect(
		page.getByTestId("beta-progress-value"),
		"позначка з чужої версії порахувалася як пройдене"
	).toContainText("0/");
});

test("відмова буфера обміну не з'їдає звіт", async ({ page }) => {
	await page.goto(PATH);
	await expect(page.getByTestId("beta-progress-value")).toBeVisible();

	// Буфер відмовляє буденно: вкладка не у фокусі, сторінка не через https,
	// немає дозволу. Тут відмова підставлена явно, бо перевіряється саме
	// запасний шлях (§ 6.2).
	await page.evaluate(() => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: {
				writeText: () => Promise.reject(new Error("denied"))
			}
		});
	});

	await expect(async () => {
		await page.getByTestId("beta-report-btn").click();
		await expect(page.getByTestId("beta-report-textarea")).toBeVisible({ timeout: 2000 });
	}).toPass({ timeout: 20_000 });

	await expect(page.getByTestId("beta-report-hint")).toBeVisible();
	await expect(page.getByTestId("beta-report-textarea")).toHaveValue(/BETA CHECKLIST REPORT/);
	await expect(page.getByTestId("beta-report-textarea")).toHaveValue(/VERSION: \d+\.\d+\.\d+/);
});

test("службова сторінка не показує навігації резюме", async ({ page }) => {
	// «Немає в меню й у жодному переліку» (§ 4) має і зворотний бік: меню
	// резюме не мусить бути ТУТ. Його посилання ведуть на якорі секцій, яких на
	// цій сторінці немає, тобто кожне з них — обіцянка в нікуди.
	await page.goto(PATH);
	await expect(page.getByTestId("beta-tabs-toolbar")).toBeVisible();
	await expect(page.getByTestId("ai-matcher-open-btn")).toHaveCount(0);
	await expect(page.locator('a[href*="#experience"]')).toHaveCount(0);
});
