<script lang="ts">
    import { MapPin, Mail, FileText } from "lucide-svelte";
    import { base } from "$app/paths";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { EMAIL, CONTACTS } from "$lib/config/contacts";
    import { handleEmailCopy } from "$lib/utils/emailCopy";
    import IconLinkedIn from "$lib/components/icons/IconLinkedIn.svelte";
    import IconWhatsApp from "$lib/components/icons/IconWhatsApp.svelte";
    import IconTelegram from "$lib/components/icons/IconTelegram.svelte";
    import IconViber from "$lib/components/icons/IconViber.svelte";

    let { isMobile, onOpenPdfModal } = $props<{
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
                {#each t.title as tag (tag)}
                    <span class="hobby-tag glass">{tag}</span>
                {/each}
            </div>
        {/if}
    </div>

    <div class="about-grid">
        <div class="about-main">
            <!-- Hidden on desktop: the sidebar carries these there. It only appears once
                 the sidebar is gone, under 768px. This is the one place a recruiter on mobile
                 is actually looking for. -->
            <div class="contacts-grid">
                <!-- Absolute external URL or app scheme, never a route -->
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={CONTACTS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary icon-only"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                >
                    <IconLinkedIn size={20} />
                </a>
                <!-- Absolute external URL or app scheme, never a route -->
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={CONTACTS.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary icon-only"
                    aria-label="WhatsApp"
                    title="WhatsApp"
                >
                    <IconWhatsApp size={20} />
                </a>
                <!-- Absolute external URL or app scheme, never a route -->
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={CONTACTS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary icon-only"
                    aria-label="Telegram"
                    title="Telegram"
                >
                    <IconTelegram size={20} />
                </a>
                <!-- Absolute external URL or app scheme, never a route -->
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={CONTACTS.viber}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn-secondary icon-only"
                    aria-label="Viber"
                    title="Viber"
                >
                    <IconViber size={20} />
                </a>
                <a
                    href="mailto:{EMAIL}"
                    class="btn-secondary icon-only"
                    onclick={handleEmailCopy}
                    data-testid="hero-email-link"
                    aria-label="Email"
                    title="Email"
                >
                    <Mail size={20} aria-hidden="true" />
                </a>
                <button
                    class="btn-secondary nowrap-btn pdf-btn"
                    onclick={onOpenPdfModal}
                    data-testid="hero-pdf-btn"
                >
                    <span><FileText size={18} aria-hidden="true" /></span> PDF version
                </button>
            </div>

            <div class="bio glass card">
                <p class="location">
                    <MapPin size={18} class="inline-icon" aria-hidden="true" />
                    {t.about.location}
                </p>
                <p class="bio-text">{t.about.content}</p>
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
        margin-bottom: 0;
        /* The bio is prose with unbreakable tech tokens in it —
           "(Java/Appium/Playwright)." alone measures 211px. An unbreakable word
           sets the min-content width of everything above it, so that one token
           was the page's second width floor after the project grid. `anywhere`
           rather than `break-word`: only this value lowers intrinsic size. */
        overflow-wrap: anywhere;
    }

    /* A direct child of .about-grid rather than of the text column, so it runs
       the full width instead of stopping short of the photo. Needs the gap
       above rather than below now that it sits under the bio card, and the same
       blur the glass cards use — flat, it read as unfinished next to them. */
    .philosophy-block {
        grid-column: 1 / -1;
        background: var(--card-bg);
        backdrop-filter: var(--glass-blur);
        -webkit-backdrop-filter: var(--glass-blur);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        padding: 18px 22px;
        margin-top: 25px;
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

    /* Hidden on desktop: the sidebar carries these there. It only appears once
       the sidebar is gone, under 768px. */
    .contacts-grid {
        display: none;
    }

    .icon-only {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        min-width: 0;
        width: 100%;
        height: 46px;
        border-radius: 12px;
        box-sizing: border-box;
    }

    .pdf-btn {
        grid-column: 1 / -1;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 46px;
        width: 100%;
        border-radius: 12px;
        box-sizing: border-box;
    }

    @media (max-width: 768px) {
        .contacts-grid {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 25px;
            width: 100%;
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
        background: var(--surface-subtle);
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
