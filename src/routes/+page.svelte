<script lang="ts">
    import { language, translations } from "$lib/i18n/index.svelte";
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
    import ErrorFallback from "$lib/components/ui/ErrorFallback.svelte"; // Import the new component

    // Runes (Svelte 5)
    let t = $derived(translations[language.current]);
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
        <HeroSection {t} {isMobile} onOpenPdfModal={() => (showPdfModal = true)} />
        {#snippet fallback()}
            <ErrorFallback sectionName="Hero" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <ExperienceSection {t} />
        {#snippet fallback()}
            <ErrorFallback sectionName="Досвід" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <SkillsSection {t} />
        {#snippet fallback()}
            <ErrorFallback sectionName="Навички" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <ProjectsSection {t} />
        {#snippet fallback()}
            <ErrorFallback sectionName="Проєкти" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <EducationSection {t} />
        {#snippet fallback()}
            <ErrorFallback sectionName="Освіта" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        <OtherSection {t} />
        {#snippet fallback()}
            <ErrorFallback sectionName="Додатково" />
        {/snippet}
    </svelte:boundary>

    <PdfModal bind:show={showPdfModal} {t} />
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
