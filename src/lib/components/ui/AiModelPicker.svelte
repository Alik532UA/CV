<script lang="ts">
    import { AI_PROVIDERS } from "$lib/config/aiProviders";
    import { aiChat } from "$lib/controllers/AiChatState.svelte";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { fill } from "$lib/i18n/fill";
    import { providerStatus } from "$lib/services/aiChain";
    import { Check, ChevronDown, Zap } from "lucide-svelte";

    /**
     * Бейдж моделі — водночас перемикач.
     *
     * Показує ту модель, яка НАСПРАВДІ відповіла (`aiChat.activeModelId`), а до
     * першої відповіді — голову ланцюжка. Раніше тут стояв літерал
     * `gemini-3.6-flash`, тому після fallback бейдж брехав.
     *
     * Ручний вибір не вимикає автоперемикання: обрана модель стає першою у
     * ланцюжку, а якщо і в неї закінчились ліміти — проксі піде далі за score.
     */

    let open = $state(false);
    let now = $state(Date.now());
    let root: HTMLDivElement | undefined = $state();

    /** Таймер живе лише поки список відкритий — там показується відлік cooldown. */
    $effect(() => {
        if (!open) return;
        const id = setInterval(() => (now = Date.now()), 1000);
        return () => clearInterval(id);
    });

    const models = $derived(
        [...AI_PROVIDERS]
            .sort((a, b) => b.score - a.score)
            .map((entry) => ({
                entry,
                status: providerStatus(entry, {
                    now,
                    cooldowns: aiChat.cooldowns,
                    keyed: aiChat.keyedIds ?? undefined
                }),
                minutesLeft: Math.max(
                    1,
                    Math.ceil(((aiChat.cooldowns[entry.id] ?? now) - now) / 60_000)
                )
            }))
    );

    // Через fill(), а не через склейку рядків: перекладачеві потрібне ціле
    // речення з дірками, бо порядок слів у мовах різний і переставити три
    // склеєні шматки він не може (I18N-v8 § 4.1).
    const badgeTitle = $derived(
        fill(aiChat.isModelConfirmed ? t.ai.tooltipAnswered : t.ai.tooltipWillTry, {
            model: aiChat.activeEntry.model,
            provider: aiChat.activeEntry.provider
        })
    );

    function choose(id: string | null) {
        aiChat.setPinned(id);
        open = false;
    }

    /** Клік поза списком закриває його. Бекдропа немає — він накрив би модалку. */
    function onPointerDown(event: PointerEvent) {
        if (!open || !root) return;
        if (!root.contains(event.target as Node)) open = false;
    }
</script>

<svelte:window onpointerdown={onPointerDown} />

<div class="ai-model-picker" bind:this={root}>
    <button
        type="button"
        class="ai-badge-btn"
        class:pending={!aiChat.isModelConfirmed}
        title={badgeTitle}
        aria-haspopup="menu"
        aria-expanded={open}
        data-testid="ai-model-badge-btn"
        onclick={() => (open = !open)}
    >
        <span>{aiChat.activeEntry.model}</span>
        <ChevronDown size={13} />
    </button>

    {#if open}
        <div
            class="ai-model-menu"
            role="menu"
            tabindex="-1"
            data-testid="ai-model-menu"
            onkeydown={(e) => {
                if (e.key === "Escape") {
                    // Інакше Escape закрив би всю модалку разом зі списком.
                    e.stopPropagation();
                    open = false;
                }
            }}
        >
            <span class="ai-model-menu__title">{t.ai.modelTitle}</span>

            <button
                type="button"
                class="ai-model-menu__item"
                class:active={aiChat.pinnedId === null}
                role="menuitemradio"
                aria-checked={aiChat.pinnedId === null}
                data-testid="ai-model-auto-btn"
                onclick={() => choose(null)}
            >
                <Zap size={14} />
                <span class="ai-model-menu__label">{t.ai.modelAuto}</span>
                {#if aiChat.pinnedId === null}<Check size={14} />{/if}
            </button>

            <div class="ai-model-menu__sep"></div>

            {#each models as { entry, status, minutesLeft } (entry.id)}
                <button
                    type="button"
                    class="ai-model-menu__item"
                    class:active={aiChat.pinnedId === entry.id}
                    class:answered={aiChat.activeModelId === entry.id}
                    role="menuitemradio"
                    aria-checked={aiChat.pinnedId === entry.id}
                    disabled={status === "no-key"}
                    data-testid="ai-model-{entry.id}-btn"
                    onclick={() => choose(entry.id)}
                >
                    <span class="ai-model-menu__label">
                        <span class="ai-model-menu__model">{entry.model}</span>
                        <span class="ai-model-menu__provider">{entry.provider}</span>
                    </span>
                    <span
                        class="ai-model-menu__status ai-model-menu__status--{status}"
                        data-testid="ai-model-{entry.id}-status"
                    >
                        {#if status === "no-key"}
                            {t.ai.statusNoKey}
                        {:else if status === "cooling"}
                            {fill(t.ai.statusCooldown, { minutes: minutesLeft })}
                        {:else if aiChat.activeModelId === entry.id}
                            {t.ai.statusAnswered}
                        {:else}
                            {t.ai.statusReady}
                        {/if}
                    </span>
                    {#if aiChat.pinnedId === entry.id}<Check size={14} />{/if}
                </button>
            {/each}

            <p class="ai-model-menu__hint">{t.ai.pinHint}</p>
        </div>
    {/if}
</div>

<style>
    .ai-model-picker {
        position: relative;
        display: inline-flex;
    }

    .ai-badge-btn {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.4px;
        font-family: inherit;
        background: var(--gradient);
        color: white;
        padding: 4px 8px 4px 10px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        transition:
            transform 0.15s ease,
            filter 0.15s ease;
    }

    .ai-badge-btn:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
    }

    /* Модель ще не відповідала — бейдж свідомо трохи тихіший, щоб «спробуємо» не
       читалося як «працює саме це». */
    .ai-badge-btn.pending {
        opacity: 0.85;
    }

    .ai-model-menu {
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 280px;
        max-width: min(340px, 90vw);
        padding: 8px;
        border-radius: 12px;
        /* --panel-bg, а не --card-bg: друге — це майже прозорий тінт для карток
           усередині сторінки (0.03), і крізь нього просвічував текст модалки.
           Той самий набір змінних, що в ScrollbarContextMenu, тому світла тема
           працює без окремих правил. */
        background: var(--panel-bg);
        border: 1px solid var(--border-color);
        box-shadow: var(--panel-shadow);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        text-align: start;
    }

    .ai-model-menu__title {
        padding: 4px 8px;
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.6px;
        text-transform: uppercase;
        opacity: 0.6;
    }

    .ai-model-menu__sep {
        height: 1px;
        margin: 4px 0;
        background: var(--border-color);
    }

    .ai-model-menu__item {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        padding: 7px 8px;
        border: none;
        border-radius: 8px;
        background: transparent;
        color: inherit;
        font-family: inherit;
        font-size: 0.8rem;
        text-align: start;
        cursor: pointer;
    }

    .ai-model-menu__item:hover:not(:disabled) {
        background: var(--surface-hover);
    }

    .ai-model-menu__item:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    .ai-model-menu__item.active {
        background: rgba(var(--accent-primary-rgb), 0.12);
    }

    .ai-model-menu__label {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-width: 0;
    }

    .ai-model-menu__model {
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .ai-model-menu__provider {
        font-size: 0.68rem;
        color: var(--text-secondary);
    }

    .ai-model-menu__status {
        font-size: 0.66rem;
        white-space: nowrap;
    }

    .ai-model-menu__status--ready {
        color: var(--score-high);
    }

    .ai-model-menu__status--cooling {
        color: var(--score-low);
    }

    .ai-model-menu__status--no-key {
        opacity: 0.6;
    }

    .ai-model-menu__item.answered .ai-model-menu__model::after {
        content: " •";
        color: var(--score-high);
    }

    .ai-model-menu__hint {
        margin: 6px 4px 2px;
        font-size: 0.68rem;
        line-height: 1.4;
        color: var(--text-secondary);
    }
</style>
