<script lang="ts">
    import { X } from "lucide-svelte";
    import { fade, scale } from "svelte/transition";
    import { base } from "$app/paths";

    let { show = $bindable(), t } = $props<{
        show: boolean;
        t: any;
    }>();

    function close() {
        show = false;
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Escape") {
            close();
        }
    }
</script>

{#if show}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="modal-backdrop"
        onclick={close}
        onkeydown={handleKeydown}
        role="presentation"
        transition:fade={{ duration: 200 }}
    >
        <div
            class="modal-content glass card"
            onclick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            transition:scale={{ duration: 200, start: 0.9 }}
        >
            <button class="close-btn" onclick={close} aria-label="Close modal">
                <X size={24} />
            </button>
            <h3 id="modal-title">{t.pdf_modal?.title || "Choose PDF Version"}</h3>
            <div class="pdf-options">
                <a
                    href="https://drive.google.com/file/d/1bLHvxMdrrv9velRAjtmmOVY6SiX2VJsS/view"
                    target="_blank"
                    class="pdf-option"
                    onclick={close}
                >
                    <div class="pdf-preview">
                        <img
                            src="{base}/pdf-preview/Alik-Zapolnov-CV-dark.jpg"
                            alt="Dark Theme CV Preview"
                        />
                    </div>
                    <span>{t.pdf_modal?.dark || "Dark Theme"}</span>
                </a>
                <a
                    href="https://drive.google.com/file/d/1NIsAlT-kVZSw3CBDR-n7JqP4Y5X2yf3p/view"
                    target="_blank"
                    class="pdf-option"
                    onclick={close}
                >
                    <div class="pdf-preview">
                        <img
                            src="{base}/pdf-preview/Alik-Zapolnov-CV-light.jpg"
                            alt="Light Theme CV Preview"
                        />
                    </div>
                    <span>{t.pdf_modal?.light || "Light Theme"}</span>
                </a>
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
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .modal-content {
        position: relative;
        background: var(--card-bg);
        padding: 30px;
        border-radius: 24px;
        max-width: 600px;
        width: 100%;
        text-align: center;
        border: 1px solid var(--border-color);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    .close-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 5px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition);
    }

    .close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-primary);
    }

    .modal-content h3 {
        color: var(--text-primary);
        margin-bottom: 25px;
        font-size: 1.5rem;
    }

    .pdf-options {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .pdf-option {
        display: flex;
        flex-direction: column;
        gap: 12px;
        text-decoration: none;
        color: var(--text-primary);
        padding: 15px;
        border-radius: 16px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid transparent;
        transition: var(--transition);
    }

    .pdf-option:hover {
        background: rgba(var(--accent-primary-rgb), 0.1);
        border-color: var(--accent-primary);
        transform: translateY(-3px);
    }

    .pdf-preview {
        aspect-ratio: 210/297;
        width: 100%;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid var(--border-color);
    }

    .pdf-preview img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    .pdf-option span {
        font-weight: 600;
        font-size: 1.1rem;
    }

    @media (max-width: 600px) {
        .modal-content {
            padding: 20px;
        }

        .pdf-options {
            gap: 10px;
        }

        .pdf-option {
            padding: 10px;
        }

        .pdf-option span {
            font-size: 0.9rem;
        }
    }
</style>
