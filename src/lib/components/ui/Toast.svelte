<script lang="ts">
	import { toast, type ToastMessage } from "$lib/controllers/toast.svelte";
	import { t } from "$lib/controllers/I18nState.svelte";
	import { CopyCheck, AlertCircle, AlertTriangle, Info, X } from "lucide-svelte";
	import { fly, fade } from "svelte/transition";
	import { MediaQuery } from "svelte/reactivity";

	// SSR-safe (fallback = false); disables only the decorative positional entrance.
	const reduceMotion = new MediaQuery("(prefers-reduced-motion: reduce)");
	// On narrow screens an anchored toast falls back to the global stack (predictable on mobile).
	const isNarrow = new MediaQuery("(max-width: 600px)");

	// Global (corner) vs anchored (next to the trigger) — see §5.
	const globalMsgs = $derived(toast.messages.filter((m) => !m.anchor || isNarrow.current));
	const anchoredMsgs = $derived(toast.messages.filter((m) => m.anchor && !isNarrow.current));

	// Position an anchored toast next to its button. Flip above/below by the
	// button's half of the viewport, center horizontally over it, then clamp the
	// toast fully on-screen using its measured size — so it can never render
	// partially or wholly off-screen (the whole point of anchoring).
	function positionAnchored(node: HTMLElement, anchor: HTMLElement) {
		const place = () => {
			const a = anchor.getBoundingClientRect();
			const w = node.getBoundingClientRect(); // measured toast size
			const gap = 10;
			const margin = 8;
			const vw = window.innerWidth;
			const vh = window.innerHeight;

			// Button center in the lower half → toast above; upper half → below.
			const above = a.top + a.height / 2 > vh / 2;
			let top = above ? a.top - gap - w.height : a.bottom + gap;
			top = Math.max(margin, Math.min(top, vh - w.height - margin));

			// Centered on the button, clamped to the viewport.
			let left = a.left + a.width / 2 - w.width / 2;
			left = Math.max(margin, Math.min(left, vw - w.width - margin));

			node.style.top = `${Math.round(top)}px`;
			node.style.left = `${Math.round(left)}px`;
		};
		place();
		return { update: place };
	}

	// Anchored toasts are positioned once; close them when the page actually
	// scrolls (past a small threshold, so incidental sub-pixel scrolls don't
	// nuke the toast) or on resize, instead of tracking the button.
	$effect(() => {
		if (anchoredMsgs.length === 0) return;
		const startX = window.scrollX;
		const startY = window.scrollY;
		const closeAll = () => {
			for (const m of toast.messages) if (m.anchor) toast.remove(m.id);
		};
		const onScroll = () => {
			if (Math.abs(window.scrollX - startX) < 6 && Math.abs(window.scrollY - startY) < 6) return;
			closeAll();
		};
		window.addEventListener("scroll", onScroll, { passive: true, capture: true });
		window.addEventListener("resize", closeAll);
		return () => {
			window.removeEventListener("scroll", onScroll, true);
			window.removeEventListener("resize", closeAll);
		};
	});
</script>

{#snippet toastCard(msg: ToastMessage)}
	<div
		class="toast-msg toast-{msg.type}"
		in:fly={{ y: reduceMotion.current ? 0 : 20, duration: reduceMotion.current ? 0 : 300 }}
		out:fade={{ duration: reduceMotion.current ? 0 : 200 }}
		role={msg.type === "error" ? "alert" : "status"}
		data-testid={`toast-message-${msg.type}`}
		onmouseenter={() => toast.pause(msg.id)}
		onmouseleave={() => toast.resume(msg.id)}
		onfocusin={() => toast.pause(msg.id)}
		onfocusout={() => toast.resume(msg.id)}
	>
		<div class="toast-icon" data-testid={`toast-icon-${msg.type}`}>
			{#if msg.type === "success"}<CopyCheck size={20} aria-hidden="true" />
			{:else if msg.type === "error"}<AlertCircle size={20} aria-hidden="true" />
			{:else if msg.type === "warn"}<AlertTriangle size={20} aria-hidden="true" />
			{:else}<Info size={20} aria-hidden="true" />{/if}
		</div>

		<div class="toast-content">
			<div class="toast-message" data-testid="toast-text-label">{msg.message}</div>
			{#if msg.action}
				<button
					class="toast-action"
					onclick={() => {
						msg.action?.onAction();
						toast.remove(msg.id);
					}}
					data-testid="toast-action-button"
				>
					{msg.action.label}
				</button>
			{/if}
		</div>

		<button
			class="toast-close"
			onclick={() => toast.remove(msg.id)}
			aria-label={t.common.close}
			data-testid="toast-close-button"
		>
			<X size={16} aria-hidden="true" />
		</button>

		<div
			class="toast-progress"
			style="animation-duration: {msg.duration}ms"
			data-testid="toast-progress-bar"
			aria-hidden="true"
		></div>
	</div>
{/snippet}

<!-- Global stack (bottom-right): ambient error/info and anything without an anchor. -->
<div class="toast-container" data-testid="toast-notifications-container">
	{#each globalMsgs as msg (msg.id)}
		{@render toastCard(msg)}
	{/each}
</div>

<!-- Anchored toasts (next to the trigger, flipped above/below) — §5. -->
{#each anchoredMsgs as msg (msg.id)}
	<div class="toast-anchored" use:positionAnchored={msg.anchor!} data-testid="toast-anchored-wrapper">
		{@render toastCard(msg)}
	</div>
{/each}

<style>
	.toast-container {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		z-index: 10000;
		pointer-events: none; /* container never intercepts clicks; toasts do */
	}

	/* Anchored toast: fixed next to the button; top/left set by positionAnchored (measured + clamped). */
	.toast-anchored {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10000;
		max-width: min(92vw, 420px);
		pointer-events: auto;
	}

	.toast-msg {
		pointer-events: auto;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: flex-start;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border-radius: 14px;
		background: var(--toast-bg, rgba(18, 18, 18, 0.88));
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid var(--border-color);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25), 0 0 20px rgba(var(--accent-primary-rgb), 0.1);
		min-width: 300px;
		max-width: 420px;
		color: var(--text-primary);
	}

	/* WCAG 2.2.1 (visual half): pause the shrink on hover OR focus inside the toast. */
	.toast-msg:hover .toast-progress,
	.toast-msg:focus-within .toast-progress {
		animation-play-state: paused;
	}

	/* Timer visualization. Duration comes inline from msg.duration (single source). */
	@keyframes toast-shrink {
		from {
			transform: scaleX(1);
		}
		to {
			transform: scaleX(0);
		}
	}
	.toast-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 3px;
		transform-origin: left center;
		animation: toast-shrink linear forwards;
	}
	.toast-success .toast-progress {
		background: #22c55e;
	}
	.toast-warn .toast-progress {
		background: #f59e0b;
	}
	.toast-error .toast-progress {
		background: #ef4444;
	}
	.toast-info .toast-progress {
		background: #3b82f6;
	}

	.toast-icon {
		display: flex;
		flex-shrink: 0;
	}
	.toast-success .toast-icon {
		color: #22c55e;
	}
	.toast-warn .toast-icon {
		color: #f59e0b;
	}
	.toast-error .toast-icon {
		color: #ef4444;
	}
	.toast-info .toast-icon {
		color: #3b82f6;
	}

	.toast-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}
	.toast-message {
		line-height: 1.4;
	}

	.toast-action {
		align-self: flex-start;
		min-height: 44px; /* touch target */
		padding: 6px 14px;
		cursor: pointer;
		color: var(--text-primary);
		background: var(--toast-action-bg, rgba(255, 255, 255, 0.08));
		border: 1px solid var(--border-color);
		border-radius: 8px;
		font-weight: 500;
		transition: all 0.2s;
	}
	.toast-action:hover {
		border-color: var(--accent-primary);
		color: var(--accent-primary);
		background: var(--toast-hover-bg, rgba(255, 255, 255, 0.14));
	}

	.toast-close {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px; /* touch target */
		height: 44px;
		margin: -0.5rem -0.5rem 0 0;
		cursor: pointer;
		background: transparent;
		border: none;
		border-radius: 50%;
		color: var(--text-secondary);
		opacity: 0.75;
		transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
		            background-color 0.25s ease,
		            color 0.25s ease,
		            opacity 0.25s ease;
		-webkit-tap-highlight-color: transparent;
	}

	.toast-close:hover {
		opacity: 1;
		background: var(--toast-hover-bg, rgba(255, 255, 255, 0.12));
		color: var(--text-primary);
		transform: rotate(90deg) scale(1.08);
	}

	.toast-close:active {
		transform: rotate(90deg) scale(0.92);
		background: var(--toast-hover-bg, rgba(255, 255, 255, 0.18));
	}

	.toast-close:focus-visible {
		outline: 2px solid var(--accent-primary, #00f2ff);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.toast-close,
		.toast-close:hover,
		.toast-close:active {
			transition: none;
			transform: none;
		}
	}

	@media (max-width: 600px) {
		.toast-container {
			bottom: 1rem;
			left: 1rem;
			right: 1rem;
			align-items: stretch;
		}
		.toast-msg {
			min-width: 0;
			max-width: 100%;
		}
	}
</style>
