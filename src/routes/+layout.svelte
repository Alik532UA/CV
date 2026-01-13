<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Header from "$lib/components/Header.svelte";
	import DynamicBackground from "$lib/components/DynamicBackground.svelte";
	import { onMount } from "svelte";
	import { language, type Language } from "$lib/i18n";
	import { fade } from "svelte/transition";

	let activeSection = "hero";
	let theme = "dark";
	let backgroundType: 0 | 1 | 2 | 3 = 1;
	let isChangingTheme = false;
	let isChangingLanguage = false;

	async function toggleTheme() {
		isChangingTheme = true;
		await new Promise((r) => setTimeout(r, 50));

		setTimeout(() => {
			theme = theme === "dark" ? "light" : "dark";
			document.documentElement.setAttribute("data-theme", theme);
			document.documentElement.style.colorScheme = "dark";
			localStorage.setItem("theme", theme);

			setTimeout(() => {
				isChangingTheme = false;
			}, 300);
		}, 200);
	}

	function changeLanguage(lang: Language) {
		if ($language === lang) return;

		isChangingLanguage = true;

		setTimeout(() => {
			language.set(lang);
			setTimeout(() => {
				isChangingLanguage = false;
			}, 50); // Short delay to render new text while blurred
		}, 200); // Animation duration for blur-in
	}

	function setBackgroundType(type: 0 | 1 | 2 | 3) {
		backgroundType = type;
		localStorage.setItem("backgroundType", type.toString());
	}

	onMount(() => {
		const savedTheme = localStorage.getItem("theme") || "dark";
		theme = savedTheme;
		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.style.colorScheme = "dark";

		const savedBgType = localStorage.getItem("backgroundType");
		if (savedBgType && ["0", "1", "2", "3"].includes(savedBgType)) {
			backgroundType = parseInt(savedBgType) as 0 | 1 | 2 | 3;
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
	});
</script>

<DynamicBackground {backgroundType} {theme} />

<div class="theme-transition-overlay" class:active={isChangingTheme}></div>

<div class="app-layout" class:language-changing={isChangingLanguage}>
	<Header
		{theme}
		{toggleTheme}
		{backgroundType}
		{setBackgroundType}
		{changeLanguage}
	/>
	<Sidebar {activeSection} />
	<BottomNav {activeSection} />

	<main>
		<slot />
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

	/* Ensure components have transition for filter */
	:global(.sidebar),
	:global(.bottom-nav) {
		transition: filter 0.2s ease-in-out !important; /* Force transition if overriden */
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
