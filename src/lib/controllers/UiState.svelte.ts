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

class BackgroundState {
	type = $state<0 | 1 | 2 | 3>(1);

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
}

export const theme = new ThemeState();
export const background = new BackgroundState();
