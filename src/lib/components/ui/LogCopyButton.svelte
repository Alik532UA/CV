<script lang="ts">
	import { browser } from "$app/environment";
	import { page } from "$app/state";
	import { onDestroy } from "svelte";
	import { debugState } from "$lib/controllers/DebugState.svelte";
	import { t } from "$lib/controllers/I18nState.svelte";
	import { fill } from "$lib/i18n/fill";
	import { logService } from "$lib/services/logService.svelte";
	import { Check, Copy, Eye, RotateCcw, EyeOff } from "lucide-svelte";
	import { fade, scale } from "svelte/transition";
	import ErrorLogModal from "./ErrorLogModal.svelte";

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;
	let showMenu = $state(false);
	let isModalOpen = $state(false);
	let userDismissed = $state(false);
	let menuX = $state(16);
	let menuY = $state(60);

	const appVersion = __APP_VERSION__;

	const urlDebug = $derived(browser && page.url.searchParams.get("debug") === "1");
	const isVisible = $derived((urlDebug || debugState.enabled) && !userDismissed);

	let fallbackReport = $state<string | null>(null);

	onDestroy(() => {
		if (copyTimer) clearTimeout(copyTimer);
	});

	function handleGlobalKeydown(e: KeyboardEvent) {
		if (e.key === "Escape" && showMenu) {
			showMenu = false;
		}
	}

	async function copyReport() {
		const report = logService.getReport();
		try {
			await navigator.clipboard.writeText(report);
			fallbackReport = null;
			copied = true;
			copyTimer = setTimeout(() => (copied = false), 1500);
		} catch (err) {
			logService.warn("ui", `Failed to copy the log report: ${String(err)}`);
			fallbackReport = report;
		}
	}

	function openMenu(e: MouseEvent) {
		e.stopPropagation();
		const target = e.currentTarget as HTMLElement | null;
		const rect = target?.getBoundingClientRect();
		if (rect) {
			menuX = rect.left;
			menuY = Math.max(8, rect.top - 180);
		}
		showMenu = !showMenu;
	}

	function handleCopyReport() {
		showMenu = false;
		void copyReport();
	}

	function handleViewErrors() {
		showMenu = false;
		isModalOpen = true;
	}

	function handleClearLogs() {
		showMenu = false;
		logService.clear();
	}

	function handleHideBadge() {
		showMenu = false;
		userDismissed = true;
		if (debugState.enabled) {
			debugState.toggle();
		}
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} onclick={() => { if (showMenu) showMenu = false; }} />

{#if fallbackReport}
	<textarea
		class="log-fallback"
		readonly
		value={fallbackReport}
		aria-label={fill(t.ui.copyReport, { version: appVersion })}
		data-testid="debug-log-fallback-input"
	></textarea>
{/if}

{#if isVisible}
	<button
		type="button"
		class="log-fab"
		class:has-errors={logService.errorCount > 0}
		class:copied
		onclick={openMenu}
		oncontextmenu={(e) => { e.preventDefault(); openMenu(e); }}
		aria-label={fill(t.ui.copyReport, { version: appVersion })}
		aria-haspopup="menu"
		aria-expanded={showMenu}
		data-testid="app-version-value"
		in:scale={{ duration: 300, start: 0.5 }}
		out:fade={{ duration: 200 }}
	>
		{#if copied}
			<div in:scale={{ duration: 200 }}>
				<Check size={14} class="hint-icon" />
			</div>
		{:else if logService.errorCount > 0}
			<span class="count">{logService.errorCount > 99 ? "99+" : logService.errorCount}</span>
		{:else}
			<Copy size={12} class="hint-icon" />
		{/if}
		<span class="version">{appVersion}</span>
	</button>

	{#if showMenu}
		<div
			class="context-menu"
			role="menu"
			tabindex="-1"
			style="left: {menuX}px; top: {menuY}px;"
			data-testid="service-badge-context-menu"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => { if (e.key === 'Escape') showMenu = false; }}
		>
			<button
				type="button"
				role="menuitem"
				class="menu-item"
				onclick={handleCopyReport}
				data-testid="service-badge-copy-report-btn"
			>
				<Copy size={14} />
				<span>Скопіювати повний звіт</span>
			</button>
			<button
				type="button"
				role="menuitem"
				class="menu-item"
				onclick={handleViewErrors}
				data-testid="service-badge-view-errors-btn"
			>
				<Eye size={14} />
				<span>Переглянути помилки ({logService.errorCount})</span>
			</button>
			<button
				type="button"
				role="menuitem"
				class="menu-item"
				onclick={handleClearLogs}
				data-testid="service-badge-clear-btn"
			>
				<RotateCcw size={14} />
				<span>Скинути лічильник</span>
			</button>
			<button
				type="button"
				role="menuitem"
				class="menu-item menu-item--hide"
				onclick={handleHideBadge}
				data-testid="service-badge-hide-btn"
			>
				<EyeOff size={14} />
				<span>Приховати табло</span>
			</button>
		</div>
	{/if}

	<ErrorLogModal isOpen={isModalOpen} onclose={() => (isModalOpen = false)} />
{/if}

<style>
	.log-fab {
		position: fixed;
		bottom: 16px;
		left: 16px;
		z-index: 9999;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		min-height: 32px;
		padding: 0 8px;
		border-radius: 16px;
		background-color: var(--panel-bg);
		color: var(--text-primary);
		border: 2px solid var(--border-color);
		cursor: pointer;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
	}
	.log-fab:hover {
		transform: scale(1.05);
	}
	.version {
		font-size: 10px;
		font-family: monospace;
		line-height: 1;
		white-space: nowrap;
	}
	.log-fab :global(.hint-icon) {
		opacity: 0.6;
		flex: none;
	}
	.log-fab.has-errors {
		background-color: #c92a2a;
		color: white;
		border-color: #7f1d1d;
	}
	.log-fab.copied {
		background-color: #237a35;
		color: white;
		border-color: #1b5e20;
	}
	.count {
		font-weight: bold;
		font-size: 11px;
		font-family: monospace;
		line-height: 1;
		padding: 2px 5px;
		border-radius: 8px;
		background-color: #7f1d1d;
		color: white;
	}
	@media (hover: none) {
		.log-fab {
			min-height: 44px;
			padding: 0 12px;
			border-radius: 22px;
			bottom: 80px;
		}
		.version {
			font-size: 12px;
		}
		.count {
			font-size: 14px;
		}
	}
	.log-fallback {
		position: fixed;
		bottom: 76px;
		left: 16px;
		width: min(38rem, calc(100vw - 32px));
		height: min(40dvh, 20rem);
		z-index: 9999;
		padding: 8px;
		font-family: monospace;
		font-size: 0.75rem;
		background: #1e1e1e;
		color: #ffffff;
		border: 2px solid #ef4444;
		border-radius: 8px;
		resize: none;
	}
	.context-menu {
		position: fixed;
		z-index: 10000;
		background: #1e1e24;
		border: 1px solid rgba(255, 255, 255, 0.15);
		border-radius: 10px;
		padding: 6px;
		display: flex;
		flex-direction: column;
		gap: 2px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
		min-width: 210px;
	}
	.menu-item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		font-size: 0.8125rem;
		color: #f1f5f9;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		text-align: left;
		transition: opacity 0.15s ease;
	}
	.menu-item:hover {
		opacity: 0.85;
	}
	.menu-item--hide {
		color: #94a3b8;
		border-top: 1px solid rgba(255, 255, 255, 0.08);
		margin-top: 4px;
		padding-top: 8px;
	}
	@media (prefers-reduced-motion: reduce) {
		.log-fab, .menu-item {
			transition: none;
		}
	}
</style>
