// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Атрибути зображень (PERFORMANCE-v8 § 10.2).
 *
 * Два правила, і обидва невидимі в тому, як сайт виглядає у розробника:
 *
 *   `width`/`height` — це не розмір на екрані, а ПРОПОРЦІЯ, з якої браузер
 *   резервує місце ще до того, як картинка приїхала. Без них сторінка
 *   перескакує під час завантаження, і побачить це той, у кого канал
 *   повільніший за локальний диск. CSS може закріпити коробку сам (тут це
 *   робить `aspect-ratio` на обгортці `.pdf-preview`), але тоді правило
 *   тримається на верстці сусіднього елемента — а наступний `<img>` додадуть
 *   без неї.
 *
 *   `fetchpriority="high"` — рівно один на сторінці. Це заявка «оце і є LCP»;
 *   другий такий елемент її знецінює, бо пріоритет стає загальним.
 *
 * ЧОГО ТУТ НЕМАЄ І ЧОМУ. Канон у тому ж § 10.2 просить ще інваріант «кожен
 * `@font-face` має `font-display`». У проєкті `@font-face` немає жодного —
 * шрифти системні. Перевірка над порожньою множиною завжди зелена й доводить
 * рівно нічого (AI-AGENT-PITFALLS-v8 § 1), тому її тут немає навмисно; вона
 * знадобиться разом із першим власним шрифтом.
 */

const walk = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (entry.endsWith(".svelte")) out.push(full.replace(/\\/g, "/"));
	}
	return out;
};

/** Коментарі відрізаються: приклад анти-патерну в коментарі — не розмітка. */
const withoutComments = (source: string): string =>
	source.replace(/<!--[\s\S]*?-->/g, "").replace(/\/\*[\s\S]*?\*\//g, "");

const files = walk("src");
const images = files.flatMap((file) =>
	[...withoutComments(readFileSync(file, "utf8")).matchAll(/<img\b[^>]*>/gs)].map((m) => ({
		file,
		tag: m[0].replace(/\s+/g, " ")
	}))
);

describe("зображення (PERFORMANCE-v8 § 10.2)", () => {
	it("перевірка жива: у проєкті знайдено <img>", () => {
		expect(files.length).toBeGreaterThan(0);
		expect(images.length, "жодного <img> — сканується не те").toBeGreaterThan(0);
	});

	it("кожен <img> оголошує власні розміри", () => {
		const bad = images
			.filter(({ tag }) => !/\bwidth=/.test(tag) || !/\bheight=/.test(tag))
			.map(({ file, tag }) => `${file}: ${tag.slice(0, 80)}`);
		expect(bad, `без width/height — місце під картинку не зарезервоване:\n${bad.join("\n")}`).toEqual(
			[]
		);
	});

	it("рівно один <img> заявлений як LCP", () => {
		const priority = images
			.filter(({ tag }) => /fetchpriority="high"/.test(tag))
			.map(({ file, tag }) => `${file}: ${tag.slice(0, 60)}`);
		expect(
			priority,
			`fetchpriority="high" має бути рівно на одному зображенні, знайдено ${priority.length}:\n${priority.join("\n")}`
		).toHaveLength(1);
	});
});
