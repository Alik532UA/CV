import { expect, test, type Locator, type Page } from "@playwright/test";
import { TOUCH_BASELINE, TOUCH_KNOWN } from "./touch-target-baseline";

/**
 * Сенсорні зони не менші за 44×44 (ACCESSIBILITY-v8 § 8, § 10.3;
 * UI-ELEMENTS-v8 § 3 — кнопка закриття як найчастіший порушник).
 *
 * Це одна з двох перевірок, які PROJECT-CONTEXT.md тримав у списку «що не
 * перевіряється автоматично» з готовим планом: «додати проєкт mobile у
 * playwright.config.ts і перевірку boundingBox()». Окремого проєкту не
 * знадобилося — `test.use({ viewport })` дає той самий вьюпорт, і набір
 * лишається одним прогоном `--project=chromium`, тобто CI не змінюється.
 *
 * ЧОМУ САМЕ БРАУЗЕР. У джерелах видно `padding` і `font-size`, а не підсумковий
 * розмір: він складається з обох, з `line-height`, з того, що дає flex-контейнер,
 * і з медіазапиту, який на цій ширині вимкнув половину відступів. Тому міряється
 * `boundingBox()` на зібраному сайті.
 *
 * 390×844 — iPhone 14/15. Ширина типова, і саме на ній вмикаються мобільні
 * гілки верстки (`max-width: 768px`), тобто перевіряється те, що бачить
 * відвідувач із телефона, а не десктопна розкладка у вузькому вікні.
 *
 * ПОРІГ — база, а не нуль. Причина й порядок розбору боргу — у
 * `tests/touch-target-baseline.ts`.
 */

test.use({ viewport: { width: 390, height: 844 } });

const MIN = 44;

/** Читабельна назва елемента: testid, потім aria-label, потім тег із текстом. */
async function describeTarget(el: Locator): Promise<string> {
	return el.evaluate((node) => {
		const e = node as HTMLElement;
		const id = e.getAttribute("data-testid");
		const label = e.getAttribute("aria-label");
		const text = (e.textContent ?? "").trim().slice(0, 24);
		return id ?? label ?? `${e.tagName.toLowerCase()} "${text}"`;
	});
}

/** @returns назви замалих цілей у межах `scope`, без розмірів. */
async function tooSmall(scope: Locator | Page): Promise<string[]> {
	const targets = scope.locator(
		"button, a[href], input:not([type=hidden]), select, [role=button], [role=menuitemradio]"
	);
	const count = await targets.count();
	// Перевірка, яка захищає перевірку: порожній набір дав би «замалих немає»
	// на порожній сторінці (AI-AGENT-PITFALLS-v8 § 1).
	expect(count, "жодного інтерактивного елемента — перевірка мертва").toBeGreaterThan(2);

	const small: string[] = [];
	for (let i = 0; i < count; i++) {
		const el = targets.nth(i);
		if (!(await el.isVisible())) continue;

		const box = await el.boundingBox();
		if (!box) continue;
		if (box.width >= MIN && box.height >= MIN) continue;

		small.push(await describeTarget(el));
	}
	return small;
}

function assertAgainstBaseline(found: string[], key: string) {
	const names = [...new Set(found)].sort();
	expect(
		names,
		`замала ціль, якої не було в базі (${key}) — або нова, або перейменована`
	).toEqual([...TOUCH_KNOWN[key]].sort());
	expect(
		found.length,
		`замалих цілей побільшало (${key}): ${found.join(", ")}`
	).toBeLessThanOrEqual(TOUCH_BASELINE[key]);
}

test("на телефоні жодна ціль не стала меншою за 44×44 понад базу", async ({ page }) => {
	await page.goto("/CV/");
	await expect(page.getByTestId("ai-matcher-open-btn")).toBeVisible();

	assertAgainstBaseline(await tooSmall(page), "home");
});

/**
 * Сторінка чеклиста починає з НУЛЯ, і це не збіг: її кнопки зроблені з
 * `min-height: 44px` одразу, бо саме на ній людина сидить із телефоном у руках.
 * Ключ у базі окремий — щоб борг головної сторінки не ховав регресію тут.
 */
test("на сторінці чеклиста всі цілі не менші за 44×44", async ({ page }) => {
	await page.goto("/CV/beta-test-checklists/");
	await expect(page.getByTestId("beta-tabs-toolbar")).toBeVisible();

	assertAgainstBaseline(await tooSmall(page.locator("main")), "betaChecklist");
});

test("цілі всередині відкритої модалки міряються окремо", async ({ page }) => {
	// Аудит бачить лише те, що на екрані (§ 10.2): без відкриття модалка не
	// перевіряється ніколи, а кнопка закриття — найчастіший порушник правила.
	test.setTimeout(90_000);

	await page.goto("/CV/");
	const textarea = page.getByTestId("ai-job-input-textarea");
	// Клік до гідрації нічого не робить — див. пастку в PROJECT-CONTEXT.md.
	await expect(async () => {
		await page.getByTestId("ai-matcher-open-btn").click();
		await expect(textarea).toBeVisible({ timeout: 5000 });
	}).toPass({ timeout: 45_000 });

	// Саме піддерево діалога, а не сторінка: `isVisible()` вважає видимою й
	// розмітку ПІД оверлеєм, тож без цього звуження модалка звітувала б про всю
	// головну сторінку ще раз, і власні три цілі загубилися б у списку з 21.
	assertAgainstBaseline(await tooSmall(page.locator('[role="dialog"]')), "aiModal");
});
