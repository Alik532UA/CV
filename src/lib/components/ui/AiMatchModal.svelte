<script lang="ts">
    import BaseModal from "./BaseModal.svelte";
    import AiModelPicker from "./AiModelPicker.svelte";
    import { aiChat } from "$lib/controllers/AiChatState.svelte";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { Sparkles, CheckCircle2, AlertCircle, Send, RotateCcw, Bot, User, Loader2 } from "lucide-svelte";

    let jobInput = $state("");
    let chatInput = $state("");

    function handleAnalyze() {
        if (!jobInput.trim()) return;
        aiChat.analyzeJob(jobInput);
    }

    function handleSendMessage() {
        if (!chatInput.trim()) return;
        const msg = chatInput;
        chatInput = "";
        aiChat.sendMessage(msg);
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (aiChat.matchResult) {
                handleSendMessage();
            } else {
                handleAnalyze();
            }
        }
    }

    function getScoreColor(pct: number): string {
        if (pct >= 80) return "var(--score-high)";
        if (pct >= 60) return "var(--score-mid)";
        return "var(--score-low)";
    }
</script>

<BaseModal bind:show={aiChat.isOpen} onclose={() => aiChat.close()}>
    {#snippet titleSnippet()}
        <div class="modal-title-with-badge">
            <span>AI Job Matcher</span>
            <AiModelPicker />
        </div>
    {/snippet}
    <div class="ai-matcher-container">
        {#if !aiChat.hasAnalysis}
            <!-- Step 1: Input Job Description / Link -->
            <div class="input-step">
                <p class="subtitle">{t.ai.subtitle}</p>

                <textarea
                    class="job-textarea"
                    data-testid="ai-job-input-textarea"
                    placeholder={t.ai.jobPlaceholder}
                    bind:value={jobInput}
                    onkeydown={handleKeydown}
                    rows="6"
                    disabled={aiChat.isLoading}
                ></textarea>

                {#if aiChat.error}
                    <div class="error-banner">
                        <AlertCircle size={18} />
                        <span>{aiChat.error}</span>
                    </div>
                {/if}

                <button
                    class="btn-primary analyze-btn"
                    data-testid="ai-analyze-btn"
                    onclick={handleAnalyze}
                    disabled={aiChat.isLoading || !jobInput.trim()}
                >
                    {#if aiChat.isLoading}
                        <Loader2 size={18} class="spin" />
                        <span>{t.ai.analyzing}</span>
                    {:else}
                        <Sparkles size={18} />
                        <span>{t.ai.analyze}</span>
                    {/if}
                </button>
            </div>
        {:else}
            <!-- Step 2: Visual Match Scorecard & Chat -->
            <div class="result-step">
                <div class="header-actions">
                    <button class="reset-btn" onclick={() => aiChat.reset()} title={t.ai.newAnalysisHint}>
                        <RotateCcw size={16} />
                        <span>{t.ai.newAnalysis}</span>
                    </button>
                </div>

                {#if !aiChat.matchResult}
                    <!-- Модель не віддала JSON. Показуємо відповідь як є: раніше на
                         цьому місці підставлялися вигадані 85% і фейкові сильні
                         сторони, тобто HR бачив цифру, якої ніхто не рахував. -->
                    <div class="raw-panel" data-testid="ai-raw-analysis-panel">
                        <h4>{t.ai.rawTitle}</h4>
                        <p>{aiChat.rawAnalysis}</p>
                        <span class="raw-panel__note">
                            {t.ai.rawNote}
                        </span>
                    </div>
                {:else}
                <!-- Match Score Badge -->
                <div class="score-card">
                    <div class="score-ring" style="--score-color: {getScoreColor(aiChat.matchResult.matchPercentage)}">
                        <span class="score-value" data-testid="ai-match-score-value">
                            {aiChat.matchResult.matchPercentage}%
                        </span>
                        <span class="score-label">{t.ai.matchLabel}</span>
                    </div>
                    <div class="score-summary">
                        <h4>{t.ai.summaryTitle}</h4>
                        <p>{aiChat.matchResult.summary}</p>
                    </div>
                </div>

                <!-- Strengths & Gaps -->
                <div class="details-grid">
                    <div class="detail-box strengths">
                        <h5><CheckCircle2 size={16} color="#10b981" /> {t.ai.strengths}</h5>
                        <ul>
                            {#each aiChat.matchResult.keyStrengths as strength (strength)}
                                <li>{strength}</li>
                            {/each}
                        </ul>
                    </div>

                    {#if aiChat.matchResult.potentialGaps?.length}
                        <div class="detail-box gaps">
                            <h5><AlertCircle size={16} color="#f59e0b" /> {t.ai.gaps}</h5>
                            <ul>
                                {#each aiChat.matchResult.potentialGaps as gap (gap)}
                                    <li>{gap}</li>
                                {/each}
                            </ul>
                        </div>
                    {/if}
                </div>
                {/if}

                <!-- Interactive Chat thread -->
                <div class="chat-section">
                    <h5>{t.ai.followUpTitle}</h5>

                    <div class="messages-list">
                        {#each aiChat.history.slice(2) as msg, index (index)}
                            <div class="chat-bubble {msg.role}">
                                <div class="avatar">
                                    {#if msg.role === 'user'}
                                        <User size={14} />
                                    {:else}
                                        <Bot size={14} />
                                    {/if}
                                </div>
                                <div class="content">{msg.content}</div>
                            </div>
                        {/each}

                        {#if aiChat.isLoading}
                            <div class="chat-bubble model loading">
                                <div class="avatar"><Bot size={14} /></div>
                                <div class="content">
                                    <Loader2 size={16} class="spin" />
                                    <span>{t.ai.thinking}</span>
                                </div>
                            </div>
                        {/if}
                    </div>

                    {#if aiChat.error}
                        <div class="error-banner">
                            <AlertCircle size={16} />
                            <span>{aiChat.error}</span>
                        </div>
                    {/if}

                    <div class="chat-input-row">
                        <input
                            type="text"
                            class="chat-input"
                            data-testid="ai-chat-input"
                            placeholder={t.ai.chatPlaceholder}
                            bind:value={chatInput}
                            onkeydown={handleKeydown}
                            disabled={aiChat.isLoading}
                        />
                        <button
                            class="send-btn"
                            data-testid="ai-chat-send-btn"
                            onclick={handleSendMessage}
                            disabled={aiChat.isLoading || !chatInput.trim()}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</BaseModal>

<style>
    .ai-matcher-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        color: var(--text-primary);
    }

    .subtitle {
        color: var(--text-secondary);
        font-size: 0.95rem;
        line-height: 1.5;
        margin-bottom: 16px;
    }

    .job-textarea {
        width: 100%;
        padding: 14px;
        border-radius: 14px;
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        font-family: inherit;
        font-size: 0.95rem;
        resize: vertical;
        outline: none;
        transition: var(--transition);
    }

    .job-textarea:focus {
        border-color: var(--accent-primary);
        box-shadow: 0 0 10px rgba(var(--accent-primary-rgb), 0.2);
    }

    .analyze-btn {
        width: 100%;
        justify-content: center;
        margin-top: 10px;
    }

    .header-actions {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;
    }

    .reset-btn {
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        padding: 6px 12px;
        border-radius: 10px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 0.85rem;
        transition: var(--transition);
    }

    .reset-btn:hover {
        background: var(--surface-hover);
        color: var(--accent-primary);
    }

    /* Score card */
    .score-card {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 18px;
        background: var(--surface-subtle);
        border-radius: 16px;
        border: 1px solid var(--border-color);
    }

    .score-ring {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        border: 4px solid var(--score-color);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        flex-shrink: 0;
    }

    .score-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--score-color);
    }

    .score-label {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
    }

    .score-summary h4 {
        margin: 0 0 6px 0;
        font-size: 1.05rem;
        color: var(--text-primary);
    }

    .score-summary p {
        margin: 0;
        font-size: 0.9rem;
        color: var(--text-secondary);
        line-height: 1.4;
    }

    /* Details Grid */
    .details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 14px;
    }

    @media (max-width: 600px) {
        .details-grid {
            grid-template-columns: 1fr;
        }
    }

    .detail-box {
        padding: 14px;
        border-radius: 12px;
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
    }

    .detail-box h5 {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 0 0 8px 0;
        font-size: 0.9rem;
        font-weight: 600;
    }

    .detail-box ul {
        margin: 0;
        padding-left: 18px;
        font-size: 0.85rem;
        color: var(--text-secondary);
        line-height: 1.4;
    }

    /* Chat section */
    .chat-section {
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .chat-section h5 {
        margin: 0;
        font-size: 0.85rem;
        color: var(--text-secondary);
    }

    .messages-list {
        max-height: 200px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding-right: 4px;
    }

    .chat-bubble {
        display: flex;
        gap: 10px;
        max-width: 85%;
        align-items: flex-start;
    }

    .chat-bubble.user {
        align-self: flex-end;
        flex-direction: row-reverse;
    }

    .chat-bubble.model {
        align-self: flex-start;
    }

    .avatar {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        background: var(--surface-hover);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
    }

    .chat-bubble.user .avatar {
        background: var(--accent-primary);
        color: white;
    }

    .chat-bubble .content {
        padding: 10px 14px;
        border-radius: 12px;
        font-size: 0.88rem;
        line-height: 1.4;
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
    }

    .chat-bubble.user .content {
        background: rgba(var(--accent-primary-rgb), 0.15);
        border-color: var(--accent-primary);
    }

    .chat-input-row {
        display: flex;
        gap: 8px;
        margin-top: 6px;
    }

    .chat-input {
        flex: 1;
        padding: 10px 14px;
        border-radius: 10px;
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        font-size: 0.9rem;
        outline: none;
    }

    .chat-input:focus {
        border-color: var(--accent-primary);
    }

    .send-btn {
        padding: 10px 16px;
        border-radius: 10px;
        background: var(--gradient);
        border: none;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

    }

    .error-banner {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px;
        border-radius: 10px;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        font-size: 0.85rem;
    }

    :global(.spin) {
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    :global(.modal-title-with-badge) {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        flex-wrap: wrap;
    }

    /* Бейдж моделі переїхав у AiModelPicker.svelte — він тепер перемикач, а не
       підпис, і стиль живе разом з ним. */

    .raw-panel {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        border-radius: 14px;
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
    }

    .raw-panel p {
        margin: 0;
        white-space: pre-wrap;
        line-height: 1.5;
    }

    .raw-panel__note {
        font-size: 0.78rem;
        color: var(--text-secondary);
    }
</style>
