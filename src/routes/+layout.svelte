<script lang="ts">
	import "../app.css";
	import Sidebar from "$lib/components/Sidebar.svelte";
	import BottomNav from "$lib/components/BottomNav.svelte";
	import Header from "$lib/components/Header.svelte";
	import { onMount } from "svelte";

	let activeSection = "hero";
	let theme = "dark";

	function toggleTheme() {
		theme = theme === "dark" ? "light" : "dark";
		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.style.colorScheme = "dark";
		localStorage.setItem("theme", theme);
	}

	onMount(() => {
		const savedTheme = localStorage.getItem("theme") || "dark";
		theme = savedTheme;
		document.documentElement.setAttribute("data-theme", theme);
		document.documentElement.style.colorScheme = "dark";

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

<div class="app-layout">
	<Header {theme} {toggleTheme} />
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
