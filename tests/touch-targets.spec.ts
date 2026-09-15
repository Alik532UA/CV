import { expect, test, type Locator, type Page } from "./fixtures";
import { TOUCH_BASELINE, TOUCH_KNOWN, TOUCH_OVERLAP_KNOWN } from "./touch-target-baseline";

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

/**
 * Один селектор на обидві перевірки, а не два однакові.
 *
 * Поелементна й попарна розходяться саме тут найтихіше: варто дописати роль в
 * одну — і друга перестає бачити той самий елемент, лишаючись зеленою.
 */
const INTERACTIVE =
	"button, a[href], input:not([type=hidden]), select, [role=button], [role=menuitemradio]";

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
	const targets = scope.locator(INTERACTIVE);
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

/**
 * Цілі перевіряються ПАРАМИ (ACCESSIBILITY-v9 § 10.3.1, `A11Y-TOUCH-OVERLAP`,
 * MEDIUM; `GATE-A11Y-AXE`).
 *
 * ЩО ЛИШАЄТЬСЯ ЗЕЛЕНИМ БЕЗ ЦЬОГО. Поелементна перевірка вище зелена й тоді,
 * коли дві цілі по 44×44 лежать одна на одній: кожна окремо відповідає
 * правилу, а клік по кутку однієї відкриває іншу.
 *
 * ЦЕ ЗАМІРЯНО ТУТ, І САМЕ ЦЕЙ ПРОЄКТ ПОТРАПИВ У КАНОН ЯК ДОКАЗ. Розбір боргу
 * в `tests/touch-target-baseline.ts` дійшов до кнопки закриття модалки, якій
 * бракує чотирьох пікселів висоти, — і виявив, що додати їх не можна: у
 * заголовку модалки AI правий край `ai-model-badge-btn` уже заходить під
 * `base-modal-close-btn`. Перекриття існує ЗАРАЗ; збільшення кнопки до 44
 * зробило б його втричі більшим, тобто «виправлення» одного правила зламало б
 * інше — і жоден гейт цього не сказав би.
 *
 * ПОРІГ — ЧОТИРИ ПІКСЕЛІ ПО ОБОХ ОСЯХ, і це не запас на око. Сусідні елементи
 * в флекс-рядку регулярно ділять межу з субпіксельним накладанням, а рамка й
 * тінь додають ще пів пікселя. Перетин, вужчий за 4px хоча б по одній осі, —
 * це стик, а не наїзд: промахнутися по ньому пальцем неможливо, бо цільова
 * зона сусіда починається далі.
 *
 * ВКЛАДЕНІ ПАРИ НЕ РАХУЮТЬСЯ. Картка-посилання з кнопкою всередині
 * перетинається з нею завжди й навмисно — це не дефект, а патерн. Ознака
 * вкладеності береться з DOM (`contains`), а не з геометрії: два різні
 * елементи можуть накладатися повністю й не бути ріднею.
 */

/** Прямокутник видимої цілі разом із її іменем і шляхом у DOM. */
type Target = {
	name: string;
	x: number;
	y: number;
	width: number;
	height: number;
	/** Індекси елементів, які містять цей або містяться в ньому. */
	kin: number[];
};

async function targets(scope: Locator | Page): Promise<Target[]> {
	return scope.locator(INTERACTIVE).evaluateAll((nodes) => {
		const visible = (nodes as HTMLElement[]).filter((node) => {
			const box = node.getBoundingClientRect();
			if (box.width === 0 || box.height === 0) return false;
			return typeof node.checkVisibility === "function" ? node.checkVisibility() : true;
		});
		return visible.map((node, i) => {
			const box = node.getBoundingClientRect();
			const id = node.getAttribute("data-testid");
			const label = node.getAttribute("aria-label");
			const text = (node.textContent ?? "").trim().slice(0, 24);
			return {
				name: id ?? label ?? `${node.tagName.toLowerCase()} "${text}"`,
				x: box.x,
				y: box.y,
				width: box.width,
				height: box.height,
				kin: visible
					.map((other, j) => (j !== i && (node.contains(other) || other.contains(node)) ? j : -1))
					.filter((j) => j >= 0)
			};
		});
	});
}

/** Наїзд однієї цілі на іншу: назва пари й розмір перетину окремо. */
type Overlap = { pair: string; size: string };

/** Пари, що наїжджають одна на одну більш ніж на 4px по ОБОХ осях. */
function overlaps(found: Target[]): Overlap[] {
	const LIMIT = 4;
	const pairs = new Map<string, Overlap>();
	for (let i = 0; i < found.length; i++) {
		for (let j = i + 1; j < found.length; j++) {
			if (found[i].kin.includes(j)) continue;
			const a = found[i];
			const b = found[j];
			const dx = Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x);
			const dy = Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y);
			if (dx <= LIMIT || dy <= LIMIT) continue;
			const pair = `${a.name} × ${b.name}`;
			pairs.set(pair, { pair, size: `${Math.round(dx)}×${Math.round(dy)}px` });
		}
	}
	return [...pairs.values()].sort((x, y) => x.pair.localeCompare(y.pair));
}

/**
 * Звіряння з базою поіменне, а не за кількістю.
 *
 * Числа тут не було б із чого рухати вниз: пар або нуль, або одиниці, і
 * лічильник над таким переліком нічого не додає — зате приховав би заміну
 * однієї пари іншою. Розміри перетину в базі не зберігаються (той самий
 * аргумент, що для розмірів цілей), але друкуються в падінні.
 */
function assertOverlapBaseline(found: Overlap[], key: string) {
	expect(
		found.map((o) => o.pair),
		`наїзд цілей, якого не було в базі (${key}) — клік по кутку однієї спрацює\n` +
			`на іншій. Знайдено: ${found.map((o) => `${o.pair} ${o.size}`).join(", ") || "нічого"}`
	).toEqual([...TOUCH_OVERLAP_KNOWN[key]].sort());
}

test("на головній не з'явилося нового наїзду цілей", async ({ page }) => {
	await page.goto("/CV/");
	await expect(page.getByTestId("ai-matcher-open-btn")).toBeVisible();

	const found = await targets(page);
	// Перевірка, яка захищає перевірку: один елемент не утворює жодної пари,
	// тобто дав би «перекриттів немає» (AI-AGENT-PITFALLS-v9 § 1).
	expect(found.length, "цілей для порівняння немає — перевірка мертва").toBeGreaterThan(5);
	assertOverlapBaseline(overlaps(found), "home");
});

test("цілі у відкритій модалці не наїжджають одна на одну", async ({ page }) => {
	test.setTimeout(90_000);

	await page.goto("/CV/");
	const textarea = page.getByTestId("ai-job-input-textarea");
	// Клік до гідрації нічого не робить — див. пастку в PROJECT-CONTEXT.md.
	await expect(async () => {
		await page.getByTestId("ai-matcher-open-btn").click();
		await expect(textarea).toBeVisible({ timeout: 5000 });
	}).toPass({ timeout: 45_000 });

	const found = await targets(page.locator('[role="dialog"]'));
	expect(found.length, "у модалці немає цілей — перевірка мертва").toBeGreaterThan(2);
	// Тут борг кнопки закриття впирається в бейдж моделі: перш ніж додавати їй
	// 4px висоти за пунктом 2 черги в базі, заголовок мусить перестати заходити
	// під її кут. Зараз перетин 4×2 px — під порогом, і саме тому нуль.
	assertOverlapBaseline(overlaps(found), "aiModal");
});

/**
 * Зворотний експеримент у наборі, а не в історії (AI-AGENT-PITFALLS-v9 § 1.1).
 *
 * Обидва тести вище зелені — і лишилися б зеленими, якби `kin` виключав усе,
 * якби `checkVisibility()` відсіював усе або якби арифметика перетину
 * помилялася знаком. Тут наїзд СТВОРЮЄТЬСЯ і має бути названий.
 */
test("детектор бачить наїзд, коли він є", async ({ page }) => {
	await page.goto("/CV/");
	const anchor = page.getByTestId("ai-matcher-open-btn");
	await expect(anchor).toBeVisible();

	await page.evaluate(() => {
		const victim = document.querySelector<HTMLElement>('[data-testid="ai-matcher-open-btn"]');
		if (!victim) throw new Error("якоря немає — підставний наїзд нема на що класти");
		const box = victim.getBoundingClientRect();
		const probe = document.createElement("button");
		probe.dataset.testid = "overlap-probe";
		probe.style.cssText =
			`position:fixed;left:${box.x + box.width - 20}px;top:${box.y + box.height - 20}px;` +
			"width:44px;height:44px;opacity:0";
		document.body.append(probe);
	});

	const found = overlaps(await targets(page)).map((o) => o.pair);
	expect(found.join("\n"), "підставний наїзд не знайдено — детектор сліпий").toContain(
		"overlap-probe"
	);
});
