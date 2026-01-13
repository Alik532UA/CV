<script lang="ts">
    import { language, translations } from "$lib/i18n";

    export let activeSection = "hero";

    import {
        User,
        Briefcase,
        Laptop,
        Rocket,
        GraduationCap,
        Sparkles,
    } from "lucide-svelte";
    $: t = translations[$language];

    $: navItems = [
        { id: "about", icon: User },
        { id: "experience", icon: Briefcase },
        { id: "skills", icon: Laptop },
        { id: "projects", icon: Rocket },
        { id: "education", icon: GraduationCap },
        { id: "other", icon: Sparkles },
    ];
</script>

<nav class="bottom-nav glass">
    {#each navItems as item}
        <a href="#{item.id}" class:active={activeSection === item.id}>
            <span class="icon">
                <svelte:component this={item.icon} size={24} />
            </span>
        </a>
    {/each}
</nav>

<style>
    .bottom-nav {
        display: none;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 64px;
        z-index: 1000;
        justify-content: space-around;
        align-items: center;
        border-radius: 0;
        padding: 0 10px;
        background: var(--header-bg);
        border: none;
        border-top: 1px solid var(--border-color);
    }

    a {
        text-decoration: none;
        color: var(--text-secondary);
        font-size: 1.4rem;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: var(--transition);
    }

    a.active {
        color: var(--accent-primary);
        background: var(--card-bg);
        box-shadow: 0 0 15px rgba(0, 242, 255, 0.15);
    }

    @media (max-width: 768px) {
        .bottom-nav {
            display: flex;
        }
    }
</style>
