<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Header from "$lib/components/Header.svelte";
	import DynamicBackground from "$lib/components/DynamicBackground.svelte";
	import { onMount } from "svelte";

	let activeSection = "hero";
	let theme = "dark";
	let backgroundType: 0 | 1 | 2 | 3 = 1;

	function toggleTheme() {
		theme = theme === "dark" ? "light" : "dark";
		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.style.colorScheme = "dark";
		localStorage.setItem("theme", theme);
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

{#if backgroundType !== 0}
	<DynamicBackground {backgroundType} {theme} />
{/if}

<div class="app-layout">
	<Header {theme} {toggleTheme} {backgroundType} {setBackgroundType} />
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
	}

	@media (max-width: 768px) {
		main {
			margin-left: 0;
			margin-top: 60px;
			padding: 20px;
			padding-bottom: 100px;
		}
	}
</style>
