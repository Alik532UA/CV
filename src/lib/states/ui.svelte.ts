import { browser } from "$app/environment";
import { replaceState } from "$app/navigation";

class ThemeState {
    current = $state("dark");
    isChanging = $state(false);

    constructor() {}

    init() {
        if (browser) {
            const params = new URLSearchParams(window.location.search);
            const theme = params.get('theme');
            const saved = theme || localStorage.getItem("theme") || "dark";
            this.set(saved);

            // Sync to URL reactively using native history API
            $effect.root(() => {
                $effect(() => {
                    const theme = this.current;
                    const url = new URL(window.location.href);
                    if (url.searchParams.get('theme') !== theme) {
                        url.searchParams.set('theme', theme);
                        replaceState(url.toString(), {});
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
            localStorage.setItem("theme", theme);
        }
    }
}

class BackgroundState {
    type = $state<0 | 1 | 2 | 3>(1);

    constructor() {}

    init() {
        if (browser) {
            const saved = localStorage.getItem("backgroundType");
            if (saved && ["0", "1", "2", "3"].includes(saved)) {
                this.type = parseInt(saved) as 0 | 1 | 2 | 3;
            }
        }
    }

    set(type: 0 | 1 | 2 | 3) {
        this.type = type;
        if (browser) {
            localStorage.setItem("backgroundType", type.toString());
        }
    }
}

export const theme = new ThemeState();
export const background = new BackgroundState();
