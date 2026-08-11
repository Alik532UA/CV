<script lang="ts">
    import BaseModal from "./BaseModal.svelte";
    import { base } from "$app/paths";
    import { FileText, FileCode, Sparkles } from "lucide-svelte";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { aiChat } from "$lib/controllers/AiChatState.svelte";
    import { track } from "$lib/services/analytics";
    import type { HTMLAttributes } from "svelte/elements";

    interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onclose'> {
        show: boolean;
    }

    let { show = $bindable(), ...restProps }: Props = $props();

    const atsFiles = [
        {
            id: "en-pdf",
            label: "EN · PDF",
            format: "pdf",
            name: "AlikZapolnov-ATS-RMS-EN.pdf",
            url: "https://drive.google.com/file/d/1xieP4ItkVvk6_ly1r9sayGYGRZ9MRf06/view?usp=drive_link"
        },
        {
            id: "en-md",
            label: "EN · MD",
            format: "md",
            name: "AlikZapolnov-ATS-RMS-EN.md",
            url: "https://drive.google.com/file/d/1SQdR3vb2JNlVTiRH-vI-Hn2R-0E2MT_k/view?usp=drive_link"
        },
        {
            id: "ua-pdf",
            label: "UA · PDF",
            format: "pdf",
            name: "AlikZapolnov-ATS-RMS-UA.pdf",
            url: "https://drive.google.com/file/d/1vOJysOCzkn_bxVEugr3c2w5HPVfsT1nf/view?usp=drive_link"
        },
        {
            id: "ua-md",
            label: "UA · MD",
            format: "md",
            name: "AlikZapolnov-ATS-RMS-UA.md",
            url: "https://drive.google.com/file/d/1HF6J92xqrLjAdFPHwJTBthzF1Te8B-zA/view?usp=drive_link"
        }
    ];
</script>

<BaseModal bind:show title={t.pdf_modal?.title || "Choose PDF Version"} {...restProps}>
    <div class="pdf-modal-container">
        <div class="pdf-options">
            <div class="pdf-option pdf-option-group" data-testid="pdf-option-ats">
                <div class="pdf-file-list">
                    {#each atsFiles as file (file.id)}
                        <!-- Absolute Google Drive URL, not an app route -->
                        <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                        <a href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="pdf-file-btn"
                            title={file.name}
                            data-testid="pdf-file-link-{file.id}"
                            onclick={() => {
                                track("cv_download", { variant: `ats-${file.id}` });
                                show = false;
                            }}
                        >
                            {#if file.format === "pdf"}
                                <FileText size={16} />
                            {:else}
                                <FileCode size={16} />
                            {/if}
                            <span class="pdf-file-label">{file.label}</span>
                        </a>
                    {/each}
                </div>
                <span>{t.pdf_modal?.ats || "ATS / RMS"}</span>
            </div>
            <a
                href="https://drive.google.com/file/d/169jkAHJDjx8P3zJODr-PtytX2HtkVaRv/view"
                target="_blank"
                rel="noopener noreferrer"
                class="pdf-option"
                data-testid="pdf-option-dark"
                onclick={() => {
                    track("cv_download", { variant: "dark" });
                    show = false;
                }}
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
                rel="noopener noreferrer"
                class="pdf-option"
                data-testid="pdf-option-light"
                onclick={() => {
                    track("cv_download", { variant: "light" });
                    show = false;
                }}
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

        <button
            type="button"
            class="ai-banner-btn"
            data-testid="pdf-option-ai"
            onclick={() => {
                track("cv_download", { variant: "ai-matcher" });
                show = false;
                aiChat.open();
            }}
        >
            <div class="ai-banner-content">
                <Sparkles size={22} class="ai-sparkle-icon" />
                <div class="ai-banner-text">
                    <span class="ai-banner-title">AI Job Matcher</span>
                    <span class="ai-banner-sub">Перевірити сумісність вакансії з кандидатом</span>
                </div>
            </div>
            <span class="ai-badge">gemini-3.6-flash</span>
        </button>
    </div>
</BaseModal>

<style>
    .pdf-modal-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 100%;
    }

    .pdf-options {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        width: 100%;
    }

    .ai-banner-btn {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 14px 20px;
        border-radius: 14px;
        border: 1px solid rgba(var(--accent-primary-rgb), 0.3);
        background: linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.12) 0%, rgba(139, 92, 246, 0.18) 100%);
        color: var(--text-primary);
        font-family: inherit;
        cursor: pointer;
        transition: var(--transition);
    }

    .ai-banner-btn:hover {
        background: linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.22) 0%, rgba(139, 92, 246, 0.3) 100%);
        border-color: var(--accent-primary);
        box-shadow: 0 4px 16px rgba(var(--accent-primary-rgb), 0.2);
    }

    .ai-banner-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    :global(.ai-banner-btn .ai-sparkle-icon) {
        color: var(--accent-primary);
    }

    .ai-banner-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
    }

    .ai-banner-title {
        font-weight: 700;
        font-size: 1rem;
        color: var(--text-primary);
    }

    .ai-banner-sub {
        font-size: 0.82rem;
        color: var(--text-secondary);
    }

    .ai-badge {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.4px;
        background: var(--gradient);
        color: white;
        padding: 4px 10px;
        border-radius: 8px;
        white-space: nowrap;
    }

    .pdf-option {
        display: flex;
        flex-direction: column;
        gap: 12px;
        text-decoration: none;
        color: var(--text-primary);
        padding: 15px;
        border-radius: 16px;
        background: var(--surface-subtle);
        border: 1px solid transparent;
        transition: var(--transition);
        text-align: center;
        min-width: 0;
    }

    /* Kept, unlike the plain cards: the whole surface is a link. */
    a.pdf-option:hover {
        background: rgba(var(--accent-primary-rgb), 0.1);
        border-color: var(--accent-primary);
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

    /* ATS / RMS column: four file links in place of a single preview */
    .pdf-file-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        min-height: 0;
    }

    .pdf-file-btn {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 42px;
        max-height: 72px;
        padding: 0 10px;
        border-radius: 10px;
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        text-decoration: none;
        transition: var(--transition);
    }

    .pdf-file-btn:hover {
        background: rgba(var(--accent-primary-rgb), 0.15);
        border-color: var(--accent-primary);
        color: var(--accent-primary);
    }

    .pdf-file-label {
        font-weight: 600;
        font-size: 0.95rem;
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

        .pdf-file-list {
            gap: 8px;
        }

        .pdf-file-btn {
            gap: 6px;
            padding: 0 6px;
        }

        .pdf-file-label {
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

        /* Keep the ATS column stacked, with its caption acting as a heading */
        .pdf-option-group {
            flex-direction: column;
            align-items: stretch;
            text-align: center;
            gap: 12px;
        }

        .pdf-option-group > span {
            order: -1;
        }

        .pdf-file-btn {
            flex: none;
            max-height: none;
            min-height: 44px;
        }

        .pdf-file-label {
            font-size: 1rem;
        }
    }
</style>
