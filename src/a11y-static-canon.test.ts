// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Значкова кнопка без імені шукається СТАТИЧНО (ACCESSIBILITY-v9 § 10.6,
 * `A11Y-STATIC-ICON-LABEL`, HIGH).
 *
 * ЧОМУ axe ЦЬОГО НЕ ЛОВИТЬ. `tests/a11y.spec.ts` міряє те, що на екрані
 * ПІСЛЯ `goto()`, у трьох станах: головна у світлій темі, головна в темній,
 * відкрита модалка AI. Кнопка, яка живе в гілці `{#if}` глибше за ці три
 * стани, у звіт не потрапляє НІКОЛИ — а саме там значкові кнопки й живуть.
 *
 * ЗАМІРЯНО ТУТ, І САМЕ ТАК ЦЮ ПЕРЕВІРКУ ЗАВЕЛИ. Перший прогін знайшов
 * `ai-chat-send-btn` у `AiMatchModal.svelte`: кнопка «надіслати» в чаті
 * дозапитів — один `<Send />` без `aria-label`, без `title` і без тексту.
 * Тобто читалка вимовляла її як «button», і в усіх 42 мовах. axe її не бачив,
 * бо панель чату з'являється лише ПІСЛЯ успішного аналізу вакансії, а сценарій
 * axe відкриває модалку й дивиться на порожню форму.
 *
 * Статичний скан НЕ заміняє axe: axe бачить складену сторінку й обчислені
 * стилі, скан — усі гілки розмітки. Обидва в гейті (§ 10.6).
 *
 * `close-button-conventions.test.ts` перевіряє те саме ВУЖЧЕ — лише кнопки з
 * локатором `-close-btn`, зате разом із їхніми власними конвенціями (значок, а
 * не хрестик текстом; жодного власного `transition`). Ця перевірка — та сама
 * вимога для решти кнопок проєкту.
 */

const SKIP = new Set(["node_modules", ".svelte-kit", "build", "dist", ".temp"]);

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		if (SKIP.has(name)) return [];
		const full = join(dir, name);
		return statSync(full).isDirectory() ? walk(full) : [full];
	});
}

const SVELTE = walk("src")
	.filter((f) => f.endsWith(".svelte"))
	.map((f) => f.replace(/\\/g, "/"));

/**
 * Розмітка без `<script>`, `<style>` і комментарів: там немає елементів, зате
 * є рядки, які виглядають як розмітка.
 *
 * Вирізане замінюється на СТІЛЬКИ Ж переводів рядка, скільки містило. Інакше
 * номер рядка у звіті вказує на місце, зсунуте на всю довжину `<script>` —
 * тобто на випадковий рядок стилів, і знахідку доводиться шукати руками.
 */
function markupOnly(source: string): string {
	const blank = (chunk: string) => "\n".repeat((chunk.match(/\n/g) ?? []).length);
	return source
		.replace(/<script[\s\S]*?<\/script>/g, blank)
		.replace(/<style[\s\S]*?<\/style>/g, blank)
		.replace(/<!--[\s\S]*?-->/g, blank);
}

/**
 * Кінець відкривального тега, з урахуванням `>` УСЕРЕДИНІ значень атрибутів.
 *
 * Не дрібниця: `onclick={() => close()}` містить `>` у стрілці, тобто
 * наївний `<button[^>]*>` обрізає тег на середині й половина атрибутів
 * (зокрема `aria-label`, який зазвичай стоїть після обробника) перестає бути
 * видимою. Перевірка тоді не падає — вона тихо звітує знахідку там, де підпис
 * є, або пропускає кнопку, чий текст вона прийняла за вміст.
 */
function tagEnd(text: string, from: number): number {
	let depth = 0;
	let quote = "";
	for (let i = from; i < text.length; i++) {
		const ch = text[i];
		if (quote) {
			if (ch === quote) quote = "";
			continue;
		}
		if (ch === '"' || ch === "'" || ch === "`") quote = ch;
		else if (ch === "{") depth++;
		else if (ch === "}") depth--;
		else if (ch === ">" && depth === 0) return i;
	}
	return -1;
}

interface Element {
	file: string;
	tag: string;
	inner: string;
	line: number;
}

/** Елементи `<button>` разом із вмістом. Кнопки не вкладаються одна в одну. */
function buttons(file: string, markup: string): Element[] {
	const found: Element[] = [];
	for (const m of markup.matchAll(/<button(?=[\s>])/g)) {
		const openStart = m.index;
		const openEnd = tagEnd(markup, openStart);
		if (openEnd < 0) continue;
		const close = markup.indexOf("</button>", openEnd);
		if (close < 0) continue;
		found.push({
			file,
			tag: markup.slice(openStart, openEnd + 1),
			inner: markup.slice(openEnd + 1, close),
			line: markup.slice(0, openStart).split("\n").length
		});
	}
	return found;
}

/**
 * Усі варіанти, якими вміст може відрендеритися: `{#if}` / `{:else if}` /
 * `{:else}` розгортаються в окремі рядки.
 *
 * Це і є суть § 10.6 — «незалежно від гілки розмітки». Кнопка, у якої одна
 * гілка з написом, а друга з самим значком, доступна лише половину часу, і
 * перевірка «чи є текст десь у вмісті» такого не бачить.
 */
function renderings(inner: string): string[] {
	const open = inner.search(/\{#if\b/);
	if (open < 0) return [inner];

	// Кінець блока з урахуванням вкладених {#if}: рівень лічильника.
	let depth = 0;
	const cuts: number[] = [];
	let end = -1;
	const token = /\{(#if\b|\/if\}|:else\b)/g;
	token.lastIndex = open;
	for (let m = token.exec(inner); m; m = token.exec(inner)) {
		if (m[1] === "#if") depth++;
		else if (m[1] === "/if}") {
			depth--;
			if (depth === 0) {
				end = m.index;
				break;
			}
		} else if (m[1] === ":else" && depth === 1) cuts.push(m.index);
	}
	if (end < 0) return [inner];

	const prefix = inner.slice(0, open);
	const suffix = inner.slice(end + "{/if}".length);
	const bodyStart = inner.indexOf("}", open) + 1;
	const bounds = [bodyStart, ...cuts.map((c) => inner.indexOf("}", c) + 1)];
	const ends = [...cuts, end];

	const branches = bounds.map((start, i) => inner.slice(start, ends[i]));
	// Гілка `{:else}` може бути відсутня — тоді порожній вміст теж варіант.
	const hasElse = cuts.some((c) => /^\{:else\}/.test(inner.slice(c)));
	if (!hasElse) branches.push("");

	return branches.flatMap((branch) => renderings(prefix + branch + suffix));
}

/** Видимий текст: усе, що лишається, коли зняти теги й керівні блоки. */
function visibleText(rendering: string): string {
	let text = "";
	let i = 0;
	while (i < rendering.length) {
		if (rendering[i] === "<") {
			const end = tagEnd(rendering, i);
			i = end < 0 ? rendering.length : end + 1;
			continue;
		}
		text += rendering[i];
		i++;
	}
	return text
		// Керівні блоки тексту не дають: `{#each}`, `{/each}`, `{:else}`, `{@const}`.
		.replace(/\{[#/:]\s*[a-z][^}]*\}/g, "")
		.replace(/\{@(const|debug|attach)\b[^}]*\}/g, "")
		.trim();
}

/** Кнопка, чиє ім'я не існує в якійсь із гілок. */
function namelessButtons(files: string[] = SVELTE): string[] {
	const found: string[] = [];
	for (const file of files) {
		const markup = markupOnly(readFileSync(file, "utf8"));
		for (const button of buttons(file, markup)) {
			if (/\baria-label(?:ledby)?\b/.test(button.tag)) continue;
			const bare = renderings(button.inner).filter((r) => visibleText(r) === "");
			if (bare.length > 0) found.push(`${button.file}:${button.line}`);
		}
	}
	return found.sort();
}

describe("значкова кнопка має ім'я в кожній гілці (A11Y-STATIC-ICON-LABEL)", () => {
	it("перевірка жива: кнопки в проєкті знайдено, і теги розібрані цілком", () => {
		const all = SVELTE.flatMap((f) => buttons(f, markupOnly(readFileSync(f, "utf8"))));
		expect(SVELTE.length).toBeGreaterThan(10);
		expect(all.length, "жодної кнопки не знайдено — сканер читає не те").toBeGreaterThan(20);
		// Доказ, що розбір атрибутів не обривається на `=>`: кнопки з обробником
		// у проєкті є, і в них видно атрибути ПІСЛЯ обробника.
		const afterArrow = all.filter((b) => /=>[\s\S]*data-testid/.test(b.tag));
		expect(
			afterArrow.length,
			"жодного тега з атрибутом після стрілкової функції — сканер обрізає теги"
		).toBeGreaterThan(0);
	});

	/**
	 * Зворотний експеримент (AI-AGENT-PITFALLS-v9 § 1.1) інлайном: детектор
	 * мусить сказати «немає імені» на кнопці зі самим значком і промовчати на
	 * тій самій кнопці з підписом — включно з випадком, коли підпис є лише в
	 * ОДНІЙ із двох гілок.
	 */
	it("детектор знаходить дефект, коли він є, і не вигадує, коли його немає", () => {
		const icon = '<button class="x" onclick={() => go()}><Send size={16} /></button>';
		const labelled = '<button aria-label={t.ai.chatSend}><Send size={16} /></button>';
		const texted = "<button><Icon />{t.ai.analyze}</button>";
		const halfBranch =
			"<button>{#if busy}<Loader />{:else}<Icon /><span>{t.ai.analyze}</span>{/if}</button>";
		const bothBranches =
			"<button>{#if busy}<Loader />{t.ai.analyzing}{:else}<Icon />{t.ai.analyze}{/if}</button>";

		const bare = (markup: string) =>
			buttons("probe.svelte", markup).filter(
				(b) =>
					!/\baria-label(?:ledby)?\b/.test(b.tag) &&
					renderings(b.inner).some((r) => visibleText(r) === "")
			).length;

		expect(bare(icon), "значок без підпису не знайдено").toBe(1);
		expect(bare(labelled), "aria-label не порахований як ім'я").toBe(0);
		expect(bare(texted), "видимий напис не порахований як ім'я").toBe(0);
		expect(bare(halfBranch), "гілка зі самим значком не знайдена").toBe(1);
		expect(bare(bothBranches), "обидві гілки з написом — це не знахідка").toBe(0);
	});

	/**
	 * Порожній перелік, і він ЗВІРЯЄТЬСЯ. Форма для запису боргу свідомо не
	 * заводиться: кнопка без доступного імені — це порушення WCAG 4.1.2
	 * рівня A, тобто не той клас, який оформлюють числом, що спадає.
	 */
	it("жодна кнопка не лишається без доступного імені", () => {
		expect(
			namelessButtons(),
			"кнопка без тексту й без aria-label: читалка вимовить її як «button».\n" +
				"Ім'я береться зі словника (`aria-label={t...}`), а не літералом:\n" +
				namelessButtons().join("\n")
		).toEqual([]);
	});
});
