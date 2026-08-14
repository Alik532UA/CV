<script lang="ts">
    import { onMount } from "svelte";
    import type { PageProps } from "./$types";
    
    // Sections
    import HeroSection from "$lib/components/sections/HeroSection.svelte";
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
        {#await import("$lib/components/sections/ExperienceSection.svelte") then { default: ExperienceSection }}
            <ExperienceSection />
        {/await}
        {#snippet failed()}
            <ErrorFallback section="experience" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        {#await import("$lib/components/sections/SkillsSection.svelte") then { default: SkillsSection }}
            <SkillsSection />
        {/await}
        {#snippet failed()}
            <ErrorFallback section="skills" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        {#await import("$lib/components/sections/ProjectsSection.svelte") then { default: ProjectsSection }}
            <ProjectsSection />
        {/await}
        {#snippet failed()}
            <ErrorFallback section="projects" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        {#await import("$lib/components/sections/EducationSection.svelte") then { default: EducationSection }}
            <EducationSection />
        {/await}
        {#snippet failed()}
            <ErrorFallback section="education" />
        {/snippet}
    </svelte:boundary>
    
    <svelte:boundary>
        {#await import("$lib/components/sections/OtherSection.svelte") then { default: OtherSection }}
            <OtherSection />
        {/await}
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
