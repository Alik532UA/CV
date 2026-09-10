import { expect, test, type Page } from "@playwright/test";

/**
 * Reflow: 320 CSS px без горизонтальної прокрутки
 * (ACCESSIBILITY-v9 § 10.8, `A11Y-REFLOW`, MEDIUM; `GATE-A11Y-AXE`).
 *
 * WCAG 1.4.10 — критерій рівня AA: вміст читається на ширині 320 px без
 * прокрутки у ДВОХ напрямках. 320 — це 1280 px при збільшенні 400 %, тобто
 * критерій не про телефони, а про людину, яка збільшує шрифт.
 *
 * ЧОМУ ЦЬОГО НЕ ЛОВИВ ЖОДЕН НАЯВНИЙ ГЕЙТ. `axe` не перевіряє цього в принципі
 * — він читає дерево доступності, а горизонтальна прокрутка це властивість
 * РОЗКЛАДКИ. Прогін `tests/touch-targets.spec.ts` уже ходить на вузькому
 * вьюпорті, але 390 px, і саме на цій ширині більшість переповнень ще
 * вміщається: у діапазоні 320–390 живе клас дефектів, який не бачить ніхто.
 *
 * МІРЯЄТЬСЯ `documentElement`, А НЕ `body`. `body` із `overflow: hidden`
 * покаже свою ширину рівно такою, як вьюпорт, скільки б не стирчало з дітей;
 * прокручує сторінку саме `<html>`. Плюс `+1` допуску на субпіксельне
 * округлення масштабу — без нього тест червоніє від `scrollWidth: 320.5`,
 * якого людина не бачить і прокрутити не може.
 *
 * ОВЕРЛЕЇ — ОКРЕМИЙ СТАН (§ 10.2). Модалка з фіксованою `width` у пікселях —
 * найчастіше місце цього дефекту, і в стані «одразу після goto()» її немає в
 * розмітці взагалі.
 */

test.use({ viewport: { width: 320, height: 800 } });

const WIDTH = 320;

/**
 * Опис того, що саме стирчить: без нього падіння каже «321 замість 320» і не
 * каже, куди дивитися. Береться найширший елемент, чий правий край виходить
 * за вьюпорт, — переповнення майже завжди має одного винуватця, а решта
 * розтягнута ним.
 */
async function overflowing(page: Page): Promise<string[]> {
	return page.evaluate((limit) => {
		const out: { name: string; right: number }[] = [];
		for (const node of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
			const box = node.getBoundingClientRect();
			if (box.width === 0 || box.height === 0) continue;
			if (box.right <= limit + 1) continue;
			const id = node.getAttribute("data-testid");
			const cls = node.className && typeof node.className === "string" ? `.${node.className.trim().split(/\s+/).join(".")}` : "";
			out.push({
				name: `${node.tagName.toLowerCase()}${id ? `[${id}]` : cls}: правий край ${Math.round(box.right)}`,
				right: box.right
			});
		}
		return out
			.sort((a, b) => b.right - a.right)
			.slice(0, 5)
			.map((x) => x.name);
	}, WIDTH);
}

async function assertNoReflow(page: Page, key: string) {
	// Перевірка, яка захищає перевірку: порожня сторінка не прокручується
	// вбік ніколи, тобто дала б зелене (AI-AGENT-PITFALLS-v9 § 1).
	const painted = await page.evaluate(() => document.body.querySelectorAll("*").length);
	expect(painted, `на сторінці (${key}) майже немає розмітки — перевірка мертва`).toBeGreaterThan(20);

	const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
	expect(
		scrollWidth,
		`горизонтальна прокрутка на 320 px (${key}), WCAG 1.4.10. Стирчить:\n` +
			(await overflowing(page)).join("\n")
	).toBeLessThanOrEqual(WIDTH + 1);
}

/**
 * Зворотний експеримент як частина набору, а не як разова дія
 * (AI-AGENT-PITFALLS-v9 § 1.1).
 *
 * Три тести нижче зелені — і були б зеленими так само, якби `scrollWidth`
 * читався не з того елемента, якби вьюпорт не застосувався або якби
 * `overflowing()` завжди повертав порожній перелік. Тут переповнення
 * СТВОРЮЄТЬСЯ і має бути назване поіменно.
 */
test("детектор бачить переповнення, коли воно є", async ({ page }) => {
	await page.goto("/CV/");
	await expect(page.getByTestId("ai-matcher-open-btn")).toBeVisible();

	await page.evaluate(() => {
		const probe = document.createElement("div");
		probe.dataset.testid = "reflow-probe";
		probe.style.cssText = "width:500px;height:8px;background:transparent";
		document.body.append(probe);
	});

	expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeGreaterThan(WIDTH + 1);
	expect((await overflowing(page)).join("\n")).toContain("reflow-probe");
});

test("головна сторінка читається на 320 px без прокрутки вбік", async ({ page }) => {
	await page.goto("/CV/");
	await expect(page.getByTestId("ai-matcher-open-btn")).toBeVisible();
	await assertNoReflow(page, "home");
});

test("сторінка чеклиста читається на 320 px без прокрутки вбік", async ({ page }) => {
	await page.goto("/CV/beta-test-checklists/");
	await expect(page.getByTestId("beta-tabs-toolbar")).toBeVisible();
	await assertNoReflow(page, "betaChecklist");
});

test("модалка AI не додає горизонтальної прокрутки на 320 px", async ({ page }) => {
	test.setTimeout(90_000);

	await page.goto("/CV/");
	const textarea = page.getByTestId("ai-job-input-textarea");
	// Клік до гідрації нічого не робить — див. пастку в PROJECT-CONTEXT.md.
	await expect(async () => {
		await page.getByTestId("ai-matcher-open-btn").click();
		await expect(textarea).toBeVisible({ timeout: 5000 });
	}).toPass({ timeout: 45_000 });

	await assertNoReflow(page, "aiModal");
});
