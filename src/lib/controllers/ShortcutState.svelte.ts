import { browser } from "$app/environment";
import { logService } from "$lib/services/logService.svelte";
import { sound } from "$lib/controllers/SoundState.svelte";
import { theme, background, langMenu, section } from "$lib/controllers/UiState.svelte";

/** Elements whose own keystrokes must not be intercepted. */
const TEXT_ENTRY = /^(INPUT|TEXTAREA|SELECT)$/;

/**
 * "sound" — the shortcut acted and wants the confirmation clip.
 * "silent" — it acted, but produces its own audio (or deliberately none).
 * false — nothing happened, so nothing is reported.
 */
type Outcome = false | "sound" | "silent";

class ShortcutState {
	/** @returns a teardown function, or undefined during SSR. */
	init(): (() => void) | undefined {
		if (!browser) return;

		document.addEventListener("keydown", this.handle);
		logService.info("ui", "Keyboard shortcuts armed: M L T B, Esc, PgUp/PgDn, 1-9");

		return () => document.removeEventListener("keydown", this.handle);
	}

	private handle = (event: KeyboardEvent) => {
		// Single unmodified keys only: Ctrl/Cmd/Alt chords belong to the browser
		// and the OS.
		if (event.ctrlKey || event.metaKey || event.altKey) return;

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
