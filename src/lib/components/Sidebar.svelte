<script lang="ts">
    import { language, translations, type Language } from "$lib/i18n";

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
        { id: "about", icon: User, label: t.nav.about },
        { id: "experience", icon: Briefcase, label: t.nav.experience },
        { id: "skills", icon: Laptop, label: t.nav.skills },
        { id: "projects", icon: Rocket, label: t.nav.projects },
        { id: "education", icon: GraduationCap, label: t.nav.education },
        { id: "other", icon: Sparkles, label: t.nav.additional },
    ];
</script>

<aside class="sidebar glass">
    <div class="profile-section">
        <h2 class="glow-text">Alik Zapolnov</h2>
        <p class="subtitle">AQA & AI Explorer</p>
    </div>

    <nav>
        <ul>
            {#each navItems as item}
                <li class:active={activeSection === item.id}>
                    <a href="#{item.id}">
                        <span class="icon">
                            <svelte:component this={item.icon} size={20} />
                        </span>
                        <span class="label">{item.label}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </nav>

    <div class="footer-info">
        <p>{t.lastUpdate}</p>
    </div>
</aside>

<style>
    .sidebar {
        width: 280px;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        display: flex;
        flex-direction: column;
        padding: 40px 20px;
        z-index: 100;
        border-radius: 0 24px 24px 0;
        border-left: none;
    }

    .profile-section {
        text-align: center;
        margin-bottom: 40px;
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 5px;
    }

    .subtitle {
        font-size: 0.9rem;
        color: var(--text-secondary);
    }

    nav {
        flex: 1;
    }

    ul {
        list-style: none;
    }

    li {
        margin-bottom: 8px;
        border-radius: 12px;
        transition: var(--transition);
        border: 1px solid transparent;
    }

    li a {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        text-decoration: none;
        color: var(--text-secondary);
        font-weight: 500;
    }

    li.active {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
    }

    li.active a {
        color: var(--accent-primary);
    }

    .icon {
        margin-right: 15px;
        font-size: 1.2rem;
    }

    .footer-info {
        margin-top: 20px;
        font-size: 0.75rem;
        color: var(--text-secondary);
        text-align: center;
        opacity: 0.7;
    }

    @media (max-width: 768px) {
        .sidebar {
            display: none;
        }
    }
</style>
