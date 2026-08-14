// @vitest-environment node
import { describe, expect, it } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Context is taken through a typed accessor, never by a string key
 * (SVELTE-CORE-v8 § 3.3).
 *
 * What this file exists for: `+layout.svelte` used to call
 * `setContext("theme", theme)` for four controllers, and `HeaderSection.svelte`
 * read them back as `getContext<any>("theme")` — four string keys and four
 * `eslint-disable @typescript-eslint/no-explicit-any` lines, in a project whose
 * eslint config sets that rule to `error` and says in a comment that the
 * codebase has none.
 *
 * Three separate holes, none of which anything else would have caught:
 *
 *  - a string key is one namespace for the whole app, shared with every library
 *    that also picks `'theme'`;
 *  - `getContext<T>` compiles with whatever `T` you write — TypeScript trusts
 *    the annotation, not the value — so the type there is a promise, not a
 *    check;
 *  - `any` removes even the promise.
 *
 * The four singletons are now imported directly, which is what `langMenu` in
 * the same component already did. This check keeps the string-keyed form from
 * coming back the next time context looks like the tidy answer.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(ROOT, p), "utf8");

/** Comments quote the very form this file forbids — strip them before matching. */
function withoutComments(source: string): string {
	return source
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/(?<![:'"\\])\/\/.*$/gm, "");
}

/**
 * `getContext(` / `setContext(` with a string literal first argument.
 *
 * The negative lookbehind matters more than it looks: `canvas.getContext('2d')`
 * appears in every backgrounds engine in this account, and without it this
 * check would be red on arrival and get deleted rather than fixed.
 */
const STRING_KEYED = /(?<![.\w])(get|set)Context\s*(?:<[^>]*>)?\s*\(\s*(['"`])/g;

/** `getContext<any>` — a string key would be caught above; this catches the type. */
const ANY_TYPED = /(?<![.\w])getContext\s*<\s*any\s*>/g;

const SOURCES = ["src/**/*.svelte", "src/**/*.ts"];

function sources(): string[] {
	return SOURCES.flatMap((pattern) => globSync(pattern, { cwd: ROOT }))
		.map((f) => f.replace(/\\/g, "/"))
		.filter((f) => !f.endsWith("context-conventions.test.ts"));
}

describe("Svelte context", () => {
	it("the check is alive: it sees the project's sources", () => {
		expect(sources().length).toBeGreaterThan(100);
	});

	it("no context is registered or read by a string key", () => {
		const bad: string[] = [];
		for (const file of sources()) {
			for (const m of withoutComments(read(file)).matchAll(STRING_KEYED)) {
				bad.push(`${file}: ${m[0]}…`);
			}
		}
		expect(
			bad,
			`a string key is one namespace for the whole app — use a Symbol in an accessor module (SVELTE-CORE-v8 § 3.3):\n${bad.join("\n")}`
		).toEqual([]);
	});

	it("no getContext<any>", () => {
		const bad: string[] = [];
		for (const file of sources()) {
			for (const m of withoutComments(read(file)).matchAll(ANY_TYPED)) {
				bad.push(`${file}: ${m[0]}`);
			}
		}
		expect(bad, `the type is switched off entirely here:\n${bad.join("\n")}`).toEqual([]);
	});

	it("canvas.getContext('2d') is not mistaken for Svelte context", () => {
		// Canary for the lookbehind above: this project does call
		// canvas.getContext('2d'), and if the regex ever starts matching it,
		// the two checks above become noise and get switched off.
		const engine = "src/lib/components/backgrounds/engine/CanvasEngine.ts";
		const source = withoutComments(read(engine));
		expect(source, "the canary file no longer calls canvas.getContext").toContain(
			"getContext(\"2d\")"
		);
		expect([...source.matchAll(STRING_KEYED)].map((m) => m[0])).toEqual([]);
	});
});
