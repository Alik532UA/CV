import type { ScrollbarMode } from "$lib/controllers/ScrollbarState.svelte";

/**
 * Single source for the mode list. It is rendered by the context menu, and would
 * be rendered by a settings panel too if this project had one — two copies drift
 * the moment a fifth mode is added, and one of the places forgets it.
 *
 * `label` indexes into `t.scrollbar` rather than holding a dotted key string:
 * this project's `t` is an object of getters, not a lookup function, so a key
 * like "scrollbar.custom" would have nothing to resolve it.
 *
 * Order runs from the familiar to the most expensive.
 */
export const SCROLLBAR_MODES: { id: ScrollbarMode; label: "standard" | "custom" | "minimap" | "minimapFull" }[] = [
	{ id: "standard", label: "standard" },
	{ id: "custom", label: "custom" },
	{ id: "minimap", label: "minimap" },
	{ id: "minimap-full", label: "minimapFull" }
];
