<script lang="ts">
    import { page } from "$app/state";
    import { language, translations } from "$lib/controllers/I18nState.svelte";
    import { INDEXED_LANGUAGES, bcp47, isHiddenRoute, isIndexed, langUrl, ogLocale } from "$lib/i18n/routing";
    // Both values come from one place, and the reasons they cannot be taken
    // from `page.url.origin` or from `base` live there (config/site.js): during
    // prerender the first is a host that does not resolve, and the second is
    // relative, which glued onto an origin gives "https://host./images/...".
    import { SITE_BASE, SITE_ORIGIN } from "$lib/config/site.js";

    let t = $derived(translations[language.current]);
    let title = $derived(t.hero.greeting);
    let description = $derived(t.hero.description);
    let imageUrl = $derived(`${SITE_ORIGIN}${SITE_BASE}/images/profile.jpg`);

    // Each language has its own address now. English resolves at both /CV/
    // and /CV/en/, and langUrl returns the bare path for it, so the explicit
    // one points its canonical at the bare one instead of competing with it.
    let canonical = $derived(langUrl(SITE_ORIGIN, language.current));

    // Only the reviewed languages are offered to search engines. The rest are
    // unreviewed machine translation: fully usable, addressable and shareable,
    // but kept out of the index rather than risking the domain being judged on
    // forty pages nobody has read.
    let indexable = $derived(isIndexed(language.current));

    /**
     * Службовий маршрут (BETA-CHECKLIST-v8 § 4). Одне рішення закриває три
     * вимоги одразу: сторінка не отримує ні `canonical`, ні `hreflang`, а
     * sitemap перелічує лише те, у чого canonical є, — тож і туди вона не
     * потрапляє. Замість цього — `noindex, nofollow`: `follow`, як у машинних
     * перекладів, тут зайвий, бо йти з неї нікуди.
     */
    let hidden = $derived(isHiddenRoute(page.route.id));

    // Structured data: lets search engines read this as a person rather than
    // guessing from prose, which is what drives the knowledge-panel style
    // result for a name query.
    let personLd = $derived(
        JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Alik Zapolnov",
            jobTitle: "Automation QA Engineer",
            description,
            url: canonical,
            image: imageUrl,
            email: "mailto:alikzapolnov@gmail.com",
            address: {
                "@type": "PostalAddress",
                addressLocality: "Odesa",
                addressCountry: "UA"
            },
            alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Odesa Polytechnic National University"
            },
            knowsAbout: [
                "Test Automation",
                "Quality Assurance",
                "Playwright",
                "Selenium",
                "C#",
                "Java",
                "Svelte",
                "AI Integration",
                "Large Language Models"
            ],
            sameAs: [
                "https://linkedin.com/in/alik-qa-engineer",
                "https://t.me/alik532",
                "https://alik532ua.github.io/DigitalWorkshop/"
            ]
        })
    );
</script>

<svelte:head>
    <title>{title} | Alik Zapolnov</title>
    <meta name="description" content={description} />
    <meta name="author" content="Alik Zapolnov" />
    {#if hidden}
        <meta name="robots" content="noindex, nofollow" />
    {:else}
        <link rel="canonical" href={canonical} />
        {#if !indexable}
            <meta name="robots" content="noindex, follow" />
        {:else}
            <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        {/if}

        <!-- Alternates for the reviewed languages only, so search engines are not
             pointed at pages this site asks them not to index. -->
        {#each INDEXED_LANGUAGES as alt (alt)}
            <link rel="alternate" hreflang={bcp47(alt)} href={langUrl(SITE_ORIGIN, alt)} />
        {/each}
        <link rel="alternate" hreflang="x-default" href={langUrl(SITE_ORIGIN, "en")} />
    {/if}

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonical} />
    <meta property="og:title" content="{title} | CV" />
    <meta property="og:description" content={description} />
    <meta property="og:locale" content={ogLocale(language.current)} />
    <meta property="og:image" content={imageUrl} />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonical} />
    <meta property="twitter:title" content="{title} | CV" />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={imageUrl} />

    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html `<script type="application/ld+json">${personLd}<\/script>`}
</svelte:head>
