<script lang="ts">
    import type { Snippet } from "svelte";

    let { 
        id, 
        title, 
        icon,
        children 
    } = $props<{
        id: string;
        title: string;
        icon?: Snippet;
        children: Snippet;
    }>();
</script>

<section {id}>
    <div class="section-header">
        {#if icon}
            <div class="title-icon">
                {@render icon()}
            </div>
        {/if}
        <h2 class="section-title">{title}</h2>
    </div>
    <div class="section-content">
        {@render children()}
    </div>
</section>

<style>
    section {
        padding: 80px 0;
        scroll-margin-top: 80px;
    }

    .section-header {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 40px;
    }

    .title-icon {
        color: var(--accent-primary);
        background: rgba(var(--accent-primary-rgb), 0.1);
        width: 45px;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        border: 1px solid rgba(var(--accent-primary-rgb), 0.2);
    }

    .section-title {
        font-size: 2.5rem;
        font-weight: 800;
        position: relative;
        display: inline-block;
        color: var(--text-primary);
        letter-spacing: -0.03em;
        margin-bottom: 0; /* Override previous margin */
    }

    .section-title::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 40px;
        height: 3px;
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

        .section-header {
            margin-bottom: 30px;
            gap: 12px;
        }

        .title-icon {
            width: 35px;
            height: 35px;
        }

        .section-title {
            font-size: 1.8rem;
        }
    }
</style>
