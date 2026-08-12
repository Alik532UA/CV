<script lang="ts">
    import { aiChat } from "$lib/controllers/AiChatState.svelte";
    import { Sparkles } from "lucide-svelte";
</script>

<button
    class="floating-ai-btn"
    onclick={() => aiChat.open()}
    aria-label="Open AI Job Matcher"
    data-testid="ai-matcher-open-btn"
    title="AI Job Matcher ({aiChat.activeEntry.model})"
>
    <span class="pulse-glow"></span>
    <span class="icon-wrapper">
        <Sparkles size={22} class="sparkle-icon" />
    </span>
    <span class="btn-text">AI Matcher</span>
</button>

<style>
    .floating-ai-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 990;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 18px;
        border-radius: 50px;
        background: var(--gradient);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 24px rgba(var(--accent-primary-rgb), 0.4);
        cursor: pointer;
        font-family: inherit;
        font-weight: 600;
        font-size: 0.95rem;
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
        backdrop-filter: var(--glass-blur);
        overflow: hidden;
    }

    .floating-ai-btn:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 12px 30px rgba(var(--accent-primary-rgb), 0.6);
    }

    .floating-ai-btn:active {
        transform: translateY(0) scale(0.98);
    }

    .pulse-glow {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
    }

    .floating-ai-btn:hover .pulse-glow {
        opacity: 1;
        animation: rotateGlow 3s linear infinite;
    }

    .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn-text {
        white-space: nowrap;
        letter-spacing: 0.02em;
    }

    @keyframes rotateGlow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    /* On mobile screens, elevate above BottomNav */
    @media (max-width: 768px) {
        .floating-ai-btn {
            bottom: 84px;
            right: 16px;
            padding: 10px 14px;
            font-size: 0.85rem;
        }
    }
</style>
