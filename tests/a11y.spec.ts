import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { A11Y_BASELINE, A11Y_KNOWN } from "./a11y-baseline";

/**
 * Машинно-виявні порушення WCAG (ACCESSIBILITY-v8 § 10, GATE-A11Y-AXE).
 *
 * Цього гейта в проєкті не було зовсім: PROJECT-CONTEXT.md тримав рядок
 * «a11y-аудит — `@axe-core/playwright` не підключено».
 *
 * МЕЖА МЕТОДУ, і її треба знати, щоб зелений результат не читався як «сайт
 * доступний». axe ловить приблизно третину проблем доступності. Порядок
 * фокуса, осмисленість `alt`, логічність заголовків, зрозумілість `aria-label`,
 * працездатність focus trap — він не бачить нічого з цього. Зелений axe
 * означає рівно одне: немає порушень, які видно машині. Ручний прохід
 * (§ 11) — обов'язкова друга половина, а не доповнення.
 *
 * Друга межа (§ 10.2): `analyze()` бачить лише той стан, що є одразу після
 * `goto()`. Модалки, відкриті меню й тости в нього не потрапляють ніколи —
 * тому нижче окремий сценарій із відкритою модалкою.
 */

const TAGS = ["wcag2a", "wcag2aa", "wcag22aa"];

async function audit(page: Page, key: string) {
	const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

	// Перевірка, яка захищає перевірку: axe, що не проаналізував нічого, дав би
	// «нуль порушень» на порожній сторінці (AI-AGENT-PITFALLS-v8 § 1).
	expect(
		results.passes.length,
		"axe не виконав жодної перевірки — сторінка порожня чи не завантажилася?"
	).toBeGreaterThan(0);

	const ids = [...new Set(results.violations.map((v) => v.id))].sort();
	expect(ids, `новий тип порушення, якого не було в базі (${key})`).toEqual(
		[...A11Y_KNOWN[key]].sort()
	);
	expect(
		results.violations.length,
		`порушень побільшало (${key}): ${results.violations.map((v) => v.id).join(", ")}`
	).toBeLessThanOrEqual(A11Y_BASELINE[key]);
}

test("головна сторінка не має машинно-виявних порушень WCAG", async ({ page }) => {
	await page.goto("/CV/");
	await expect(page.getByTestId("ai-matcher-open-btn")).toBeVisible();
	await audit(page, "home");
});

/**
 * ТЕМНА ТЕМА — окремий прогін, а не той самий (ACCESSIBILITY-v8 § 6).
 *
 * До цього тут стояв один набір, і PROJECT-CONTEXT.md чесно тримав рядок:
 * «axe-прогін іде у світлій темі (типова для Playwright), тож темну ніхто не
 * міряв». Контраст — властивість ПАРИ кольорів, тож зелений результат у світлій
 * темі не говорить про темну взагалі нічого, а темна тут не «інверсія»: це
 * власний набір змінних у `:root[data-theme='dark']`.
 *
 * `colorScheme: 'dark'` б'є в `prefers-color-scheme`, а не в `localStorage`, —
 * тобто перевіряється саме той шлях, яким тему отримує відвідувач, що ніколи не
 * торкався перемикача. Перший `expect` нижче тримає цей ланцюжок чесним: якщо
 * тема не доїхала, axe міряв би світлу і мовчав.
 */
test.describe("темна тема", () => {
	test.use({ colorScheme: "dark" });

	test("головна сторінка не має машинно-виявних порушень WCAG", async ({ page }) => {
		await page.goto("/CV/");
		await expect(page.getByTestId("ai-matcher-open-btn")).toBeVisible();
		await expect(
			page.locator("html"),
			"тема не темна — далі axe міряв би світлу й дав би зелений ні про що"
		).toHaveAttribute("data-theme", "dark");
		await audit(page, "homeDark");
	});
});

/**
 * Службова сторінка перевіряється НАРІВНІ з рештою (BETA-CHECKLIST-v8 § 5.5).
 *
 * Спокуса пропустити її велика: вона не в індексі, її не бачить відвідувач.
 * Але саме нею користується той, кого попросили перевірити сайт, — і якщо
 * найслабше покритою буде вона, доступність перевірятиме людина, якій сама
 * перевірка незручна.
 */
test("сторінка чеклиста не має машинно-виявних порушень WCAG", async ({ page }) => {
	await page.goto("/CV/beta-test-checklists/");
	await expect(page.getByTestId("beta-tabs-toolbar")).toBeVisible();
	await audit(page, "betaChecklist");
});

test("модалка AI Matcher доступна у ВІДКРИТОМУ стані", async ({ page }) => {
	// Довший ліміт, ніж типові 30 с: сам аудит займає секунди, а модалка
	// приїжджає динамічним імпортом, який dev-сервер компілює за першим
	// зверненням. Обидва рази це не «повільний тест», а «перевірка, якій не
	// вистачило часу» — і виглядає вона як падіння коду.
	test.setTimeout(90_000);

	await page.goto("/CV/");
	const textarea = page.getByTestId("ai-job-input-textarea");
	// Клік до гідрації нічого не робить — див. пастку в PROJECT-CONTEXT.md.
	await expect(async () => {
		await page.getByTestId("ai-matcher-open-btn").click();
		await expect(textarea).toBeVisible({ timeout: 5000 });
	}).toPass({ timeout: 45_000 });

	await audit(page, "aiModal");
});
