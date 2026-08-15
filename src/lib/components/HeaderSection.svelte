<script lang="ts">
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
    import { LANGUAGE_META, LANGUAGE_GROUP_ORDER, LANGUAGE_GROUP_LABELS, languageBadge } from "$lib/i18n/languageMeta";
    import { onMount, onDestroy } from "svelte";
    /**
     * All five controllers are imported directly, the way `langMenu` already
     * was. The other four used to come through `getContext<any>("theme")` and
     * friends — a string key and a disabled type check on every one of them,
     * each with its own `eslint-disable` for the `any` the project's own
     * config calls an error.
     *
     * The note that used to sit above `langMenu` said the direct import "keeps
     * its types", which was exactly right and exactly the argument against the
     * other four: `getContext<T>` compiles with any `T` you write, because
     * TypeScript believes the annotation rather than the value. `any` dropped
     * even that pretence — renaming `background.type` would have gone
     * unnoticed here until the panel stopped working in a browser.
     *
     * These are module-level singletons, so context was handing this component
     * the same object the import gives it; nothing changes at runtime.
     * SVELTE-CORE-v8 § 3.3 — and `src/context-conventions.test.ts` now keeps a
     * string-keyed context from coming back.
     */
    import { langMenu, theme, background } from "$lib/controllers/UiState.svelte";
    import { language } from "$lib/controllers/I18nState.svelte";
    import { sound } from "$lib/controllers/SoundState.svelte";

    let isBgDropdownOpen = $state(false);
    let langQuery = $state("");

    // Covers the L shortcut as well as the trigger button: however the panel
    // came open, it opens on an empty query rather than last time's leftovers.
    $effect(() => {
        if (langMenu.isOpen) {
            langQuery = "";
            isBgDropdownOpen = false;
        }
    });

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
        if (isBgDropdownOpen) langMenu.close();
    }

    function toggleLangDropdown() {
        langMenu.toggle();
    }

    function selectBackground(type: 0 | 1 | 2 | 3) {
        background.set(type);
        isBgDropdownOpen = false;
    }

    function selectLanguage(lang: Language) {
        language.set(lang);
        langMenu.close();
    }

    let langPanel: HTMLDivElement | undefined = $state();

    /** Within this many pixels of each other, two options are in the same column. */
    const COLUMN_TOLERANCE = 20;

    /** Left edges of the rendered columns, ordered left to right. */
    function columnEdges(options: HTMLButtonElement[]): number[] {
        const edges: number[] = [];
        for (const option of options) {
            const { left } = option.getBoundingClientRect();
            if (!edges.some((edge) => Math.abs(edge - left) < COLUMN_TOLERANCE)) edges.push(left);
        }
        return edges.sort((a, b) => a - b);
    }

    /**
     * The option one column over, at the nearest height to the current one.
     *
     * CSS multi-column layout puts nothing about columns in the DOM — the groups
     * are one flat list that the browser flows into however many columns fit — so
     * sideways movement has to be read off the geometry. Stepping the list index
     * instead, as this first did, just repeats what Down and Up already do.
     *
     * @returns null at the outermost column: clamped rather than wrapped, since
     * jumping the full width of the panel is disorienting in a way that Down
     * rolling over to the top is not.
     */
    function columnNeighbour(
        options: HTMLButtonElement[],
        current: HTMLButtonElement,
        direction: 1 | -1
    ): HTMLButtonElement | null {
        const edges = columnEdges(options);
        const columnOf = (el: HTMLButtonElement) =>
            edges.findIndex((edge) => Math.abs(edge - el.getBoundingClientRect().left) < COLUMN_TOLERANCE);

        const wanted = columnOf(current) + direction;
        if (wanted < 0 || wanted >= edges.length) return null;

        const rect = current.getBoundingClientRect();
        const middle = rect.top + rect.height / 2;

        let best: HTMLButtonElement | null = null;
        let bestGap = Infinity;
        for (const option of options) {
            if (columnOf(option) !== wanted) continue;
            const r = option.getBoundingClientRect();
            const gap = Math.abs(r.top + r.height / 2 - middle);
            if (gap < bestGap) {
                bestGap = gap;
                best = option;
            }
        }
        return best;
    }

    /**
     * Arrow keys move focus between the options, so Enter and Space keep working
     * as the browser's own activation rather than needing a second code path.
     *
     * Down and Up run the flat list and roll over at its ends. Right and Left
     * move a column at a time, keeping the vertical position.
     */
    function handleLangKeydown(event: KeyboardEvent) {
        const vertical = event.key === "ArrowDown" ? 1 : event.key === "ArrowUp" ? -1 : 0;
        const sideways = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
        const jump = event.key === "Home" ? "first" : event.key === "End" ? "last" : null;
        if (!vertical && !sideways && !jump) return;
        if (!langPanel) return;

        const focused = document.activeElement as HTMLElement | null;
        // Left and Right belong to the caret while the search box has focus.
        // Down and Up are taken from it deliberately: that is how a visitor gets
        // out of the field and into the list.
        if (sideways && focused?.classList.contains("lang-search")) return;

        const options = [...langPanel.querySelectorAll<HTMLButtonElement>('button[role="menuitemradio"]')];
        if (!options.length) return;

        const from = options.indexOf(focused as HTMLButtonElement);
        let target: HTMLButtonElement | null;

        if (jump) {
            target = jump === "first" ? options[0] : options[options.length - 1];
        } else if (vertical) {
            // From the search box, Down opens at the top of the list and Up at
            // the bottom, so both have somewhere to go on the first press.
            target = from === -1
                ? (vertical === 1 ? options[0] : options[options.length - 1])
                : options[(from + vertical + options.length) % options.length];
        } else {
            target = from === -1 ? options[0] : columnNeighbour(options, options[from], sideways as 1 | -1);
        }

        // Claimed even when there is nowhere to go, so the outermost column does
        // not hand the key back and scroll the page behind the panel.
        event.preventDefault();
        event.stopPropagation();
        if (!target) return;

        target.focus();
        // The clip for moving a selection, as against committing to one — Enter
        // fires the click, and the click handler plays "selected" itself.
        sound.play("hover");
    }

    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (isBgDropdownOpen && !target.closest(".mobile-bg-switcher")) {
            isBgDropdownOpen = false;
        }
        if (langMenu.isOpen && !target.closest(".lang-switcher-wrapper")) {
            langMenu.close();
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
            <!-- Background Control Wrapper (Desktop) -->
            <div class="bg-control-wrapper desktop-only">
                <div
                    class="toggle-group glass"
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

                {#if background.type !== 0}
                    <div class="bg-slider-container">
                        <div class="bg-slider-panel glass">
                            {#if background.type === 1}
                                <div class="bg-slider-info">
                                    <span class="bg-slider-label">Particles</span>
                                    <span class="bg-slider-value">{background.particlesCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min="8"
                                    max="1024"
                                    step="8"
                                    value={background.particlesCount}
                                    oninput={(e) => background.setParticlesCount(e.currentTarget.valueAsNumber)}
                                    class="volume-slider"
                                    aria-label="Particle Count"
                                />
                            {:else if background.type === 2}
                                <div class="bg-slider-info">
                                    <span class="bg-slider-label">Waves</span>
                                    <span class="bg-slider-value">{background.wavesCount}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="8"
                                    step="1"
                                    value={background.wavesCount}
                                    oninput={(e) => background.setWavesCount(e.currentTarget.valueAsNumber)}
                                    class="volume-slider"
                                    aria-label="Wave Layers"
                                />
                            {:else if background.type === 3}
                                <div class="bg-slider-info">
                                    <span class="bg-slider-label">Line Width</span>
                                    <span class="bg-slider-value">{background.shapesLineWidth}px</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="512"
                                    step="1"
                                    value={background.shapesLineWidth}
                                    oninput={(e) => background.setShapesLineWidth(e.currentTarget.valueAsNumber)}
                                    class="volume-slider"
                                    aria-label="Line Width"
                                />
                            {/if}
                        </div>
                    </div>
                {/if}
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

                        {#if background.type !== 0}
                            <div class="dropdown-divider"></div>
                            <div class="mobile-bg-slider">
                                {#if background.type === 1}
                                    <div class="bg-slider-info">
                                        <span class="bg-slider-label">Particles</span>
                                        <span class="bg-slider-value">{background.particlesCount}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="8"
                                        max="1024"
                                        step="8"
                                        value={background.particlesCount}
                                        oninput={(e) => background.setParticlesCount(e.currentTarget.valueAsNumber)}
                                        class="volume-slider"
                                    />
                                {:else if background.type === 2}
                                    <div class="bg-slider-info">
                                        <span class="bg-slider-label">Waves</span>
                                        <span class="bg-slider-value">{background.wavesCount}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="8"
                                        step="1"
                                        value={background.wavesCount}
                                        oninput={(e) => background.setWavesCount(e.currentTarget.valueAsNumber)}
                                        class="volume-slider"
                                    />
                                {:else if background.type === 3}
                                    <div class="bg-slider-info">
                                        <span class="bg-slider-label">Line Width</span>
                                        <span class="bg-slider-value">{background.shapesLineWidth}px</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="512"
                                        step="1"
                                        value={background.shapesLineWidth}
                                        oninput={(e) => background.setShapesLineWidth(e.currentTarget.valueAsNumber)}
                                        class="volume-slider"
                                    />
                                {/if}
                            </div>
                        {/if}
                    </div>
                {/if}
            </div>

            <!-- Sound control, ported from the sea page's audio control: the
                 slider is revealed by hovering the wrapper, and a wheel over it
                 nudges the level. preventDefault stops that wheel from also
                 scrolling the page underneath. -->
            <div
                class="sound-control-wrapper"
                data-testid="sound-container"
                onwheel={(e) => {
                    e.preventDefault();
                    sound.adjustVolumeByWheel(e.deltaY);
                }}
                role="presentation"
            >
                <!-- data-sfx-ignore so switching sounds off is itself silent: the
                     delegated click handler runs in the capture phase, ahead of
                     this button's own handler, and would otherwise fire the click
                     sound on the way out. -->
                <button
                    class="glass-icon-btn sound-toggle"
                    onclick={() => sound.toggle()}
                    data-sfx-ignore
                    title={t.common.sound}
                    aria-label={t.common.sound}
                    aria-pressed={sound.enabled}
                    data-testid="sound-toggle-btn"
                >
                    {#if sound.enabled && sound.volume > 0}
                        <Volume2 size={18} />
                    {:else}
                        <VolumeX size={18} />
                    {/if}
                </button>
                <!-- Two levels, same as the sea page's language panel: the outer
                     div carries the position and a transparent top padding that
                     bridges the gap under the button, the inner one is the glass
                     surface. One element cannot do both — a background on the
                     bridge would paint over the header's edge. -->
                <div class="volume-slider-container">
                    <div class="volume-panel glass">
                        <!-- Labelled by the button's own word rather than a second
                             translated string: role="slider" plus the percentage
                             in aria-valuetext already says this sets a level. -->
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={sound.volume}
                            oninput={(e) => sound.setVolume(e.currentTarget.valueAsNumber)}
                            class="volume-slider"
                            aria-label={t.common.sound}
                            aria-valuetext="{Math.round(sound.volume * 100)}%"
                            data-testid="sound-volume-slider"
                        />
                    </div>
                </div>
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
                    aria-expanded={langMenu.isOpen}
                    data-testid="lang-trigger-btn"
                >
                    <ActiveFlag width="20" height="15" class="flag-icon" />
                    <span class="lang-code">{languageBadge(language.current)}</span>
                </button>

                {#if langMenu.isOpen}
                    <!-- Arrow keys are handled on the panel rather than the
                         options, so they work from the search box too — it takes
                         focus as the panel opens, which is where every keyboard
                         visitor starts. -->
                    <div
                        class="lang-dropdown glass"
                        role="menu"
                        tabindex="-1"
                        bind:this={langPanel}
                        onkeydown={handleLangKeydown}
                    >
                        <!-- Обґрунтування: правило застерігає від фокуса, який
                             забирають у відвідувача без його дії — на
                             завантаженні сторінки. Тут навпаки: панель існує
                             лише після явного кліку по перемикачу, і поле
                             пошуку — те, заради чого її відкривають. Фокус
                             усередину щойно відкритої панелі вимагає сама
                             ACCESSIBILITY-v8 § 3; без autofocus він лишився б
                             на тригері позаду. -->
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

    /* These sit at opacity 0.5 until selected, which left them with no hover
       state at all — the group border was the only thing that reacted. */
    .toggle-group button:not(.active):hover {
        background: rgba(var(--accent-primary-rgb), 0.12);
        color: var(--accent-primary);
        opacity: 1;
    }

    :global(.flag-icon) {
        border-radius: 2px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.35), 0 0 1px rgba(0, 0, 0, 0.2);
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

    .glass-icon-btn:hover {
        background: rgba(var(--accent-primary-rgb), 0.12);
        border-color: var(--accent-primary);
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

    .sound-toggle[aria-pressed="false"]:hover {
        color: var(--accent-primary);
        opacity: 1;
    }

    .bg-control-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .bg-slider-container {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        padding-top: 12px;
        opacity: 0;
        visibility: hidden;
        transition:
            opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
            visibility 0.3s;
        z-index: 1001;
    }

    .bg-control-wrapper:hover .bg-slider-container,
    .bg-control-wrapper:focus-within .bg-slider-container {
        opacity: 1;
        visibility: visible;
    }

    .bg-slider-panel {
        display: flex;
        flex-direction: column;
        gap: 6px;
        width: 140px;
        padding: 10px 12px;
        border-radius: 12px;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        backdrop-filter: var(--glass-blur);
        box-shadow: var(--panel-shadow);
    }

    .bg-slider-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.72rem;
        color: var(--text-secondary);
        font-weight: 600;
    }

    .bg-slider-value {
        color: var(--accent-primary);
        font-weight: 700;
    }

    .dropdown-divider {
        height: 1px;
        background: var(--border-color);
        margin: 4px 0;
    }

    .mobile-bg-slider {
        padding: 4px 8px;
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .sound-control-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .volume-slider-container {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        /* Transparent bridge: the panel hangs below the button, and without this
           the pointer leaves the wrapper on the way down and it vanishes. */
        padding-top: 12px;
        opacity: 0;
        visibility: hidden;
        transition:
            opacity 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
            visibility 0.3s;
        z-index: 1001;
    }

    /* focus-within on the wrapper rather than the panel: it means tabbing to the
       button, or tapping it on a touch screen, also brings the slider up. Behind
       hover alone it would be unreachable without a mouse. */
    .sound-control-wrapper:hover .volume-slider-container,
    .sound-control-wrapper:focus-within .volume-slider-container {
        opacity: 1;
        visibility: visible;
    }

    .volume-panel {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 110px;
        padding: 12px 12px;
        border-radius: 12px;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        backdrop-filter: var(--glass-blur);
        box-shadow: var(--panel-shadow);
    }

    .volume-slider {
        -webkit-appearance: none;
        appearance: none;
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background: var(--border-color);
        outline: none;
        cursor: pointer;
    }

    .volume-slider:focus-visible {
        outline: 2px solid var(--accent-primary);
        outline-offset: 6px;
    }

    .volume-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--accent-primary);
        cursor: pointer;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        transition: transform 0.2s;
    }

    .volume-slider::-webkit-slider-thumb:hover {
        transform: scale(1.2);
    }

    .volume-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border: none;
        border-radius: 50%;
        background: var(--accent-primary);
        cursor: pointer;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
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
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 140px;
        backdrop-filter: var(--glass-blur);
        box-shadow: var(--panel-shadow);
        z-index: 1001;
    }

    .lang-dropdown {
        width: min(92vw, 820px);
        max-height: 78vh;
    }

    .lang-search {
        flex-shrink: 0;
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 8px 10px;
        color: var(--text-primary);
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
        /* No extra opacity on top: against the light panel that took a 3.6:1
           label down to roughly 2:1. */
        color: var(--text-secondary);
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
        /* Primary, not secondary: these are the panel's actionable content, and
           on the light panel --text-secondary lands at 3.6:1. It read as passable
           only while the panel was hardcoded near-black. */
        color: var(--text-primary);
        cursor: pointer;
        border-radius: 8px;
        width: 100%;
        text-align: left;
        transition: var(--transition);
    }

    .bg-dropdown button:hover,
    .lang-dropdown button:hover {
        background: var(--surface-hover);
    }

    /* Arrow keys move focus, so this ring is what the visitor is steering — a
       hover style alone would leave them navigating blind.
       Plain :focus rather than :focus-visible: the move is programmatic, and
       Chrome only grants :focus-visible to a programmatic focus when it decides
       the last interaction was keyboard. These buttons can only take focus while
       the panel is open, and clicking one closes it, so there is no case where a
       mouse user is left looking at a stray ring. */
    .bg-dropdown button:focus,
    .lang-dropdown button:focus {
        background: var(--surface-hover);
        color: var(--text-primary);
        outline: 2px solid var(--accent-primary);
        outline-offset: -2px;
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
