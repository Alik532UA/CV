<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { onDestroy } from "svelte";
	import { debugState } from "$lib/controllers/DebugState.svelte";
	import { logService } from "$lib/services/logService.svelte";
	import { Check, Copy } from "lucide-svelte";
	import { fade, scale } from "svelte/transition";

	/**
	 * The service badge: version number, error count and report copying — ONE
	 * element.
	 *
	 * **Shape changes, position does not.** At rest it is a pill carrying the
	 * version; with errors it is a red circle carrying their count; after copying,
	 * a tick. One element, one corner, one `data-testid`.
	 *
	 * **Visibility (DEBUGGING-v8 § 2.1, with a deviation).** In dev the badge is
	 * ALWAYS visible rather than only when errors exist, as the canon prescribes:
	 * it now carries the version number, and hiding that makes no sense — dev is
	 * exactly where it is wanted. Before this, the version lived only in a
	 * commented-out line in the sidebar, so no screenshot of a bug ever showed
	 * which build it was taken on.
	 *
	 * **In production it is hidden until debug mode is on, and there are two ways
	 * in — deliberately different in nature.** `?debug=1` works on a phone and
	 * survives being sent as a link; a run of `V` presses is for whoever is already
	 * at a keyboard, and it persists between sessions. A run of presses is
	 * unreachable by touch, which is exactly why the URL parameter stays: otherwise
	 * nobody would ever see the version on a phone.
	 *
	 * **The run itself lives in `ShortcutState`, not here** — because in production
	 * this component is not rendered until the gesture has fired, so a listener
	 * inside it could never see the gesture that reveals it.
	 */
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	const appVersion = __APP_VERSION__;

	/*
	 * `browser &&` is required, not defensive: during prerender, touching
	 * `page.url.searchParams` throws "Cannot access url.searchParams on a page with
	 * prerendering enabled" and fails the build outright.
	 */
	const urlDebug = $derived(browser && page.url.searchParams.get("debug") === "1");
	/*
	 * `?debug=1` applies ON TOP of the stored state: a link carrying it has to
	 * reveal the badge even for somebody who previously hid it with a run of
	 * presses. Otherwise the most reliable route — the only one available by touch
	 * — could be locked out permanently.
	 */
	const isVisible = $derived(urlDebug || debugState.enabled);

	onDestroy(() => {
		if (copyTimer) clearTimeout(copyTimer);
	});

	async function copyReport() {
		try {
			await navigator.clipboard.writeText(logService.getReport());
			copied = true;
			copyTimer = setTimeout(() => (copied = false), 1500);
		} catch (err) {
			// `warn`, not `error`: the clipboard is unavailable under perfectly
			// normal conditions — an unfocused page, a denied permission, HTTP
			// instead of HTTPS (ERROR-HANDLING-v8 § 1.4). At `error` level this
			// would bump `logService.errorCount`, i.e. the very counter this badge
			// displays: a failed attempt to copy the report would create a reason
			// for the badge to show a count.
			//
			// And through logService rather than console: the package forbids
			// console in production code (CODE-QUALITY-v8 § anti-patterns), and here
			// it also would not reach the report this button hands over.
			logService.warn("ui", `Failed to copy the log report: ${String(err)}`);
		}
	}
</script>

{#if isVisible}
	<button
		type="button"
		class="log-fab"
		class:has-errors={logService.errorCount > 0}
		class:copied
		onclick={copyReport}
		aria-label={`Copy error report — version ${appVersion}`}
		data-testid="app-version-value"
		in:scale={{ duration: 300, start: 0.5 }}
		out:fade={{ duration: 200 }}
	>
		<!-- The version sits OUTSIDE the branches: the error count is ADDED to it rather
		     than replacing it. Otherwise, in dev — where an error is almost always
		     present — the version would never be on screen at all. -->
		{#if copied}
			<div in:scale={{ duration: 200 }}>
				<Check size={14} class="hint-icon" />
			</div>
		{:else if logService.errorCount > 0}
			<span class="count">{logService.errorCount > 99 ? "99+" : logService.errorCount}</span>
		{:else}
			<Copy size={12} class="hint-icon" />
		{/if}
		<span class="version">{appVersion}</span>
	</button>
{/if}

<style>
	.log-fab {
		position: fixed;
		bottom: 16px;
		left: 16px;
		z-index: 9999;

		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;

		/* A pill: a version number does not fit inside a 32px circle. */
		min-height: 32px;
		padding: 0 8px;
		border-radius: 16px;

		background-color: var(--panel-bg);
		color: var(--text-primary);
		border: 2px solid var(--border-color);
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.log-fab:hover {
		transform: scale(1.05);
	}

	.version {
		font-size: 10px;
		font-family: monospace;
		line-height: 1;
		/* The number is read off a screenshot, so it must not wrap. */
		white-space: nowrap;
	}

	/*
	 * The copy icon is a hint that the pill is clickable, not an action of its
	 * own — hence smaller than the number, and faded. The version is the point.
	 */
	.log-fab :global(.hint-icon) {
		opacity: 0.6;
		flex: none;
	}

	/*
	 * The shape does NOT change between states: a pill stays a pill, because the
	 * version stays in place. Errors used to turn the badge into a 32px circle, which
	 * lost not just the version but the element's recognisability — a different thing
	 * appeared in the corner and had to be re-read.
	 */

	/*
	 * Darker than #ff4444 for WCAG AA rather than for taste: white text on the
	 * old colour gave 3.1:1 where 4.5 is required. The error count is the one
	 * badge read precisely when something has gone wrong — the worst possible
	 * candidate for "almost legible".
	 */
	.log-fab.has-errors {
		background-color: #c92a2a;
		color: white;
		border-color: #7f1d1d;
	}

	/* The green follows the same rule: #2f9e44 gave 3.45:1 under white text, #237a35 gives 5.38:1. */
	.log-fab.copied {
		background-color: #237a35;
		color: white;
		border-color: #1b5e20;
	}

	/*
	 * The count is a chip BEFORE the number, not text instead of it. Darker red than
	 * the capsule itself (#7f1d1d on #c92a2a): white on it gives 10:1, and the chip
	 * reads as its own element rather than as a smear.
	 */
	.count {
		font-weight: bold;
		font-size: 11px;
		font-family: monospace;
		line-height: 1;
		padding: 2px 5px;
		border-radius: 8px;
		background-color: #7f1d1d;
		color: white;
	}

	/*
	 * Size follows the INPUT METHOD, not the window width: on a 900px desktop the
	 * button would stay mouse-sized, and on a 1024px tablet it would stay
	 * touch-hostile (ACCESSIBILITY-v8 § 8, DEBUGGING-v8 § 2.2). The old rule was
	 * `max-width: 768px`, which SHRANK the button to 24px exactly where 44 is
	 * needed. `bottom` still moves it clear of the bottom navigation.
	 */
	@media (hover: none) {
		.log-fab {
			min-height: 44px;
			padding: 0 12px;
			border-radius: 22px;
			bottom: 80px;
		}

		.version {
			font-size: 12px;
		}

		.count {
			font-size: 14px;
		}
	}
</style>
