<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Header from "$lib/components/Header.svelte";
	import DynamicBackground from "$lib/components/DynamicBackground.svelte";
	import SEO from "$lib/components/SEO.svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { replaceState, afterNavigate } from "$app/navigation";
	import { language } from "$lib/controllers/I18nState.svelte";
	import { theme, background } from "$lib/controllers/UiState.svelte";
	import { migrateStorageKeys } from "$lib/utils/storageMigration";
	import LogCopyButton from "$lib/components/ui/LogCopyButton.svelte";
	import Toast from "$lib/components/ui/Toast.svelte";
	import { setContext } from "svelte";

	let { children } = $props();

	// Inject controllers via Context API for architectural consistency
	setContext("theme", theme);
	setContext("background", background);
	setContext("language", language);

	// Runes (Svelte 5)
	let activeSection = $state("about");
	let isRouterReady = $state(false);

	// URL Sync Effect for Sections
	$effect(() => {
		if (isRouterReady && browser) {
			// eslint-disable-next-line svelte/prefer-svelte-reactivity
			const url = new URL(window.location.href);
			
			// Only sync Section Hash here
			if (activeSection && url.hash !== `#${activeSection}`) {
				url.hash = activeSection;
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				replaceState(url.toString(), {});
			}
		}
	});

	afterNavigate(() => {
		isRouterReady = true;
		
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
		language.init();

		const observedElements = new Set<Element>();

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
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
		};
	});
</script>

<SEO />

<a href="#main-content" class="skip-link">Skip to main content</a>

<DynamicBackground backgroundType={background.type} theme={theme.current} />

<div class="theme-transition-overlay" class:active={theme.isChanging}></div>

<div class="app-layout" class:language-changing={language.isChanging}>
	<Header />
	<Sidebar {activeSection} />
	<BottomNav {activeSection} />
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
		color: #fff;
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
