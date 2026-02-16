<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Header from "$lib/components/Header.svelte";
	import DynamicBackground from "$lib/components/DynamicBackground.svelte";
	import { onMount } from "svelte";
	import { browser } from "$app/environment";
	import { replaceState, afterNavigate } from "$app/navigation";
	import { language, type Language } from "$lib/i18n/index.svelte";
	import { theme, background } from "$lib/states/ui.svelte";

	let { children } = $props();

	// Runes (Svelte 5)
	let activeSection = $state("about");
	let isRouterReady = $state(false);

	// URL Sync Effect
	$effect(() => {
		if (isRouterReady && browser && language.current) {
			const url = new URL(window.location.href);
			if (url.searchParams.get('lang') !== language.current) {
				url.searchParams.set('lang', language.current);
				replaceState(url.toString(), {});
			}
		}
	});

	afterNavigate(() => {
		isRouterReady = true;
	});

	onMount(() => {
		// Sync Language from URL on Load
		const langParam = new URLSearchParams(window.location.search).get('lang') as Language;
		if (langParam && (langParam === 'en' || langParam === 'uk')) {
			language.current = langParam;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						activeSection = entry.target.id;
					}
				});
			},
			{ threshold: 0.3 },
		);

		document.querySelectorAll("section[id]").forEach((section) => {
			observer.observe(section);
		});
		
		return () => observer.disconnect();
	});
</script>

<DynamicBackground backgroundType={background.type} theme={theme.current} />

<div class="theme-transition-overlay" class:active={theme.isChanging}></div>

<div class="app-layout" class:language-changing={language.isChanging}>
	<Header />
	<Sidebar {activeSection} />
	<BottomNav {activeSection} />

	<main>
		{@render children()}
	</main>
</div>

<style>
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
