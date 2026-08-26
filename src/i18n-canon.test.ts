// @vitest-environment node
import { describe, expect, it } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

/**
 * Localisation invariants (I18N-v8 § 2, § 4.3, § 7.1).
 *
 * The site renders in 42 languages, and the failure mode this file exists for
 * is not a crash: it is a visitor reading a page in Italian and hitting a
 * paragraph in Ukrainian. Nothing goes red, `svelte-check` is happy, and the
 * only way anyone finds out is by opening the page in that language — which is
 * exactly what nobody does for the thirty-eighth locale.
 *
 * That is how the whole AI Job Matcher shipped in Ukrainian.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(ROOT, p), "utf8");

/** Comments and <style> blocks are ours to write in any language. */
function strippedMarkup(source: string): string {
	return source
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/<style[\s\S]*?<\/style>/g, "")
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/^\s*\/\/.*$/gm, "");
}

const CYRILLIC = /[\u0400-\u04FF]/;

describe("the check is alive", () => {
	it("finds components and locales", () => {
		expect(globSync("src/lib/components/**/*.svelte", { cwd: ROOT }).length).toBeGreaterThan(20);
		expect(globSync("src/lib/i18n/locales/*.ts", { cwd: ROOT }).length).toBeGreaterThan(40);
	});
});

describe("no user-facing text outside the dictionaries", () => {
	/**
	 * Cyrillic is the tell, not the rule. The rule is "every visible string
	 * comes from `t`", which cannot be checked directly — a literal in English
	 * is indistinguishable from a class name or an aria role. But this project's
	 * author writes in Ukrainian, so a hardcoded UI string here is Cyrillic
	 * essentially every time, and that IS checkable.
	 *
	 * Comments and <style> are stripped first: the code is commented in
	 * Ukrainian on purpose and always will be.
	 */
	it.each([
		["src/lib/components/**/*.svelte"],
		["src/routes/**/*.svelte"]
	])("%s carries no Cyrillic outside comments", (pattern) => {
		const offenders: string[] = [];
		for (const file of globSync(pattern, { cwd: ROOT })) {
			const path = file.replace(/\\/g, "/");
			const code = strippedMarkup(read(path));
			for (const line of code.split("\n")) {
				if (CYRILLIC.test(line)) offenders.push(`${path}: ${line.trim().slice(0, 80)}`);
			}
		}
		expect(
			offenders,
			`hardcoded text — it will show up untranslated in the other 41 languages:\n${offenders.join("\n")}`
		).toEqual([]);
	});

	/**
	 * ПОЛОВИНА, ЯКОЇ СКАНЕР ВИЩЕ НЕ БАЧИВ. Він читає `.svelte`, а рядок, що
	 * потрапляє на екран, не зобов'язаний жити в компоненті: `aiChat.error`
	 * малюється в `AiMatchModal`, а складається в `AiChatState.svelte.ts`. Саме
	 * там і лишалися чотири літерали українською — «Не вдалося звернутися до
	 * AI-проксі», «Проксі повернув не JSON», «Помилка проксі» — плюс поле
	 * `error` з воркера, теж українською. Тобто відвідувач, який читає сайт
	 * італійською, при обриві мережі отримував кирилицю, і докблок цього файлу
	 * («так увесь AI Job Matcher і поїхав українською») описував стан, який
	 * насправді не був виправлений до кінця.
	 *
	 * Перевіряється не весь контролер, а те, що видно: чи не присвоюється
	 * `this.error` літералом. Ширший скан тут неможливий — сусідні файли повні
	 * законної кирилиці (`betaChecklist` двомовний за побудовою, `knowledgeBase`
	 * — вміст резюме, `aiPrompt` — системний промпт моделі, `languageMeta` —
	 * самоназви мов).
	 */
	const ERROR_ASSIGNMENT = /\berror\s*=\s*(["'`])/g;

	it("finds a literal assigned to error when there is one", () => {
		// Регулярка — це весь тест; мовчки зламана звітує про успіх.
		expect('this.error = "Помилка проксі";').toMatch(new RegExp(ERROR_ASSIGNMENT.source));
		expect("this.error = describeFailure(err);").not.toMatch(new RegExp(ERROR_ASSIGNMENT.source));
		expect("this.error = t.ai.emptyAnswer;").not.toMatch(new RegExp(ERROR_ASSIGNMENT.source));
	});

	it("no controller builds a visible error out of a literal", () => {
		const offenders: string[] = [];
		for (const file of globSync("src/lib/controllers/**/*.ts", { cwd: ROOT })) {
			const path = file.replace(/\\/g, "/");
			if (/\.(test|spec)\.ts$/.test(path)) continue;
			const code = strippedMarkup(read(path));
			code.split("\n").forEach((line, i) => {
				if (new RegExp(ERROR_ASSIGNMENT.source).test(line)) {
					offenders.push(`${path}:${i + 1}: ${line.trim().slice(0, 80)}`);
				}
			});
		}
		expect(
			offenders,
			`a visible error message frozen into one language:\n${offenders.join("\n")}`
		).toEqual([]);
	});
});

describe("dictionary parity is enforced by the type", () => {
	/**
	 * The parity guarantee of this project rests entirely on each locale being
	 * annotated `: Translations`. Drop the annotation and TypeScript infers the
	 * object's own shape instead of checking it against the schema — the file
	 * still compiles, and a missing key goes unnoticed until a page renders
	 * `undefined`. There is no warning for this anywhere else.
	 */
	it("every locale file is annotated with the Translations type", () => {
		const bad: string[] = [];
		for (const file of globSync("src/lib/i18n/locales/*.ts", { cwd: ROOT })) {
			const path = `src/lib/i18n/locales/${basename(file)}`;
			if (!/:\s*Translations\s*=/.test(read(path))) bad.push(path);
		}
		expect(bad, `no ": Translations" annotation — parity is not checked in:\n${bad.join("\n")}`).toEqual(
			[]
		);
	});

	/**
	 * UI-UX-v8 § 4: emoji belong in user content, not in interface strings —
	 * they render differently on every platform and read as noise to a screen
	 * reader. Checked in the dictionaries, because that is where the visible
	 * text lives.
	 */
	/**
	 * ПОЛОВИНА, ЯКОЇ ТИП НЕ ЛОВИТЬ. Анотація `: Translations` доводить, що ключі
	 * на місці, і не доводить нічого про значення: `title: ""` компілюється
	 * бездоганно, а на екрані дає порожню кнопку, порожній заголовок або зникле
	 * речення. Канон вимагає обидві перевірки в одному місці
	 * (I18N-v8 § 7.1: «жодного порожнього рядка»), і саме її тут бракувало.
	 *
	 * Пробіл рахується порожнім навмисно: `" "` — це той самий дефект, тільки
	 * невидимий у diff.
	 */
	const EMPTY_VALUE = String.raw`([A-Za-z_$][\w$]*)\s*:\s*(""|''|` + "``" + String.raw`|"\s+"|'\s+')`;

	it("finds an empty value when there is one", () => {
		// Регулярка — це весь тест; мовчки зламана звітує про успіх.
		const one = new RegExp(EMPTY_VALUE);
		expect('\ttitle: "",').toMatch(one);
		expect("\ttitle: ' ',").toMatch(one);
		expect('\ttitle: "Close",').not.toMatch(one);
		expect("\ttitle: 'Закрити',").not.toMatch(one);
	});

	it("no locale value is an empty string", () => {
		const bad: string[] = [];
		for (const file of globSync("src/lib/i18n/locales/*.ts", { cwd: ROOT })) {
			const path = `src/lib/i18n/locales/${basename(file)}`;
			const text = read(path);
			for (const m of text.matchAll(new RegExp(EMPTY_VALUE, "g"))) {
				const line = text.slice(0, m.index).split("\n").length;
				bad.push(`${path}:${line}  ${m[1]}`);
			}
		}
		expect(
			bad,
			`порожній рядок у словнику — тип цього не бачить, а сторінка покаже нічого:\n${bad.join("\n")}`
		).toEqual([]);
	});

	it("no emoji in interface strings", () => {
		const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
		const bad: string[] = [];
		for (const file of globSync("src/lib/i18n/locales/*.ts", { cwd: ROOT })) {
			const path = `src/lib/i18n/locales/${basename(file)}`;
			for (const line of read(path).split("\n")) {
				if (emoji.test(line)) bad.push(`${path}: ${line.trim().slice(0, 60)}`);
			}
		}
		expect(bad, bad.join("\n")).toEqual([]);
	});
});

describe("locale-aware formatting", () => {
	/**
	 * I18N-v8 HIGH: `toLocaleString()` with no argument formats in the BROWSER's
	 * locale, not the site's. A visitor with a German browser reading the
	 * Ukrainian page gets German dates — and the developer, whose browser
	 * matches the page they are testing, never sees it.
	 */
	it("no toLocaleString/toLocaleDateString without an explicit locale", () => {
		const bad: string[] = [];
		for (const file of globSync("src/**/*.{ts,svelte}", { cwd: ROOT })) {
			const path = file.replace(/\\/g, "/");
			if (path.endsWith("i18n-canon.test.ts")) continue;
			const code = strippedMarkup(read(path));
			for (const m of code.matchAll(/\.toLocale(?:Date|Time)?String\(\s*\)/g)) {
				bad.push(`${path}: ${m[0]}`);
			}
		}
		expect(
			bad,
			`formats in the browser's locale rather than the site's:\n${bad.join("\n")}`
		).toEqual([]);
	});
});

describe("writing direction travels with the language (§ 6)", () => {
	/**
	 * `he` shipped in the language list from the first commit and `dir="rtl"`
	 * existed nowhere in the project, so the Hebrew page laid out left to right:
	 * punctuation at the wrong end of every line, and a document that both the
	 * browser and a screen reader believed was LTR. PROJECT-CONTEXT.md carried
	 * it as "either do it or drop `he`".
	 *
	 * The direction is now derived in one place — `textDirection()` — and used
	 * in two: `hooks.server.ts` bakes it into every prerendered page, and
	 * `I18nState` updates it on a switch without reload. This test exists
	 * because those two are the pair that can silently drift: setting `lang`
	 * without `dir` gives the worst of both, a page declared Hebrew and laid
	 * out the other way.
	 */
	it("every place that sets documentElement.lang also sets dir", () => {
		const offenders: string[] = [];
		for (const file of globSync("src/**/*.{ts,svelte}", { cwd: ROOT })) {
			const path = file.replace(/\\/g, "/");
			if (path.endsWith("i18n-canon.test.ts")) continue;
			const lines = read(path).split("\n");
			lines.forEach((line, i) => {
				if (!/documentElement\.lang\s*=/.test(line)) return;
				// The dir assignment is expected within the same short block.
				const near = lines.slice(i, i + 4).join("\n");
				if (!/documentElement\.dir\s*=/.test(near)) {
					offenders.push(`${path}:${i + 1}`);
				}
			});
		}
		expect(
			offenders,
			`lang is set without dir — a Hebrew page would render left to right:\n${offenders.join("\n")}`
		).toEqual([]);
	});

	it("the sole source of direction knows about Hebrew and nothing else yet", () => {
		const routing = read("src/lib/i18n/routing.ts");
		expect(routing, "textDirection() is gone — who sets dir now?").toContain("textDirection");
		// A canary against the opposite mistake: marking everything rtl.
		expect(routing).toMatch(/RTL_LANGUAGES[\s\S]{0,120}"he"/);
	});
});
