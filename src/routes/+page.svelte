<script lang="ts">
    import { language, translations } from "$lib/i18n";
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
    <HeroSection {t} {isMobile} onOpenPdfModal={() => (showPdfModal = true)} />
    
    <ExperienceSection {t} />
    
    <SkillsSection {t} />
    
    <ProjectsSection {t} />
    
    <EducationSection {t} />
    
    <OtherSection {t} />

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
