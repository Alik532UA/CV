import { browser } from "$app/environment";
import { MediaQuery } from "svelte/reactivity";
import { storage } from "$lib/services/storage";
import { logService } from "$lib/services/logService.svelte";

/**
 * Touch devices keep the native bar: scrolling there is done with a finger, and
 * the bar takes no layout width to begin with.
 *
 * IMPORTANT: these two conditions are duplicated in the first-frame script in
 * `src/app.html`, which cannot import this module. If either changes here, change
 * it there — `src/scrollbar-canon.test.ts` fails when the two drift apart.
 */
const canHover = new MediaQuery("(hover: hover) and (pointer: fine)");
/** Below this width a minimap would eat usable page width. */
const wideEnough = new MediaQuery("(min-width: 1100px)");

/** The mode a visitor picked. */
export type ScrollbarMode = "standard" | "custom" | "minimap" | "minimap-full";
/** The mode actually in force, which may fall back to the native bar. */
export type ScrollbarControl = "native" | "custom" | "minimap" | "minimap-full";

const MODES: ScrollbarMode[] = ["standard", "custom", "minimap", "minimap-full"];

/**
 * Holds both the stored preference and the mode that really draws.
 *
 * The canon splits these across a general `ui` controller and a scrollbar one.
 * They are together here because this project has no central `ui` object — theme,
 * background, language menu and section are each their own export — so one
 * controller per feature is the local convention.
 */
class ScrollbarState {
	/** The stored choice. Custom by default: the reason for this file is that the
	 *  native bar takes 15px of width, which the PDF modal makes visible as a jump. */
	mode = $state<ScrollbarMode>("custom");

	menu = $state<{ open: boolean; x: number; y: number }>({ open: false, x: 0, y: 0 });

	/**
	 * A chosen mode can turn out to be unavailable, and then the native bar stays.
	 * That is a deliberate retreat rather than a fault: an ordinary working bar
	 * beats none at all.
	 */
	readonly active = $derived.by<ScrollbarControl>(() => {
		if (!browser || !canHover.current) return "native";
		if (this.mode === "custom") return "custom";
		if ((this.mode === "minimap" || this.mode === "minimap-full") && wideEnough.current) {
			return this.mode;
		}
		return "native";
	});

	/** Whether to hide the native bar. The single source of truth for the class
	 *  on `<html>` — see the effect in +layout.svelte. */
	readonly hidesNative = $derived(this.active !== "native");

	constructor() {}

	init() {
		if (!browser) return;
		const saved = storage.get("scrollbarMode");
		if (saved !== null && (MODES as string[]).includes(saved)) {
			this.mode = saved as ScrollbarMode;
		}
		logService.info("ui", `Initializing scrollbar mode: ${this.mode}`);
	}

	set(mode: ScrollbarMode) {
		this.mode = mode;
		storage.set("scrollbarMode", mode);
		logService.info("ui", `Scrollbar mode changed: ${mode} (active: ${this.active})`);
	}

	openMenu = (x: number, y: number) => {
		this.menu = { open: true, x, y };
	};

	closeMenu = () => {
		this.menu = { ...this.menu, open: false };
	};
}

export const scrollbar = new ScrollbarState();
