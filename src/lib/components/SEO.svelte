<script lang="ts">
    import { language, translations } from "$lib/controllers/I18nState.svelte";
    import { page } from "$app/state";
    import { base } from "$app/paths";
    
    let t = $derived(translations[language.current]);
    let title = $derived(t.hero.greeting);
    let description = $derived(t.hero.description);
</script>

<svelte:head>
    <title>{title} | Alik Zapolnov</title>
    <meta name="description" content={description} />
    <meta name="author" content="Alik Zapolnov" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={page.url.href} />
    <meta property="og:title" content="{title} | CV" />
    <meta property="og:description" content={description} />
    <meta property="og:locale" content={language.current === 'uk' ? 'uk_UA' : 'en_US'} />
    <meta property="og:image" content="{page.url.origin}{base}/images/profile.jpg" />

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={page.url.href} />
    <meta property="twitter:title" content="{title} | CV" />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content="{page.url.origin}{base}/images/profile.jpg" />
</svelte:head>
