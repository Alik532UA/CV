<script lang="ts">
    import { language, translations } from "$lib/controllers/I18nState.svelte";
    import {
        User,
        Briefcase,
        Laptop,
        Rocket,
        GraduationCap,
        Sparkles,
    } from "lucide-svelte";

    let { activeSection = "hero" } = $props<{ activeSection?: string }>();
    
    let t = $derived(translations[language.current]);

    const navItems = $derived([
        { id: "about", icon: User, label: t.nav.about },
        { id: "experience", icon: Briefcase, label: t.nav.experience },
        { id: "skills", icon: Laptop, label: t.nav.skills },
        { id: "projects", icon: Rocket, label: t.nav.projects },
        { id: "education", icon: GraduationCap, label: t.nav.education },
        { id: "other", icon: Sparkles, label: t.nav.additional },
    ]);
</script>

<nav class="bottom-nav glass" aria-label={t.nav.bottom_nav_label || "Bottom navigation"}>
    {#each navItems as item (item.id)}
        <a 
            href="#{item.id}" 
            class:active={activeSection === item.id}
            aria-label={item.label}
            title={item.label}
        >
            <span class="icon">
                <item.icon size={24} aria-hidden="true" />
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

    /* Without the glow, which is reserved for the section actually in view. */
    a:not(.active):hover {
        color: var(--accent-primary);
        background: var(--card-bg);
    }

    @media (max-width: 768px) {
        .bottom-nav {
            display: flex;
        }
    }
</style>
