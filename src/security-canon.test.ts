// @vitest-environment node
import { describe, expect, it } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Static security invariants (SECURITY-v8 § 16).
 *
 * These are the checks that read like paranoia until the day one of them fires.
 * Each corresponds to a rule in the canon that is invisible in normal use: the
 * page renders identically whether the policy is right or wrong, and the
 * failure only appears in someone else's browser, or not at all — as a
 * protection that was never there.
 *
 * What is NOT here, and cannot be: whether the policy is SUFFICIENT. A blocked
 * resource shows up only at runtime (§ 6.2), so that belongs in Playwright
 * against the built site. This file proves the policy says what we meant it to
 * say — not that saying it was enough.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(ROOT, p), "utf8");

const SVELTE_CONFIG = read("svelte.config.js");
const APP_HTML = read("src/app.html");

function sourceFiles(): string[] {
	return globSync("src/**/*.{ts,svelte}", { cwd: ROOT })
		.map((p) => p.replace(/\\/g, "/"))
		// This file quotes the very patterns it forbids.
		.filter((p) => !p.endsWith("security-canon.test.ts"));
}

describe("the check is alive", () => {
	it("finds sources to read", () => {
		expect(sourceFiles().length).toBeGreaterThan(50);
	});
});

describe("CSP declares only what a meta policy can deliver", () => {
	/**
	 * The whole reason this file exists.
	 *
	 * A <meta http-equiv="Content-Security-Policy"> is REQUIRED by spec to
	 * ignore `frame-ancestors`, `report-uri` and `sandbox`. This site is static
	 * — adapter-static, GitHub Pages — so the meta tag is the only delivery
	 * mechanism there is, and SvelteKit strips those directives out of the
	 * built HTML.
	 *
	 * `frame-ancestors: ['none']` sat in the config and was silently dropped.
	 * Reading the config, the project looked protected against clickjacking.
	 * Reading build/index.html, it never was. Anyone re-adding it will be
	 * making the same mistake, in the same place, for the same reason — so the
	 * failure message says what to do instead.
	 */
	it.each(["frame-ancestors", "report-uri", "sandbox"])(
		"does not declare %s, which a meta policy silently ignores",
		(directive) => {
			expect(
				SVELTE_CONFIG.includes(`'${directive}'`),
				`'${directive}' is in svelte.config.js. A static build delivers CSP only ` +
					`through <meta>, and <meta> is required to ignore this directive — ` +
					`SvelteKit drops it from build/. It would read as protection without ` +
					`being any. Deliver it as a real HTTP header, or leave it out.`
			).toBe(false);
		}
	);

	/**
	 * Absent means blocked (§ 6.2), so every host the document reaches for has
	 * to be named somewhere in the policy. app.html is where third-party hosts
	 * enter this project — the font CSS and its preconnects — and adding one
	 * without touching the policy is a silent block, not an error.
	 */
	it("names every third-party host that app.html reaches for", () => {
		const hosts = new Set(
			[...APP_HTML.matchAll(/https:\/\/([a-z0-9.-]+)/g)].map((m) => m[1])
		);
		const missing = [...hosts].filter((h) => !SVELTE_CONFIG.includes(h));
		expect(
			missing,
			`app.html loads from these hosts, and no CSP directive mentions them — ` +
				`the browser will block them without an error anyone reads: ${missing.join(", ")}`
		).toEqual([]);
	});

	it("keeps object-src and base-uri, which have no default to fall back on", () => {
		// There is no default-src here, so an omitted directive is not inherited
		// — it is unrestricted. These two are cheap and close real injection paths.
		expect(SVELTE_CONFIG).toContain("'object-src'");
		expect(SVELTE_CONFIG).toContain("'base-uri'");
	});
});

describe("dangerous constructs", () => {
	it("has no eval, Function-from-string or document.write (§ 13)", () => {
		const bad = sourceFiles().filter((f) =>
			/\beval\s*\(|new Function\s*\(|document\.write\s*\(/.test(read(f))
		);
		expect(bad, `dynamic code execution in: ${bad.join(", ")}`).toEqual([]);
	});

	/**
	 * § 5.3 allows `{@html}` without sanitisation only where the string is one
	 * we built ourselves — JSON-LD via JSON.stringify is the canonical case, and
	 * the only one in this project. Anything else has to sanitise.
	 */
	it("has no unaccounted-for {@html} (§ 5)", () => {
		const bad: string[] = [];
		for (const file of sourceFiles().filter((f) => f.endsWith(".svelte"))) {
			for (const m of read(file).matchAll(/\{@html\s+([^}]+)\}/g)) {
				const expr = m[1];
				if (!/sanitize|JSON\.stringify|ld\+json/.test(expr)) {
					bad.push(`${file}: {@html ${expr.trim().slice(0, 48)}}`);
				}
			}
		}
		expect(bad, `unchecked {@html}:\n${bad.join("\n")}`).toEqual([]);
	});
});

describe("secrets", () => {
	/**
	 * Everything in a static bundle is visible in DevTools, so a PUBLIC_ variable
	 * is a published variable. The AI keys live as Cloudflare Worker secrets and
	 * the site knows only the proxy URL; this fails if a key ever comes back.
	 */
	it("has no API key hiding behind a PUBLIC_ name", () => {
		const bad: string[] = [];
		for (const file of sourceFiles()) {
			for (const m of read(file).matchAll(/PUBLIC_[A-Z0-9_]+/g)) {
				if (/KEY|SECRET|TOKEN|PASSWORD|CREDENTIAL/.test(m[0])) bad.push(`${file}: ${m[0]}`);
			}
		}
		expect(
			bad,
			`PUBLIC_ variables ship in the bundle in plain text:\n${bad.join("\n")}`
		).toEqual([]);
	});
});
