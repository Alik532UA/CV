<script lang="ts">
    import { ChevronDown, Briefcase } from "lucide-svelte";
    import { slide } from "svelte/transition";
    import Section from "../ui/Section.svelte";
    import { t } from "$lib/i18n/index.svelte";
    import { experienceData } from "$lib/data/experience";

    let showNonIT = $state(false);
</script>

<Section id="experience" title={t.experience.title}>
    {#snippet icon()}
        <Briefcase size={22} aria-hidden="true" />
    {/snippet}
    
    <div class="timeline">
        {#each experienceData.it as exp (exp.id)}
            <div class="exp-card glass card">
                <span class="date">{exp.date}</span>
                <h3>{exp.company}</h3>
                <p class="role">{t.experience.roles[exp.roleKey]}</p>
                <p class="desc">{t.experience.descriptions[exp.descKey]}</p>
            </div>
        {/each}

        <button 
            class="btn-toggle-exp" 
            onclick={() => (showNonIT = !showNonIT)}
            aria-expanded={showNonIT}
            aria-controls="non-it-experience-list"
        >
            {showNonIT ? t.experience.hideNonIT : t.experience.showNonIT}
            <ChevronDown size={18} class={showNonIT ? "rotated" : ""} />
        </button>

        {#if showNonIT}
            <div class="non-it-list" transition:slide id="non-it-experience-list">
                {#each experienceData.nonIT as exp (exp.id)}
                    <div class="exp-card glass card non-it">
                        <span class="date">{exp.date}</span>
                        <h3>{exp.company}</h3>
                        <p class="role">{t.experience.roles[exp.roleKey]}</p>
                        <p class="desc">{t.experience.descriptions[exp.descKey]}</p>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</Section>

<style>
    .timeline {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .exp-card {
        padding: 25px;
    }

    .date {
        color: var(--accent-primary);
        font-weight: 700;
        font-size: 0.9rem;
        display: block;
        margin-bottom: 5px;
    }

    .role {
        color: var(--text-secondary);
        font-weight: 600;
        margin-bottom: 10px;
    }

    .btn-toggle-exp {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        padding: 14px;
        border-radius: 12px;
        cursor: pointer;
        font-family: inherit;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: var(--transition);
        width: 100%;
        margin-top: 20px;
    }

    .btn-toggle-exp:hover {
        border-color: var(--accent-primary);
    }

    :global(.btn-toggle-exp svg) {
        transition: transform 0.3s ease;
    }

    :global(.btn-toggle-exp svg.rotated) {
        transform: rotate(180deg);
    }
</style>

