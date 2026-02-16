<script lang="ts">
    import { MapPin, Linkedin, Send, Mail, FileText } from "lucide-svelte";
    import { base } from "$app/paths";

    let { t, isMobile, onOpenPdfModal } = $props<{
        t: any;
        isMobile: boolean;
        onOpenPdfModal: () => void;
    }>();
</script>

<section id="about" class="about-section">
    <div class="intro-header">
        <h1 class="glow-text">{t.hero.greeting}</h1>
        {#if isMobile}
            <p class="tagline">{t.title_mobile}</p>
        {:else}
            <div class="tagline-tags">
                {#each t.title as tag}
                    <span class="hobby-tag glass">{tag}</span>
                {/each}
            </div>
        {/if}
    </div>

    <div class="about-grid">
        <div class="about-main">
            <div class="bio glass card">
                <p class="location">
                    <MapPin size={18} class="inline-icon" />
                    {t.about.location}
                </p>
                <p class="bio-text">{t.about.content}</p>

                <div class="contacts-grid">
                    <a
                        href="https://linkedin.com/in/alik-qa-engineer"
                        target="_blank"
                        class="btn-secondary"
                    >
                        <span><Linkedin size={18} /></span> LinkedIn
                    </a>
                    <a
                        href="https://t.me/alik532"
                        target="_blank"
                        class="btn-secondary"
                    >
                        <span><Send size={18} /></span> Telegram
                    </a>
                    <a
                        href="mailto:alikzapolnov@gmail.com"
                        class="btn-secondary"
                    >
                        <span><Mail size={18} /></span> Email
                    </a>
                    <button
                        class="btn-secondary nowrap-btn"
                        onclick={onOpenPdfModal}
                    >
                        <span><FileText size={18} /></span> PDF version
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
