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
			const theme = params.get("theme");
			const saved = theme || storage.get("theme") || "dark";
			logService.info("ui", `Initializing theme: ${saved} (source: ${theme ? "URL" : "storage"})`);
			this.set(saved);

			// Sync to URL reactively using native history API
			$effect.root(() => {
				$effect(() => {
					const theme = this.current;
					const url = new URL(window.location.href);
					if (url.searchParams.get("theme") !== theme) {
						url.searchParams.set("theme", theme);
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
