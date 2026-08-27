// @vitest-environment node
import { describe, expect, it } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Розкладка їде за напрямком письма, а не за «лівим» і «правим» (I18N-v8 § 6).
 *
 * `he` є в переліку мов, `dir="rtl"` виставляється і на prerender
 * (`hooks.server.ts`), і при перемиканні (`I18nState`), і за цим стежить
 * `i18n-canon.test.ts`. Але атрибут перевертає лише те, що вміє перевертатися:
 * текст, флекс-порядок, `margin-inline-*`. Правило, написане як `margin-right`,
 * лишається праворуч і на івриті — тож значок опиняється не з того боку підпису,
 * смужка часової шкали — не з того боку картки, а `text-align: left` притискає
 * івритський рядок до краю, від якого його ніхто не читає.
 *
 * ЧОМУ САМЕ ЦІ ВЛАСТИВОСТІ. Тут лише ті, у яких логічний відповідник ОДНОЗНАЧНИЙ
 * і дзеркалення потрібне майже завжди: відступи, поля, рамки, вирівнювання
 * тексту. `left:`/`right:` у позиціонуванні свідомо НЕ рахуються — половина з
 * них у цьому проєкті це пари `left: 0; right: 0` (на всю ширину, напрямку не
 * має), а друга половина зчеплена з арифметикою в JS: смуга прокрутки, мінімапа
 * й прокрутка від краю міряють `clientX` від правого краю вікна. Перевірка, що
 * не розрізняє ці випадки, дає більше хибних спрацювань, ніж знахідок, і її
 * вимикають — про що канон говорить прямо (SVELTE-UI-v8 § 3.6).
 *
 * ЩО РОБИТИ З ЧЕРВОНИМ. Замінити на логічний відповідник:
 *   margin-left  → margin-inline-start     text-align: left  → text-align: start
 *   padding-right → padding-inline-end     border-left → border-inline-start
 * Якщо властивість справді фізична — тобто зчеплена з фізичним `left`/`right`
 * у тому ж блоці — додати файл у `PAIRED_WITH_PHYSICAL` із причиною.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(ROOT, p), "utf8");

/**
 * Коментарі — не код. `BottomNav.svelte` пояснює, чому `margin-right: 15px` там
 * ніколи не діяв, і перевірка, яка читає пояснення, падає на документації —
 * рівно як це сталося при першому прогоні.
 *
 * Переноси рядків збережено, щоб номер у звіті вказував на справжній рядок.
 */
function withoutComments(text: string): string {
	const blank = (m: string) => m.replace(/[^\n]/g, " ");
	return text.replace(/\/\*[\s\S]*?\*\//g, blank).replace(/<!--[\s\S]*?-->/g, blank);
}

const PHYSICAL =
	/\b(?:margin|padding)-(?:left|right)\s*:|(?<!border-)\bborder-(?:left|right)\s*:(?!\s*none)|\btext-align\s*:\s*(?:left|right)\b/g;

/**
 * Файли, де фізична властивість зчеплена з фізичним позиціонуванням у тому ж
 * місці, тож переклад однієї половини дав би розсинхрон, а не підтримку RTL.
 *
 * Число — межа, що лише спадає. Перевести обидві половини можна лише разом із
 * JS-геометрією, і це окрема робота, а не рядок у стилі.
 */
const PAIRED_WITH_PHYSICAL: Record<string, number> = {
	// Панель мінімапи прибита до `right: 0`, а її смужка рахує `clientX` від
	// правого краю вікна. Рамка мусить бути з того самого боку, що й панель.
	"src/lib/components/ui/Minimap.svelte": 1,
	// Відступ основного вмісту дорівнює ширині бічної панелі, яка стоїть на
	// `left: 0`. Обидва числа — одне рішення про розкладку.
	"src/routes/+layout.svelte": 3
};

function styleSources(): string[] {
	return globSync("src/**/*.{svelte,css}", { cwd: ROOT }).map((p) => p.replace(/\\/g, "/"));
}

describe("напрямок письма (I18N-v8 § 6)", () => {
	it("перевірка жива: стилі знайдено", () => {
		const files = styleSources();
		expect(files.length, "глоб не бачить стилів — перевірка мертва").toBeGreaterThan(20);
		expect(files).toContain("src/app.css");
	});

	it("знаходить фізичну властивість, коли вона там є", () => {
		// Регулярка — це весь тест; мовчки зламана звітує про успіх.
		const one = new RegExp(PHYSICAL.source);
		expect("margin-right: 8px;").toMatch(one);
		expect("padding-left: 18px;").toMatch(one);
		expect("border-left: 2px solid red;").toMatch(one);
		expect("text-align: left;").toMatch(one);

		expect("margin-inline-end: 8px;").not.toMatch(one);
		expect("padding-inline-start: 18px;").not.toMatch(one);
		expect("border-inline-start: 2px solid red;").not.toMatch(one);
		expect("text-align: start;").not.toMatch(one);
		// Скидання й радіуси до напрямку стосунку не мають.
		expect("border-left: none;").not.toMatch(one);
		expect("border-top-left-radius: 8px;").not.toMatch(one);
		// Коментар, що цитує анти-патерн, не рахується.
		expect(withoutComments("/* margin-right: 15px */\n.a { gap: 0 }")).not.toMatch(one);
	});

	it("жоден новий файл не вирівнює вміст по фізичному краю", () => {
		const offenders: string[] = [];
		for (const file of styleSources()) {
			if (file in PAIRED_WITH_PHYSICAL) continue;
			const code = withoutComments(read(file));
			for (const m of code.matchAll(new RegExp(PHYSICAL.source, "g"))) {
				const line = code.slice(0, m.index).split("\n").length;
				offenders.push(`${file}:${line}  ${m[0].trim()}`);
			}
		}
		expect(
			offenders,
			`на івриті це лишиться з того самого боку — потрібен логічний відповідник:\n${offenders.join("\n")}`
		).toEqual([]);
	});

	it("жоден чинний виняток не зростає", () => {
		const grown: string[] = [];
		for (const [file, limit] of Object.entries(PAIRED_WITH_PHYSICAL)) {
			const found = [...withoutComments(read(file)).matchAll(new RegExp(PHYSICAL.source, "g"))];
			if (found.length > limit) grown.push(`${file}: ${found.length}, було ${limit}`);
		}
		expect(grown, `виняток може лише скорочуватися:\n${grown.join("\n")}`).toEqual([]);
	});

	it("список винятків не містить файлів, які вже вклалися", () => {
		const stale = Object.entries(PAIRED_WITH_PHYSICAL)
			.filter(([file, limit]) => {
				const found = [...withoutComments(read(file)).matchAll(new RegExp(PHYSICAL.source, "g"))];
				return found.length < limit;
			})
			.map(([file]) => file);
		expect(
			stale,
			`підтягнути число вниз — інакше запас дозволить відрости назад:\n${stale.join("\n")}`
		).toEqual([]);
	});
});
