<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    
    // Sections
    //
    // Імпорти статичні, і це не смак. Було `{#await import(...)}` навколо
    // кожної з п'яти — тобто навколо ОСНОВНОГО ВМІСТУ сторінки
    // (SVELTEKIT-DATA-v8 § 2.5, CRITICAL для static-профілю). Під час prerender
    // `{#await}` віддає в HTML pending-гілку, а вона тут порожня: у кожній із 44
    // згенерованих сторінок стояла сама лише Hero-секція. Досвід, навички,
    // проєкти, освіта й додаткове не бачив ні кравлер, ні прев'ю в месенджері —
    // саме те, заради чого резюме й існує.
    //
    // У джерелах цього не видно ніяк: у dev усе на місці, бо там сторінка
    // рендериться на запит і імпорти встигають (AI-AGENT-PITFALLS-v8 § 2).
    // Симптом жив рівно в `build/*.html`, і його додатково глушив
    // `prerender.handleMissingId: 'ignore'` у svelte.config.js: кравлер бачив
    // посилання `#experience` на сторінці без такого якоря і мовчав.
    //
    // Ліниве завантаження тут нічого не економило: сторінка одна, усі п'ять
    // секцій показуються завжди, тож їхні чанки все одно вантажаться одразу
    // після гідрації — лише на крок пізніше й повз prerender.
    import HeroSection from "$lib/components/sections/HeroSection.svelte";
    import ExperienceSection from "$lib/components/sections/ExperienceSection.svelte";
    import SkillsSection from "$lib/components/sections/SkillsSection.svelte";
    import ProjectsSection from "$lib/components/sections/ProjectsSection.svelte";
    import EducationSection from "$lib/components/sections/EducationSection.svelte";
    import OtherSection from "$lib/components/sections/OtherSection.svelte";
    import { pdfModal } from "$lib/controllers/PdfModalState.svelte";
    import { aiChat } from "$lib/controllers/AiChatState.svelte";

    // UI
    import ErrorFallback from "$lib/components/ui/ErrorFallback.svelte";
    import { toast } from "$lib/controllers/toast.svelte";
    import { logService } from "$lib/services/logService.svelte";
    import { t } from "$lib/controllers/I18nState.svelte";

    /**
     * Обидві модалки живуть окремими чанками, і доти їхнє завантаження стояло в
     * розмітці як `{#await import(…) then …}` — БЕЗ гілки `:catch`.
     *
     * Вона потрібна не для повноти. Чанк 404-иться буденно: вкладка, відкрита до
     * деплою, просить файл зі старим хешем, якого на сервері вже немає; те саме
     * дає обрив мережі. Без `:catch` проміс відхиляється в порожнечу — кнопку
     * натиснуто, `isOpen` уже `true`, модалка не з'явиться ніколи і не скаже
     * чому. Гірше: наступне натискання не змінить нічого, бо стан ЖЕ відкритий.
     * З погляду відвідувача це не збій мережі, а зламана кнопка
     * (ERROR-HANDLING-v8 § 1.4 — збій, що маскується мовчки).
     *
     * ЧОМУ НЕ `{:catch}` У РОЗМІТЦІ. Гілка `:catch` — це вираз рендеру, а
     * повідомити тут означає ЗМІНИТИ стан: показати тост і закрити модалку.
     * Мутація стану з виразу розмітки — саме те, від чого застерігає
     * SVELTE-CORE-v8, тож завантаження перенесено в `$effect`, який виконується
     * ПІСЛЯ рендеру, а розмітка лишилася чистим `{#if}`.
     */
    // Два різні типи, а не один спільний: у PdfModal є bindable-проп `show`,
    // у AiMatchModal пропів немає взагалі, і спільний тип збрехав би про обидва.
    type PdfModalComponent = typeof import("$lib/components/ui/PdfModal.svelte").default;
    type AiModalComponent = typeof import("$lib/components/ui/AiMatchModal.svelte").default;

    let PdfModal = $state<PdfModalComponent | null>(null);
    let AiMatchModal = $state<AiModalComponent | null>(null);

    /** @returns компонент або `null`, якщо чанк не приїхав */
    async function loadModal<T>(
        which: "pdf" | "ai",
        load: () => Promise<{ default: T }>,
        close: () => void
    ): Promise<T | null> {
        try {
            return (await load()).default;
        } catch (error) {
            // `warn`, а не `error`: обрив мережі й застарілий хеш чанка —
            // очікувані ситуації, а не дефекти коду (ERROR-HANDLING-v8 § 1.4).
            logService.warn("ui", `Modal chunk failed to load (${which}): ${String(error)}`);
            // Рядок із наявного ключа, тим самим прийомом, що й ErrorFallback:
            // нових записів у 42 словники не заведено жодного, а повідомлення
            // приходить мовою інтерфейсу.
            toast.error(t.errorPage.genericText);
            // Без цього кнопка лишається «натиснутою й мертвою» назавжди.
            close();
            return null;
        }
    }

    $effect(() => {
        if (!pdfModal.isOpen || PdfModal) return;
        void loadModal(
            "pdf",
            () => import("$lib/components/ui/PdfModal.svelte"),
            () => pdfModal.close()
        ).then((component) => (PdfModal = component));
    });

    $effect(() => {
        if (!aiChat.isOpen || AiMatchModal) return;
        void loadModal(
            "ai",
            () => import("$lib/components/ui/AiMatchModal.svelte"),
            () => aiChat.close()
        ).then((component) => (AiMatchModal = component));
    });

    // Consumed by child sections through their own props
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let { data }: PageProps = $props();

    // Runes (Svelte 5)
    let isMobile = $state(false);

    onMount(() => {
        const mediaQuery = window.matchMedia("(max-width: 768px)");
        isMobile = mediaQuery.matches;
        
        const handler = (e: MediaQueryListEvent) => {
            isMobile = e.matches;
        };
        
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    });
</script>

<div class="container">
    <HeroSection {isMobile} onOpenPdfModal={() => pdfModal.open()} />
    
    <svelte:boundary>
        <ExperienceSection />
        {#snippet failed()}
            <ErrorFallback section="experience" />
        {/snippet}
    </svelte:boundary>

    <svelte:boundary>
        <SkillsSection />
        {#snippet failed()}
            <ErrorFallback section="skills" />
        {/snippet}
    </svelte:boundary>

    <svelte:boundary>
        <ProjectsSection />
        {#snippet failed()}
            <ErrorFallback section="projects" />
        {/snippet}
    </svelte:boundary>

    <svelte:boundary>
        <EducationSection />
        {#snippet failed()}
            <ErrorFallback section="education" />
        {/snippet}
    </svelte:boundary>

    <svelte:boundary>
        <OtherSection />
        {#snippet failed()}
            <ErrorFallback section="additional" />
        {/snippet}
    </svelte:boundary>

    {#if pdfModal.isOpen && PdfModal}
        <PdfModal bind:show={pdfModal.isOpen} />
    {/if}

    {#if aiChat.isOpen && AiMatchModal}
        <AiMatchModal />
    {/if}
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    @media (max-width: 1024px) {
        .container {
            width: 99%;
            margin: 0 auto;
        }
    }
</style>
