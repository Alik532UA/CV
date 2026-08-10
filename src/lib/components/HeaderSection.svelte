<script lang="ts">
    import { getContext } from "svelte";
    import { t, type Language } from "$lib/controllers/I18nState.svelte";
    import {
        Sun,
        Moon,
        Sparkles,
        Waves,
        CircleOff,
        Shapes,
        Volume2,
        VolumeX,
    } from "lucide-svelte";
    import FlagEN from "$lib/components/flags/FlagEN.svelte";
    import { LANGUAGE_META, LANGUAGE_GROUP_ORDER, LANGUAGE_GROUP_LABELS } from "$lib/i18n/languageMeta";
    import { onMount, onDestroy } from "svelte";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const language = getContext<any>("language");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const theme = getContext<any>("theme");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const background = getContext<any>("background");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sound = getContext<any>("sound");

    let isBgDropdownOpen = $state(false);
    let isLangDropdownOpen = $state(false);
    let langQuery = $state("");

    const filteredLanguageMeta = $derived(
        LANGUAGE_META.filter((l) => {
            const q = langQuery.trim().toLowerCase();
            if (!q) return true;
            return l.label.toLowerCase().includes(q) || l.code.includes(q);
        })
    );

    // Groups render in a fixed order and only when they have a match, so the
    // list stays tidy however many languages end up sharing a group.
    const visibleGroups = $derived(
        LANGUAGE_GROUP_ORDER.map((group) => ({
            group,
            items: filteredLanguageMeta.filter((l) => l.group === group)
        })).filter((g) => g.items.length > 0)
    );

    function toggleBgDropdown() {
        isBgDropdownOpen = !isBgDropdownOpen;
        if (isBgDropdownOpen) isLangDropdownOpen = false;
    }

    function toggleLangDropdown() {
        isLangDropdownOpen = !isLangDropdownOpen;
        if (isLangDropdownOpen) {
            isBgDropdownOpen = false;
            langQuery = "";
        }
    }

    function selectBackground(type: 0 | 1 | 2 | 3) {
        background.set(type);
        isBgDropdownOpen = false;
    }

    function selectLanguage(lang: Language) {
        language.set(lang);
        isLangDropdownOpen = false;
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (isBgDropdownOpen && !target.closest(".mobile-bg-switcher")) {
            isBgDropdownOpen = false;
        }
        if (isLangDropdownOpen && !target.closest(".lang-switcher-wrapper")) {
            isLangDropdownOpen = false;
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

    // Helper to get the flag shown on the collapsed language trigger button
    let ActiveFlag = $derived(
        LANGUAGE_META.find((l) => l.code === language.current)?.flag ?? FlagEN
    );
</script>

<header class="header glass">
    <div class="header-content">
        <div class="controls">
            <!-- Background Switcher (Desktop) -->
            <div
                class="toggle-group glass desktop-only"
                data-testid="bg-toggle-toolbar"
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
                    data-testid="bg-off-btn"
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
                    data-testid="bg-particles-btn"
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
                    data-testid="bg-waves-btn"
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
                    data-testid="bg-shapes-btn"
                >
                    <Shapes size={18} />
                </button>
            </div>

            <!-- Background Switcher (Mobile) -->
            <div
                class="mobile-bg-switcher mobile-only"
                data-testid="bg-toggle-mobile-toolbar"
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

            <!-- Language Switcher: one trigger for every viewport, since an
                 inline row (the old desktop layout) stops scaling well past a
                 handful of languages. The panel adds a search box and groups
                 once the list grows; with 4 languages it is sparse but the
                 structure is what needs to hold up as more are added. -->
            <div
                class="lang-switcher-wrapper"
                data-testid="lang-select"
            >
                <button
                    class="glass-icon-btn lang-trigger"
                    onclick={(e) => { e.stopPropagation(); toggleLangDropdown(); }}
                    aria-label="Select language"
                    aria-haspopup="true"
                    aria-expanded={isLangDropdownOpen}
                >
                    <ActiveFlag width="20" height="15" class="flag-icon" />
                    <span class="lang-code">{language.current.toUpperCase()}</span>
                </button>

                {#if isLangDropdownOpen}
                    <div class="lang-dropdown glass" role="menu">
                        <!-- svelte-ignore a11y_autofocus -->
                        <input
                            type="text"
                            class="lang-search"
                            placeholder="Search language..."
                            bind:value={langQuery}
                            onclick={(e) => e.stopPropagation()}
                            autofocus
                        />
                        <div class="lang-groups">
                            <div class="lang-columns">
                                {#each visibleGroups as { group, items } (group)}
                                    <div class="lang-group">
                                        <span class="lang-group-label">{LANGUAGE_GROUP_LABELS[group]}</span>
                                        {#each items as { code, label, flag: Flag } (code)}
                                            <button
                                                onclick={() => selectLanguage(code)}
                                                class:active={language.current === code}
                                                role="menuitemradio"
                                                aria-checked={language.current === code}
                                                data-testid="lang-{code}-btn"
                                                title={label.endsWith("*") ? "Machine-translated draft — pending native speaker review" : undefined}
                                            >
                                                <Flag width="20" height="15" class="flag-icon" />
                                                <span>{label}</span>
                                            </button>
                                        {/each}
                                    </div>
                                {:else}
                                    <p class="lang-empty">No languages found</p>
                                {/each}
                            </div>
                        </div>
                    </div>
                {/if}
            </div>

            <!-- Theme Toggle -->
            <div class="toggle-group glass" data-testid="theme-toggle-toolbar" role="group" aria-label="Theme selection">
                <button
                    onclick={() => theme.current !== "light" && theme.toggle()}
                    class:active={theme.current === "light"}
                    title="Light Theme"
                    aria-label="Enable light theme"
                    aria-pressed={theme.current === "light"}
                    data-testid="theme-light-btn"
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
                    data-testid="theme-dark-btn"
                >
                    <Moon size={18} />
                </button>
            </div>

            <!-- Sound Toggle: data-sfx-ignore so switching sounds off is itself
                 silent — the delegated click handler runs in the capture phase,
                 ahead of this button's own handler, and would otherwise fire the
                 click sound on the way out. -->
            <button
                class="glass-icon-btn sound-toggle"
                onclick={() => sound.toggle()}
                data-sfx-ignore
                title={t.common.sound}
                aria-label={t.common.sound}
                aria-pressed={sound.enabled}
                data-testid="sound-toggle-btn"
            >
                {#if sound.enabled}
                    <Volume2 size={18} />
                {:else}
                    <VolumeX size={18} />
                {/if}
            </button>
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

    .lang-trigger {
        width: auto;
        padding: 0 10px;
        gap: 6px;
    }

    /* Matches the dimmed look the theme and background groups use for the
       option that is not currently active. */
    .sound-toggle[aria-pressed="false"] {
        color: var(--text-secondary);
        opacity: 0.5;
    }

    .lang-code {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.02em;
    }

    .bg-dropdown,
    .lang-dropdown {
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

    .lang-dropdown {
        width: min(92vw, 820px);
        max-height: 78vh;
    }

    .lang-search {
        flex-shrink: 0;
        background: rgba(255, 255, 255, 0.06);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 10px;
        color: var(--text-primary, #fff);
        font-size: 0.85rem;
    }

    .lang-search:focus {
        outline: none;
        border-color: var(--accent-primary);
    }

    /* Scroll container only — the multi-column element inside must keep an
       auto height, or CSS multicol spills sideways instead of scrolling. */
    .lang-groups {
        overflow-y: auto;
    }

    /* Newspaper-style columns rather than one full-width grid row per group:
       with 12 groups of wildly different sizes, a per-group grid left the
       one-language groups (Uralic, Caucasus, Semitic) reserving a whole row
       and wasting most of it. Here each group is a compact vertical stack
       that packs in underneath the previous one. */
    .lang-columns {
        columns: 150px;
        column-gap: 14px;
    }

    .lang-group {
        /* Keep a group's heading welded to its languages across a column break. */
        break-inside: avoid;
        display: flex;
        flex-direction: column;
        padding-bottom: 10px;
    }

    .lang-group-label {
        padding: 4px 12px 2px;
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
        opacity: 0.6;
    }

    .lang-empty {
        padding: 10px 12px;
        font-size: 0.85rem;
        color: var(--text-secondary);
        text-align: center;
    }

    .mobile-bg-switcher,
    .lang-switcher-wrapper {
        position: relative;
    }

    .bg-dropdown button,
    .lang-dropdown button {
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

    .bg-dropdown button:hover,
    .lang-dropdown button:hover {
        background: rgba(255, 255, 255, 0.05);
    }

    .bg-dropdown button.active,
    .lang-dropdown button.active {
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

        /* Pin the panel to the viewport instead of the trigger. The language
           button is not the rightmost control — the theme toggle sits after it,
           about 94px wide — so a panel this wide anchored to the button's right
           edge is pushed off the left side of the screen. Same fix as the sea
           page switcher in DigitalWorkshop. */
        .lang-dropdown {
            position: fixed;
            top: 66px;
            left: 15px;
            right: 15px;
            width: auto;
            /* Clear the 60px header above and the 64px bottom nav below. */
            max-height: calc(100vh - 140px);
            max-height: calc(100dvh - 140px);
        }
    }
</style>
