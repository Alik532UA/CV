import { browser, dev } from "$app/environment";
import { logService } from "$lib/services/logService.svelte";
import { createKeySequence } from "$lib/services/keySequence";
import { hardReset, RESET_PRESSES_DEV, RESET_PRESSES_PROD } from "$lib/services/resetService";
import { debugState } from "$lib/controllers/DebugState.svelte";
import { sound } from "$lib/controllers/SoundState.svelte";
import { theme, background, langMenu, section } from "$lib/controllers/UiState.svelte";

/**
 * **KEY MAP FOR THIS PROJECT** — so the next agent does not re-derive it:
 *
 * | Key | State | Where / why |
 * |---|---|---|
 * | `T` | ✅ theme | `theme.toggle()` |
 * | `L` | ✅ language panel | `langMenu.toggle()`; the panel focuses its search box, so `L` is then correctly swallowed by the field |
 * | `M` | ✅ sound | `sound.toggle()` |
 * | `B` | ✅ background | `background.cycle()` |
 * | `V` | ✅ service badge | run of presses, below; the badge is `ui/LogCopyButton.svelte` |
 * | `R` | ✅ emergency reset | run of presses, below; `services/resetService.ts` |
 * | `Esc` | ✅ close the language panel | |
 * | `PgUp`/`PgDn` | ✅ previous/next section | |
 * | `1`–`9` | ✅ jump to section | Numpad included: the codes differ, the intent does not |
 * | `F` | ⏭️ SKIPPED | no fullscreen — neither a control nor a `requestFullscreen` call exists |
 * | `C` | ⏭️ SKIPPED | no clock on screen |
 * | `H` | ⏭️ SKIPPED | "home" is section 1, which `1` already reaches |
 *
 * Skipped means the feature is absent, not that the key was forgotten. When the
 * feature appears, its key comes from the canonical map (HOTKEYS-v8 § 1.1) rather
 * than being invented.
 */

/** Elements whose own keystrokes must not be intercepted. */
const TEXT_ENTRY = /^(INPUT|TEXTAREA|SELECT)$/;

/**
 * "sound" — the shortcut acted and wants the confirmation clip.
 * "silent" — it acted, but produces its own audio (or deliberately none).
 * false — nothing happened, so nothing is reported.
 */
type Outcome = false | "sound" | "silent";

/**
 * `V` toggles the service badge, and the threshold depends on the direction.
 *
 * A function rather than a number: once the gesture fires, the threshold it needs
 * is different (with the badge visible, hiding it costs 5, not 55). Recreating
 * the sequence on every state change would throw away half of a run in progress.
 */
const versionSequence = createKeySequence({
	code: "KeyV",
	threshold: () => debugState.pressesToToggle,
	onComplete: () => logService.info("ui", `Service badge ${debugState.toggle() ? "shown" : "hidden"}`)
});

/**
 * `R` is the emergency reset. Thresholds and the confirmation live in
 * `resetService`; in production `hardReset(true)` asks first, so the run and the
 * dialog are two independent barriers.
 */
const resetSequence = createKeySequence({
	code: "KeyR",
	threshold: dev ? RESET_PRESSES_DEV : RESET_PRESSES_PROD,
	onComplete: () => void hardReset(!dev)
});

class ShortcutState {
	/** @returns a teardown function, or undefined during SSR. */
	init(): (() => void) | undefined {
		if (!browser) return;

		document.addEventListener("keydown", this.handle);
		logService.info("ui", "Keyboard shortcuts armed: M L T B V R, Esc, PgUp/PgDn, 1-9");

		return () => {
			document.removeEventListener("keydown", this.handle);
			versionSequence.reset();
			resetSequence.reset();
		};
	}

	private handle = (event: KeyboardEvent) => {
		// Single unmodified keys only: Ctrl/Cmd/Alt chords belong to the browser
		// and the OS.
		if (event.ctrlKey || event.metaKey || event.altKey) return;

		/*
		 * Service gestures come first, and they get EVERY key — including the one
		 * that just completed the other run. That is what makes a run a run: a
		 * different key has to reset the counter.
		 *
		 * They also run before the text-entry guard below, and they do not need it
		 * repeated: `keySequence` carries its own, together with the auto-repeat,
		 * window and modifier guards it cannot borrow from here.
		 *
		 * No `preventDefault` for them: a lone `v` or `r` outside a field does
		 * nothing in a browser, and swallowing them would be taking a key away from
		 * the page for a gesture that has not completed yet.
		 */
		versionSequence.handle(event);
		resetSequence.handle(event);

		// Escape is exempt from the text-entry guard below, and is the only key
		// that needs to be. The language panel focuses its search box as it opens,
		// so from there L is — correctly — swallowed by the field: "l" has to
		// reach it to find Lithuanian. Escape is what closes the panel instead.
		if (event.code === "Escape") {
			if (!langMenu.isOpen) return;
			langMenu.close();
			event.preventDefault();
			sound.play("selected");
			return;
		}

		const target = event.target as HTMLElement | null;
		if (target?.isContentEditable || TEXT_ENTRY.test(target?.tagName ?? "")) return;

		const outcome = this.dispatch(event);
		if (!outcome) return;

		// Only once something has been handled — PageUp at the first section must
		// still scroll the way the key normally does.
		event.preventDefault();

		// Same rule the click handler follows: the clip reports what happened, so
		// a PageDown at the last section makes no sound.
		if (outcome === "sound") sound.play("selected");
	};

	private dispatch(event: KeyboardEvent): Outcome {
		switch (event.code) {
			case "KeyM":
				// set() plays its own confirmation when switching on, and switching
				// off is meant to be the one silent action here.
				sound.toggle();
				return "silent";
			case "KeyL":
				langMenu.toggle();
				return "sound";
			case "KeyT":
				theme.toggle();
				return "sound";
			case "KeyB":
				background.cycle();
				return "sound";
			case "PageUp":
				return section.step(-1) && "sound";
			case "PageDown":
				return section.step(1) && "sound";
		}

		// 1-9 pick a section outright. Numpad included: the codes differ, and a
		// visitor pressing 3 does not care which 3 it was.
		const digit = /^(?:Digit|Numpad)([1-9])$/.exec(event.code);
		if (digit) return section.goByIndex(Number(digit[1])) && "sound";

		return false;
	}
}

export const shortcuts = new ShortcutState();
