<script lang="ts">
    import BaseModal from "./BaseModal.svelte";
    import { base } from "$app/paths";
    import { FileText, FileCode, Sparkles } from "lucide-svelte";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { aiChat } from "$lib/controllers/AiChatState.svelte";
    import { track } from "$lib/services/analytics";
    import type { HTMLAttributes } from "svelte/elements";
    import {
        ATS_FILES,
        THEMED_FILES,
        PREVIEW_WIDTH,
        PREVIEW_HEIGHT
    } from "$lib/config/cvDownloads";

    interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onclose'> {
        show: boolean;
    }

    let { show = $bindable(), ...restProps }: Props = $props();
</script>

<BaseModal bind:show title={t.pdf_modal?.title || "Choose PDF Version"} {...restProps}>
    <div class="pdf-modal-container">
        <div class="pdf-options">
            <div class="pdf-option pdf-option-group" data-testid="pdf-option-ats">
                <div class="pdf-file-list">
                    {#each ATS_FILES as file (file.id)}
                        <!-- Absolute Google Drive URL, not an app route -->
                        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                        <a href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="pdf-file-btn"
                            title={file.name}
                            data-testid="pdf-file-link-{file.id}"
                            onclick={() => {
                                track("cv_download", { variant: `ats-${file.id}` });
                                show = false;
                            }}
                        >
                            {#if file.format === "pdf"}
                                <FileText size={16} />
                            {:else}
                                <FileCode size={16} />
                            {/if}
                            <span class="pdf-file-label">{file.label}</span>
                        </a>
                    {/each}
                </div>
                <span>{t.pdf_modal?.ats || "ATS / RMS"}</span>
            </div>
            {#each THEMED_FILES as file (file.id)}
                <!-- Absolute Google Drive URL, not an app route -->
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pdf-option"
                    data-testid="pdf-option-{file.id}"
                    onclick={() => {
                        track("cv_download", { variant: file.id });
                        show = false;
                    }}
                >
                    <div class="pdf-preview">
                        <img
                            src="{base}/pdf-preview/{file.image}"
                            alt={file.alt}
                            loading="lazy"
                            decoding="async"
                            width={PREVIEW_WIDTH}
                            height={PREVIEW_HEIGHT}
                        />
                    </div>
                    <!-- Підпис читається В РОЗМІТЦІ, а не збирається в масиві
                         вище: там він застиг би на мові, яка була в момент
                         створення масиву (SVELTE-CORE-v8 § 1.1). -->
                    <span>{t.pdf_modal?.[file.id] || file.fallback}</span>
                </a>
            {/each}
        </div>

        <button
            type="button"
            class="ai-banner-btn"
            data-testid="pdf-option-ai"
            onclick={() => {
                track("cv_download", { variant: "ai-matcher" });
                show = false;
                aiChat.open();
            }}
        >
            <div class="ai-banner-header">
                <div class="ai-banner-title-group">
                    <Sparkles size={20} class="ai-sparkle-icon" />
                    <span class="ai-banner-title">AI Job Matcher</span>
                </div>
                <!-- Не перемикач, а підпис: вкладена кнопка всередині кнопки-банера
                     була б невалідною розміткою. Перемикати модель — у самій модалці. -->
                <span class="ai-badge">{aiChat.activeEntry.model}</span>
            </div>
            <p class="ai-banner-sub">{t.ai.bannerSub}</p>
        </button>
    </div>
</BaseModal>

<style>
    /*
     * Усі вертикальні розміри тут — функція висоти вікна, а не константи.
     *
     * Мета: на будь-якому екрані вміст СТИСКАЄТЬСЯ до розміру, що вміщується,
     * замість того щоб вилазити за межі або ховатися під прокрутку. `dvh`
     * замість `vh`, бо на мобільних висота живе разом із панеллю браузера.
     */
    .pdf-modal-container {
        display: flex;
        flex-direction: column;
        gap: clamp(8px, 1.8dvh, 20px);
        width: 100%;
    }

    .pdf-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: clamp(8px, 1.8dvh, 20px);
        width: 100%;
    }

    .ai-banner-btn {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        gap: clamp(2px, 0.8dvh, 8px);
        width: 100%;
        padding: clamp(8px, 1.8dvh, 16px) 20px;
        border-radius: 16px;
        border: 1px solid rgba(var(--accent-primary-rgb), 0.35);
        background: linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.14) 0%, rgba(139, 92, 246, 0.22) 100%);
        color: var(--text-primary);
        font-family: inherit;
        cursor: pointer;
        transition: var(--transition);
        text-align: left;
        box-sizing: border-box;
    }

    .ai-banner-btn:hover {
        background: linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.24) 0%, rgba(139, 92, 246, 0.35) 100%);
        border-color: var(--accent-primary);
        box-shadow: 0 4px 20px rgba(var(--accent-primary-rgb), 0.25);
    }

    /*
     * `flex-wrap` тут — не косметика, а те, що не дає рядку вилізти.
     *
     * Було: заголовок із `white-space: nowrap` і бейдж із `flex-shrink: 0` в
     * одному рядку. Коли їхня сума перевищувала ширину, поступитися не міг
     * ніхто — і банер віддавав ГОРИЗОНТАЛЬНУ прокрутку. Назва моделі приходить
     * ззовні (`aiChat.activeEntry.model`), тож її довжина не під нашим
     * контролем: сьогодні `gemini-3.6-flash`, завтра довша.
     *
     * Тепер бейдж переходить на свій рядок, коли не вміщується, а до того
     * стискається шрифтом. Зайва висота з'являється лише в тому випадку, коли
     * альтернатива — обрізаний вміст.
     */
    .ai-banner-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: clamp(4px, 1.2vw, 10px);
        width: 100%;
    }

    .ai-banner-title-group {
        display: flex;
        align-items: center;
        gap: 10px;
        /* Без цього флекс-елемент не може стати вужчим за свій вміст, і
           перенесення не спрацьовує — рядок усе одно вилазить. */
        min-width: 0;
    }

    :global(.ai-banner-btn .ai-sparkle-icon) {
        color: var(--accent-primary);
        flex-shrink: 0;
    }

    .ai-banner-title {
        font-weight: 700;
        font-size: clamp(0.92rem, 2.2dvh, 1.05rem);
        color: var(--text-primary);
        white-space: nowrap;
    }

    /* Опис у два рядки — найбільший поодинокий блок банера, тож саме він
       найбільше й віддає на низькому екрані. `line-height` теж плавний:
       на фіксованих 1.4 два рядки з'їдають більше, ніж сам шрифт. */
    .ai-banner-sub {
        font-size: clamp(0.74rem, 1.9dvh, 0.85rem);
        color: var(--text-secondary);
        margin: 0;
        line-height: clamp(1.25, 0.3dvh, 1.4);
    }

    .ai-badge {
        /* Розмір ведений ШИРИНОЮ вікна, на відміну від решти тут: бейдж
           упирається саме в неї, а не у висоту. Нижня межа не агресивна
           навмисно — коли місця бракує, першим спрацьовує перенесення рядка,
           тож стискати шрифт до нечитабельного немає потреби. */
        font-size: clamp(0.66rem, 2.4vw, 0.72rem);
        font-weight: 700;
        letter-spacing: 0.4px;
        background: var(--gradient);
        color: white;
        padding: 4px clamp(6px, 1.8vw, 10px);
        border-radius: 8px;
        white-space: nowrap;
        flex-shrink: 0;
        /* Останній рубіж: якщо навіть на своєму рядку назва моделі довша за
           банер, вона скорочується трикрапкою, а не тягне за собою прокрутку
           всієї модалки. */
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .pdf-option {
        display: flex;
        flex-direction: column;
        gap: 12px;
        text-decoration: none;
        color: var(--text-primary);
        padding: 15px;
        border-radius: 16px;
        background: var(--surface-subtle);
        border: 1px solid transparent;
        transition: var(--transition);
        text-align: center;
        min-width: 0;
    }

    /* Kept, unlike the plain cards: the whole surface is a link. */
    a.pdf-option:hover {
        background: rgba(var(--accent-primary-rgb), 0.1);
        border-color: var(--accent-primary);
    }

    /*
     * Пропорція A4 ведена шириною колонки — і саме тому на низькому екрані
     * прев'ю виростало до 252px при вікні 380px заввишки: медіазапити нижче
     * дивляться лише на ШИРИНУ, тож у ландшафті телефона діяла десктопна
     * сітка з високими картками.
     *
     * `max-height` рахується з висоти вікна. Коли він спрацьовує, пропорція
     * поступається — зображення обрізається по `object-fit: cover`, і це
     * правильний компроміс: це мініатюра, а не документ.
     */
    .pdf-preview {
        aspect-ratio: 210/297;
        width: 100%;
        max-height: clamp(72px, 30dvh, 320px);
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid var(--border-color);
    }

    .pdf-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .pdf-option span {
        font-weight: 600;
        font-size: 1.1rem;
        white-space: nowrap;
    }

    /* ATS / RMS column: four file links in place of a single preview */
    .pdf-file-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: clamp(5px, 1.2dvh, 10px);
        min-height: 0;
    }

    .pdf-file-btn {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 42px;
        max-height: 72px;
        padding: 0 10px;
        border-radius: 10px;
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        text-decoration: none;
        transition: var(--transition);
    }

    .pdf-file-btn:hover {
        background: rgba(var(--accent-primary-rgb), 0.15);
        border-color: var(--accent-primary);
        color: var(--accent-primary);
    }

    .pdf-file-label {
        font-weight: 600;
        font-size: 0.95rem;
        white-space: nowrap;
    }

    /*
     * Низьке вікно — незалежно від ширини.
     *
     * Решта медіазапитів тут дивиться лише на ширину, і саме через це
     * ландшафт телефона (740×380) отримував десктопну розкладку: чотири файли
     * в стовпчик, високі прев'ю, повні відступи. Висота — окрема вісь, і її
     * теж треба питати.
     *
     * Сітка 2×2 замість стовпчика economить близько 85px — найбільший
     * поодинокий виграш висоти в цьому вікні.
     */
    @media (max-height: 620px) {
        .pdf-file-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            align-content: center;
        }

        .pdf-file-btn {
            flex: none;
            max-height: none;
        }
    }

    @media (max-width: 640px) {
        .pdf-options {
            gap: 10px;
        }

        .pdf-option {
            padding: 10px;
            border-radius: 12px;
        }

        .pdf-option span {
            font-size: 0.85rem;
        }

        .pdf-file-list {
            gap: 8px;
        }

        .pdf-file-btn {
            gap: 6px;
            padding: 0 6px;
        }

        .pdf-file-label {
            font-size: 0.85rem;
        }
    }

    @media (max-width: 480px) {
        .pdf-options {
            grid-template-columns: 1fr;
        }

        /* Власної прокрутки тут більше немає. Доти стояло
           `max-height: 70vh; overflow-y: auto`, і воно не рятувало: обмежувався
           лише цей блок, а картка модалки росла далі — разом із заголовком,
           банером AI та відступами, — тож хрестик усе одно виїжджав за екран.
           Замість обрізати вміст, він тепер стискається (clamp вище). */

        .pdf-option {
            flex-direction: row;
            align-items: center;
            text-align: left;
            gap: clamp(8px, 1.6dvh, 15px);
            padding: clamp(6px, 1.4dvh, 10px);
        }

        /* Прев'ю — найбільший вертикальний споживач після списку файлів, тож
           воно й віддає найбільше. Пропорція A4 збережена: висота ведена, а
           ширина рахується з неї. */
        .pdf-preview {
            height: clamp(44px, 9dvh, 80px);
            width: calc(clamp(44px, 9dvh, 80px) * 210 / 297);
            flex-shrink: 0;
        }

        .pdf-option span {
            font-size: clamp(0.85rem, 2.2dvh, 1.1rem);
            white-space: normal;
        }

        /* Keep the ATS column stacked, with its caption acting as a heading */
        .pdf-option-group {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            gap: clamp(6px, 1.4dvh, 12px);
        }

        .pdf-option-group > span {
            order: -1;
        }

        .pdf-file-btn {
            flex: none;
            max-height: none;
            /* 44px — рекомендований мінімум дотику, і він тримається, доки
               екран це дозволяє. Нижче — стискається: недосяжна кнопка гірша
               за трохи меншу. */
            min-height: clamp(34px, 6.4dvh, 44px);
        }

        .pdf-file-label {
            font-size: clamp(0.85rem, 2.1dvh, 1rem);
        }

        /*
         * Низький екран: чотири файли стають сіткою 2×2.
         *
         * Це найбільший виграш висоти з усіх — чотири рядки по ~44px із
         * проміжками займають близько 200px, сітка 2×2 — удвічі менше. Саме
         * стовпчик ATS і робив вікно вищим за екран на телефоні 429×636.
         */
        @media (max-height: 720px) {
            .pdf-file-list {
                display: grid;
                grid-template-columns: 1fr 1fr;
            }
        }
    }
</style>
