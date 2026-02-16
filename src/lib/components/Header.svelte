<script lang="ts">
    import { language, type Language } from "$lib/i18n";
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

    let { 
        theme, 
        toggleTheme, 
        backgroundType = 1, 
        setBackgroundType = () => {} 
    } = $props<{
        theme: string;
        toggleTheme: () => void;
        backgroundType: 0 | 1 | 2 | 3;
        setBackgroundType: (type: 0 | 1 | 2 | 3) => void;
    }>();

    let isBgDropdownOpen = $state(false);

    function setLanguage(lang: Language) {
        language.set(lang);
    }

    function toggleBgDropdown() {
        isBgDropdownOpen = !isBgDropdownOpen;
    }

    function selectBackground(type: 0 | 1 | 2 | 3) {
        setBackgroundType(type);
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
    let ActiveBgIcon = $derived([CircleOff, Sparkles, Waves, Shapes][backgroundType]);
</script>

<header class="header glass">
    <div class="header-content">
        <div class="controls">
            <!-- Background Switcher (Desktop) -->
            <div
                class="toggle-group glass desktop-only"
                data-testid="bg-switcher"
            >
                <button
                    onclick={() => setBackgroundType(0)}
                    class:active={backgroundType === 0}
                    title="Off"
                    data-testid="bg-off"
                >
                    <CircleOff size={18} />
                </button>
                <div class="divider"></div>
                <button
                    onclick={() => setBackgroundType(1)}
                    class:active={backgroundType === 1}
                    title="Particles"
                    data-testid="bg-particles"
                >
                    <Sparkles size={18} />
                </button>
                <div class="divider"></div>
                <button
                    onclick={() => setBackgroundType(2)}
                    class:active={backgroundType === 2}
                    title="Waves"
                    data-testid="bg-waves"
                >
                    <Waves size={18} />
                </button>
                <div class="divider"></div>
                <button
                    onclick={() => setBackgroundType(3)}
                    class:active={backgroundType === 3}
                    title="Shapes"
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
                >
                    <ActiveBgIcon size={20} />
                </button>

                {#if isBgDropdownOpen}
                    <div class="bg-dropdown glass">
                        <button
                            onclick={() => selectBackground(0)}
                            class:active={backgroundType === 0}
                        >
                            <CircleOff size={16} /> <span>Off</span>
                        </button>
                        <button
                            onclick={() => selectBackground(1)}
                            class:active={backgroundType === 1}
                        >
                            <Sparkles size={16} /> <span>Particles</span>
                        </button>
                        <button
                            onclick={() => selectBackground(2)}
                            class:active={backgroundType === 2}
                        >
                            <Waves size={16} /> <span>Waves</span>
                        </button>
                        <button
                            onclick={() => selectBackground(3)}
                            class:active={backgroundType === 3}
                        >
                            <Shapes size={16} /> <span>Shapes</span>
                        </button>
                    </div>
                {/if}
            </div>

            <!-- Language Switcher -->
            <div class="toggle-group glass" data-testid="lang-switcher">
                <button
                    onclick={() => setLanguage("en")}
                    class:active={language.current === "en"}
                    title="English"
                    data-testid="lang-en"
                >
                    <FlagEN width="20" height="15" class="flag-icon" />
                </button>
                <div class="divider"></div>
                <button
                    onclick={() => setLanguage("uk")}
                    class:active={language.current === "uk"}
                    title="Українська"
                    data-testid="lang-uk"
                >
                    <FlagUK width="20" height="15" class="flag-icon" />
                </button>
            </div>

            <!-- Theme Toggle (Now with same style as Language Switcher) -->
            <div class="toggle-group glass" data-testid="theme-switcher">
                <button
                    onclick={() => theme !== "light" && toggleTheme()}
                    class:active={theme === "light"}
                    title="Light Theme"
                    data-testid="theme-light"
                >
                    <Sun size={18} />
                </button>
                <div class="divider"></div>
                <button
                    onclick={() => theme !== "dark" && toggleTheme()}
                    class:active={theme === "dark"}
                    title="Dark Theme"
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
