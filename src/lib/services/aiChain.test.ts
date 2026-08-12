// @vitest-environment node
// Логіка ланцюжка не торкається DOM — jsdom тут лише сповільнював би запуск.
import { describe, expect, it } from "vitest";
import { AI_PROVIDERS, type AiProviderEntry } from "$lib/config/aiProviders";
import {
	buildChain,
	classifyStatus,
	cooldownMsFor,
	isRetryableOnSameProvider,
	parseRetryAfter,
	providerStatus,
	pruneCooldowns,
	shouldTryNextProvider
} from "./aiChain";

const NOW = 1_700_000_000_000;

function entry(id: string, score: number): AiProviderEntry {
	return {
		id,
		provider: "Test",
		model: id,
		wire: "openai",
		keyName: "GROQ_API_KEY",
		baseUrl: "https://example.test/v1/chat/completions",
		score
	};
}

const A = entry("a", 90);
const B = entry("b", 80);
const C = entry("c", 70);
const ALL = [A, B, C];
const withAllKeys = () => true;

describe("classifyStatus", () => {
	it("розділяє ліміти, невалідний ключ і нашу власну помилку", () => {
		expect(classifyStatus(429)).toBe("quota");
		expect(classifyStatus(403)).toBe("quota");
		expect(classifyStatus(401)).toBe("auth");
		expect(classifyStatus(400)).toBe("request");
		expect(classifyStatus(404)).toBe("request");
		expect(classifyStatus(503)).toBe("transient");
	});

	it("на зламаному запиті ланцюжок не палиться", () => {
		// Головна причина, чому класифікація взагалі існує: 400 однаково зустріне
		// кожна модель, тож три зайві виклики нічого не дають.
		expect(shouldTryNextProvider("request")).toBe(false);
		expect(shouldTryNextProvider("quota")).toBe(true);
		expect(shouldTryNextProvider("transient")).toBe(true);
	});

	it("повторює на тій самій моделі лише тимчасові помилки", () => {
		expect(isRetryableOnSameProvider("transient")).toBe(true);
		expect(isRetryableOnSameProvider("quota")).toBe(false);
	});
});

describe("cooldown", () => {
	it("шанує Retry-After у секундах і як дату", () => {
		expect(parseRetryAfter("42", NOW)).toBe(42);
		expect(parseRetryAfter(new Date(NOW + 60_000).toUTCString(), NOW)).toBe(60);
		expect(parseRetryAfter(null, NOW)).toBeNull();
		expect(parseRetryAfter("не-дата", NOW)).toBeNull();
	});

	it("бере Retry-After замість дефолту, але обрізає абсурдні значення", () => {
		expect(cooldownMsFor("quota", 120)).toBe(120_000);
		expect(cooldownMsFor("quota", null)).toBe(30 * 60 * 1000);
		expect(cooldownMsFor("quota", 999_999)).toBe(2 * 60 * 60 * 1000);
	});

	it("невалідний ключ гасне надовго, бо сам собою не полагодиться", () => {
		expect(cooldownMsFor("auth", 5)).toBeGreaterThan(cooldownMsFor("quota", null));
	});

	it("prune прибирає прострочене й лишає активне", () => {
		const pruned = pruneCooldowns({ a: NOW - 1, b: NOW + 1000 }, NOW);
		expect(pruned).toEqual({ b: NOW + 1000 });
	});
});

describe("buildChain", () => {
	it("сортує за score, а не за порядком у реєстрі", () => {
		const chain = buildChain([C, A, B], { now: NOW, hasKey: withAllKeys });
		expect(chain.map((p) => p.id)).toEqual(["a", "b", "c"]);
	});

	it("викидає провайдерів без ключа", () => {
		const chain = buildChain(ALL, { now: NOW, hasKey: (p) => p.id !== "a" });
		expect(chain.map((p) => p.id)).toEqual(["b", "c"]);
	});

	it("ставить остиглих у хвіст, а не викидає", () => {
		// Ключове рішення: ланцюжок ніколи не буває порожнім через cooldown —
		// ліміт міг скинутися раніше, ніж ми думали.
		const chain = buildChain(ALL, {
			now: NOW,
			cooldowns: { a: NOW + 60_000 },
			hasKey: withAllKeys
		});
		expect(chain.map((p) => p.id)).toEqual(["b", "c", "a"]);
	});

	it("ігнорує прострочений cooldown", () => {
		const chain = buildChain(ALL, { now: NOW, cooldowns: { a: NOW - 1 }, hasKey: withAllKeys });
		expect(chain.map((p) => p.id)).toEqual(["a", "b", "c"]);
	});

	it("ручний вибір стає головою, але fallback лишається", () => {
		const chain = buildChain(ALL, { now: NOW, pinnedId: "c", hasKey: withAllKeys });
		expect(chain.map((p) => p.id)).toEqual(["c", "a", "b"]);
	});

	it("пробує закріплену модель навіть коли вона остигає — це явний вибір людини", () => {
		const chain = buildChain(ALL, {
			now: NOW,
			pinnedId: "a",
			cooldowns: { a: NOW + 60_000 },
			hasKey: withAllKeys
		});
		expect(chain[0].id).toBe("a");
	});

	it("закріплення неіснуючої або безключової моделі не ламає ланцюжок", () => {
		const chain = buildChain(ALL, { now: NOW, pinnedId: "zzz", hasKey: withAllKeys });
		expect(chain.map((p) => p.id)).toEqual(["a", "b", "c"]);
	});
});

describe("providerStatus", () => {
	it("розрізняє ready / cooling / no-key", () => {
		expect(providerStatus(A, { now: NOW, keyed: ["a"] })).toBe("ready");
		expect(providerStatus(A, { now: NOW, keyed: ["b"] })).toBe("no-key");
		expect(providerStatus(A, { now: NOW, cooldowns: { a: NOW + 5 }, keyed: ["a"] })).toBe(
			"cooling"
		);
	});

	it("без списку ключів вважає модель наявною — клієнт не знає про секрети", () => {
		expect(providerStatus(A, { now: NOW })).toBe("ready");
	});
});

describe("реєстр AI_PROVIDERS", () => {
	it("має унікальні id у kebab-case (id потрапляє в data-testid)", () => {
		const ids = AI_PROVIDERS.map((p) => p.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
	});

	it("покриває більше одного провайдера — інакше fallback лікує лише симптом", () => {
		expect(new Set(AI_PROVIDERS.map((p) => p.provider)).size).toBeGreaterThan(1);
	});

	it("кожен запис має ключ і базовий URL", () => {
		for (const p of AI_PROVIDERS) {
			expect(p.keyName).toBeTruthy();
			expect(p.baseUrl.startsWith("https://")).toBe(true);
		}
	});
});
