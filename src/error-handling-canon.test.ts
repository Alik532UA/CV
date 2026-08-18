// @vitest-environment node
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * ERROR-HANDLING-v8 § 7 — інваріантів цього файлу в проєкті не було жодного.
 *
 * Три правила, і всі три про той самий клас: збій, який стався, але про який
 * ніхто не дізнався.
 *
 *   `throw '...'`   рядок замість Error — і в місці зловлення немає ні stack, ні
 *                   `instanceof`, тобто причина втрачена там, де її шукатимуть;
 *   порожній catch  збій ковтається мовчки. Найдорожча форма: користувач бачить
 *                   кнопку, яка «нічого не робить», а журнал — нічого;
 *   `+error.svelte` без нього SvelteKit віддає власну сторінку, чужу сайту, і
 *                   вона не перекладена жодною з 42 мов.
 *
 * Плюс SC-ASYNC / EH-BOUNDARY-PENDING (HIGH): `<svelte:boundary>`, у тілі якої
 * є `await`, мусить мати сніпет `pending`. Без нього під час prerender межа
 * віддає ПОРОЖНЮ гілку — і сторінка їде в індекс без свого вмісту. Саме цей
 * клас уже коштував цьому проєкту п'яти секцій резюме, тільки через `{#await}`
 * (див. коментар у `src/routes/[[lang=lang]]/+page.svelte`); межа з `await`
 * ламається так само й видно це знову лише в `build/`.
 */

const walk = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/\.(ts|svelte)$/.test(entry)) out.push(full.replace(/\\/g, "/"));
	}
	return out;
};

/**
 * Коментарі відрізаються ПРОБІЛАМИ, а не вирізаються: інакше поїдуть номери
 * рядків у звіті. Без цього кроку перевірка падає на власній документації —
 * коментар, що пояснює анти-патерн, мусить його процитувати.
 */
const withoutComments = (source: string): string =>
	source
		.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "))
		.replace(/<!--[\s\S]*?-->/g, (m) => m.replace(/[^\n]/g, " "))
		.replace(/(^|[^:])\/\/[^\n]*/g, (m, p1) => p1 + m.slice(p1.length).replace(/./g, " "));

const sources = walk("src").filter((f) => !/\.(test|spec)\.ts$/.test(f));
const read = (f: string) => withoutComments(readFileSync(f, "utf8"));
const readRaw = (f: string) => readFileSync(f, "utf8");

/**
 * Скрипт першого кадру живе в `src/app.html`, тобто поза `.ts`/`.svelte`, — і
 * саме він має найбільше підстав ковтати збій (сховище може кинути на самому
 * зверненні). Тому файл додається до перевірки на мовчазний catch окремо: те,
 * що правило до нього не дотягувалося, не робить його винятком.
 */
const CATCH_SCOPE = [...sources, "src/app.html"];

describe("обробка помилок (ERROR-HANDLING-v8 § 7)", () => {
	it("перевірка жива: джерела знайдено", () => {
		expect(sources.length).toBeGreaterThan(20);
	});

	it("немає throw рядком", () => {
		const bad = sources.filter((f) => /throw\s+['"`]/.test(read(f)));
		expect(bad, `throw 'string' — у catch не лишиться ні stack, ні типу:\n${bad.join("\n")}`).toEqual(
			[]
		);
	});

	/**
	 * ЧИТАЄТЬСЯ СИРИЙ ФАЙЛ, з коментарями — і це не недогляд.
	 *
	 * Ковтати збій буває правильно: захоплення вказівника, яке однаково несе
	 * слухач на window; health-запит, чия відсутність не має ламати чат; спроба
	 * розібрати відповідь як JSON. У проєкті таких п'ять, і кожен несе поруч
	 * записану причину. Перевірка, яка спершу вирізає коментарі, оголосила б
	 * дефектом саме їх — тобто вимагала б прибрати пояснення, щоб стати
	 * зеленою. Тому правило тут рівно те, що в каноні: `catch` із ПОРОЖНІМ
	 * тілом. Порожнє тіло — це збій, про який не знає ніхто; тіло з причиною —
	 * це рішення.
	 */
	it("немає мовчазного catch — порожнього й без записаної причини", () => {
		const bad = CATCH_SCOPE.filter((f) => /catch\s*(\([^)]*\))?\s*\{\s*\}/.test(readRaw(f)));
		expect(
			bad,
			`catch із порожнім тілом — або обробити, або записати поруч, чому ковтається:\n${bad.join("\n")}`
		).toEqual([]);
	});

	it("сторінка помилки існує і вона своя", () => {
		expect(existsSync("src/routes/+error.svelte"), "немає src/routes/+error.svelte").toBe(true);
	});
});

/**
 * EH-BOUNDARY-PENDING (HIGH). Пара «межа ↔ її сніпети» читається з ТІЛА межі,
 * а не з файлу цілком: у `+page.svelte` меж п'ять поспіль, і перевірка «є await
 * і є pending десь у файлі» пройшла б, навіть якби вони стояли в різних межах.
 */
function boundaries(source: string): string[] {
	const out: string[] = [];
	const open = /<svelte:boundary[^>]*>/g;
	for (const m of source.matchAll(open)) {
		const from = m.index + m[0].length;
		const to = source.indexOf("</svelte:boundary>", from);
		out.push(source.slice(from, to === -1 ? source.length : to));
	}
	return out;
}

describe("svelte:boundary з await (SC-ASYNC / EH-BOUNDARY-PENDING)", () => {
	const withBoundary = sources.filter((f) => f.endsWith(".svelte") && read(f).includes("<svelte:boundary"));

	it("перевірка жива: межі в проєкті є", () => {
		expect(withBoundary.length, "жодної <svelte:boundary> — перевірка мертва").toBeGreaterThan(0);
	});

	it("кожна межа з await у тілі має сніпет pending", () => {
		const bad: string[] = [];
		for (const file of withBoundary) {
			boundaries(read(file)).forEach((body, i) => {
				// `{#await}` рахується так само: під час prerender він теж віддає
				// pending-гілку, і порожньою вона робить те саме.
				const hasAwait = /\bawait\b/.test(body);
				if (hasAwait && !/\{#snippet\s+pending\b/.test(body)) {
					bad.push(`${file}: межа #${i + 1} має await і не має pending`);
				}
			});
		}
		expect(bad, `порожня гілка в prerender — сторінка поїде в індекс без вмісту:\n${bad.join("\n")}`).toEqual(
			[]
		);
	});

	it("кожна межа має сніпет failed — інакше вона нічого не показує", () => {
		const bad: string[] = [];
		for (const file of withBoundary) {
			boundaries(read(file)).forEach((body, i) => {
				if (!/\{#snippet\s+failed\b/.test(body)) bad.push(`${file}: межа #${i + 1} без failed`);
			});
		}
		expect(bad, bad.join("\n")).toEqual([]);
	});
});
