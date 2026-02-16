<script lang="ts">
    import { X } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";
    import { onMount, tick } from "svelte";

    let { 
        show = $bindable(), 
        title,
        children,
        onclose
    } = $props<{
        show: boolean;
        title?: string;
        children: import('svelte').Snippet;
        onclose?: () => void;
    }>();

    let modalRef: HTMLDivElement | undefined = $state();
    let previouslyFocused: HTMLElement | null = null;

    function close() {
        show = false;
        onclose?.();
    }

    function handleKeydown(e: KeyboardEvent) {
        if (!show) return;

        if (e.key === "Escape") {
            close();
        }

        if (e.key === "Tab" && modalRef) {
            const focusableElements = modalRef.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    }

    $effect(() => {
        if (show) {
            previouslyFocused = document.activeElement as HTMLElement;
            tick().then(() => {
                const firstFocusable = modalRef?.querySelector(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                ) as HTMLElement;
                firstFocusable?.focus();
            });
            document.body.style.overflow = 'hidden';
        } else {
            previouslyFocused?.focus();
            document.body.style.overflow = '';
        }
    });

    onMount(() => {
        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
            document.body.style.overflow = '';
        };
    });
</script>

{#if show}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="modal-backdrop"
        onclick={close}
        transition:fade={{ duration: 200 }}
    >
        <div
            bind:this={modalRef}
            class="modal-content glass card"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            tabindex="-1"
            transition:scale={{ duration: 200, start: 0.95 }}
        >
            <button class="close-btn" onclick={close} aria-label="Close modal">
                <X size={24} />
            </button>

            {#if title}
                <h3 id="modal-title">{title}</h3>
            {/if}

            <div class="modal-body">
                {@render children()}
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(8px);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .modal-content {
        position: relative;
        background: var(--card-bg);
        padding: 40px;
        border-radius: 24px;
        max-width: 650px;
        width: 100%;
        border: 1px solid var(--border-color);
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .close-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 8px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
        z-index: 10;
    }

    .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--accent-primary);
        transform: rotate(90deg);
    }

    h3 {
        color: var(--text-primary);
        margin-bottom: 30px;
        font-size: 1.75rem;
        text-align: center;
        font-weight: 700;
        letter-spacing: -0.02em;
    }

    .modal-body {
        position: relative;
    }

    @media (max-width: 640px) {
        .modal-content {
            padding: 30px 20px;
        }
        
        h3 {
            font-size: 1.4rem;
            margin-bottom: 20px;
        }
    }
</style>
