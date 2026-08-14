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
