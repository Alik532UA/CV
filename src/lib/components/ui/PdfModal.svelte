<script lang="ts">
    import BaseModal from "./BaseModal.svelte";
    import { base } from "$app/paths";
    import { t } from "$lib/controllers/I18nState.svelte";
    import type { HTMLAttributes } from "svelte/elements";

    interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onclose'> {
        show: boolean;
    }

    let { show = $bindable(), ...restProps }: Props = $props();
</script>

<BaseModal bind:show title={t.pdf_modal?.title || "Choose PDF Version"} {...restProps}>
    <div class="pdf-options">
        <a
            href="https://drive.google.com/file/d/1Znm2vqgBaUOaIGr8SQnSkEGDQgvfpr3p/view"
            target="_blank"
            class="pdf-option"
            onclick={() => (show = false)}
        >
            <div class="pdf-preview">
                <img
                    src="{base}/pdf-preview/Alik-Zapolnov-CV-ATS-RMS-EN.jpg"
                    alt="ATS / RMS CV Preview"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <span>{t.pdf_modal?.ats || "ATS / RMS"}</span>
        </a>
        <a
            href="https://drive.google.com/file/d/169jkAHJDjx8P3zJODr-PtytX2HtkVaRv/view"
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
            href="https://drive.google.com/file/d/1bNX2y5uD99DrQ1-jjjbFyYQJbeWeeCLB/view"
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
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        width: 100%;
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
        min-width: 0;
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
        white-space: nowrap;
    }

    @media (max-width: 640px) {
        .pdf-options {
            gap: 10px;
        }

        .pdf-option {
            padding: 10px;
            border-radius: 12px;
        }

        .pdf-option span {
            font-size: 0.85rem;
        }
    }

    @media (max-width: 480px) {
        .pdf-options {
            grid-template-columns: 1fr;
            max-height: 70vh;
            overflow-y: auto;
            padding-right: 5px;
        }

        .pdf-option {
            flex-direction: row;
            align-items: center;
            text-align: left;
            gap: 15px;
        }

        .pdf-preview {
            width: 60px;
            height: 80px;
            flex-shrink: 0;
        }

        .pdf-option span {
            font-size: 1.1rem;
            white-space: normal;
        }
    }
</style>
