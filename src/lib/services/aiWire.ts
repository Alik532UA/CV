/**
 * Перекладачі між нашим форматом діалогу і двома протоколами: Gemini native та
 * OpenAI-сумісним (Groq, SambaNova, OpenRouter, локальна Ollama — усі говорять
 * ним). Адаптер на протокол, а не на провайдера: додати ще один OpenAI-сумісний
 * сервіс — це рядок у реєстрі, а не новий код.
 *
 * Як і aiChain.ts, лежить під `src/` заради тестів (`vitest` бачить лише
 * `src/**`), а виконується у Cloudflare Worker.
 */

import type { AiProviderEntry, AiWire } from "../config/aiProviders";

export interface AiPromptMessage {
	role: "user" | "model";
	content: string;
}

export interface WireRequestOptions {
	apiKey: string;
	system: string;
	messages: AiPromptMessage[];
	/** Перший аналіз вакансії — потрібен строгий JSON; далі вільний чат. */
	jsonMode: boolean;
}

export interface WireRequest {
	url: string;
	init: {
		method: "POST";
		headers: Record<string, string>;
		body: string;
	};
}

const TEMPERATURE_JSON = 0.2;
const TEMPERATURE_CHAT = 0.7;

/**
 * Бюджет на роздуми + власне відповідь для reasoning-моделей через біндінг.
 * 4096 виявилося замало: gpt-oss обривався на роздумах приблизно в половині
 * спроб. Ціна щедрішого бюджету — neurons лише за фактично згенеровані токени.
 */
const BINDING_MAX_TOKENS = 8192;

/**
 * Повідомлення у форматі OpenAI/Workers AI: system окремим першим елементом.
 * Спільне для `openai` і `cf-binding` — інакше дві копії мапінгу ролей
 * розійшлися б, а помітно це стало б лише на другому провайдері.
 */
export function buildChatMessages(
	system: string,
	messages: AiPromptMessage[]
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
	return [
		{ role: "system" as const, content: system },
		...messages.map((m) => ({
			role: m.role === "user" ? ("user" as const) : ("assistant" as const),
			content: m.content
		}))
	];
}

/**
 * Вхід для `env.AI.run(model, …)`. Не HTTP-запит: URL і заголовків тут немає,
 * бо біндінг — виклик рантайму воркера, а не мережі.
 */
export function buildBindingInput(
	options: Pick<WireRequestOptions, "system" | "messages" | "jsonMode">
): {
	messages: ReturnType<typeof buildChatMessages>;
	temperature: number;
	max_tokens: number;
} {
	return {
		messages: buildChatMessages(options.system, options.messages),
		temperature: options.jsonMode ? TEMPERATURE_JSON : TEMPERATURE_CHAT,
		/**
		 * Без явного ліміту Workers AI дає дефолт на кілька сотень токенів, а
		 * gpt-oss — reasoning-модель: вона витрачає їх на `reasoning` і повертає
		 * `content: null` з `finish_reason: "length"`. Тобто відповідь приходить
		 * порожньою не через помилку, а через бюджет.
		 */
		max_tokens: BINDING_MAX_TOKENS
	};
}

export function buildWireRequest(entry: AiProviderEntry, options: WireRequestOptions): WireRequest {
	const { apiKey, system, messages, jsonMode } = options;
	const temperature = jsonMode ? TEMPERATURE_JSON : TEMPERATURE_CHAT;

	if (entry.wire === "cf-binding") {
		// Не тихий фолбек на HTTP: біндінг не має URL, і запит нікуди не пішов би.
		throw new Error(`${entry.id}: cf-binding goes through buildBindingInput, not HTTP`);
	}

	if (entry.wire === "gemini") {
		return {
			// Ключ у заголовку, а не в `?key=` — інакше він тече в кожен лог,
			// проксі й Referer по дорозі.
			url: `${entry.baseUrl}${entry.model}:generateContent`,
			init: {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-goog-api-key": apiKey
				},
				body: JSON.stringify({
					systemInstruction: { parts: [{ text: system }] },
					contents: messages.map((m) => ({
						role: m.role === "user" ? "user" : "model",
						parts: [{ text: m.content }]
					})),
					generationConfig: jsonMode
						? { responseMimeType: "application/json", temperature }
						: { temperature }
				})
			}
		};
	}

	return {
		url: entry.baseUrl,
		init: {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: entry.model,
				messages: buildChatMessages(system, messages),
				temperature
			})
			// `response_format: json_object` тут свідомо не надсилаємо: набір
			// моделей, що його підтримують, у Groq і SambaNova різний, і відмова
			// приходить як 400 — тобто ми втратили б провайдера через прикрасу.
			// Замість цього JSON вимагає промпт, а розбирає extractJsonObject().
		}
	};
}

interface GeminiPayload {
	candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

interface OpenAiPayload {
	choices?: Array<{ message?: { content?: string } }>;
}

/** Біндінг Workers AI віддає текст полем `response`, а не `choices`. */
interface BindingPayload {
	response?: string;
}

export function extractReplyText(wire: AiWire, payload: unknown): string {
	if (!payload || typeof payload !== "object") return "";

	if (wire === "cf-binding") {
		const binding = payload as BindingPayload & OpenAiPayload;
		// `response` — документований формат; `choices` як запас, бо частина
		// моделей Workers AI віддає OpenAI-подібну обгортку.
		return (binding.response ?? binding.choices?.[0]?.message?.content ?? "").trim();
	}

	if (wire === "gemini") {
		const parts = (payload as GeminiPayload).candidates?.[0]?.content?.parts ?? [];
		return parts
			.map((p) => p.text ?? "")
			.join("")
			.trim();
	}

	return ((payload as OpenAiPayload).choices?.[0]?.message?.content ?? "").trim();
}

/** Текст помилки провайдера — щоб у логах було видно причину, а не «500». */
export function extractProviderError(raw: string): string {
	try {
		const parsed = JSON.parse(raw) as { error?: { message?: string } | string };
		if (typeof parsed.error === "string") return parsed.error;
		if (parsed.error?.message) return parsed.error.message;
	} catch {
		/* не JSON — віддаємо як є */
	}
	return raw.slice(0, 300);
}

/**
 * Дістає JSON-об'єкт з відповіді моделі.
 *
 * Потрібен тому, що строгий JSON-режим є лише в Gemini: OpenAI-сумісні
 * провайдери охоче обертають об'єкт у ```json-фенс або додають фразу до/після.
 * Раніше на невдалому `JSON.parse` контролер вигадував `matchPercentage: 85` з
 * фейковими сильними сторонами — тобто показував HR вигадані дані.
 */
export function extractJsonObject(text: string): Record<string, unknown> | null {
	const trimmed = stripCodeFence(text.trim());

	const direct = tryParseObject(trimmed);
	if (direct) return direct;

	const slice = firstJsonObjectSlice(trimmed);
	return slice ? tryParseObject(slice) : null;
}

function stripCodeFence(text: string): string {
	const fence = /^```[a-z]*\s*([\s\S]*?)\s*```$/i.exec(text);
	return fence ? fence[1].trim() : text;
}

function tryParseObject(text: string): Record<string, unknown> | null {
	try {
		const parsed = JSON.parse(text);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed)
			? (parsed as Record<string, unknown>)
			: null;
	} catch {
		return null;
	}
}

/**
 * Перший збалансований `{…}` у тексті. Лапки і escape-послідовності
 * враховуються, інакше `"summary": "виріс на 50% {sic}"` обривав би об'єкт
 * посеред рядка.
 */
function firstJsonObjectSlice(text: string): string | null {
	const start = text.indexOf("{");
	if (start === -1) return null;

	let depth = 0;
	let inString = false;
	let escaped = false;

	for (let i = start; i < text.length; i++) {
		const char = text[i];

		if (inString) {
			if (escaped) escaped = false;
			else if (char === "\\") escaped = true;
			else if (char === '"') inString = false;
			continue;
		}

		if (char === '"') inString = true;
		else if (char === "{") depth++;
		else if (char === "}") {
			depth--;
			if (depth === 0) return text.slice(start, i + 1);
		}
	}

	return null;
}
