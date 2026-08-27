<script lang="ts">
    import { language, translations } from "$lib/controllers/I18nState.svelte";
    import {
        User,
        Briefcase,
        Laptop,
        Rocket,
        GraduationCap,
        Sparkles,
        Mail,
        FileText,
    } from "lucide-svelte";
    import IconLinkedIn from "$lib/components/icons/IconLinkedIn.svelte";
    import IconWhatsApp from "$lib/components/icons/IconWhatsApp.svelte";
    import IconTelegram from "$lib/components/icons/IconTelegram.svelte";
    import IconViber from "$lib/components/icons/IconViber.svelte";
    import { pdfModal } from "$lib/controllers/PdfModalState.svelte";
    import { CONTACTS } from "$lib/config/contacts";
    import { handleEmailCopy } from "$lib/utils/emailCopy";

    let { activeSection = "hero" } = $props<{ activeSection?: string }>();

    let t = $derived(translations[language.current]);

    const contactLinks = [
        { label: "LinkedIn", href: CONTACTS.linkedin, icon: IconLinkedIn, external: true },
        { label: "WhatsApp", href: CONTACTS.whatsapp, icon: IconWhatsApp, external: true },
        { label: "Telegram", href: CONTACTS.telegram, icon: IconTelegram, external: true },
        { label: "Viber", href: CONTACTS.viber, icon: IconViber, external: true },
        {
            label: "Email",
            href: `mailto:${CONTACTS.email}`,
            icon: Mail,
            external: false,
            testid: "sidebar-email-link",
            onclick: handleEmailCopy
        }
    ];

    let navItems = $derived([
        { id: "about", icon: User, label: t.nav.about },
        { id: "experience", icon: Briefcase, label: t.nav.experience },
        { id: "skills", icon: Laptop, label: t.nav.skills },
        { id: "projects", icon: Rocket, label: t.nav.projects },
        { id: "education", icon: GraduationCap, label: t.nav.education },
        { id: "other", icon: Sparkles, label: t.nav.additional },
    ]);
</script>

<aside class="sidebar glass">
    <div class="profile-section">
        <h2 class="glow-text">Alik Zapolnov</h2>
        <p class="subtitle">AQA & AI Explorer</p>
    </div>

    <nav>
        <ul>
            {#each navItems as item (item.id)}
                <li class:active={activeSection === item.id}>
                    <a href="#{item.id}">
                        <span class="icon">
                            <item.icon size={20} aria-hidden="true" />
                        </span>
                        <span class="label">{item.label}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </nav>

    <!-- Desktop only: the sidebar is hidden under 768px, where the hero keeps
         its own copy of these. Icons carry no visible label here — the row has
         to stay on one line inside a 280px panel. -->
    <div class="sidebar-contacts">
        <div class="contact-icons">
            {#each contactLinks as link (link.label)}
                <!-- Absolute external URLs and mailto:/viber: schemes, never app
                     routes — resolve() would mangle them. -->
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    class="contact-icon"
                    aria-label={link.label}
                    title={link.label}
                    data-testid={link.testid}
                    onclick={link.onclick}
                >
                    <link.icon size={20} aria-hidden="true" />
                </a>
            {/each}
        </div>
        <button class="pdf-button" onclick={() => pdfModal.open()} data-testid="sidebar-pdf-btn">
            <FileText size={18} aria-hidden="true" />
            <span>PDF version</span>
        </button>
    </div>

    <div class="footer-info">
        <p>{t.lastUpdate}</p>
        <!--
            The version number lives on the service badge (ui/LogCopyButton),
            not here. It sat commented out at this spot for a long time, which is
            the worst of the three options: a visitor reading a CV has no use for
            a build number, and whoever debugs a screenshot could not see one
            either. The badge shows it in dev and, on request, in production.
        -->
    </div>
</aside>

<style>
    /* nav already has flex: 1, so this sits at the bottom without margin tricks */
    .sidebar-contacts {
        padding: 0 20px 12px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .contact-icons {
        display: flex;
        justify-content: space-between;
        gap: 4px;
    }

    .contact-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
        transition: var(--transition);
    }

    .contact-icon:hover {
        color: var(--accent-primary);
        border-color: var(--accent-primary);
    }



    .pdf-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        width: 100%;
        padding: 9px 12px;
        border-radius: 10px;
        border: 1px solid var(--border-color);
        background: transparent;
        color: var(--text-secondary);
        font-size: 0.85rem;
        font-family: inherit;
        cursor: pointer;
        transition: var(--transition);
    }

    .pdf-button:hover {
        color: var(--accent-primary);
        border-color: var(--accent-primary);
    }

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

    /* A lighter version of the .active treatment: hovering a section should
       read as "this is what you would land on", not compete with the section
       you are already in. */
    li:not(.active):hover {
        background: rgba(var(--accent-primary-rgb), 0.06);
        border-color: var(--border-color);
    }

    li:not(.active):hover a {
        color: var(--accent-primary);
    }

    .icon {
        margin-inline-end: 15px;
        font-size: 1.2rem;
    }

    .footer-info {
        margin-top: 20px;
        font-size: 0.75rem;
        color: var(--text-secondary);
        text-align: center;
        /* `opacity: 0.7` тут не було: --text-secondary уже приглушений, і
           множення приглушень давало #919195 — 2.75:1 при потрібних 4.5
           (ACCESSIBILITY-v8 § 6). Найдрібніший текст на сторінці був найгірше
           читаний. */
    }

    @media (max-width: 768px) {
        .sidebar {
            display: none;
        }
    }
</style>
