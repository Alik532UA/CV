<script lang="ts">
    import { language, type Language } from "$lib/i18n";
    import {
        Sun,
        Moon,
        Sparkles,
        Waves,
        CircleOff,
        Shapes,
        MoreHorizontal, // Using MoreHorizontal for the dropdown trigger
    } from "lucide-svelte";
    import FlagUK from "$lib/components/flags/FlagUK.svelte";
    import FlagEN from "$lib/components/flags/FlagEN.svelte";
    import { onMount, onDestroy } from "svelte";

    export let theme: string;
    export let toggleTheme: () => void;
    export let backgroundType: 0 | 1 | 2 | 3 = 1;
    export let setBackgroundType: (type: 0 | 1 | 2 | 3) => void = () => {};
    export let changeLanguage: (lang: Language) => void;

    let isBgDropdownOpen = false;

    function setLanguage(lang: Language) {
        changeLanguage(lang);
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
    $: ActiveBgIcon = [CircleOff, Sparkles, Waves, Shapes][backgroundType];
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
                    on:click={() => setBackgroundType(0)}
                    class:active={backgroundType === 0}
                    title="Off"
                    data-testid="bg-off"
                >
                    <CircleOff size={18} />
                </button>
                <div class="divider"></div>
                <button
                    on:click={() => setBackgroundType(1)}
                    class:active={backgroundType === 1}
                    title="Particles"
                    data-testid="bg-particles"
                >
                    <Sparkles size={18} />
                </button>
                <div class="divider"></div>
                <button
                    on:click={() => setBackgroundType(2)}
                    class:active={backgroundType === 2}
                    title="Waves"
                    data-testid="bg-waves"
                >
                    <Waves size={18} />
                </button>
                <div class="divider"></div>
                <button
                    on:click={() => setBackgroundType(3)}
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
                    on:click|stopPropagation={toggleBgDropdown}
                >
                    <svelte:component this={ActiveBgIcon} size={20} />
                </button>

                {#if isBgDropdownOpen}
                    <div class="bg-dropdown glass">
                        <button
                            on:click={() => selectBackground(0)}
                            class:active={backgroundType === 0}
                        >
                            <CircleOff size={16} /> <span>Off</span>
                        </button>
                        <button
                            on:click={() => selectBackground(1)}
                            class:active={backgroundType === 1}
                        >
                            <Sparkles size={16} /> <span>Particles</span>
                        </button>
                        <button
                            on:click={() => selectBackground(2)}
                            class:active={backgroundType === 2}
                        >
                            <Waves size={16} /> <span>Waves</span>
                        </button>
                        <button
                            on:click={() => selectBackground(3)}
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
                    on:click={() => setLanguage("en")}
                    class:active={$language === "en"}
                    title="English"
                    data-testid="lang-en"
                >
                    <FlagEN width="20" height="15" class="flag-icon" />
                </button>
                <div class="divider"></div>
                <button
                    on:click={() => setLanguage("uk")}
                    class:active={$language === "uk"}
                    title="Українська"
                    data-testid="lang-uk"
                >
                    <FlagUK width="20" height="15" class="flag-icon" />
                </button>
            </div>

            <!-- Theme Toggle (Now with same style as Language Switcher) -->
            <div class="toggle-group glass" data-testid="theme-switcher">
                <button
                    on:click={() => theme !== "light" && toggleTheme()}
                    class:active={theme === "light"}
                    title="Light Theme"
                    data-testid="theme-light"
                >
                    <Sun size={18} />
                </button>
                <div class="divider"></div>
                <button
                    on:click={() => theme !== "dark" && toggleTheme()}
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

    /* Також цільово для SVG всередині для надійності скруглення */
    :global(.flag-icon svg) {
        border-radius: 2px;
    }

    .divider {
        width: 1px;
        background: var(--border-color);
        height: 18px;
        margin: 0 2px;
    }

    /* Mobile handling */
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
        color: var(
            --accent-primary
        ); /* Always colored as it shows active state */
        cursor: pointer;
        backdrop-filter: var(--glass-blur);
        transition: var(--transition);
    }

    .bg-dropdown {
        position: absolute;
        top: 60px; /* Below header */
        right: 0; /* Align right relative to container if relative, but likely needs fixed/absolute adjustments based on layout */
        /* Since .controls is flex, relative pos would be better on .mobile-bg-switcher */
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

        /* Adjust controls spacing for mobile */
        .controls {
            gap: 10px;
            width: 100%; /* Take full width to allow spacing */
        }

        .mobile-bg-switcher {
            margin-right: auto; /* Push other items to right */
        }

        .bg-dropdown {
            left: 0;
            right: auto;
        }
    }
</style>
