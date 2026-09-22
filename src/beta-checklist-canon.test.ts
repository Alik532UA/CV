// @vitest-environment node
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { ALL_CHECKS, BETA_TABS, COVERAGE_ORDER, sortChecks } from "$lib/data/betaChecklist";

/**
 * Інваріанти над чеклистом (BETA-CHECKLIST-v8 § 5).
 *
 * ЧОМУ ЦЕ ГОЛОВНА ЧАСТИНА ФІЧІ, А НЕ ЇЇ ДОДАТОК. Найдорожча пастка чеклистів —
 * не помилка в пункті, а ВІДСТАВАННЯ: код змінився, пункт лишився, і людина
 * ставить «перевірено» на тому, чого вже немає. Правило в документі помічає це
 * тоді, коли документ хтось перечитає; інваріант — на кожному прогоні. Саме
 * тому чеклист тут — дані в репозиторії, а не сторінка в Notion.
 */

/**
 * Джерело САМОЇ сторінки — окремо від решти проєкту.
 *
 * Правила § 8 говорять про те, що є на ЦІЙ сторінці: локатор, знайдений у
 * чужому компоненті, нічого не довів би.
 */
const PAGE_SOURCE = readFileSync("src/routes/beta-test-checklists/+page.svelte", "utf8");

/**
 * Перелік прихованих маршрутів читається з ТЕКСТУ модуля політики адрес.
 *
 * Імпортувати його не можна: `routing.ts` тягне за собою клієнтський рантайм
 * SvelteKit, і під `node` файл падає ще до першого `it`. Текст тут не гірший за
 * імпорт — він із того самого єдиного джерела, а не з другого списку.
 */
const HIDDEN_ROUTES: string[] = [
	...readFileSync("src/lib/i18n/routing.ts", "utf8")
		.match(/HIDDEN_ROUTES[^=]*=\s*\[([^\]]*)\]/)?.[1]
		.matchAll(/"([^"]+)"/g) ?? []
].map((m) => m[1]);

const walk = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else out.push(full.replace(/\\/g, "/"));
	}
	return out;
};

const SOURCES = walk("src");

/**
 * Маршрути беруться З ДИСКА, а не зі списку, який тримають руками. Другий
 * список розійшовся б із першим на першому ж новому маршруті — а саме цього
 * правило § 5.1 і має не допустити. Форма — `page.route.id`, як її повідомляє
 * SvelteKit: тека `[[lang=lang]]` дає `/[[lang=lang]]`.
 */
const ROUTES_ON_DISK = SOURCES.filter((f) => /\/routes\/.*\+page\.svelte$/.test(f)).map((f) => {
	const rest = f.replace(/^src\/routes/, "").replace(/\/\+page\.svelte$/, "");
	return rest === "" ? "/" : rest;
});

/** Локатори з розмітки — лише літерали: шаблон із `{…}` збігся б із вигаданим. */
const LITERAL_TESTIDS = new Set(
	SOURCES.filter((f) => f.endsWith(".svelte")).flatMap((f) =>
		[...readFileSync(f, "utf8").matchAll(/data-testid="([^"{]+)"/g)].map((m) => m[1])
	)
);

/**
 * Локатори, які збираються з двох частин: `data-testid="beta-vote-{…}-{vote}-btn"`
 * у розмітці, а самі значення — у даних. Рядка `beta-vote-theme-1-fail-btn`
 * немає ніде, і без цього кроку перевірка бракувала б правильні назви (§ 5.3).
 */
const slug = (id: string) => id.replace(/_/g, "-");
for (const check of ALL_CHECKS) {
	LITERAL_TESTIDS.add(`beta-check-${slug(check.id)}-item`);
	LITERAL_TESTIDS.add(`beta-check-${slug(check.id)}-text`);
	LITERAL_TESTIDS.add(`beta-check-${slug(check.id)}-category-text`);
	for (const vote of ["fail", "weird", "ok"]) {
		LITERAL_TESTIDS.add(`beta-vote-${slug(check.id)}-${vote}-btn`);
	}
}
for (const tab of BETA_TABS) LITERAL_TESTIDS.add(`beta-tab-${tab.id}-btn`);
for (const level of COVERAGE_ORDER) LITERAL_TESTIDS.add(`beta-level-${level}-section`);

const CYRILLIC = /[Ѐ-ӿ]/;

describe("чеклист живий", () => {
	it("бачить пункти, вкладки й маршрути проєкту", () => {
		expect(ALL_CHECKS.length).toBeGreaterThan(10);
		expect(BETA_TABS.length).toBeGreaterThan(1);
		expect(ROUTES_ON_DISK.length, "жодного маршруту на диску — перевірка мертва").toBeGreaterThan(1);
		expect(LITERAL_TESTIDS.size).toBeGreaterThan(30);
	});
});

describe("§ 5.1 — кожен маршрут заявлений вкладкою", () => {
	it("немає маршруту, який нічим перевіряти", () => {
		const claimed = new Set(BETA_TABS.flatMap((tab) => tab.routes));
		const uncovered = ROUTES_ON_DISK.filter((route) => !claimed.has(route));
		expect(
			uncovered,
			`сторінка є, а перевіряти її нічим — додайте вкладку:\n${uncovered.join("\n")}`
		).toEqual([]);
	});

	it("жодна вкладка не заявляє маршруту, якого немає", () => {
		const onDisk = new Set(ROUTES_ON_DISK);
		const ghosts = BETA_TABS.flatMap((tab) =>
			tab.routes.filter((r) => !onDisk.has(r)).map((r) => `${tab.id} → ${r}`)
		);
		expect(ghosts, `вкладка перевіряє неіснуючу сторінку:\n${ghosts.join("\n")}`).toEqual([]);
	});
});

describe("§ 5.2 — covered називає файл тесту, і файл існує", () => {
	it("кожен covered називає наявний файл", () => {
		const missing = ALL_CHECKS.filter((c) => c.coverage === "covered").filter(
			(c) => !c.test || !existsSync(c.test)
		);
		expect(
			missing.map((c) => `${c.id} → ${c.test ?? "(без назви)"}`),
			"твердження про покриття гниє швидше за сам чеклист"
		).toEqual([]);
	});

	it("manual і testable не називають тесту — одне з двох було б неправдою", () => {
		const wrong = ALL_CHECKS.filter((c) => c.coverage !== "covered" && c.test !== undefined);
		expect(wrong.map((c) => `${c.id}: ${c.coverage} + test`)).toEqual([]);
	});
});

describe("§ 5.3 — «натисніть» вимагає локатора", () => {
	it("пункт, що просить натиснути, називає локатор", () => {
		const naked = ALL_CHECKS.filter((c) => /натисн/i.test(c.text.uk) || /\bpress\b/i.test(c.text.en))
			.filter((c) => !c.testid)
			.map((c) => c.id);
		expect(naked, "неперевірний за побудовою").toEqual([]);
	});

	it("кожен названий локатор існує в розмітці", () => {
		const ghosts = ALL_CHECKS.filter((c) => c.testid && !LITERAL_TESTIDS.has(c.testid)).map(
			(c) => `${c.id} → ${c.testid}`
		);
		expect(ghosts, `локатора немає в жодному компоненті:\n${ghosts.join("\n")}`).toEqual([]);
	});
});

describe("§ 5.4 — решта інваріантів", () => {
	it("id унікальні й мають форму {вкладка}_{номер}", () => {
		const ids = ALL_CHECKS.map((c) => c.id);
		expect(new Set(ids).size, "дублікат id — два пункти ділили б одну позначку").toBe(ids.length);

		const wrong = BETA_TABS.flatMap((tab) =>
			tab.checks.filter((c) => !new RegExp(`^${tab.id}_\\d+$`).test(c.id)).map((c) => c.id)
		);
		expect(wrong, "id не з тієї вкладки або не за формою").toEqual([]);
	});

	it("тексти й категорії непорожні двома мовами", () => {
		const empty = ALL_CHECKS.filter(
			(c) => !c.text.uk.trim() || !c.text.en.trim() || !c.category.uk.trim() || !c.category.en.trim()
		).map((c) => c.id);
		expect(empty).toEqual([]);
	});

	it("в англійському тексті немає кирилиці, в українському вона є", () => {
		// Забутий переклад тип не бачить: рядок є, і він українською.
		const notTranslated = ALL_CHECKS.filter(
			(c) => CYRILLIC.test(c.text.en) || CYRILLIC.test(c.category.en)
		).map((c) => c.id);
		expect(notTranslated, "англійський текст лишився українським").toEqual([]);

		const notUkrainian = ALL_CHECKS.filter((c) => !CYRILLIC.test(c.text.uk)).map((c) => c.id);
		expect(notUkrainian, "український текст не українською").toEqual([]);
	});

	it("в українському тексті один вид апострофа", () => {
		// Два різні апострофи ламають пошук по чеклисту, а шукати в ньому
		// доводиться щоразу, коли зі звіту треба знайти пункт за словом.
		const straight = ALL_CHECKS.filter((c) => /'/.test(c.text.uk)).map((c) => c.id);
		expect(straight, "прямий апостроф замість ’").toEqual([]);
	});

	it("у кожної вкладки є пункт для людини", () => {
		const machineOnly = BETA_TABS.filter(
			(tab) => !tab.checks.some((c) => c.coverage === "manual")
		).map((t) => t.id);
		expect(machineOnly, "вкладка, де все покрито машиною, марнує час людини").toEqual([]);
	});

	/**
	 * § 3.4 `BETA-LEVEL-BALANCE` — сильніша умова, ніж «хоч один manual».
	 *
	 * Контрольна група корисна доти, доки лишається групою, а не списком: кожен
	 * `covered` витрачає час живої людини там, де автотест уже дивиться. У
	 * сусідньому проєкті набору цей перекіс дійшов до 26 `covered` проти 15
	 * `manual` — половина чеклиста була контрольною групою.
	 */
	it("у вкладці covered не переважає manual (§ 3.4)", () => {
		const skewed = BETA_TABS.map((tab) => {
			const n = (level: string) => tab.checks.filter((c) => c.coverage === level).length;
			return { id: tab.id, manual: n("manual"), covered: n("covered") };
		}).filter((row) => row.covered > row.manual);

		expect(
			skewed.map((r) => `${r.id}: covered ${r.covered} > manual ${r.manual}`),
			"контрольна група більша за роботу — час людини йде туди, де тест уже дивиться"
		).toEqual([]);
	});

	it("у кожної вкладки є пункт-межа", () => {
		const noBoundary = BETA_TABS.filter((tab) => !tab.checks.some((c) => c.negative)).map(
			(t) => t.id
		);
		expect(
			noBoundary,
			"ліміт, що перестав діяти, виглядає точно так само, як ліміт, що діє"
		).toEqual([]);
	});

	it("текст не починається з номера і не називає внутрішніх речей", () => {
		const numbered = ALL_CHECKS.filter((c) => /^\s*\d/.test(c.text.uk) || /^\s*\d/.test(c.text.en));
		expect(numbered.map((c) => c.id), "номер малює сторінка з позиції (§ 2.2)").toEqual([]);

		// Людина, яка згодилася потикати сайт, не знає, що таке локатор.
		const internals = /\.svelte|\.ts\b|testid|localStorage|\$state|\$derived|singleton|синглтон/i;
		const leaked = ALL_CHECKS.filter((c) => internals.test(c.text.uk) || internals.test(c.text.en));
		expect(leaked.map((c) => c.id), "внутрішня назва в тексті для гравця").toEqual([]);
	});

	it("сортування дає manual → testable → covered і зберігає порядок оголошення", () => {
		for (const tab of BETA_TABS) {
			const sorted = sortChecks(tab.checks);
			const levels = sorted.map((c) => COVERAGE_ORDER.indexOf(c.coverage));
			expect([...levels].sort((a, b) => a - b), `${tab.id}: рівні не за порядком`).toEqual(levels);

			// Порядок усередині рівня тематичний — від пересортування розділи
			// розсипалися б.
			for (const level of COVERAGE_ORDER) {
				const declared = tab.checks.filter((c) => c.coverage === level).map((c) => c.id);
				const shown = sorted.filter((c) => c.coverage === level).map((c) => c.id);
				expect(shown, `${tab.id}/${level}: порядок оголошення не збережено`).toEqual(declared);
			}
		}
	});

	/**
	 * § 8.5.1 `BETA-VERSION-VISIBLE`, § 8.4 `BETA-SCREEN-LINKS`, § 6.2.1
	 * `BETA-REPORT-HINT-SPLIT`.
	 *
	 * Підказка «позначено на іншій версії» на пункті стояла з самого початку, а
	 * якої версії ЦЯ сторінка — не було написано ніде. `beta-report-hint` висів
	 * на ВІДМОВІ буфера, тож сценарій «підказка видима» доводив протилежне тому,
	 * що мав. Поле звалося `beta-report-textarea` — другим іменем канонічного
	 * `beta-report-input`.
	 */
	it("на сторінці є версія, вихід і дві різні підказки звіту", () => {
		expect(PAGE_SOURCE).toContain('data-testid="beta-version-text"');
		expect(PAGE_SOURCE).toContain('data-testid="beta-home-link"');
		expect(PAGE_SOURCE).toContain('data-testid="beta-report-hint"');
		expect(PAGE_SOURCE).toContain('data-testid="beta-report-failed-hint"');
		expect(PAGE_SOURCE).toContain('data-testid="beta-report-input"');
	});

	/**
	 * § 8.4 `BETA-SCREEN-LINKS` — умова, а не безумовна вимога.
	 *
	 * Правило знімає крок «прочитав пункт — шукаю, де це на сайті». Тут шукати
	 * ніде: резюме — ОДНА сторінка, і шість тематичних вкладок називають той
	 * самий маршрут. Перелік посилань вийшов би з шести однакових рядків «на
	 * головну» плюс посилання на себе.
	 *
	 * Тому інваріант перевіряє УМОВУ: щойно вкладки почнуть називати більш ніж
	 * один змістовий маршрут, посилання стають обов'язковими — і цей тест
	 * почервоніє першим.
	 */
	it("посилання на екрани обов'язкові, щойно маршрут не один (§ 8.4)", () => {
		expect(HIDDEN_ROUTES.length, "перелік прихованих не прочитано — перевірка мертва").toBeGreaterThan(0);

		const meaningful = new Set(
			BETA_TABS.flatMap((tab) => tab.routes).filter((route) => !HIDDEN_ROUTES.includes(route))
		);

		if (meaningful.size <= 1) {
			expect(
				PAGE_SOURCE.includes('data-testid="beta-home-link"'),
				"єдиний змістовий маршрут — вихід на головну і є посиланням на екран"
			).toBe(true);
			return;
		}

		expect(PAGE_SOURCE, "маршрутів уже кілька — перелік екранів обов'язковий").toContain(
			'data-testid="beta-screen-'
		);
	});

	/**
	 * § 4.0 `BETA-NOINDEX-OVER-DISALLOW` — перевірка ПРОТИЛЕЖНОГО.
	 *
	 * `Disallow` забороняє ЗАВАНТАЖЕННЯ: краулер, який його виконав, сторінку не
	 * читає — отже й `noindex` у ній не читає ніколи, а адреса, на яку хтось
	 * послався ззовні, лягає в індекс голим URL. Прибрати його потім нічим:
	 * прибирає рівно той тег, до якого краулер не дійшов.
	 */
	it("сторінка чеклиста НЕ закрита Disallow у robots.txt (§ 4.0)", () => {
		const robots = readFileSync("static/robots.txt", "utf8");
		const disallowed = [...robots.matchAll(/^Disallow:\s*(\S+)/gm)].map((m) => m[1]);

		expect(
			disallowed.filter((rule) => rule.includes("beta-test-checklists")),
			"Disallow забирає в краулера саме той запит, у відповіді на який лежить noindex"
		).toEqual([]);
	});
});
