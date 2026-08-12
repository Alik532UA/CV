// @vitest-environment node
import { describe, expect, it } from "vitest";
import type { AiProviderEntry } from "$lib/config/aiProviders";
import {
	buildBindingInput,
	buildWireRequest,
	extractJsonObject,
	extractProviderError,
	extractReplyText
} from "./aiWire";

const gemini: AiProviderEntry = {
	id: "gemini-36-flash",
	provider: "Gemini",
	model: "gemini-3.6-flash",
	wire: "gemini",
	keyName: "GEMINI_API_KEY",
	baseUrl: "https://generativelanguage.googleapis.com/v1beta/models/",
	score: 90
};

const groq: AiProviderEntry = {
	id: "groq-gpt-oss-120b",
	provider: "Groq",
	model: "openai/gpt-oss-120b",
	wire: "openai",
	keyName: "GROQ_API_KEY",
	baseUrl: "https://api.groq.com/openai/v1/chat/completions",
	score: 82
};

const messages = [
	{ role: "user" as const, content: "вакансія" },
	{ role: "model" as const, content: "відповідь" }
];

describe("buildWireRequest / gemini", () => {
	it("кладе ключ у заголовок, а не в query", () => {
		const req = buildWireRequest(gemini, {
			apiKey: "secret-key",
			system: "sys",
			messages,
			jsonMode: true
		});
		expect(req.url).toBe(
			"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent"
		);
		expect(req.url).not.toContain("secret-key");
		expect(req.init.headers["x-goog-api-key"]).toBe("secret-key");
	});

	it("вмикає нативний JSON-режим лише для першого аналізу", () => {
		const json = JSON.parse(
			buildWireRequest(gemini, { apiKey: "k", system: "sys", messages, jsonMode: true }).init.body
		);
		expect(json.generationConfig.responseMimeType).toBe("application/json");
		expect(json.systemInstruction.parts[0].text).toBe("sys");

		const chat = JSON.parse(
			buildWireRequest(gemini, { apiKey: "k", system: "sys", messages, jsonMode: false }).init.body
		);
		expect(chat.generationConfig.responseMimeType).toBeUndefined();
		expect(chat.generationConfig.temperature).toBeGreaterThan(
			json.generationConfig.temperature as number
		);
	});
});

describe("buildWireRequest / openai", () => {
	it("переносить system окремим повідомленням і мапить model → assistant", () => {
		const req = buildWireRequest(groq, {
			apiKey: "gsk_x",
			system: "sys",
			messages,
			jsonMode: true
		});
		expect(req.url).toBe(groq.baseUrl);
		expect(req.init.headers.Authorization).toBe("Bearer gsk_x");

		const body = JSON.parse(req.init.body);
		expect(body.model).toBe("openai/gpt-oss-120b");
		expect(body.messages.map((m: { role: string }) => m.role)).toEqual([
			"system",
			"user",
			"assistant"
		]);
	});

	it("не надсилає response_format — це 400 на частині моделей", () => {
		const body = JSON.parse(
			buildWireRequest(groq, { apiKey: "k", system: "s", messages, jsonMode: true }).init.body
		);
		expect(body.response_format).toBeUndefined();
	});
});

describe("cf-binding", () => {
	const cf: AiProviderEntry = {
		id: "cloudflare-gpt-oss-120b",
		provider: "Cloudflare",
		model: "@cf/openai/gpt-oss-120b",
		wire: "cf-binding",
		keyName: null,
		baseUrl: "",
		score: 40
	};

	it("вхід для env.AI.run має system першим повідомленням", () => {
		const input = buildBindingInput({ system: "sys", messages, jsonMode: true });
		expect(input.messages.map((m) => m.role)).toEqual(["system", "user", "assistant"]);
		expect(input.messages[0].content).toBe("sys");
		expect(input.temperature).toBeLessThan(0.5);
	});

	it("HTTP-білдер на біндінгу кидає помилку, а не мовчки шле запит у нікуди", () => {
		// baseUrl порожній: без цієї перевірки fetch пішов би на "" і впав би
		// незрозумілою помилкою мережі замість явної.
		expect(() =>
			buildWireRequest(cf, { apiKey: "", system: "s", messages, jsonMode: false })
		).toThrow(/cf-binding/);
	});

	it("текст беруть з response або з OpenAI-подібної обгортки", () => {
		expect(extractReplyText("cf-binding", { response: " відповідь " })).toBe("відповідь");
		// Реальний формат @cf/openai/gpt-oss-120b — саме `choices`, а не `response`.
		expect(extractReplyText("cf-binding", { choices: [{ message: { content: "з choices" } }] })).toBe(
			"з choices"
		);
	});

	it("роздуми без відповіді дають порожній рядок, а не текст роздумів", () => {
		// Справжня відповідь, знята з біндінга 13.08.2026: бюджет токенів пішов у
		// `reasoning`, `content` лишився null. Показати роздуми користувачу було б
		// гірше за перемикання на наступного провайдера.
		const reasoningOnly = {
			choices: [
				{
					finish_reason: "length",
					message: { content: null, reasoning: "We need to analyze the vacancy…" }
				}
			]
		};
		expect(extractReplyText("cf-binding", reasoningOnly)).toBe("");
	});

	it("просить достатній бюджет токенів — інакше reasoning-модель не дійде до відповіді", () => {
		const input = buildBindingInput({ system: "s", messages, jsonMode: true });
		expect(input.max_tokens).toBeGreaterThanOrEqual(2048);
	});
});

describe("extractReplyText", () => {
	it("склеює частини Gemini", () => {
		const text = extractReplyText("gemini", {
			candidates: [{ content: { parts: [{ text: "перша " }, { text: "друга" }] } }]
		});
		expect(text).toBe("перша друга");
	});

	it("бере choices[0].message.content для OpenAI-сумісних", () => {
		expect(extractReplyText("openai", { choices: [{ message: { content: " привіт " } }] })).toBe(
			"привіт"
		);
	});

	it("порожня відповідь не кидає виняток", () => {
		expect(extractReplyText("gemini", {})).toBe("");
		expect(extractReplyText("openai", null)).toBe("");
	});
});

describe("extractJsonObject", () => {
	it("розбирає чистий JSON", () => {
		expect(extractJsonObject('{"matchPercentage":88}')).toEqual({ matchPercentage: 88 });
	});

	it("знімає ```json-фенс, яким люблять обертати відповідь OpenAI-сумісні моделі", () => {
		expect(extractJsonObject('```json\n{"matchPercentage":70}\n```')).toEqual({
			matchPercentage: 70
		});
	});

	it("виловлює об'єкт із балаканини навколо", () => {
		const raw = 'Ось результат:\n{"matchPercentage":91,"summary":"ok"}\nСподіваюсь, допоміг!';
		expect(extractJsonObject(raw)).toEqual({ matchPercentage: 91, summary: "ok" });
	});

	it("не обривається на дужці всередині рядка", () => {
		const raw = '{"summary":"зростання {sic} на 50%","matchPercentage":60}';
		expect(extractJsonObject(raw)).toEqual({
			summary: "зростання {sic} на 50%",
			matchPercentage: 60
		});
	});

	it("повертає null, коли JSON немає — далі показуємо сирий текст, а не вигадані дані", () => {
		expect(extractJsonObject("Вибачте, не можу оцінити цю вакансію.")).toBeNull();
		expect(extractJsonObject("[1,2,3]")).toBeNull();
	});
});

describe("extractProviderError", () => {
	it("дістає message з типової помилки провайдера", () => {
		expect(extractProviderError('{"error":{"message":"quota exceeded","code":429}}')).toBe(
			"quota exceeded"
		);
		expect(extractProviderError('{"error":"invalid_api_key"}')).toBe("invalid_api_key");
	});

	it("не-JSON віддає обрізаним", () => {
		expect(extractProviderError("<html>502 Bad Gateway</html>")).toBe("<html>502 Bad Gateway</html>");
		expect(extractProviderError("x".repeat(500)).length).toBe(300);
	});
});
