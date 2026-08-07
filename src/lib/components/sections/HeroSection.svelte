<script lang="ts">
    import { MapPin, Linkedin, Send, Mail, FileText } from "lucide-svelte";
    import { base } from "$app/paths";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { toast } from "$lib/controllers/toast.svelte";
    import { EMAIL } from "$lib/config/contacts";

    let { isMobile, onOpenPdfModal } = $props<{
        isMobile: boolean;
        onOpenPdfModal: () => void;
    }>();

    function handleEmailCopy(e: MouseEvent) {
        e.preventDefault();
        // Capture synchronously: e.currentTarget is null by the time the async
        // clipboard promise resolves. The toast anchors to this button.
        const anchor = e.currentTarget as HTMLElement;
        const openMail = () => {
            window.location.href = `mailto:${EMAIL}`;
        };

        // Guard: clipboard is absent outside a secure context / in old browsers.
        if (!navigator.clipboard?.writeText) {
            openMail();
            return;
        }

        navigator.clipboard.writeText(EMAIL).then(
            () =>
                toast.success(
                    t.hero.emailCopied,
                    6000,
                    {
                        label: t.hero.openMailClient,
                        onAction: openMail
                    },
                    anchor // anchored: toast appears next to the button, not in the corner
                ),
            openMail // clipboard rejected → fall back to mailto
        );
    }
</script>

<section id="about" class="about-section">
    <div class="intro-header">
        <h1 class="glow-text">{t.hero.greeting}</h1>
        {#if isMobile}
            <p class="tagline">{t.title_mobile}</p>
        {:else}
            <div class="tagline-tags">
                {#each t.title as tag (tag)}
                    <span class="hobby-tag glass">{tag}</span>
                {/each}
            </div>
        {/if}
    </div>

    <div class="about-grid">
        <div class="about-main">
            <div class="bio glass card">
                <p class="location">
                    <MapPin size={18} class="inline-icon" aria-hidden="true" />
                    {t.about.location}
                </p>
                <p class="bio-text">{t.about.content}</p>

                {#if t.about.philosophyTitle && t.about.philosophyItems}
                    <div class="philosophy-block">
                        <h4 class="philosophy-title">{t.about.philosophyTitle}</h4>
                        <ul class="philosophy-list">
                            {#if t.about.philosophyItems.greenfield}<li>{t.about.philosophyItems.greenfield}</li>{/if}
                            {#if t.about.philosophyItems.dynamicTests}<li>{t.about.philosophyItems.dynamicTests}</li>{/if}
                            {#if t.about.philosophyItems.aiWorkflows}<li>{t.about.philosophyItems.aiWorkflows}</li>{/if}
                        </ul>
                    </div>
                {/if}

                <div class="contacts-grid">
                    <a
                        href="https://linkedin.com/in/alik-qa-engineer"
                        target="_blank"
                        class="btn-secondary"
                    >
                        <span><Linkedin size={18} aria-hidden="true" /></span> LinkedIn
                    </a>
                    <a
                        href="https://t.me/alik532"
                        target="_blank"
                        class="btn-secondary"
                    >
                        <span><Send size={18} aria-hidden="true" /></span> Telegram
                    </a>
                    <a
                        href="mailto:{EMAIL}"
                        class="btn-secondary"
                        onclick={handleEmailCopy}
                        data-testid="hero-email-link"
                    >
                        <span><Mail size={18} aria-hidden="true" /></span> Email
                    </a>
                    <button
                        class="btn-secondary nowrap-btn"
                        onclick={onOpenPdfModal}
                    >
                        <span><FileText size={18} aria-hidden="true" /></span> PDF
                        version
                    </button>
                </div>
            </div>
        </div>

        <div class="about-side">
            <div class="profile-card glass card">
                <img
                    src="{base}/images/profile.jpg"
                    alt="Profile"
                    class="profile-img"
                    fetchpriority="high"
                    decoding="async"
                    width="280"
                    height="280"
                />
            </div>
        </div>
    </div>
</section>

<style>
    section {
        padding: 80px 0;
    }

    .intro-header {
        text-align: center;
        margin-bottom: 50px;
        padding: 40px 0;
    }

    h1 {
        font-size: 5rem;
        margin-bottom: 10px;
        line-height: 1.1;
    }

    .about-grid {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 30px;
        align-items: start;
    }

    .tagline {
        font-size: 1.1rem;
        color: var(--text-secondary);
        margin-bottom: 25px;
        letter-spacing: 2px;
        text-transform: uppercase;
        white-space: pre-line;
    }

    .tagline-tags {
        display: flex;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 25px;
    }

    .location {
        color: var(--accent-primary);
        font-weight: 600;
        margin-bottom: 15px;
    }

    .bio-text {
        font-size: 1.1rem;
        line-height: 1.7;
        margin-bottom: 20px;
    }

    .philosophy-block {
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        padding: 18px 22px;
        margin-bottom: 25px;
    }

    .philosophy-title {
        font-size: 1rem;
        font-weight: 600;
        color: var(--accent-primary, #00f2ff);
        margin-bottom: 12px;
    }

    .philosophy-list {
        padding-left: 18px;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .philosophy-list li {
        font-size: 0.92rem;
        color: var(--text-secondary, rgba(255, 255, 255, 0.8));
        line-height: 1.5;
    }

    .contacts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
    }

    .nowrap-btn {
        white-space: nowrap;
        font-size: 0.95rem;
    }

    .profile-card {
        padding: 10px;
        border-radius: 30px;
    }

    .profile-img {
        width: 100%;
        /* Without this the height="280" attribute survives as a presentational
           hint: the image keeps a fixed 280px height while width follows the
           container, so it stretches wherever .about-side is narrower than 300px. */
        height: auto;
        aspect-ratio: 1 / 1;
        object-fit: cover;
        border-radius: 20px;
        display: block;
    }

    .hobby-tag {
        padding: 6px 14px;
        border-radius: 15px;
        font-size: 0.85rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
    }

    @media (max-width: 1024px) {
        .intro-header {
            padding: 20px 0;
        }

        h1 {
            font-size: 3.5rem;
            text-align: center;
        }

        .about-grid {
            grid-template-columns: 1fr;
            display: flex;
            flex-direction: column;
        }

        .about-side {
            display: block;
            order: -1;
            width: 200px;
            margin: 0 auto 20px;
        }

        .tagline {
            text-align: center;
        }
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 2.8rem;
        }
    }
</style>
