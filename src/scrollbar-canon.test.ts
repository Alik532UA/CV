import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { globSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Static invariants for SCROLLBAR-v8 § 11.
 *
 * The modes themselves — geometry, pointer events, drag feel — are only testable
 * in a browser, and § 11 says so outright. What IS checkable from the source is the
 * handful of facts that live in two places at once and go stale silently. Each of
 * these has a matching checkbox in the canon.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(ROOT, p), "utf8");

const APP_HTML = read("src/app.html");
const CONTROLLER = read("src/lib/controllers/ScrollbarState.svelte.ts");
const SVELTE_CONFIG = read("svelte.config.js");

/**
 * Every source file that could plausibly touch the class or call scrollTo.
 *
 * This file excludes itself: it quotes the very patterns it forbids, and matched
 * its own regex on the first run.
 */
function sourceFiles(): string[] {
	// app.html is in scope: the first-frame script is the class's second owner.
	return globSync("src/**/*.{ts,svelte,css,html}", { cwd: ROOT })
		.map((p) => p.replace(/\\/g, "/"))
		.filter((p) => !p.endsWith("scrollbar-canon.test.ts"));
}

describe("scrollbar canon § 8.2 — the first-frame script duplicates the controller", () => {
	// The script in app.html cannot import the controller, so the media queries and
	// the mode names exist twice. They drift silently: one behaviour on the first
	// frame, another after hydration, and the visitor sees the jump.
	it.each([
		["(hover: hover) and (pointer: fine)"],
		["(min-width: 1100px)"],
		["minimap-full"]
	])("both places agree on %s", (needle) => {
		expect(APP_HTML, `missing from app.html: ${needle}`).toContain(needle);
		expect(CONTROLLER, `missing from ScrollbarState: ${needle}`).toContain(needle);
	});

	it("the default mode matches in both places", () => {
		// app.html: `localStorage.getItem(...) || 'custom'`
		const html = APP_HTML.match(/scrollbarMode'\)\s*\|\|\s*'([a-z-]+)'/);
		// controller: `mode = $state<ScrollbarMode>("custom")`
		const ts = CONTROLLER.match(/mode\s*=\s*\$state<ScrollbarMode>\("([a-z-]+)"\)/);
		expect(html?.[1], "no default found in app.html").toBeTruthy();
		expect(ts?.[1], "no default found in the controller").toBeTruthy();
		expect(html?.[1]).toBe(ts?.[1]);
	});
});

describe("scrollbar canon § 2.3 — the hiding class has exactly one owner", () => {
	it("has-custom-scrollbar is added or removed in exactly two places", () => {
		// One: the effect in +layout.svelte. Two: the first-frame script. Any third is
		// a drawing component doing it for itself, which races on every mode switch.
		const owners: string[] = [];
		for (const file of sourceFiles()) {
			const text = read(file);
			for (const m of text.matchAll(
				/classList\.(?:add|remove|toggle)\(\s*["'`]has-custom-scrollbar/g
			)) {
				owners.push(`${file}: ${m[0]}`);
			}
		}
		expect(owners.sort(), `owners:\n${owners.join("\n")}`).toHaveLength(2);
	});
});

describe("scrollbar canon § 9.2 — behavior: 'auto' is forbidden", () => {
	it("no scrollTo passes behavior: 'auto'", () => {
		// 'auto' means "read CSS scroll-behavior", which is `smooth` in app.css. Every
		// mouse move during a drag would start an animation and they would chase each
		// other — correct-looking code that judders.
		const offenders: string[] = [];
		for (const file of sourceFiles()) {
			const text = read(file);
			if (/behavior:\s*["']auto["']/.test(text)) offenders.push(file);
		}
		expect(offenders, `behavior: 'auto' in:\n${offenders.join("\n")}`).toEqual([]);
	});
});

describe("scrollbar canon § 9.10 / § 9.11 — the minimap must not fight its own drag", () => {
	const MINIMAP = read("src/lib/components/ui/Minimap.svelte");

	it("has exactly one Spring, the slide-out", () => {
		// A second one is either the marker height or a presence spring. The first
		// makes grabOffset disagree with the clamp it was taken under; the second
		// needs a class that stops the element rendering, which releases the pointer
		// capture and kills the gesture mid-move. Both read as "it sometimes sticks".
		const springs = [...MINIMAP.matchAll(/new Spring\(/g)];
		expect(springs, `found ${springs.length} Spring instances`).toHaveLength(1);
	});

	it("never turns itself non-rendered", () => {
		// Scoped to the strip: pointer-events: none on .minimap__clone is required,
		// so only rules for .minimap itself are of interest. The print block is cut
		// out as well — `display: none` there is what the canon asks for, and it can
		// never fire mid-gesture.
		const styles = MINIMAP.slice(MINIMAP.indexOf("<style>")).replace(
			/@media print\s*\{[\s\S]*?\n\s*\}/g,
			""
		);
		const stripRules = [...styles.matchAll(/\.minimap(?:--[\w-]+|\.[\w-]+)?\s*\{([^}]*)\}/g)]
			.map((m) => m[1])
			.join("\n");
		expect(stripRules).not.toMatch(/visibility:\s*hidden/);
		expect(stripRules).not.toMatch(/pointer-events:\s*none/);
		expect(stripRules).not.toMatch(/display:\s*none/);
	});

	it("suppresses the browser's own gesture on the drag surface", () => {
		// The strip sits against the right edge of the window, which is where the
		// browser's selection autoscroll lives. Let a selection start on a press and
		// that autoscroll fights every scrollTo the drag makes — the schematic mode
		// scrolled or stuck depending on which won. Three things stop it, and all
		// three have to hold.
		expect(MINIMAP, "no user-select: none on .minimap").toMatch(
			/\.minimap\s*\{[^}]*user-select:\s*none/
		);
		expect(MINIMAP, "no preventDefault in the pointerdown handler").toMatch(
			/function onPointerDown[\s\S]{0,400}?e\.preventDefault\(\)/
		);
		// Blocks are a drawing. Without this the press lands on a child element in the
		// schematic mode and on the strip itself in the visual one — different targets
		// for what is meant to be the same gesture.
		const blockRule = MINIMAP.match(/\.minimap__block,\s*\.minimap__viewport\s*\{([^}]*)\}/);
		expect(blockRule?.[1], "no shared .minimap__block rule found").toBeTruthy();
		expect(blockRule![1]).toMatch(/pointer-events:\s*none/);
	});

	it("carries the drag on the window, not only on the strip", () => {
		// 28px wide: the slightest sideways drift takes the cursor off it, and if
		// pointer capture ever fails to take, the strip's own handler hears nothing.
		expect(MINIMAP).toMatch(/<svelte:window[\s\S]*?if \(dragging\) \{\s*requestScroll/);
	});

	// The custom bar has the same shape — a track with a child indicator, pressed
	// against the right edge — so it has the same defect. It is harder to notice
	// there only because the thumb is usually under the cursor already, being the
	// thing people grab; a press beside it on a 10px track misses every time.
	it("applies the same three to the custom bar, whose track is narrower still", () => {
		const BAR = read("src/lib/components/ui/PageScrollbar.svelte");
		expect(BAR, "no user-select: none on .page-scrollbar").toMatch(
			/\.page-scrollbar\s*\{[^}]*user-select:\s*none/
		);
		expect(BAR, "no pointer-events: none on the thumb").toMatch(
			/\.page-scrollbar__thumb\s*\{[^}]*pointer-events:\s*none/
		);
		expect(BAR, "no preventDefault in the pointerdown handler").toMatch(
			/function onTrackPointerDown[\s\S]{0,400}?e\.preventDefault\(\)/
		);
		expect(BAR, "the window does not carry the drag").toMatch(
			/<svelte:window[\s\S]*?if \(dragging\) \{\s*requestScroll/
		);
	});

	it("marks the clone inert, not merely tabindex-stripped", () => {
		// removeAttribute('tabindex') only unmakes what tabindex made focusable.
		// <button> and <a href> are focusable natively, and this page's clone holds
		// fifty of them — Tab would walk into an invisible copy of the whole site.
		expect(MINIMAP).toMatch(/setAttribute\("inert"/);
	});

	it("changes only the background on hover", () => {
		// The strip is the full height of the viewport, so any edge treatment on it is
		// a bright line down the whole screen rather than the highlight it looks like.
		const hover = MINIMAP.match(/\.minimap:hover[^{]*\{([^}]*)\}/);
		expect(hover?.[1], "no .minimap:hover rule found").toBeTruthy();
		expect(hover![1]).not.toMatch(/border|outline|box-shadow/);
	});
});

describe("CSP — the first-frame script's hash is registered", () => {
	it("svelte.config.js lists the hash of the script actually in app.html", () => {
		// SvelteKit hashes only the scripts it emits itself, so this one is listed by
		// hand — and editing the script changes the hash. It had already gone stale
		// this way once, leaving the built site blocking its own theme script.
		const inline = APP_HTML.match(/<script>([\s\S]*?)<\/script>/);
		expect(inline?.[1], "no inline script in app.html").toBeTruthy();

		const hash = "sha256-" + createHash("sha256").update(inline![1], "utf8").digest("base64");
		expect(
			SVELTE_CONFIG,
			`app.html's inline script hashes to ${hash}, which svelte.config.js does not list`
		).toContain(hash);
	});
});
