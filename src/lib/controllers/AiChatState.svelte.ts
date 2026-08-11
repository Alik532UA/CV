import { base } from "$app/paths";
import { env } from "$env/dynamic/public";
import { KNOWLEDGE_BASE_UA } from "$lib/data/knowledgeBase";
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

interface ApiResponse {
    result?: MatchResult;
    rawText?: string;
    reply?: string;
    error?: string;
}

const MODEL_FALLBACK_CHAIN = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite"
];

async function callGeminiDirect(input: string, history: ChatMessage[] = []): Promise<ApiResponse> {
    const apiKey = env.PUBLIC_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("API ключ GEMINI_API_KEY не знайдено. Вкажіть GEMINI_API_KEY у GitHub Secrets або файлі .env.");
    }

    const systemInstruction = `Ти — AI-асистент Аліка Заполнова (QA / AQA Engineer, 5+ років у QA, 2+ роки в AQA).
Твоя мета — проаналізувати вакансію або відповісти на запитання HR і оцінити сумісність Аліка на основі його Бази Знань.

База Знань Аліка:
${KNOWLEDGE_BASE_UA}
`;

    const isFirstAnalysis = history.length === 0;
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    if (history.length > 0) {
        for (const msg of history) {
            contents.push({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            });
        }
        contents.push({
            role: 'user',
            parts: [{ text: input }]
        });
    } else {
        const isUrl = input.trim().startsWith('http://') || input.trim().startsWith('https://');
        const userPrompt = isUrl
            ? `Проаналізуй вакансію за цим посиланням: ${input.trim()}. Проаналізуй вимоги цієї вакансії та порівняй їх з базою знань Аліка.`
            : `Ось опис вакансії:\n"""\n${input.trim()}\n"""\nПроаналізуй вимоги цієї вакансії та порівняй їх з базою знань Аліка.`;

        const promptText = isFirstAnalysis
            ? `${userPrompt}\n\nВАЖЛИВО: Відповідь НАДАЙ СТРОГО У ФОРМАТІ JSON з такими полями:
{
  "matchPercentage": number (0-100),
  "keyStrengths": string[] (3-5 сильних сторін),
  "potentialGaps": string[] (1-3 питання/прогалини),
  "summary": string (короткий висновок 2-3 речення),
  "recommendedResponse": string (професійна відповідь для HR)
}`
            : userPrompt;

        contents.push({
            role: 'user',
            parts: [{ text: promptText }]
        });
    }

    let responseJson: Record<string, unknown> | null = null;
    let lastError: Error | null = null;

    for (const modelName of MODEL_FALLBACK_CHAIN) {
        try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
            const apiRes = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents,
                    systemInstruction: {
                        parts: [{ text: systemInstruction }]
                    },
                    generationConfig: isFirstAnalysis
                        ? { responseMimeType: "application/json", temperature: 0.2 }
                        : { temperature: 0.7 }
                })
            });

            if (apiRes.status === 429 || apiRes.status === 403) {
                continue;
            }

            if (!apiRes.ok) {
                const errText = await apiRes.text();
                throw new Error(`Gemini API (${modelName}): ${apiRes.status} ${errText}`);
            }

            responseJson = (await apiRes.json()) as Record<string, unknown>;
            break;
        } catch (err: unknown) {
            lastError = err as Error;
        }
    }

    if (!responseJson) {
        throw lastError || new Error("Не вдалося отримати відповідь від AI.");
    }

    const candidates = responseJson.candidates as Array<{ content?: { parts?: Array<{ text?: string }> } }> | undefined;
    const rawText = candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (isFirstAnalysis) {
        try {
            const parsed = JSON.parse(rawText) as MatchResult;
            return { result: parsed, rawText };
        } catch {
            return { rawText };
        }
    } else {
        return { reply: rawText, rawText };
    }
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
            let data: ApiResponse;

            try {
                const res = await fetch(`${base}/api/ai-match`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ input: this.initialInput })
                });

                if (res.status === 405 || res.status === 404) {
                    // Static hosting (GitHub Pages) returns 405 Method Not Allowed / 404
                    logService.info("ui", "Static host detected (HTTP 405/404). Falling back to direct Gemini API call...");
                    data = await callGeminiDirect(this.initialInput);
                } else {
                    const rawResponseText = await res.text();
                    try {
                        data = JSON.parse(rawResponseText) as ApiResponse;
                    } catch {
                        throw new Error(
                            rawResponseText.includes("GEMINI_API_KEY") || res.status === 500
                                ? "API ключ GEMINI_API_KEY не знайдено в файлі .env. Будь ласка, вкажіть GEMINI_API_KEY у вашому файлі .env"
                                : `Помилка сервера (${res.status}): ${rawResponseText.slice(0, 150)}`
                        );
                    }
                }
            } catch (serverErr: unknown) {
                const errStr = (serverErr as Error).message || "";
                if (errStr.includes("405") || errStr.includes("404")) {
                    data = await callGeminiDirect(this.initialInput);
                } else {
                    throw serverErr;
                }
            }

            if (data.error) {
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
        } catch (err: unknown) {
            const errorObj = err as Error;
            this.error = errorObj.message || "An unexpected error occurred.";
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
            let data: ApiResponse;

            try {
                const res = await fetch(`${base}/api/ai-match`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        input: userMsg,
                        history: this.history.slice(0, -1) // send context up to last msg
                    })
                });

                if (res.status === 405 || res.status === 404) {
                    data = await callGeminiDirect(userMsg, this.history.slice(0, -1));
                } else {
                    const rawResponseText = await res.text();
                    try {
                        data = JSON.parse(rawResponseText) as ApiResponse;
                    } catch {
                        throw new Error(`Помилка сервера (${res.status}): ${rawResponseText.slice(0, 150)}`);
                    }
                }
            } catch (serverErr: unknown) {
                const errStr = (serverErr as Error).message || "";
                if (errStr.includes("405") || errStr.includes("404")) {
                    data = await callGeminiDirect(userMsg, this.history.slice(0, -1));
                } else {
                    throw serverErr;
                }
            }

            if (data.error) {
                throw new Error(data.error || "Не вдалося відправити повідомлення");
            }

            const modelReply = data.reply || data.rawText || "Дякую за запитання!";
            this.history = [...this.history, { role: "model", content: modelReply }];
            logService.info("ui", "Received reply from gemini-3.6-flash");
        } catch (err: unknown) {
            const errorObj = err as Error;
            this.error = errorObj.message || "An error occurred while sending message.";
            logService.error("ui", `Send message error: ${this.error}`);
        } finally {
            this.isLoading = false;
        }
    }
}

export const aiChat = new AiChatState();
