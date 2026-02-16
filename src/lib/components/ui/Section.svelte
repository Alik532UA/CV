<script lang="ts">
    let { 
        id, 
        title, 
        children 
    } = $props<{
        id: string;
        title: string;
        children: import('svelte').Snippet;
    }>();
</script>

<section {id}>
    <h2 class="section-title">{title}</h2>
    <div class="section-content">
        {@render children()}
    </div>
</section>

<style>
    section {
        padding: 80px 0;
        scroll-margin-top: 80px;
    }

    .section-title {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 40px;
        position: relative;
        display: inline-block;
        color: var(--text-primary);
        letter-spacing: -0.03em;
    }

    .section-title::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 60px;
        height: 4px;
        background: var(--gradient);
        border-radius: 2px;
    }

    .section-content {
        position: relative;
    }

    @media (max-width: 768px) {
        section {
            padding: 50px 0;
        }

        .section-title {
            font-size: 2rem;
            margin-bottom: 30px;
        }
    }
</style>
