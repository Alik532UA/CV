<script lang="ts">
    import { ChevronDown } from "lucide-svelte";
    import { slide } from "svelte/transition";

    let { t } = $props<{ t: any }>();
    let showNonIT = $state(false);
</script>

<section id="experience">
    <h2 class="section-title">{t.experience.title}</h2>
    <div class="timeline">
        {#each t.experience.it as exp}
            <div class="exp-card glass card">
                <span class="date">{exp.date}</span>
                <h3>{exp.company}</h3>
                <p class="role">{exp.role}</p>
                <p class="desc">{exp.desc}</p>
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
                {#each t.experience.nonIT as exp}
                    <div class="exp-card glass card non-it">
                        <span class="date">{exp.date}</span>
                        <h3>{exp.company}</h3>
                        <p class="role">{exp.role}</p>
                        <p class="desc">{exp.desc}</p>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</section>

<style>
    section {
        padding: 60px 0;
    }

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
