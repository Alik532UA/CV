<script lang="ts">
    import BaseModal from "./BaseModal.svelte";
    import { base } from "$app/paths";
    import { t } from "$lib/i18n/index.svelte";

    let { show = $bindable() } = $props<{
        show: boolean;
    }>();
</script>

<BaseModal bind:show title={t.pdf_modal?.title || "Choose PDF Version"}>
    <div class="pdf-options">
        <a
            href="https://drive.google.com/file/d/1bLHvxMdrrv9velRAjtmmOVY6SiX2VJsS/view"
            target="_blank"
            class="pdf-option"
            onclick={() => (show = false)}
        >
            <div class="pdf-preview">
                <img
                    src="{base}/pdf-preview/Alik-Zapolnov-CV-dark.jpg"
                    alt="Dark Theme CV Preview"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <span>{t.pdf_modal?.dark || "Dark Theme"}</span>
        </a>
        <a
            href="https://drive.google.com/file/d/1NIsAlT-kVZSw3CBDR-n7JqP4Y5X2yf3p/view"
            target="_blank"
            class="pdf-option"
            onclick={() => (show = false)}
        >
            <div class="pdf-preview">
                <img
                    src="{base}/pdf-preview/Alik-Zapolnov-CV-light.jpg"
                    alt="Light Theme CV Preview"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <span>{t.pdf_modal?.light || "Light Theme"}</span>
        </a>
    </div>
</BaseModal>

<style>
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
        text-align: center;
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
