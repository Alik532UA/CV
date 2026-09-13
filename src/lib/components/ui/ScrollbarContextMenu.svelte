<script lang="ts">
    import { browser } from "$app/environment";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { scrollbar, type ScrollbarMode } from "$lib/controllers/ScrollbarState.svelte";
    import { SCROLLBAR_MODES } from "$lib/config/scrollbarModes";

    /**
     * Width and height are needed so the menu does not run off the screen.
     *
     * 260, а не 210, і число заміряне по ВСІХ 41 словнику (`measureText` у
     * 13.6px Outfit, шрифті рядка меню). Найдовша доводка — болгарська
     * «Превъртане при посочване», 172 px; рядок із тумблером лишає під текст
     * `WIDTH − 20` падінга панелі `− 44` тумблера `− 12` проміжку, тобто 184 при
     * 260. Найдовший підпис режиму — грузинський, 161 px, і йому вистачає з
     * великим запасом. На 210 болгарська переносилася б на два рядки.
     *
     * Стільки ж у сусіднього сайта на цьому ж пакеті: те саме показане двічі не
     * має бути двох різних ширин.
     */
    const WIDTH = 260;
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

    /**
     * Висота ВСЬОГО стека — обох панелей разом із проміжком, — і вона МІРЯЄТЬСЯ.
     *
     * Арифметика лишається тільки як значення до першого кадру: рядок — це
     * падінг плюс лінійний бокс, а лінійний бокс залежить від шрифта, від того,
     * чи переніс підпис, і від висоти тумблера. Поки панель була одна, похибка
     * була дрібною; з другою панеллю, її падінгом і проміжком угадувати стало
     * нічим. Помилка тут видно як меню, що звисає за нижній край екрана.
     */
    let height = $state(SCROLLBAR_MODES.length * ITEM_HEIGHT + PADDING * 2 + 24);

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

    <!-- Стек двох ПАНЕЛЕЙ, а не одна панель із роздільником. Перелік режимів —
         вибір одного з чотирьох; доводка — незалежна настройка. Окремий
         контейнер каже це саме собою, без пояснень (SCROLLBAR § 7.4). -->
    <div
        class="scrollbar-menu-stack"
        bind:offsetHeight={height}
        style="left: {position.left}px; top: {position.top}px; width: {WIDTH}px;"
        role="presentation"
        onkeydown={(e) => {
            if (e.key === "Escape") scrollbar.closeMenu();
        }}
    >
    <div
        class="scrollbar-menu"
        role="menu"
        tabindex="-1"
        data-testid="scrollbar-context-menu"
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
    </div>

    {#if showHold}
        <!-- Тумблер, а не галочка: галочка з фіксованою колонкою лишала порожній
             відступ у вимкненому стані, і підпис висів без нічого ліворуч.

             Нативний `<input type="checkbox">` під ним, а не кнопка з
             `aria-checked`: це справжній елемент форми — фокус, пробіл, читалка
             й `:disabled` дістаються задарма. Панель НЕ закривається на
             перемиканні: зворотний зв'язок про стан — сам тумблер, і панель, що
             зникла раніше, ніж він доїхав, лишає без відповіді на «то
             ввімкнулося чи ні». -->
        <div class="scrollbar-menu scrollbar-menu--hold">
            <label class="scrollbar-hold" data-testid="scrollbar-hold-label">
                <span>{t.scrollbar.hold}</span>
                <input
                    type="checkbox"
                    class="scrollbar-hold__input"
                    checked={scrollbar.holdScroll}
                    onchange={() => scrollbar.setHoldScroll(!scrollbar.holdScroll)}
                    data-testid="scrollbar-hold-toggle"
                />
                <span class="scrollbar-hold__slider"></span>
            </label>
        </div>
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

    /* Позиціонується стек; панелі всередині — звичайний потік. */
    .scrollbar-menu-stack {
        position: fixed;
        z-index: 1601;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .scrollbar-menu {
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

    /* Друга панель: один рядок, тож вертикальний падінг менший за панель
       переліку — інакше вона виглядала б порожньою коробкою навколо тумблера. */
    .scrollbar-menu--hold {
        padding: 8px 10px;
    }

    /* Підпис ліворуч, тумблер праворуч. */
    .scrollbar-hold {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        cursor: pointer;
        user-select: none;
        font-size: 0.85rem;
        color: var(--text-primary);
    }

    /* Поле лишається в потоці подій (фокус, пробіл, читалка), але не видно. */
    .scrollbar-hold__input {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
    }

    .scrollbar-hold__slider {
        position: relative;
        flex: 0 0 44px;
        height: 24px;
        border-radius: 24px;
        background: var(--border-color);
        transition: background 0.3s;
    }

    .scrollbar-hold__slider::before {
        content: "";
        position: absolute;
        left: 3px;
        bottom: 3px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s;
    }

    .scrollbar-hold__input:checked + .scrollbar-hold__slider {
        background: var(--accent-primary);
    }

    .scrollbar-hold__input:checked + .scrollbar-hold__slider::before {
        transform: translateX(20px);
    }

    /* Обведення на тумблері, а не на полі: те 0×0 і не видно, де фокус. */
    .scrollbar-hold__input:focus-visible + .scrollbar-hold__slider {
        outline: 2px solid var(--accent-primary);
        outline-offset: 2px;
    }

    @media (prefers-reduced-motion: reduce) {
        .scrollbar-hold__slider,
        .scrollbar-hold__slider::before {
            transition: none;
        }
    }
</style>
