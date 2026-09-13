<script lang="ts">
    import { browser } from "$app/environment";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { scrollbar, type ScrollbarMode } from "$lib/controllers/ScrollbarState.svelte";
    import { SCROLLBAR_MODES } from "$lib/config/scrollbarModes";

    /** Width and height are needed so the menu does not run off the screen. */
    const WIDTH = 210;
    const ITEM_HEIGHT = 34;
    const PADDING = 12;

    /**
     * Чекбокс доводки показується, лише поки малює НАША смуга.
     *
     * Умова на `active`, а не на `mode`, і різниця тут не косметична
     * (HOLD-SCROLL § 1.3): на сенсорному екрані й у вікні, вужчому за 1100 px
     * під мінімапу, `mode` лишається `custom`/`minimap`, а малює нативна смуга.
     * Написане на `mode` показало б перемикач там, де наводити нема на що.
     */
    const showHold = $derived(scrollbar.active !== "native");

    const height = $derived(
        SCROLLBAR_MODES.length * ITEM_HEIGHT + PADDING * 2 + 24 + (showHold ? ITEM_HEIGHT + 9 : 0)
    );

    /**
     * Opens next to the cursor, but wholly inside the window.
     *
     * The `browser` guard is not decoration: this project prerenders, and Svelte 5
     * evaluates the derived body while rendering on the server, where `window` does
     * not exist. Without it every page 500s — the menu never being open is no
     * protection, because the value is computed before that is checked.
     */
    const position = $derived.by(() => {
        const { x, y } = scrollbar.menu;
        return {
            // To the left of the cursor: the bar hugs the right edge, and a menu to
            // the right of it simply would not fit.
            left: Math.max(PADDING, x - WIDTH - 4),
            top: browser ? Math.min(Math.max(PADDING, y), window.innerHeight - height - PADDING) : y
        };
    });

    /** A strip this wide at the right edge catches the right button. */
    const EDGE_PX = 20;

    /**
     * The native bar is drawn by the browser and hands the page no events: a right
     * click over it gives the system menu, and that cannot be changed.
     *
     * A transparent element on top of it is worse than it sounds — it would cover
     * the bar itself, which could then be neither dragged nor clicked. So the event
     * is taken from the document and judged by coordinate instead. Nothing is
     * covered, and the working strip sits twenty pixels to the LEFT of the bar.
     */
    function onDocumentContextMenu(e: MouseEvent) {
        if (scrollbar.active !== "native") return;
        // clientWidth, not innerWidth: the first excludes the native bar, so the strip
        // does not depend on how thick the system draws it.
        const edge = document.documentElement.clientWidth;
        if (e.clientX < edge - EDGE_PX || e.clientX > edge) return;
        e.preventDefault();
        scrollbar.openMenu(e.clientX, e.clientY);
    }

    function choose(mode: ScrollbarMode) {
        scrollbar.set(mode);
        scrollbar.closeMenu();
    }
</script>

<svelte:window oncontextmenu={onDocumentContextMenu} />

{#if scrollbar.menu.open}
    <!-- The backdrop takes any press outside the menu and closes it. The right button
         closes it too, or the native menu would appear over ours. -->
    <div
        class="scrollbar-menu__backdrop"
        data-testid="scrollbar-menu-backdrop"
        role="presentation"
        onpointerdown={scrollbar.closeMenu}
        oncontextmenu={(e) => {
            e.preventDefault();
            scrollbar.closeMenu();
        }}
    ></div>

    <div
        class="scrollbar-menu"
        style="left: {position.left}px; top: {position.top}px; width: {WIDTH}px;"
        role="menu"
        tabindex="-1"
        data-testid="scrollbar-context-menu"
        onkeydown={(e) => {
            if (e.key === "Escape") scrollbar.closeMenu();
        }}
    >
        <span class="scrollbar-menu__title">{t.scrollbar.title}</span>
        {#each SCROLLBAR_MODES as mode (mode.id)}
            <!-- menuitemradio with aria-checked rather than plain menuitem: the
                 options are mutually exclusive, and a screen reader has to say which
                 one is chosen. -->
            <button
                type="button"
                class="scrollbar-menu__item"
                class:active={scrollbar.mode === mode.id}
                role="menuitemradio"
                aria-checked={scrollbar.mode === mode.id}
                onclick={() => choose(mode.id)}
                data-testid="scrollbar-menu-{mode.id}-btn"
            >
                {t.scrollbar[mode.label]}
            </button>
        {/each}

        {#if showHold}
            <span class="scrollbar-menu__separator" role="separator"></span>
            <!-- menuitemcheckbox, не menuitemradio: опція не належить до групи
                 режимів і вибору серед них не скидає.

                 Меню тут НЕ закривається, на відміну від вибору режиму. Вибір —
                 ухвалене рішення, і дивитися на нього нема чого; це перемикач,
                 і єдиний зворотний зв'язок про його стан — галочка в цьому ж
                 рядку. Меню, що закрилося раніше, ніж вона намалювалася, лишає
                 людину без відповіді на «то ввімкнулося чи ні». -->
            <button
                type="button"
                class="scrollbar-menu__item scrollbar-menu__item--check"
                role="menuitemcheckbox"
                aria-checked={scrollbar.holdScroll}
                onclick={() => scrollbar.setHoldScroll(!scrollbar.holdScroll)}
                data-testid="scrollbar-menu-hold-btn"
            >
                <span class="scrollbar-menu__mark" aria-hidden="true"
                    >{scrollbar.holdScroll ? "✓" : ""}</span
                >
                {t.scrollbar.hold}
            </button>
        {/if}
    </div>
{/if}

<style>
    /* Above the bar itself (1500) and above the header, but below the modal backdrop
       (2000) — the menu is never open at the same time as a modal. */
    .scrollbar-menu__backdrop {
        position: fixed;
        inset: 0;
        z-index: 1600;
    }

    .scrollbar-menu {
        position: fixed;
        z-index: 1601;
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 12px 8px;
        border-radius: 12px;
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        box-shadow: var(--panel-shadow);
        backdrop-filter: var(--glass-blur);
    }

    .scrollbar-menu__title {
        padding: 2px 10px 8px;
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
    }

    .scrollbar-menu__item {
        display: flex;
        align-items: center;
        padding: 8px 10px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: var(--text-primary);
        font-family: inherit;
        font-size: 0.85rem;
        text-align: start;
        cursor: pointer;
        transition: var(--transition);
    }

    .scrollbar-menu__item:hover {
        background: var(--surface-hover);
    }

    .scrollbar-menu__item:focus {
        background: var(--surface-hover);
        outline: 2px solid var(--accent-primary);
        outline-offset: -2px;
    }

    .scrollbar-menu__item.active {
        background: rgba(var(--accent-primary-rgb), 0.2);
        color: var(--accent-primary);
    }

    .scrollbar-menu__separator {
        height: 1px;
        margin: 4px 6px;
        background: var(--border-color);
    }

    .scrollbar-menu__item--check {
        gap: 6px;
    }

    /**
     * Ширина фіксована й не залежить від того, стоїть галочка чи ні: інакше
     * підпис стрибав би вбік при кожному натисканні — просто в меню, яке саме
     * на нього й дивиться.
     */
    .scrollbar-menu__mark {
        flex: 0 0 14px;
        color: var(--accent-primary);
        text-align: center;
    }
</style>
