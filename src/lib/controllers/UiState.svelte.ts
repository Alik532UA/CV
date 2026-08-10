import { browser } from "$app/environment";
import { storage } from "$lib/services/storage";
import { logService } from "$lib/services/logService.svelte";

class ThemeState {
	current = $state("dark");
	isChanging = $state(false);

	constructor() {}

	init() {
		if (browser) {
			const params = new URLSearchParams(window.location.search);
			const themeParam = params.get("theme");
			const saved = storage.get("theme");
			
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const systemTheme = mediaQuery.matches ? "dark" : "light";
			
			const initialTheme = themeParam || saved || systemTheme;
			
			logService.info("ui", `Initializing theme: ${initialTheme} (source: ${themeParam ? "URL" : saved ? "storage" : "system"})`);
			this.set(initialTheme);

			// Listen for system theme changes if user hasn't explicitly set a theme
			mediaQuery.addEventListener("change", (e) => {
				if (!storage.get("theme")) {
					const newTheme = e.matches ? "dark" : "light";
					logService.info("ui", `System theme changed to: ${newTheme}`);
					this.set(newTheme);
				}
			});

			// Sync to URL reactively using native history API
			$effect.root(() => {
				$effect(() => {
					const theme = this.current;
					const url = new URL(window.location.href);
					if (url.searchParams.get("theme") !== theme) {
						url.searchParams.set("theme", theme);
						// history.replaceState doesn't trigger reactive dependencies, 
						// but we use untrack to be architecturally consistent
						window.history.replaceState(null, "", url.toString());
						logService.info("ui", `Theme synced to URL: ${theme}`);
					}
				});
			});
		}
	}

	async toggle() {
		this.isChanging = true;
		logService.info("ui", "Toggling theme...");
		await new Promise((r) => setTimeout(r, 50));

		setTimeout(() => {
			const next = this.current === "dark" ? "light" : "dark";
			this.set(next);

			setTimeout(() => {
				this.isChanging = false;
			}, 300);
		}, 200);
	}

	set(theme: string) {
		this.current = theme;
		if (browser) {
			document.documentElement.setAttribute("data-theme", theme);
			document.documentElement.style.colorScheme = theme;
			storage.set("theme", theme);
		}
	}
}

function getInitialBackgroundType(): 0 | 1 | 2 | 3 {
	if (browser) {
		const saved = storage.get("backgroundType");
		if (saved && ["0", "1", "2", "3"].includes(saved)) {
			return parseInt(saved) as 0 | 1 | 2 | 3;
		}
	}
	return 1;
}

class BackgroundState {
	type = $state<0 | 1 | 2 | 3>(getInitialBackgroundType());

	constructor() {}

	init() {
		if (browser) {
			const saved = storage.get("backgroundType");
			if (saved && ["0", "1", "2", "3"].includes(saved)) {
				this.type = parseInt(saved) as 0 | 1 | 2 | 3;
				logService.info("ui", `Initializing background type: ${this.type}`);
			}
		}
	}

	set(type: 0 | 1 | 2 | 3) {
		this.type = type;
		if (browser) {
			storage.set("backgroundType", type.toString());
			logService.info("ui", `Background type changed: ${type}`);
		}
	}

	/** For the B shortcut: four options, so it steps rather than toggles. */
	cycle() {
		this.set((((this.type + 1) % 4) as 0 | 1 | 2 | 3));
	}
}

/**
 * The language panel's open flag, lifted out of HeaderSection so the L shortcut
 * can reach it. The panel's other concerns — the search query, closing the
 * background dropdown — stay in the component.
 */
class LangMenuState {
	isOpen = $state(false);

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}

	toggle() {
		this.isOpen = !this.isOpen;
	}
}

/**
 * Which section is in view, and how to move between them.
 *
 * `active` is written by the layout's IntersectionObserver, so the shortcuts
 * step from whatever the navs are highlighting rather than from a second,
 * possibly disagreeing idea of "current".
 */
class SectionState {
	active = $state("about");

	/** While a jump is in flight, see observed(). */
	private settleUntil = 0;

	/**
	 * Called by the layout's IntersectionObserver, and ignored mid-jump. A smooth
	 * scroll crosses every section between here and the target, and letting those
	 * report themselves would leave a second PageDown stepping from wherever the
	 * animation happened to have reached.
	 */
	observed(id: string) {
		if (performance.now() < this.settleUntil) return;
		this.active = id;
	}

	/**
	 * Read from the DOM on each use. The sidebar and the bottom nav each keep
	 * their own copy of this list already; a third would be one more thing to
	 * drift out of step with the page.
	 */
	ids(): string[] {
		if (!browser) return [];
		return [...document.querySelectorAll("section[id]")].map((el) => el.id);
	}

	/** @returns whether the move happened, so a no-op stays silent. */
	go(id: string): boolean {
		if (!browser) return false;
		const el = document.getElementById(id);
		if (!el) return false;

		// Section.svelte sets scroll-margin-top: 80px and <html> is
		// scroll-behavior: smooth, so the header offset and the animation are
		// already handled here.
		el.scrollIntoView();
		this.active = id;
		// Long enough to cover the smooth scroll; manual scrolling takes over
		// again once it lapses.
		this.settleUntil = performance.now() + 700;
		logService.info("ui", `Section navigated: ${id}`);
		return true;
	}

	step(delta: number): boolean {
		const ids = this.ids();
		const from = ids.indexOf(this.active);
		const next = (from === -1 ? 0 : from) + delta;
		// Clamped rather than wrapped: PageDown at the last section should stop,
		// not jump the visitor back to the top.
		if (next < 0 || next >= ids.length || next === from) return false;
		return this.go(ids[next]);
	}

	goByIndex(oneBased: number): boolean {
		const ids = this.ids();
		if (oneBased < 1 || oneBased > ids.length) return false;
		return this.go(ids[oneBased - 1]);
	}
}

export const theme = new ThemeState();
export const background = new BackgroundState();
export const langMenu = new LangMenuState();
export const section = new SectionState();
