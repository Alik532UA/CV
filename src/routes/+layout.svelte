<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/components/SidebarNav.svelte";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Header from "$lib/components/HeaderSection.svelte";
	import DynamicBackground from "$lib/components/DynamicBackground.svelte";
	import SEO from "$lib/components/SEO.svelte";
	import { onMount } from "svelte";
	import { SvelteSet } from "svelte/reactivity";
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { replaceState, afterNavigate } from "$app/navigation";
	import { language } from "$lib/controllers/I18nState.svelte";
	import { theme, background, section } from "$lib/controllers/UiState.svelte";
	import { sound } from "$lib/controllers/SoundState.svelte";
	import { shortcuts } from "$lib/controllers/ShortcutState.svelte";
	import { migrateStorageKeys } from "$lib/utils/storageMigration";
	import { initAnalytics, trackPageView, track } from "$lib/services/analytics";
	import LogCopyButton from "$lib/components/ui/LogCopyButton.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import { setContext } from "svelte";

	let { children } = $props();

	// Set here rather than in the page component: SEO.svelte lives in this
	// layout and renders before the page does, and `language` is a module
	// singleton. Assigning it further down meant that while prerendering, the
	// head of each page was still built from the previous page's language —
	// /uk/ shipped English tags, /ja/ shipped Ukrainian, and so on down the list.
	language.current = page.data.language ?? "en";

	// Effects do not run while prerendering, so the assignment above covers that;
	// this keeps the singleton in step with the browser back and forward buttons.
	$effect(() => {
		language.current = page.data.language ?? "en";
	});

	// Inject controllers via Context API for architectural consistency
	setContext("theme", theme);
	setContext("background", background);
	setContext("language", language);
	setContext("sound", sound);

	// Runes (Svelte 5)
	// The observer below owns this value; it lives on the section controller so
	// the PgUp/PgDn and 1-9 shortcuts step from the same "current" the navs show.
	let isRouterReady = $state(false);

	// URL Sync Effect for Sections
	$effect(() => {
		if (isRouterReady && browser) {
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const url = new URL(window.location.href);
			
			// Only sync Section Hash here
			if (section.active && url.hash !== `#${section.active}`) {
				url.hash = section.active;
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				replaceState(url.toString(), {});
			}
		}
	});

	afterNavigate(() => {
		isRouterReady = true;

		// Fires on the initial load too, so this covers both the first view and
		// any later client-side navigation.
		trackPageView();

		// Handle initial scroll if hash exists
		if (browser && window.location.hash) {
			const id = window.location.hash.slice(1);
			const el = document.getElementById(id);
			if (el) {
				setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
			}
		}
	});

	onMount(() => {
		// Migrate storage keys before initialization
		migrateStorageKeys();

		// Initialize global states
		theme.init();
		background.init();
		// The route segment decides the language; init falls back to the saved
		// choice only at the bare path, where none was named.
		language.init(page.data.routeLanguage);
		initAnalytics();

		// One delegated pair of listeners on document rather than a directive on
		// each of the ~43 interactive elements, so modals and anything added later
		// are covered without being wired up individually.
		const teardownSound = sound.init();
		const teardownShortcuts = shortcuts.init();

		const observedElements = new SvelteSet<Element>();
		// This is a single page, so without per-section events the report would
		// show one page view and nothing about how far anyone actually read.
		const reportedSections = new SvelteSet<string>();

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						section.observed(entry.target.id);
						// Once per load: the observer re-fires every time a
						// section scrolls back into view.
						if (!reportedSections.has(entry.target.id)) {
							reportedSections.add(entry.target.id);
							track("section_view", { section: entry.target.id });
						}
					}
				});
			},
			{ 
				threshold: 0.2,
				rootMargin: '-70px 0px -30% 0px' 
			},
		);

		const attachObservers = () => {
			document.querySelectorAll("section[id]").forEach((section) => {
				if (!observedElements.has(section)) {
					observedElements.add(section);
					observer.observe(section);
				}
			});
		};

		attachObservers();

		const mutationObserver = new MutationObserver(() => {
			attachObservers();
		});

		if (document.body) {
			mutationObserver.observe(document.body, { childList: true, subtree: true });
		}
		
		return () => {
			observer.disconnect();
			mutationObserver.disconnect();
			teardownSound?.();
			teardownShortcuts?.();
		};
	});
</script>

<SEO />

<a href="#main-content" class="skip-link">Skip to main content</a>

<DynamicBackground backgroundType={background.type} theme={theme.current} />

<div class="theme-transition-overlay" class:active={theme.isChanging}></div>

<div class="app-layout" class:language-changing={language.isChanging}>
	<Header />
	<Sidebar activeSection={section.active} />
	<BottomNav activeSection={section.active} />
	<LogCopyButton />
	<main id="main-content">
		{@render children()}
	</main>
</div>

<Toast />

<style>
	.skip-link {
		position: absolute;
		top: -40px;
		left: 0;
		background: var(--accent-primary);
		color: var(--on-accent);
		padding: 8px;
		z-index: 9999;
		transition: top 0.3s;
	}

	.skip-link:focus {
		top: 0;
	}

	.app-layout {
		display: flex;
		min-height: 100vh;
	}

	main {
		flex: 1;
		margin-left: 280px;
		margin-top: 70px;
		padding: 40px;
		position: relative;
		transition: filter 0.2s ease-in-out;
	}

	/* Global Blur for Language Change */
	.app-layout.language-changing main,
	.app-layout.language-changing :global(.sidebar),
	.app-layout.language-changing :global(.bottom-nav) {
		filter: blur(8px);
	}

	:global(.sidebar),
	:global(.bottom-nav) {
		transition: filter 0.2s ease-in-out !important;
	}

	@media (max-width: 768px) {
		main {
			margin-left: 0;
			margin-top: 60px;
			padding: 20px;
			padding-bottom: 100px;
		}
	}

	.theme-transition-overlay {
		position: fixed;
		inset: 0;
		pointer-events: none;
		opacity: 0;
		backdrop-filter: blur(0px);
		transition:
			opacity 0.2s ease-in-out,
			backdrop-filter 0.2s ease-in-out;
		z-index: 9999;
		background: rgba(0, 0, 0, 0.1);
	}

	.theme-transition-overlay.active {
		opacity: 1;
		backdrop-filter: blur(12px);
	}

	:global(body),
	:global(div),
	:global(section),
	:global(header),
	:global(aside),
	:global(button),
	:global(a),
	:global(p),
	:global(h1),
	:global(h2),
	:global(h3),
	:global(span) {
		transition:
			background-color 0.3s ease,
			color 0.3s ease,
			border-color 0.3s ease,
			box-shadow 0.3s ease;
	}
</style>
