<script lang="ts">
    import { language, type Language } from "$lib/i18n/index.svelte";
    import { theme, background } from "$lib/states/ui.svelte";
    import {
        Sun,
        Moon,
        Sparkles,
        Waves,
        CircleOff,
        Shapes,
    } from "lucide-svelte";
    import FlagUK from "$lib/components/flags/FlagUK.svelte";
    import FlagEN from "$lib/components/flags/FlagEN.svelte";
    import { onMount, onDestroy } from "svelte";

    let isBgDropdownOpen = $state(false);

    function setLanguage(lang: Language) {
        language.set(lang);
    }

    function toggleBgDropdown() {
        isBgDropdownOpen = !isBgDropdownOpen;
    }

    function selectBackground(type: 0 | 1 | 2 | 3) {
        background.set(type);
        isBgDropdownOpen = false;
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (isBgDropdownOpen && !target.closest(".mobile-bg-switcher")) {
            isBgDropdownOpen = false;
        }
    }

    onMount(() => {
        if (typeof window !== "undefined") {
            document.addEventListener("click", handleClickOutside);
        }
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            document.removeEventListener("click", handleClickOutside);
        }
    });

    // Helper to get icon for active mobile bg
    let ActiveBgIcon = $derived([CircleOff, Sparkles, Waves, Shapes][background.type]);
</script>

<header class="header glass">
    <div class="header-content">
        <div class="controls">
            <!-- Background Switcher (Desktop) -->
            <div
                class="toggle-group glass desktop-only"
                data-testid="bg-switcher"
                role="radiogroup"
                aria-label="Background effect"
            >
                <button
                    onclick={() => background.set(0)}
                    class:active={background.type === 0}
                    title="Background Off"
                    aria-label="Disable background effects"
                    aria-checked={background.type === 0}
                    role="radio"
                    data-testid="bg-off"
                >
                    <CircleOff size={18} />
                </button>
                <div class="divider" role="separator"></div>
                <button
                    onclick={() => background.set(1)}
                    class:active={background.type === 1}
                    title="Particles Effect"
                    aria-label="Enable particles background"
                    aria-checked={background.type === 1}
                    role="radio"
                    data-testid="bg-particles"
                >
                    <Sparkles size={18} />
                </button>
                <div class="divider" role="separator"></div>
                <button
                    onclick={() => background.set(2)}
                    class:active={background.type === 2}
                    title="Waves Effect"
                    aria-label="Enable waves background"
                    aria-checked={background.type === 2}
                    role="radio"
                    data-testid="bg-waves"
                >
                    <Waves size={18} />
                </button>
                <div class="divider" role="separator"></div>
                <button
                    onclick={() => background.set(3)}
                    class:active={background.type === 3}
                    title="Shapes Effect"
                    aria-label="Enable shapes background"
                    aria-checked={background.type === 3}
                    role="radio"
                    data-testid="bg-shapes"
                >
                    <Shapes size={18} />
                </button>
            </div>

            <!-- Background Switcher (Mobile) -->
            <div
                class="mobile-bg-switcher mobile-only"
                data-testid="bg-switcher-mobile"
            >
                <button
                    class="glass-icon-btn"
                    onclick={(e) => { e.stopPropagation(); toggleBgDropdown(); }}
                    aria-label="Select background effect"
                    aria-haspopup="true"
                    aria-expanded={isBgDropdownOpen}
                >
                    <ActiveBgIcon size={20} />
                </button>

                {#if isBgDropdownOpen}
                    <div class="bg-dropdown glass" role="menu">
                        <button
                            onclick={() => selectBackground(0)}
                            class:active={background.type === 0}
                            role="menuitemradio"
                            aria-checked={background.type === 0}
                        >
                            <CircleOff size={16} /> <span>Off</span>
                        </button>
                        <button
                            onclick={() => selectBackground(1)}
                            class:active={background.type === 1}
                            role="menuitemradio"
                            aria-checked={background.type === 1}
                        >
                            <Sparkles size={16} /> <span>Particles</span>
                        </button>
                        <button
                            onclick={() => selectBackground(2)}
                            class:active={background.type === 2}
                            role="menuitemradio"
                            aria-checked={background.type === 2}
                        >
                            <Waves size={16} /> <span>Waves</span>
                        </button>
                        <button
                            onclick={() => selectBackground(3)}
                            class:active={background.type === 3}
                            role="menuitemradio"
                            aria-checked={background.type === 3}
                        >
                            <Shapes size={16} /> <span>Shapes</span>
                        </button>
                    </div>
                {/if}
            </div>

            <!-- Language Switcher -->
            <div class="toggle-group glass" data-testid="lang-switcher" role="group" aria-label="Language selection">
                <button
                    onclick={() => setLanguage("en")}
                    class:active={language.current === "en"}
                    title="English"
                    aria-label="Switch to English"
                    aria-pressed={language.current === "en"}
                    data-testid="lang-en"
                >
                    <FlagEN width="20" height="15" class="flag-icon" />
                </button>
                <div class="divider" role="separator"></div>
                <button
                    onclick={() => setLanguage("uk")}
                    class:active={language.current === "uk"}
                    title="Українська"
                    aria-label="Switch to Ukrainian"
                    aria-pressed={language.current === "uk"}
                    data-testid="lang-uk"
                >
                    <FlagUK width="20" height="15" class="flag-icon" />
                </button>
            </div>

            <!-- Theme Toggle -->
            <div class="toggle-group glass" data-testid="theme-switcher" role="group" aria-label="Theme selection">
                <button
                    onclick={() => theme.current !== "light" && theme.toggle()}
                    class:active={theme.current === "light"}
                    title="Light Theme"
                    aria-label="Enable light theme"
                    aria-pressed={theme.current === "light"}
                    data-testid="theme-light"
                >
                    <Sun size={18} />
                </button>
                <div class="divider" role="separator"></div>
                <button
                    onclick={() => theme.current !== "dark" && theme.toggle()}
                    class:active={theme.current === "dark"}
                    title="Dark Theme"
                    aria-label="Enable dark theme"
                    aria-pressed={theme.current === "dark"}
                    data-testid="theme-dark"
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
        background: rgba(var(--accent-primary-rgb), 0.3);
        color: var(--accent-primary);
        opacity: 1;
        box-shadow: none;
    }

    :global(.flag-icon) {
        border-radius: 2px;
        overflow: hidden;
    }

    :global(.flag-icon svg) {
        border-radius: 2px;
    }

    .divider {
        width: 1px;
        background: var(--border-color);
        height: 18px;
        margin: 0 2px;
    }

    .mobile-only {
        display: none;
    }

    .desktop-only {
        display: flex;
    }

    .glass-icon-btn {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--accent-primary);
        cursor: pointer;
        backdrop-filter: var(--glass-blur);
        transition: var(--transition);
    }

    .bg-dropdown {
        position: absolute;
        top: 60px;
        right: 0;
        background: rgba(0, 0, 0, 0.9);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 140px;
        backdrop-filter: var(--glass-blur);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 1001;
    }

    .mobile-bg-switcher {
        position: relative;
    }

    .bg-dropdown button {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 12px;
        background: transparent;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        border-radius: 8px;
        width: 100%;
        text-align: left;
        transition: var(--transition);
    }

    .bg-dropdown button:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .bg-dropdown button.active {
        background: rgba(var(--accent-primary-rgb), 0.2);
        color: var(--accent-primary);
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

        .desktop-only {
            display: none;
        }

        .mobile-only {
            display: block;
        }

        .controls {
            gap: 10px;
            width: 100%;
        }

        .mobile-bg-switcher {
            margin-right: auto;
        }

        .bg-dropdown {
            left: 0;
            right: auto;
        }
    }
</style>
