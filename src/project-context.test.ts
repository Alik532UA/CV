// @vitest-environment node
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * `PROJECT-CONTEXT.md` не бреше про проєкт.
 *
 * ЧОМУ ЦЕ ВАЖИТЬ БІЛЬШЕ, НІЖ ЗДАЄТЬСЯ. Алгоритм пакета (README v8, крок 2)
 * каже читати цей файл ПЕРЕД усім іншим: у ньому префікс сховищ, профіль,
 * обрані optional-файли й свідомі відхилення. Усе, що робиться далі,
 * спирається на нього. Файл, який розійшовся з кодом, не просто застарілий —
 * він скеровує наступну роботу за хибними засновками, і жоден гейт цього не
 * бачить, бо гейти дивляться на код.
 *
 * ЦЕ НЕ ГІПОТЕЗА. Станом на 2026-08-27 файл стверджував три речі, які код
 * спростовував:
 *
 *   «переведено рівно одну змінну на light-dark()»  — переведено 25, і про це
 *                                                     сказано на 57 рядків вище
 *                                                     в тому ж файлі;
 *   «ja.ts — єдиний файл із CRLF»                    — нормалізовано `54bd574`;
 *   «свідоме відхилення: одна конвенція кінців       — відхилення скасоване тим
 *    рядків»                                           самим комітом.
 *
 * Кожне з трьох було ПРАВДОЮ, коли його писали. Саме тому потрібен гейт, а не
 * уважність: застаріває тут не текст, а світ навколо нього.
 *
 * ЩО ТУТ ПЕРЕВІРЯЄТЬСЯ, А ЩО НІ. Лише факти, у яких є ЄДИНЕ ДЖЕРЕЛО в коді:
 * шляхи, префікс, порти, база, кількість мов. Проза про причини рішень машині
 * не піддається й не мусить — вона й не застаріває так само тихо, бо її читають.
 */

const ROOT = resolve(__dirname, "..");
const DOC = readFileSync(resolve(ROOT, "PROJECT-CONTEXT.md"), "utf8");
const read = (p: string) => readFileSync(resolve(ROOT, p), "utf8");

/**
 * Обидва документи для агента, а не лише один (`PIT-DOC-FACTS`,
 * `PIT-NUMBER-UNDER-GATE`, обидва HIGH).
 *
 * Канон називає ДВА файли — `AGENTS.md` і `PROJECT-CONTEXT.md`, — а гейт тут
 * читав лише другий. Ціна цього видна одразу, як тільки перший потрапив під
 * перевірку: у таблиці «бази, які рухаються лише вниз» два з трьох рядків
 * `AGENTS.md` називали числа, яких у гейтах уже не існувало, — «21 замала
 * ціль» при зміряних 12 і «11 файлів, найбільший 1073» при чотирьох записах
 * зі стелею 855. Обидва були правдою, коли їх писали.
 *
 * Симетрично: `PROJECT-CONTEXT.md` називав ТРИ ключі бази axe при чотирьох —
 * `betaChecklist` додали й рядок не оновили.
 */
const DOCS: Record<string, string> = {
	"PROJECT-CONTEXT.md": DOC,
	"AGENTS.md": read("AGENTS.md")
};

describe("PROJECT-CONTEXT.md звірений із кодом", () => {
	it("перевірка жива: файл прочитано", () => {
		expect(DOC.length, "PROJECT-CONTEXT.md порожній — сканер читає не те").toBeGreaterThan(5000);
		expect(DOC).toContain("PROJECT_PREFIX");
	});

	/**
	 * Шлях у зворотних лапках мусить існувати. Найдешевша форма гниття: файл
	 * перейменували, документ лишився вказувати в порожнечу, і наступний, хто
	 * прийде за поясненням, вирішить, що механізму просто немає.
	 *
	 * Береться лише те, що однозначно вказує на файл ЦЬОГО репозиторію: шлях
	 * від відомого кореня зі справжнім розширенням. Тека без файлу (`src/lib/`)
	 * і чужі адреси (`/DigitalWorkshop/`) не рахуються навмисно.
	 */
	it("кожен згаданий файл проєкту існує — в обох документах", () => {
		const roots = "(?:src|tests|scripts|worker|static|\\.github|\\.claude)";
		const path = new RegExp("`(" + roots + "/[\\w./-]+\\.\\w{1,5})`", "g");

		const missing: string[] = [];
		for (const [doc, text] of Object.entries(DOCS)) {
			for (const m of text.matchAll(path)) {
				if (!existsSync(resolve(ROOT, m[1]))) missing.push(`${doc}: ${m[1]}`);
			}
		}
		expect(
			missing,
			`документ посилається на файли, яких немає:\n${missing.join("\n")}`
		).toEqual([]);
	});

	it("знаходить неіснуючий шлях, коли він там є", () => {
		// Регулярка — це весь тест; мовчки зламана звітує про успіх.
		const roots = "(?:src|tests|scripts|worker|static|\\.github|\\.claude)";
		const path = new RegExp("`(" + roots + "/[\\w./-]+\\.\\w{1,5})`");
		expect("`src/lib/nowhere.ts`").toMatch(path);
		expect("`scripts/check-build.mjs`").toMatch(path);
		// Тека без файлу і чужий сайт — не наші шляхи.
		expect("`src/lib/components/`").not.toMatch(path);
		expect("`/DigitalWorkshop/`").not.toMatch(path);
	});

	it("префікс сховищ той самий, що в коді", () => {
		const declared = /export const STORAGE_PREFIX = "([^"]+)"/.exec(read("src/lib/config/storage.ts"))?.[1];
		expect(declared, "storage.ts більше не оголошує STORAGE_PREFIX").toBeTruthy();
		expect(DOC, `у документі має стояти \`${declared}\``).toContain(`\`${declared}\``);
	});

	/**
	 * Три власні порти — не примха, і документ це пояснює: на типовому 5173
	 * висять усі сім проєктів автора, і Playwright спокійно перевірив би чужий
	 * сайт. Один раз так і сталося. Отже число в документі мусить дорівнювати
	 * числу в конфігу, інакше пояснення захищає від чогось іншого.
	 */
	it("порти ті самі, що в конфігах", () => {
		const launch = read(".claude/launch.json");
		const playwright = read("playwright.config.ts");

		const devPort = /"--port", "(\d+)"[\s\S]*?"port": (\d+)/.exec(launch);
		expect(devPort, "launch.json більше не оголошує порт dev-сервера").toBeTruthy();
		const testPort = /const TEST_PORT = (\d+);/.exec(playwright)?.[1];
		expect(testPort, "playwright.config.ts більше не оголошує TEST_PORT").toBeTruthy();

		expect(DOC, `dev-порт ${devPort![1]}`).toContain(`**${devPort![1]}**`);
		expect(DOC, `порт Playwright ${testPort}`).toContain(`**${testPort}**`);
	});

	it("base path той самий, що в конфігу сайту", () => {
		const base = /export const SITE_BASE = "([^"]+)"/.exec(read("src/lib/config/site.js"))?.[1];
		expect(base, "site.js більше не оголошує SITE_BASE").toBeTruthy();
		expect(DOC).toContain(`\`${base}\``);
	});

	/**
	 * Кількість мов згадана в документі кілька разів і легко застаріває: додати
	 * мову — це один рядок у `SUPPORTED_LANGUAGES` і жодного нагадування про
	 * решту тексту.
	 */
	it("кількість мов та сама, що в переліку", () => {
		const state = read("src/lib/controllers/I18nState.svelte.ts");
		const block = /SUPPORTED_LANGUAGES: readonly Language\[\] = \[([\s\S]*?)\];/.exec(state);
		expect(block, "перелік мов більше не читається — перевірка мертва").toBeTruthy();
		const count = [...block![1].matchAll(/"[\w-]+"/g)].length;

		expect(count).toBeGreaterThan(10);
		const claimed = [...DOC.matchAll(/(\d+)\s+мов/g)].map((m) => Number(m[1]));
		expect(claimed.length, "документ ніде не називає кількість мов — перевірка мертва").toBeGreaterThan(0);
		const wrong = claimed.filter((n) => n !== count && n !== count - 1);
		expect(
			wrong,
			`у коді ${count} мов, а документ каже: ${wrong.join(", ")} ` +
				`(${count - 1} дозволено — це форма «решта ${count - 1}», тобто без поточної)`
		).toEqual([]);
	});
});

/**
 * Числа баз у документах дорівнюють тому, що міряють гейти
 * (`PIT-NUMBER-UNDER-GATE`, AI-AGENT-PITFALLS-v9 § 5.5.1, HIGH).
 *
 * Правило канону просте: число, записане в `AGENTS.md` чи
 * `PROJECT-CONTEXT.md`, або стоїть під гейтом, або його там немає. Третій
 * варіант — «число в прозі, яке ніхто не звіряє» — це не документація, а
 * пастка: воно виглядає як замір, читається як замір і застаріває тихо.
 *
 * ЩО САМЕ ЗВІРЯЄТЬСЯ. Рядок документа, який називає файл бази, не має права
 * містити цілого числа, якого база не міряє. Дозволені — самі значення бази,
 * їхня сума, кількість ключів і межі § 7.
 *
 * ЩО НЕ ЗВІРЯЄТЬСЯ, І ЧОМУ ЦЕ НЕ ДІРКА. З рядка знімаються ідіоми, у яких
 * число за побудовою НЕ є поточним заміром і мусить лишатися: дата, посилання
 * на розділ (`§ 10.1.1`) чи версію пакета (`v9.2`), контраст (`4.5:1`),
 * розмір цілі (`44×44`, `44px`), журнальний перехід (`484 → 446`, `було 21`)
 * і число в лапках-«ялинках» — саме так у цьому проєкті цитують ХИБНІ числа,
 * названі колись із пам'яті.
 */
describe("числа баз у документах — під гейтом (PIT-NUMBER-UNDER-GATE)", () => {
	const AXE_BLOCK = /A11Y_BASELINE: Record<string, number> = \{([\s\S]*?)\};/;
	const TOUCH_BLOCK = /TOUCH_BASELINE: Record<string, number> = \{([\s\S]*?)\};/;

	/** Цілі числа рядка, які претендують бути поточним заміром. */
	function claimedNumbers(line: string): number[] {
		const cleaned = line
			.replace(/«[^»]*»/g, " ")
			.replace(/\d{4}-\d{2}-\d{2}/g, " ")
			.replace(/§\s*[\d.]+/g, " ")
			.replace(/-?v\d+(?:\.\d+)?/gi, " ")
			.replace(/\d+[.,]\d+\s*:\s*\d+/g, " ")
			.replace(/\d+\s*[×x]\s*\d+/g, " ")
			.replace(/\d+\s*(?:px|КБ|кб|%)/g, " ")
			.replace(/\d+\s*→\s*\d+/g, " ")
			/*
			 * БЕЗ `\b` ПЕРЕД КИРИЛИЦЕЮ, і це не дрібниця. У JavaScript `\b` —
			 * межа класу `[A-Za-z0-9_]`, тобто перед `б` її НЕ існує: і пробіл,
			 * і `б` для нього однаково «не слово». `\bбуло` не збігається ніколи,
			 * тож журнальне «було 21» проходило б як поточний замір. Знайдено
			 * канаркою нижче, а не читанням.
			 */
			.replace(/було\s+\*{0,2}\d+/g, " ");
		return [...cleaned.matchAll(/\b(\d+)\b/g)].map((m) => Number(m[1])).filter((n) => n >= 2);
	}

	/** Значення `ALLOWED` і `LIMITS` розбираються з джерела гейта. */
	function sizeRatchet(): { allowed: Record<string, number>; limits: number[] } {
		const source = read("src/structure-conventions.test.ts");
		const allowedBlock = /const ALLOWED: Record<string, number> = \{([\s\S]*?)\};/.exec(source);
		const limitsBlock = /const LIMITS: Array<\[RegExp, number\]> = \[([\s\S]*?)\];/.exec(source);
		expect(allowedBlock, "ALLOWED більше не читається — перевірка мертва").toBeTruthy();
		expect(limitsBlock, "LIMITS більше не читається — перевірка мертва").toBeTruthy();
		const allowed: Record<string, number> = {};
		for (const m of allowedBlock![1].matchAll(/"([^"]+)":\s*(\d+)/g)) allowed[m[1]] = Number(m[2]);
		const limits = [...limitsBlock![1].matchAll(/,\s*(\d+)\]/g)].map((m) => Number(m[1]));
		return { allowed, limits };
	}

	/**
	 * Числа з файла-бази у `tests/`: значення, сума, кількість ключів.
	 *
	 * Регулярка приходить літералом, а не збирається з імені: `new RegExp` над
	 * шаблонним рядком тут уже один раз мовчки зламався — `\s` у шаблонному
	 * рядку це літера `s`, тобто вираз збігався ні з чим, і перевірка падала
	 * не з тим, що шукала. Літерал такого класу не має.
	 */
	function baselineNumbers(
		file: string,
		name: string,
		block: RegExp
	): { values: number[]; keys: string[] } {
		const source = read(file);
		const found = block.exec(source);
		expect(found, `${name} у ${file} більше не читається — перевірка мертва`).toBeTruthy();
		const entries = [...found![1].matchAll(/(\w+):\s*(\d+)/g)];
		return { values: entries.map((m) => Number(m[2])), keys: entries.map((m) => m[1]) };
	}

	const rowsWith = (needle: string) =>
		Object.entries(DOCS).flatMap(([doc, text]) =>
			text
				.split("\n")
				.map((line, i) => ({ doc, line, no: i + 1 }))
				.filter(({ line }) => line.includes(needle))
		);

	it("перевірка жива: бази читаються, ідіоми знімаються, рядки знаходяться", () => {
		const axe = baselineNumbers("tests/a11y-baseline.ts", "A11Y_BASELINE", AXE_BLOCK);
		const touch = baselineNumbers("tests/touch-target-baseline.ts", "TOUCH_BASELINE", TOUCH_BLOCK);
		const { allowed, limits } = sizeRatchet();
		expect(axe.keys.length).toBeGreaterThan(2);
		expect(touch.keys.length).toBeGreaterThan(2);
		expect(Object.keys(allowed).length).toBeGreaterThan(0);
		expect(limits.length).toBeGreaterThan(2);

		// Ідіоми, які мусять зникати, і число, яке мусить лишатися.
		expect(claimedNumbers("заміряно 2026-08-28, § 10.1.1, канон v9.2")).toEqual([]);
		expect(claimedNumbers("контраст 4.5:1, ціль 44×44, min-height: 44px")).toEqual([]);
		expect(claimedNumbers("484 → 446, було 21, «дев'ять / 1057»")).toEqual([]);
		expect(claimedNumbers("зараз 12 цілей")).toEqual([12]);

		expect(rowsWith("tests/a11y-baseline.ts").length, "жоден документ не називає базу axe").toBeGreaterThan(0);
		expect(rowsWith("tests/touch-target-baseline.ts").length, "жоден документ не називає базу цілей").toBeGreaterThan(0);
	});

	it("рядок про базу axe називає ВСІ її ключі, якщо називає хоч один", () => {
		const { keys } = baselineNumbers("tests/a11y-baseline.ts", "A11Y_BASELINE", AXE_BLOCK);
		const bad: string[] = [];
		for (const { doc, line, no } of rowsWith("tests/a11y-baseline.ts")) {
			const named = keys.filter((k) => line.includes(k));
			if (named.length === 0) continue;
			const missing = keys.filter((k) => !line.includes(k));
			if (missing.length > 0) bad.push(`${doc}:${no}: не названо ${missing.join(", ")}`);
		}
		expect(
			bad,
			"рядок перелічує ключі бази axe і пропускає частину: читач вирішить, що\n" +
				"решта сторінок не міряється взагалі:\n" + bad.join("\n")
		).toEqual([]);
	});

	it("рядок про базу сенсорних цілей називає ВСІ її ключі, якщо називає хоч один", () => {
		const { keys } = baselineNumbers("tests/touch-target-baseline.ts", "TOUCH_BASELINE", TOUCH_BLOCK);
		const bad: string[] = [];
		for (const { doc, line, no } of rowsWith("tests/touch-target-baseline.ts")) {
			const named = keys.filter((k) => line.includes(k));
			if (named.length === 0) continue;
			const missing = keys.filter((k) => !line.includes(k));
			if (missing.length > 0) bad.push(`${doc}:${no}: не названо ${missing.join(", ")}`);
		}
		expect(bad, `рядок пропускає частину ключів бази цілей:\n${bad.join("\n")}`).toEqual([]);
	});

	it("жодне число поруч із базою не розходиться з тим, що вона міряє", () => {
		const axe = baselineNumbers("tests/a11y-baseline.ts", "A11Y_BASELINE", AXE_BLOCK);
		const touch = baselineNumbers("tests/touch-target-baseline.ts", "TOUCH_BASELINE", TOUCH_BLOCK);
		const { allowed, limits } = sizeRatchet();
		const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
		const allowedValues = Object.values(allowed);

		const cases: Array<[string, Set<number>]> = [
			[
				"tests/a11y-baseline.ts",
				new Set([...axe.values, sum(axe.values), axe.keys.length])
			],
			[
				"tests/touch-target-baseline.ts",
				new Set([...touch.values, sum(touch.values), touch.keys.length])
			],
			[
				"src/structure-conventions.test.ts",
				new Set([
					...allowedValues,
					Object.keys(allowed).length,
					Math.max(...allowedValues),
					...limits
				])
			]
		];

		const wrong: string[] = [];
		for (const [needle, permitted] of cases) {
			for (const { doc, line, no } of rowsWith(needle)) {
				for (const n of claimedNumbers(line)) {
					if (!permitted.has(n)) {
						wrong.push(
							`${doc}:${no}: число ${n} поруч із ${needle} — гейт міряє ` +
								`{${[...permitted].sort((a, b) => a - b).join(", ")}}`
						);
					}
				}
			}
		}
		expect(
			[...new Set(wrong)],
			"число в документі не дорівнює тому, що міряє гейт. Або звірити його з базою,\n" +
				"або прибрати з прози й лишити посилання на файл — третього не буває:\n" +
				wrong.join("\n")
		).toEqual([]);
	});
});
