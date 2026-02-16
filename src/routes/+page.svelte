<script lang="ts">
    import { t } from "$lib/i18n/index.svelte";
    import { onMount } from "svelte";
    
    // Sections
    import HeroSection from "$lib/components/sections/HeroSection.svelte";
    import ExperienceSection from "$lib/components/sections/ExperienceSection.svelte";
    import SkillsSection from "$lib/components/sections/SkillsSection.svelte";
    import ProjectsSection from "$lib/components/sections/ProjectsSection.svelte";
    import EducationSection from "$lib/components/sections/EducationSection.svelte";
    import OtherSection from "$lib/components/sections/OtherSection.svelte";
    
    // UI
    import PdfModal from "$lib/components/ui/PdfModal.svelte";
    import ErrorFallback from "$lib/components/ui/ErrorFallback.svelte";

    // Runes (Svelte 5)
    let isMobile = $state(false);
    let showPdfModal = $state(false);

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
    <svelte:boundary>
        <HeroSection {isMobile} onOpenPdfModal={() => (showPdfModal = true)} />
        {#snippet failed()}
            <ErrorFallback sectionName="Hero" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <ExperienceSection />
        {#snippet failed()}
            <ErrorFallback sectionName="Досвід" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <SkillsSection />
        {#snippet failed()}
            <ErrorFallback sectionName="Навички" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <ProjectsSection />
        {#snippet failed()}
            <ErrorFallback sectionName="Проєкти" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <EducationSection />
        {#snippet failed()}
            <ErrorFallback sectionName="Освіта" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <OtherSection />
        {#snippet failed()}
            <ErrorFallback sectionName="Додатково" />
        {/snippet}
    </svelte:boundary>

    {#if showPdfModal}
        {#await import("$lib/components/ui/PdfModal.svelte") then { default: PdfModal }}
            <PdfModal bind:show={showPdfModal} />
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
