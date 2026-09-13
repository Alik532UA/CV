<script lang="ts">
    import { Sun, Moon } from "lucide-svelte";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { theme } from "$lib/controllers/UiState.svelte";

    /**
     * Перемикач світлої й темної теми (THEME-SWITCHER).
     *
     * ## Чому окремим компонентом, а не рядками в `HeaderSection`
     *
     * Там він і був — разом із мовною панеллю, вибором фону, звуком і рештою
     * шапки, у файлі на 855 рядків, що вже стоїть у списку боргу § 7. Додати
     * до нього ще сорок означало б «борг зростає», а гейт проєкту каже прямо:
     * борг може лише скорочуватися. Тож замість піднімати стелю перемикач
     * поїхав сюди — і HeaderSection натомість поменшав.
     *
     * Обмін вийшов чесний ще й змістовно: кнопки теми — єдине місце в шапці,
     * яке має ВЛАСНУ палітру, не зв'язану з поточною темою (§ 4), і тримати
     * такий острів усередині спільних стилів панелі було джерелом конфліктів
     * специфічності.
     */

    /**
     * Наведення на кнопку теми ПОКАЗУЄ цю тему на всій сторінці, поки курсор
     * там (§ 3). Іконка каже про тему двома кольорами, сторінка — усіма; вибір
     * стає видимим до кліку.
     *
     * ТІЛЬКИ МИША. `pointerenter` приходить і від тапу, а `pointerleave` на
     * дотику — ні: тема застрягла б показаною, доки людина не торкнеться чогось
     * іншого. Клавіатура має свій шлях — `T` перебирає теми по-справжньому.
     */
    function previewOn(next: string, e: PointerEvent) {
        if (e.pointerType === "mouse") theme.previewTheme(next);
    }

    function previewOff(e: PointerEvent) {
        if (e.pointerType === "mouse") theme.previewTheme(null);
    }

    /*
     * Страхування на випадок, коли `pointerleave` не прийде взагалі: шапка
     * ховається на прокрутці, і кнопка може зникнути прямо з-під курсора.
     */
    $effect(() => () => theme.previewTheme(null));
</script>

<div class="toggle-group glass" data-testid="theme-toggle-toolbar" role="group" aria-label={t.ui.theme}>
    <button
        class="theme-opt"
        onclick={() => theme.current !== "light" && theme.toggle()}
        class:active={theme.current === "light"}
        onpointerenter={(e) => previewOn("light", e)}
        onpointerleave={previewOff}
        data-theme-key="light"
        title={t.ui.themeLight}
        aria-label={t.ui.themeLight}
        aria-pressed={theme.current === "light"}
        aria-keyshortcuts="T"
        data-testid="theme-light-btn"
    >
        <Sun size={18} />
    </button>
    <div class="divider" role="separator"></div>
    <button
        class="theme-opt"
        onclick={() => theme.current !== "dark" && theme.toggle()}
        class:active={theme.current === "dark"}
        onpointerenter={(e) => previewOn("dark", e)}
        onpointerleave={previewOff}
        data-theme-key="dark"
        title={t.ui.themeDark}
        aria-label={t.ui.themeDark}
        aria-pressed={theme.current === "dark"}
        aria-keyshortcuts="T"
        data-testid="theme-dark-btn"
    >
        <Moon size={18} />
    </button>
</div>

<style>
    /* Та сама оболонка, що й у решти груп шапки: скляна плашка з рамкою. */
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

    .divider {
        width: 1px;
        height: 20px;
        background: var(--border-color);
        margin: 0 2px;
    }

    /*
     * КНОПКА ТЕМИ ПОКАЗУЄ СВОЮ ТЕМУ, а не поточну (§ 4).
     *
     * Значення взяті з палітри `app.css`: перший аргумент `light-dark()` —
     * світле, другий — темне. Стоять КОНСТАНТАМИ навмисно: кнопка теми `dark`
     * мусить лишатися темною й у світлій темі, тобто саме тут токени не діють —
     * інакше обидві кнопки знову були б однакові.
     *
     * ЛІТЕРАЛАМИ, а не через проміжні змінні кнопки. Гейт контрасту
     * (`contrast-canon.test.ts`) розвʼязує змінні лише з `:root`, тож змінна,
     * оголошена тут-таки на кнопці, лишала б пару НЕВИМІРЯНОЮ — він чесно
     * повідомив про це «текст не колір». Гейт, який не бачить пари, гірший за
     * зайве повторення на чотири рядки.
     *
     * (`css-variables.test.ts` до купи довів, що це не теорія: він сканує й
     * коментарі, і перша редакція цього блока згадала неоголошену змінну
     * прямо в тексті — гейт її знайшов.)
     *
     * Заміряно ним же (WCAG AA, поріг 4.5): спокій 15,8:1 і 20,0:1, наведення
     * 5,9:1 і 15,2:1. Найгірша пара — білий на #0066cc.
     */
    .theme-opt {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 32px;
        width: 44px;
        border-radius: 8px;
        border: 1px solid;
        cursor: pointer;
        transition: var(--transition);
    }

    /* Обрана лишається СВОЇХ кольорів — інакше обрана тема єдина перестала б
       показувати себе. Вибір позначає обведення, а не заливка. */
    .theme-opt.active {
        box-shadow: 0 0 0 2px currentColor;
    }

    .theme-opt[data-theme-key="light"] {
        background: #f5f5f7;
        color: #1d1d1f;
        border-color: #0066cc;
    }

    .theme-opt[data-theme-key="light"]:hover,
    .theme-opt[data-theme-key="light"]:focus-visible {
        background: #0066cc;
        color: #ffffff;
    }

    .theme-opt[data-theme-key="dark"] {
        background: #050505;
        color: #ffffff;
        border-color: #00f2ff;
    }

    .theme-opt[data-theme-key="dark"]:hover,
    .theme-opt[data-theme-key="dark"]:focus-visible {
        background: #00f2ff;
        color: #050505;
    }
</style>
