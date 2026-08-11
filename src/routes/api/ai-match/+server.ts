import { json, type RequestHandler } from '@sveltejs/kit';
import { KNOWLEDGE_BASE_UA } from '$lib/data/knowledgeBase';
import { env } from '$env/dynamic/private';

/**
 * Fallback model chain if gemini-3.6-flash encounters rate limits (429) or token exhaustion.
 */
const MODEL_FALLBACK_CHAIN = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite'
];

interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

interface RequestBody {
    input?: string;
    history?: ChatMessage[];
}

/**
 * Extracts plain text from a URL if possible, otherwise returns original text.
 */
async function fetchJobTextFromUrl(urlStr: string): Promise<string> {
    try {
        const url = new URL(urlStr);
        const res = await fetch(url.toString(), {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            }
        });
        if (!res.ok) return urlStr;
        const html = await res.text();
        
        // Strip HTML tags and collapse whitespace for LLM prompt
        const cleanText = html
            .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, '')
            .replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        return cleanText.length > 100 ? cleanText.slice(0, 8000) : urlStr;
    } catch {
        return urlStr;
    }
}

export const POST: RequestHandler = async ({ request }) => {
    const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
        return json({
            error: 'GEMINI_API_KEY is not configured on the server. Please set GEMINI_API_KEY in environment variables.'
        }, { status: 500 });
    }

    try {
        const body: RequestBody = await request.json();
        const rawInput = body.input?.trim() || '';
        const history: ChatMessage[] = body.history || [];

        if (!rawInput && history.length === 0) {
            return json({ error: 'Input text or URL is required.' }, { status: 400 });
        }

        // Process URL input if user pasted a link
        let processedInput = rawInput;
        if (rawInput.startsWith('http://') || rawInput.startsWith('https://')) {
            processedInput = await fetchJobTextFromUrl(rawInput);
        }

        // System prompt establishing Alik's persona and full knowledge base
        const systemInstruction = `Ти — AI-асистент Аліка Заполнова (Automation QA Engineer & AI Integration Specialist). 
Твоя мета — проаналізувати вимоги вакансії від HR або рекрутера, порівняти їх із знаннями про Аліка та дати об'єктивний, професійний висновок.

ОСНОВНА БАЗА ЗНАНЬ ПРО АЛІКА:
${KNOWLEDGE_BASE_UA}

ПРАВИЛА ТА КРИТЕРІЇ:
1. Будь ввічливим, професійним та переконуючим.
2. Не вигадуй досвід, якого немає в базі знань. Оцінюй відповідність строго за фактами.
3. Якщо це перша обробка вакансії (без історії), твоя відповідь ПОВИННА БУТИ STRICT VALID JSON у наступному форматі:
{
  "matchPercentage": 88,
  "keyStrengths": ["5+ років QA / 2+ роки AQA", "Greenfield досвід та самостійне ведення проектів", "Глибока інтеграція AI інструментів (Claude Code, Gemini CLI, Antigravity IDE)"],
  "potentialGaps": ["Потрібно детальніше уточнити особливості внутрішньої CI/CD системи компанії"],
  "summary": "Алік чудово підходить на цю позицію завдяки багатому досвіду в AQA та автоматизації з нуля.",
  "recommendedResponse": "Привіт! Дякую за цікаву вакансію. Алік має релевантний досвід і буде радий обговорити деталі."
}
4. Якщо в запиті є історія діалогу (продовження чату з HR), відповідай звичайним текстом від імені Аліка/AI-асистента.`;

        // Build contents array for Gemini REST API
        const contents = [];

        if (history.length === 0) {
            // First message: analyze job description
            contents.push({
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nВАКАНСІЯ ДЛЯ АНАЛІЗУ:\n${processedInput}` }]
            });
        } else {
            // Subsequent chat messages: include conversation history
            let isFirst = true;
            for (const msg of history) {
                let text = msg.content;
                if (isFirst) {
                    text = `${systemInstruction}\n\nПОЧАТКОВА ВАКАНСІЯ ТА КОНТЕКСТ:\n${text}`;
                    isFirst = false;
                }
                contents.push({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text }]
                });
            }

            if (rawInput) {
                contents.push({
                    role: 'user',
                    parts: [{ text: rawInput }]
                });
            }
        }

        // Try primary model gemini-3.6-flash first, fallback to gemini-3.5-flash -> gemini-3.1-flash-lite on 429
        let lastError: Error | null = null;
        let responseJson: Record<string, unknown> | null = null;

        for (const modelName of MODEL_FALLBACK_CHAIN) {
            try {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
                
                const apiRes = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents,
                        generationConfig: history.length === 0
                            ? { responseMimeType: 'application/json', temperature: 0.2 }
                            : { temperature: 0.7 }
                    })
                });

                if (apiRes.status === 429 || apiRes.status === 403) {
                    console.warn(`[AI-Match] Model ${modelName} returned HTTP ${apiRes.status}. Attempting fallback...`);
                    continue;
                }

                if (!apiRes.ok) {
                    const errText = await apiRes.text();
                    throw new Error(`Gemini API Error (${modelName}): ${apiRes.status} ${errText}`);
                }

                responseJson = (await apiRes.json()) as Record<string, unknown>;
                break; // Successfully got response
            } catch (err: unknown) {
                lastError = err as Error;
                console.error(`[AI-Match] Error with model ${modelName}:`, lastError.message);
            }
        }

        if (!responseJson) {
            throw lastError || new Error('All models in fallback chain failed.');
        }

        const candidates = responseJson.candidates as Array<{ content?: { parts?: Array<{ text?: string }> } }> | undefined;
        const rawText = candidates?.[0]?.content?.parts?.[0]?.text || '';

        if (history.length === 0) {
            try {
                const parsed = JSON.parse(rawText);
                return json({ isFirstAnalysis: true, result: parsed, rawText });
            } catch {
                return json({ isFirstAnalysis: true, result: null, rawText });
            }
        } else {
            return json({ isFirstAnalysis: false, reply: rawText });
        }
    } catch (err: unknown) {
        const errorObj = err as Error;
        console.error('[AI-Match API Error]:', errorObj);
        return json({ error: errorObj.message || 'Internal server error' }, { status: 500 });
    }
};
