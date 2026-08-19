<script lang="ts">
	import { page } from "$app/state";
	import { Home } from "lucide-svelte";
	import { language, t } from "$lib/controllers/I18nState.svelte";
	import { langPath } from "$lib/i18n/routing";

	/**
	 * The page SvelteKit renders when a load function throws or a route does not
	 * resolve (ERROR-HANDLING-v8 — the declared minimum of that document).
	 *
	 * This is not hypothetical here. `[[lang]]/+page.ts` calls `error(404, ...)`
	 * for an unknown language segment on purpose, so that /CV/xyz/ is a 404
	 * rather than a silent fall back to English under a real-looking address.
	 * Until this file existed, that deliberate 404 landed on SvelteKit's own
	 * built-in page: black text on white, in English, with no way back to the
	 * site and none of its chrome — the theme, the navigation, the language
	 * picker all gone.
	 *
	 * It renders inside +layout.svelte, so the header, sidebar and background
	 * stay; only the page body is replaced.
	 */

	// 404 gets its own wording because its cause is knowable and actionable —
	// almost always a mistyped language code in a shared link. Everything else
	// is a genuine surprise and gets the generic pair.
	const isNotFound = $derived(page.status === 404);
	const title = $derived(isNotFound ? t.errorPage.notFoundTitle : t.errorPage.genericTitle);
	const text = $derived(isNotFound ? t.errorPage.notFoundText : t.errorPage.genericText);
</script>

<svelte:head>
	<title>{title} | Alik Zapolnov</title>
	<!-- An error page must never be indexed: it returns 200 on static hosting
	     (GitHub Pages serves 404.html as the SPA shell), so nothing else tells
	     a crawler this is not real content. -->
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="error-page" role="alert">
	<p class="status" aria-hidden="true">{page.status}</p>
	<h1 data-testid="error-title-text">{title}</h1>
	<p class="text" data-testid="error-message-text">{text}</p>

	<!--
		Plain <a>, not goto(): this page is reached in states where the client
		router may itself be the thing that failed, and a full navigation is the
		one way back that does not depend on it.

		Back to the CURRENT language rather than to the bare path — someone who
		mistyped /CV/ukr/ wanted Ukrainian, and sending them to English would
		answer their typo by changing the subject. Same eslint exemption as
		everywhere else langPath() is used: it already carries `base`, and
		resolve() would prepend it a second time.
	-->
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a class="home" href={langPath(language.current)} data-testid="error-home-link">
		<Home size={18} aria-hidden="true" />
		<span>{t.errorPage.backHome}</span>
	</a>
</div>

<style>
	.error-page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 12px;
		min-height: 50vh;
		min-height: 50dvh;
		padding: 40px 20px;
		text-align: center;
	}

	.status {
		font-size: clamp(56px, 12vw, 96px);
		font-weight: 700;
		line-height: 1;
		margin: 0;
		/* Decorative scale, so it stays quiet next to the sentence that carries
		   the meaning. */
		color: var(--text-secondary);
		opacity: 0.35;
	}

	h1 {
		margin: 0;
		font-size: clamp(22px, 4vw, 30px);
		color: var(--text-primary);
	}

	.text {
		margin: 0;
		max-width: 46ch;
		color: var(--text-secondary);
	}

	.home {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin-top: 12px;
		/* 44px minimum touch target (ACCESSIBILITY-v8 § 10.3) — the padding is
		   what provides it; the label alone is shorter than that on mobile. */
		min-height: 44px;
		padding: 10px 20px;
		border-radius: 8px;
		border: 1px solid var(--accent-primary);
		color: var(--accent-primary);
		text-decoration: none;
		transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.home:hover {
		background: var(--accent-primary);
		color: var(--on-accent);
	}

	.home:focus-visible {
		outline: 2px solid var(--accent-primary);
		outline-offset: 3px;
	}

	@media (prefers-reduced-motion: reduce) {
		.home {
			transition: none;
		}
	}
</style>
