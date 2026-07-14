<script lang="ts">
	import { dev } from "$app/environment";
	import { logService } from "$lib/services/logService.svelte";
	import { Check } from "lucide-svelte";
	import { fade, scale } from "svelte/transition";

	let copied = $state(false);
	const isVisible = $derived(dev && logService.errorCount > 0);

	async function copyReport() {
		try {
			await navigator.clipboard.writeText(logService.getReport());
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			console.error("Failed to copy logs:", err);
		}
	}
</script>

{#if isVisible}
	<button
		class="log-fab"
		class:copied
		onclick={copyReport}
		aria-label="Copy Error Report"
		in:scale={{ duration: 300, start: 0.5 }}
		out:fade={{ duration: 200 }}
	>
		<div class="icon-container">
			{#if copied}
				<div in:scale={{ duration: 200 }}>
					<Check size={18} />
				</div>
			{:else}
				<span class="count">{logService.errorCount}</span>
			{/if}
		</div>
	</button>
{/if}

<style>
	.log-fab {
		position: fixed;
		bottom: 16px;
		left: 16px;
		z-index: 9999;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background-color: #ff4444;
		color: white;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		padding: 0;
	}

	@media (max-width: 768px) {
		.log-fab {
			width: 24px;
			height: 24px;
			bottom: 80px; /* Above bottom nav */
		}
		.count {
			font-size: 10px;
		}
	}

	.log-fab:hover {
		transform: scale(1.1);
		background-color: #ff5555;
	}

	.log-fab.copied {
		background-color: #00c851;
	}

	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.count {
		font-weight: bold;
		font-size: 12px;
		font-family: monospace;
	}
</style>
