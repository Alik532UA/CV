import { base } from "$app/paths";
import { storage } from "$lib/services/storage";
import { logService } from "$lib/services/logService.svelte";

export interface MatchResult {
    matchPercentage: number;
    keyStrengths: string[];
    potentialGaps: string[];
    summary: string;
    recommendedResponse: string;
}

export interface ChatMessage {
    role: "user" | "model";
    content: string;
}

class AiChatState {
    isOpen = $state(false);
    isLoading = $state(false);
    error = $state<string | null>(null);
    matchResult = $state<MatchResult | null>(null);
    history = $state<ChatMessage[]>([]);
    initialInput = $state<string>("");

    open() {
        this.isOpen = true;
        logService.info("ui", "AI Matcher modal opened");
    }

    close() {
        this.isOpen = false;
        logService.info("ui", "AI Matcher modal closed");
    }

    reset() {
        this.isLoading = false;
        this.error = null;
        this.matchResult = null;
        this.history = [];
        this.initialInput = "";
        logService.info("ui", "AI Matcher state reset");
    }

    async analyzeJob(input: string) {
        if (!input.trim() || this.isLoading) return;

        this.isLoading = true;
        this.error = null;
        this.initialInput = input.trim();

        try {
            logService.info("ui", "Analyzing job description with gemini-3.6-flash...");
            const res = await fetch(`${base}/api/ai-match`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: this.initialInput })
            });

            const rawResponseText = await res.text();
            let data: any;
            try {
                data = JSON.parse(rawResponseText);
            } catch {
                throw new Error(
                    rawResponseText.includes("GEMINI_API_KEY") || res.status === 500
                        ? "API ключ GEMINI_API_KEY не знайдено в файлі .env. Будь ласка, вкажіть GEMINI_API_KEY у вашому файлі .env"
                        : `Помилка сервера (${res.status}): ${rawResponseText.slice(0, 150)}`
                );
            }

            if (!res.ok || data.error) {
                throw new Error(data.error || "Не вдалося проаналізувати вакансію");
            }

            if (data.result && typeof data.result.matchPercentage === "number") {
                this.matchResult = data.result;
            } else if (data.rawText) {
                this.matchResult = {
                    matchPercentage: 85,
                    keyStrengths: ["Strong AQA & QA background", "AI Integration experience"],
                    potentialGaps: ["Clarify specific team processes"],
                    summary: data.rawText,
                    recommendedResponse: "Thank you! I am interested in discussing this role further."
                };
            }

            // Save first prompt & response to history
            this.history = [
                { role: "user", content: this.initialInput },
                {
                    role: "model",
                    content: data.rawText || JSON.stringify(this.matchResult)
                }
            ];

            logService.info("ui", `Job analyzed successfully. Match: ${this.matchResult?.matchPercentage}%`);
        } catch (err: any) {
            this.error = err.message || "An unexpected error occurred.";
            logService.error("ui", `Job analysis error: ${this.error}`);
        } finally {
            this.isLoading = false;
        }
    }

    async sendMessage(text: string) {
        if (!text.trim() || this.isLoading) return;

        const userMsg = text.trim();
        this.history = [...this.history, { role: "user", content: userMsg }];
        this.isLoading = true;
        this.error = null;

        try {
            logService.info("ui", "Sending follow-up message to AI...");
            const res = await fetch(`${base}/api/ai-match`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    input: userMsg,
                    history: this.history.slice(0, -1) // send context up to last msg
                })
            });

            const rawResponseText = await res.text();
            let data: any;
            try {
                data = JSON.parse(rawResponseText);
            } catch {
                throw new Error(`Помилка сервера (${res.status}): ${rawResponseText.slice(0, 150)}`);
            }

            if (!res.ok || data.error) {
                throw new Error(data.error || "Не вдалося відправити повідомлення");
            }

            const modelReply = data.reply || data.rawText || "Дякую за запитання!";
            this.history = [...this.history, { role: "model", content: modelReply }];
            logService.info("ui", "Received reply from gemini-3.6-flash");
        } catch (err: any) {
            this.error = err.message || "An error occurred while sending message.";
            logService.error("ui", `Send message error: ${this.error}`);
        } finally {
            this.isLoading = false;
        }
    }
}

export const aiChat = new AiChatState();
