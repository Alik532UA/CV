// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Спокійний стан елемента не може бути невидимим (UI-ELEMENTS-v8
 * `UIE-STARTING-STYLE`).
 *
 * ## Що саме тут стережеться
 *
 * Анімацію появи довго робили так: у CSS `opacity: 0`, а видимість давав JS —
 * клас, доданий в `requestAnimationFrame`. Виглядає невинно, але це означає, що
 * СПОКІЙНИМ станом елемента є невидимий, і будь-який шлях, на якому JS не
 * дійшов до рядка з класом, лишає елемент невидимим НАЗАВЖДИ.
 *
 * У цьому проєкті такі шляхи справді були, і обидва вище за той рядок у
 * `CanvasEngine.mount()`: вихід при `getContext("2d") === null` (так поводяться
 * розширення, що блокують canvas проти відбитка браузера) і `if (canvas)` у
 * компоненті. Симптом — порожнє тло при робочому журналі й робочому циклі
 * малювання, тобто дефект без жодної підказки про причину.
 *
 * `@starting-style` перевертає напрямок відмови: спокійний стан — `opacity: 1`,
 * «звідки» описане поруч із «куди», і найгірший наслідок будь-якої відмови —
 * поява без плавності замість «не з'явилося ніколи».
 *
 * ## Чому перевірка саме така вузька
 *
 * Заборона `opacity: 0` узагалі дала б десятки спрацювань на легітимних
 * випадках: прихований до відкриття шар, зникання, `--hidden`-стан. Тут же
 * ознака однозначна — базове правило класу, який ЗАВЖДИ присутній у розмітці,
 * не має права бути невидимим.
 *
 * Зворотний експеримент проведено (AI-AGENT-PITFALLS-v8 § 1.1): поверненням
 * `opacity: 0` разом із `.bg-canvas:global(.mounted)` обидві перевірки нижче
 * червоніють.
 */

const BG_DIR = "src/lib/components/backgrounds";

const walk = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else out.push(full.replace(/\\/g, "/"));
	}
	return out;
};

const bgFiles = walk(BG_DIR);
const canvasComponents = bgFiles.filter((f) => {
	if (!f.endsWith(".svelte")) return false;
	return readFileSync(f, "utf8").includes("class=\"bg-canvas\"");
});

/** Коментарі зачищаються пробілами: вони цитують прибраний код і були б доказом його наявності. */
const stripComments = (source: string): string =>
	source
		.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "))
		.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

/**
 * Тіло блока, що починається з `header {`, — з підрахунком дужок, а не регуляркою.
 *
 * Ліниве `([\s\S]*?)\}` тут дає ХИБНИЙ результат, і це заміряно: воно
 * зупиняється на закритті ВКЛАДЕНОГО `@starting-style`, тож `opacity: 0` зі
 * стану «звідки» потрапляє в базові оголошення й читається як «спокійний стан
 * невидимий». Перевірка червоніла б саме на правильному коді.
 */
const blockBody = (source: string, header: RegExp): string | null => {
	const at = source.search(header);
	if (at < 0) return null;
	const open = source.indexOf("{", at);
	if (open < 0) return null;

	let depth = 0;
	for (let i = open; i < source.length; i += 1) {
		if (source[i] === "{") depth += 1;
		else if (source[i] === "}") {
			depth -= 1;
			if (depth === 0) return source.slice(open + 1, i);
		}
	}
	return null;
};

describe("анімація появи тла", () => {
	it("перевірка жива: компоненти з полотном знайдено", () => {
		// Три: FloatingShapes, Particles, Waves. Менше — сканер дивиться не туди,
		// і «порушень немає» означало б «нічого не перевірено».
		expect(canvasComponents.length).toBeGreaterThanOrEqual(3);
	});

	it("полотно у спокої видиме, а поява описана через @starting-style", () => {
		const problems: string[] = [];

		for (const file of canvasComponents) {
			const source = stripComments(readFileSync(file, "utf8"));
			const rule = blockBody(source, /^\s*\.bg-canvas\s*\{/m);

			if (rule === null) {
				problems.push(`${file}: правило .bg-canvas не знайдено`);
				continue;
			}

			const from = blockBody(rule, /@starting-style\s*\{/);
			if (from === null) {
				problems.push(`${file}: немає @starting-style — поява знову залежить від JS`);
			} else if (!/opacity:\s*0\s*;/.test(from)) {
				problems.push(`${file}: @starting-style є, але поява не з прозорості`);
			}

			// Базові оголошення — тіло правила БЕЗ вкладеного стану «звідки».
			const base = from === null ? rule : rule.replace(from, "");
			if (!/opacity:\s*1\s*;/.test(base)) {
				problems.push(`${file}: спокійний стан .bg-canvas не має opacity: 1`);
			}
		}

		expect(
			problems,
			`видимість тла знову залежить від того, чи дійшов JS до потрібного рядка:\n${problems.join("\n")}`
		).toEqual([]);
	});

	it("жоден скрипт не роздає видимість класом", () => {
		const offenders = walk("src")
			.filter((f) => /\.(ts|svelte)$/.test(f) && !f.endsWith(".test.ts"))
			.filter((f) => /classList\.(add|remove)\(\s*["'`]mounted/.test(stripComments(readFileSync(f, "utf8"))));

		expect(
			offenders,
			`клас видимості з JS повернувся — це той самий дефект, лише в новому місці: ${offenders.join(", ")}`
		).toEqual([]);
	});
});
