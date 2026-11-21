<script lang="ts">
	import { focusTrap } from '$lib/utils/focusTrap';
	import { logService } from '$lib/services/logService.svelte';
	import { Bug, Check, Copy, Trash2, X } from 'lucide-svelte';
	import { onDestroy } from 'svelte';
	import ErrorLogItem from './ErrorLogItem.svelte';

	interface Props {
		isOpen: boolean;
		onclose: () => void;
	}
	let { isOpen, onclose }: Props = $props();

	type FilterType = 'all' | 'error' | 'warn' | 'info';
	let activeFilter = $state<FilterType>('all');
	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	const labelClose = 'Close';

	const allLogs = $derived(logService.logs);
	const errorCount = $derived(allLogs.filter((e) => e.level === 'error').length);
	const warnCount = $derived(allLogs.filter((e) => e.level === 'warn').length);
	const infoCount = $derived(allLogs.filter((e) => e.level === 'info').length);

	const filteredList = $derived(
		(activeFilter === 'all' ? allLogs : allLogs.filter((e) => e.level === activeFilter))
			.slice()
			.reverse()
	);

	onDestroy(() => {
		if (copyTimer) clearTimeout(copyTimer);
	});

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(logService.getReport());
			copied = true;
			if (copyTimer) clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 1500);
		} catch (error) {
			logService.warn?.('ui', `Failed to copy error report: ${String(error)}`);
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			event.preventDefault();
			onclose();
		}
	}
</script>

{#if isOpen}
	<div
		class="modal-backdrop"
		role="dialog"
		aria-modal="true"
		aria-labelledby="error-log-modal-title"
		data-testid="error-log-modal-overlay"
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) onclose();
		}}
		onkeydown={handleKeydown}
		use:focusTrap
	>
		<div class="modal-card" data-testid="error-log-modal-container">
			<div class="modal-header" data-testid="error-log-modal-header">
				<div class="header-left">
					<div class="icon-wrap"><Bug size={18} /></div>
					<div>
						<h2 id="error-log-modal-title" class="modal-title" data-testid="error-log-modal-title">Error & Event Log</h2>
						<span class="version-badge">v{typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'unknown'}</span>
					</div>
				</div>
				<button type="button" class="btn-close" onclick={onclose} aria-label={labelClose} data-testid="error-log-modal-close-btn">
					<X size={18} />
				</button>
			</div>

			<div class="modal-toolbar">
				<div class="tabs" role="tablist" data-testid="error-log-modal-tabs">
					<button type="button" role="tab" aria-selected={activeFilter === 'all'} class="tab" class:tab--active={activeFilter === 'all'} onclick={() => (activeFilter = 'all')} data-testid="error-log-modal-all-tab">
						All <span class="tab-badge tab-badge--all">{allLogs.length}</span>
					</button>
					<button type="button" role="tab" aria-selected={activeFilter === 'error'} class="tab" class:tab--active={activeFilter === 'error'} onclick={() => (activeFilter = 'error')} data-testid="error-log-modal-error-tab">
						Errors <span class="tab-badge tab-badge--error">{errorCount}</span>
					</button>
					<button type="button" role="tab" aria-selected={activeFilter === 'warn'} class="tab" class:tab--active={activeFilter === 'warn'} onclick={() => (activeFilter = 'warn')} data-testid="error-log-modal-warn-tab">
						Warnings <span class="tab-badge tab-badge--warn">{warnCount}</span>
					</button>
					<button type="button" role="tab" aria-selected={activeFilter === 'info'} class="tab" class:tab--active={activeFilter === 'info'} onclick={() => (activeFilter = 'info')} data-testid="error-log-modal-info-tab">
						Info <span class="tab-badge tab-badge--info">{infoCount}</span>
					</button>
				</div>

				<div class="actions">
					<button type="button" class="btn-action" class:btn-action--copied={copied} onclick={handleCopy} data-testid="error-log-modal-copy-btn" aria-label="Copy report">
						{#if copied}<Check size={14} /><span>Copied</span>{:else}<Copy size={14} /><span>Copy report</span>{/if}
					</button>
					<button type="button" class="btn-action btn-action--danger" onclick={() => logService.clear()} disabled={allLogs.length === 0} data-testid="error-log-modal-clear-btn" aria-label="Clear log">
						<Trash2 size={14} /><span>Clear</span>
					</button>
				</div>
			</div>

			<div class="modal-body" data-testid="error-log-modal-list">
				{#if filteredList.length === 0}
					<div class="empty-state" data-testid="error-log-modal-empty-message">
						<Check size={28} class="empty-icon" />
						<p class="empty-text">Log is empty. No events recorded.</p>
					</div>
				{:else}
					<div class="event-list">
						{#each filteredList as item, idx (idx)}
							<ErrorLogItem {item} />
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop { position: fixed; inset: 0; z-index: 10001; background: rgba(0, 0, 0, 0.7); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; padding: 16px; }
	.modal-card { background: #18181b; color: #f4f4f5; border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; width: 100%; max-width: 800px; max-height: 85dvh; display: flex; flex-direction: column; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); overflow: hidden; }
	.modal-header, .modal-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
	.header-left, .tabs, .actions { display: flex; align-items: center; gap: 6px; }
	.icon-wrap { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.3); color: #ef4444; }
	.modal-title { font-size: 1rem; font-weight: 700; margin: 0; color: #ffffff; }
	.version-badge { font-size: 0.6875rem; font-family: monospace; opacity: 0.6; }
	.btn-close { width: 28px; height: 28px; border: none; opacity: 0.7; cursor: pointer; border-radius: 6px; }
	.tab, .btn-action { cursor: pointer; border-radius: 6px; transition: all 0.15s ease; display: flex; align-items: center; gap: 6px; padding: 4px 10px; font-size: 0.8125rem; border: 1px solid rgba(255, 255, 255, 0.15); }
	.tab--active { border-color: rgba(255, 255, 255, 0.4); font-weight: 600; }
	.tab-badge { font-size: 0.625rem; padding: 1px 5px; border-radius: 4px; font-weight: 700; }
	.tab-badge--error { background: #dc2626; color: #ffffff; }
	.tab-badge--warn { background: #d97706; color: #000000; }
	.tab-badge--info { background: #2563eb; color: #ffffff; }
	.btn-action--copied { background: #15803d; color: #ffffff; }
	.btn-action--danger:hover { color: #ef4444; }
	.modal-body { flex: 1; overflow-y: auto; padding: 16px; min-height: 200px; }
	.empty-state { display: flex; flex-direction: column; align-items: center; padding: 40px; opacity: 0.7; }
	.empty-text { margin: 0; }
	:global(.empty-icon) { color: #22c55e; }
	.event-list { display: flex; flex-direction: column; gap: 8px; }
	@media (prefers-reduced-motion: reduce) { .tab, .btn-action { transition: none; } }
</style>
