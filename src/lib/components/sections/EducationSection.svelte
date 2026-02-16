<script lang="ts">
    import Section from "../ui/Section.svelte";
    import { t } from "$lib/i18n/index.svelte";
</script>

<Section id="education" title={t.education.title}>
    <div class="education-grid">
        {#each t.education.items as edu}
            <div class="edu-card glass card">
                <h3>{edu.institution}</h3>
                <span class="date">{edu.date}</span>
                <p>{edu.desc}</p>
            </div>
        {/each}
    </div>
</Section>

<style>
    .education-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .edu-card {
        padding: 25px;
    }

    .date {
        color: var(--accent-primary);
        font-weight: 700;
        font-size: 0.9rem;
        display: block;
        margin-bottom: 5px;
    }
</style>
