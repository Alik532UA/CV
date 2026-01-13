<script lang="ts">
    import { language, type Language } from "$lib/i18n";
    import { Sun, Moon } from "lucide-svelte";
    import FlagUK from "$lib/components/flags/FlagUK.svelte";
    import FlagEN from "$lib/components/flags/FlagEN.svelte";

    export let theme: string;
    export let toggleTheme: () => void;

    function setLanguage(lang: Language) {
        language.set(lang);
    }
</script>

<header class="header glass">
    <div class="header-content">
        <div class="controls">
            <!-- Language Switcher -->
            <div class="toggle-group glass">
                <button
                    on:click={() => setLanguage("en")}
                    class:active={$language === "en"}
                    title="English"
                >
                    <FlagEN width="20" height="15" />
                </button>
                <div class="divider"></div>
                <button
                    on:click={() => setLanguage("uk")}
                    class:active={$language === "uk"}
                    title="Українська"
                >
                    <FlagUK width="20" height="15" />
                </button>
            </div>

            <!-- Theme Toggle (Now with same style as Language Switcher) -->
            <div class="toggle-group glass">
                <button
                    on:click={() => theme !== "light" && toggleTheme()}
                    class:active={theme === "light"}
                    title="Light Theme"
                >
                    <Sun size={18} />
                </button>
                <div class="divider"></div>
                <button
                    on:click={() => theme !== "dark" && toggleTheme()}
                    class:active={theme === "dark"}
                    title="Dark Theme"
                >
                    <Moon size={18} />
                </button>
            </div>
        </div>
    </div>
</header>

<style>
    .header {
        position: fixed;
        top: 0;
        right: 0;
        left: 280px;
        height: 70px;
        z-index: 1000;
        background: var(--header-bg);
        border: none;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        padding: 0 40px;
    }

    .header-content {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .controls {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .toggle-group {
        display: flex;
        padding: 4px;
        border-radius: 12px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        height: 40px;
        align-items: center;
        transition: var(--transition);
        backdrop-filter: var(--glass-blur);
    }

    .toggle-group:hover {
        border-color: var(--accent-primary);
    }

    .toggle-group button {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        cursor: pointer;
        transition: var(--transition);
        height: 32px;
        width: 44px;
        opacity: 0.5;
    }

    .toggle-group button.active {
        background: rgba(var(--accent-primary-rgb), 0.1);
        color: var(--accent-primary);
        opacity: 1;
        box-shadow: none;
    }

    .divider {
        width: 1px;
        background: var(--border-color);
        height: 18px;
        margin: 0 2px;
    }

    @media (max-width: 768px) {
        .header {
            left: 0;
            padding: 0 15px;
            height: 60px;
        }

        .toggle-group button {
            width: 38px;
        }
    }
</style>
