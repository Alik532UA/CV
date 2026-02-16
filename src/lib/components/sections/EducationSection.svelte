<script lang="ts">
    let { t } = $props<{ t: any }>();
</script>

<section id="education">
    <h2 class="section-title">{t.education.title}</h2>
    <div class="education-grid">
        {#each t.education.items as edu}
            <div class="edu-card glass card">
                <h3>{edu.institution}</h3>
                <span class="date">{edu.date}</span>
                <p>{edu.desc}</p>
            </div>
        {/each}
    </div>
</section>

<style>
    section {
        padding: 60px 0;
    }

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
