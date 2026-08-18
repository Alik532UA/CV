// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Опора на приватні стилі іншого компонента (SVELTE-UI-v8 § 4, § 3.5).
 *
 * Клас дефекту, про який компілятор не попереджає НІЯК і який не видно в жодному
 * іншому гейті: розмітку переносять з одного компонента в інший, клас їде разом
 * із нею, а правило лишається там, звідки її взяли. Скоуп Svelte туди не дістає,
 * тож елемент просто не стилізований — і виглядає це не як помилка, а як
 * «чомусь трохи не так». Гірший бік — зворотний: правку правила роблять в одному
 * компоненті в упевненості, що вона поширюється на обидва.
 *
 * ПЕРЕВІРКА НАВМИСНО ВУЗЬКА. Правило «кожен клас має мати оголошення» дало б
 * десятки спрацювань на суто семантичних іменах (`about-side`, `error-page`) і
 * одразу перетворилося б на список винятків, який ніхто не читає. Тут сигнал
 * однозначний: правило ІСНУЄ — але не там, де знадобилося.
 *
 * Перший прогін знайшов рівно один випадок: `class="icon"` у BottomNav.svelte
 * при єдиному правилі `.icon` у SidebarNav.svelte. `margin-right: 15px` не діяв
 * там ніколи.
 */

const walk = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (entry.endsWith(".svelte")) out.push(full.replace(/\\/g, "/"));
	}
	return out;
};

/**
 * Коментарі зачищаються ПРОБІЛАМИ, а не вирізаються, — і це не педантизм.
 * Перший прогін цієї перевірки впав на власній документації: коментар, що
 * пояснює прибраний `class="icon"`, мусив його процитувати, і сканер порахував
 * цитату за розмітку (AI-AGENT-PITFALLS-v8 § 1, той самий випадок описаний у
 * FLUID-SIZING-v8 § 9).
 */
const stripComments = (source: string): string =>
	source
		.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "))
		.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));

/** Класи, оголошені у `<style>` самого компонента. */
const styledClasses = (source: string): Set<string> => {
	const style = stripComments(source).match(/<style[^>]*>([\s\S]*)<\/style>/)?.[1] ?? "";
	return new Set([...style.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]));
};

/**
 * Класи в розмітці. Лише статичний `class="..."`: `class:foo={...}` і шаблони
 * з інтерполяцією не бувають перенесені разом із розміткою так, щоб про них
 * забули, — а от буквальний рядок буває саме так.
 */
const usedClasses = (source: string): Set<string> => {
	const markup = stripComments(source).replace(/<style[^>]*>[\s\S]*<\/style>/, "");
	return new Set(
		[...markup.matchAll(/class="([^"{]*)"/g)].flatMap((m) => m[1].split(/\s+/)).filter(Boolean)
	);
};

const files = walk("src");
const globalCss = readFileSync("src/app.css", "utf8");
const owned = new Map(files.map((f) => [f, styledClasses(readFileSync(f, "utf8"))]));

describe("стилі компонентів (SVELTE-UI-v8 § 3.5)", () => {
	it("перевірка жива: компоненти й глобальні стилі знайдено", () => {
		expect(files.length).toBeGreaterThan(20);
		expect(globalCss.length).toBeGreaterThan(1000);
		// Хоч один компонент мусить щось стилізувати, інакше `owned` порожній і
		// «проблем немає» означало б «нічого не порівнювалося».
		expect([...owned.values()].some((s) => s.size > 0)).toBe(true);
	});

	it("жоден компонент не покладається на приватні стилі іншого", () => {
		const problems: string[] = [];

		for (const file of files) {
			const source = readFileSync(file, "utf8");
			for (const cls of usedClasses(source)) {
				if (owned.get(file)!.has(cls)) continue; // стилізує сам
				if (globalCss.includes(`.${cls}`)) continue; // або це глобальний клас

				const elsewhere = files.filter((o) => o !== file && owned.get(o)!.has(cls));
				if (elsewhere.length > 0) {
					problems.push(`${file}: .${cls} стилізує ${elsewhere.join(", ")}`);
				}
			}
		}

		expect(
			problems,
			`правило існує, але в іншому компоненті — скоуп туди не дістає:\n${problems.join("\n")}`
		).toEqual([]);
	});
});
