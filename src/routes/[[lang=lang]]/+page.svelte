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

    {#if pdfModal.isOpen}
        {#await import("$lib/components/ui/PdfModal.svelte") then { default: PdfModal }}
            <PdfModal bind:show={pdfModal.isOpen} />
        {/await}
    {/if}

    {#if aiChat.isOpen}
        {#await import("$lib/components/ui/AiMatchModal.svelte") then { default: AiMatchModal }}
            <AiMatchModal />
        {/await}
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
