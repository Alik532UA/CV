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
	it("кожен згаданий файл проєкту існує", () => {
		const roots = "(?:src|tests|scripts|worker|static|\\.github|\\.claude)";
		const path = new RegExp("`(" + roots + "/[\\w./-]+\\.\\w{1,5})`", "g");

		const missing: string[] = [];
		for (const m of DOC.matchAll(path)) {
			if (!existsSync(resolve(ROOT, m[1]))) missing.push(m[1]);
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
