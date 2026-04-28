import { browser } from "$app/environment";
import { storage } from "$lib/services/storage";

class ThemeState {
	current = $state("dark");
	isChanging = $state(false);

	constructor() {}

	init() {
		if (browser) {
			const params = new URLSearchParams(window.location.search);
			const theme = params.get("theme");
			const saved = theme || storage.get("theme") || "dark";
			this.set(saved);

			// Sync to URL reactively using native history API
			$effect.root(() => {
				$effect(() => {
					const theme = this.current;
					const url = new URL(window.location.href);
					if (url.searchParams.get("theme") !== theme) {
						url.searchParams.set("theme", theme);
						window.history.replaceState(null, "", url.toString());
					}
				});
			});
		}
	}

	async toggle() {
		this.isChanging = true;
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
			}
		}
	}

	set(type: 0 | 1 | 2 | 3) {
		this.type = type;
		if (browser) {
			storage.set("backgroundType", type.toString());
		}
	}
}

export const theme = new ThemeState();
export const background = new BackgroundState();
