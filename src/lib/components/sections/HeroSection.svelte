<script lang="ts">
    import { MapPin, Linkedin, Send, Mail, FileText, CheckCircle2 } from "lucide-svelte";
    import { base } from "$app/paths";
    import { t } from "$lib/controllers/I18nState.svelte";

    let { isMobile, onOpenPdfModal } = $props<{
        isMobile: boolean;
        onOpenPdfModal: () => void;
    }>();

    let showEmailTooltip = $state(false);
    let tooltipTimeout: ReturnType<typeof setTimeout>;

    function handleEmailCopy(e: MouseEvent) {
        e.preventDefault();
        navigator.clipboard.writeText("alikzapolnov@gmail.com").then(() => {
            showEmailTooltip = true;
            clearTimeout(tooltipTimeout);
            tooltipTimeout = setTimeout(() => {
                showEmailTooltip = false;
            }, 5000);
        });
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
                    <div class="email-wrapper" style="position: relative;">
                        <button
                            class="btn-secondary"
                            onclick={handleEmailCopy}
                            style="width: 100%"
                        >
                            <span><Mail size={18} aria-hidden="true" /></span> Email
                        </button>
                        {#if showEmailTooltip}
                            <div class="email-tooltip">
                                <div class="tooltip-content">
                                    <span class="success-text"><CheckCircle2 size={16} /> {t.hero.emailCopied}</span>
                                    <a href="mailto:alikzapolnov@gmail.com" class="open-mail-client" onclick={(e) => e.stopPropagation()}>
                                        {t.hero.openMailClient}
                                    </a>
                                </div>
                                <div class="progress-container">
                                    <div class="tooltip-progress"></div>
                                </div>
                            </div>
                        {/if}
                    </div>
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
        margin-bottom: 30px;
    }

    .contacts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
    }

    .email-tooltip {
        position: absolute;
        bottom: calc(100% + 14px);
        left: 50%;
        transform: translateX(-50%);
        padding: 16px;
        border-radius: 12px;
        z-index: 100;
        min-width: 220px;
        background: var(--bg-color);
        border: 1px solid var(--border-color);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        animation: tooltip-fade-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }

    .email-tooltip::before,
    .email-tooltip::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        border-style: solid;
    }

    .email-tooltip::before {
        bottom: -7px;
        border-width: 7px 7px 0;
        border-color: var(--border-color) transparent transparent transparent;
    }

    .email-tooltip::after {
        bottom: -6px;
        border-width: 6px 6px 0;
        border-color: var(--bg-color) transparent transparent transparent;
    }

    .tooltip-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .success-text {
        font-weight: 600;
        color: var(--accent-primary, #4caf50);
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .open-mail-client {
        font-size: 0.8rem;
        color: var(--text-primary);
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
        padding: 6px 12px;
        border-radius: 8px;
        display: inline-block;
        width: 100%;
        text-align: center;
    }

    .open-mail-client:hover {
        background: rgba(255, 255, 255, 0.1);
        border-color: var(--accent-primary);
        color: var(--accent-primary);
    }

    @keyframes tooltip-fade-in {
        from {
            opacity: 0;
            transform: translate(-50%, 10px);
        }
        to {
            opacity: 1;
            transform: translate(-50%, 0);
        }
    }

    .progress-container {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        overflow: hidden;
        border-radius: 0 0 11px 11px;
    }

    .tooltip-progress {
        width: 100%;
        height: 100%;
        background: var(--gradient);
        animation: progress-shrink 5s linear forwards;
    }

    @keyframes progress-shrink {
        from {
            width: 100%;
        }
        to {
            width: 0%;
        }
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
