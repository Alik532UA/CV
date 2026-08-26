import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * The AI proxy is stubbed at `fetch`, so these cases describe exactly one
 * thing: what the controller does with what comes back. That is where the
 * dishonest answers used to be invented.
 */
vi.mock("$env/dynamic/public", () => ({ env: { PUBLIC_AI_PROXY_URL: "http://proxy.test" } }));
vi.mock("$app/environment", () => ({ browser: true, dev: false }));
vi.mock("$app/navigation", () => ({ goto: vi.fn() }));

const { aiChat } = await import("./AiChatState.svelte");
const { t } = await import("./I18nState.svelte");

function respond(body: Record<string, unknown>) {
	vi.stubGlobal(
		"fetch",
		vi.fn(async () => new Response(JSON.stringify({ ok: true, ...body }), { status: 200 }))
	);
}

beforeEach(() => {
	aiChat.reset();
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("an empty answer is a failure, not a result", () => {
	/**
	 * AI-PROVIDERS-v8 § 6.1.1 — "success in which nothing was said". HTTP 200,
	 * the chain ran, the body is empty. This used to become the string
	 * "Модель не повернула структурований аналіз." in the results panel: a
	 * breakdown rendered as an outcome, in a panel that otherwise holds analysis.
	 */
	it("reports an error instead of filling the analysis panel", async () => {
		respond({ result: null, rawText: "   " });

		await aiChat.analyzeJob("Senior QA Engineer, Playwright, 5 years");

		expect(aiChat.error).toBe(t.ai.emptyAnswer);
		expect(aiChat.rawAnalysis).toBeNull();
		expect(aiChat.matchResult).toBeNull();
		expect(aiChat.hasAnalysis, "an empty answer must not open the results step").toBe(false);
	});

	/**
	 * The follow-up chat had its own invention: "Дякую за запитання!" — a polite
	 * line attributed to the model, which the model never said, and after which
	 * a recruiter sits waiting for the actual answer.
	 */
	it("does not attribute a made-up reply to the model", async () => {
		respond({ result: { matchPercentage: 80, keyStrengths: [], summary: "ok" }, rawText: "{}" });
		await aiChat.analyzeJob("job");

		const before = aiChat.history.length;
		respond({ reply: "", rawText: "" });
		await aiChat.sendMessage("Is he open to relocation?");

		expect(aiChat.error).toBe(t.ai.emptyAnswer);
		// The visitor's own message stays — only the fabricated answer is gone.
		expect(aiChat.history.length).toBe(before + 1);
		expect(aiChat.history.at(-1)?.role).toBe("user");
	});
});

describe("a non-JSON answer is still shown", () => {
	/**
	 * § 7.2: when the model answers in prose instead of JSON, show the prose.
	 * The earlier behaviour here was worse than an empty panel — it substituted
	 * `matchPercentage: 85` with invented strengths, so a recruiter read a
	 * number nobody had computed.
	 */
	it("shows the raw text rather than inventing a score", async () => {
		respond({ result: null, rawText: "Looks like a strong match, roughly speaking." });

		await aiChat.analyzeJob("job");

		expect(aiChat.matchResult).toBeNull();
		expect(aiChat.rawAnalysis).toBe("Looks like a strong match, roughly speaking.");
		expect(aiChat.error).toBeNull();
	});
});

describe("a failure is reported in the visitor's language", () => {
	/**
	 * Every one of these used to reach the screen as a Ukrainian literal — three
	 * from this controller, one straight out of the worker's `error` field. The
	 * site is English by default and renders in 42 languages, so a recruiter
	 * whose connection dropped read Cyrillic, and the sentence they read named a
	 * provider they had never heard of.
	 *
	 * The proxy now sends a CODE and the site picks the sentence, so what is
	 * asserted here is the mapping — including that the technical detail still
	 * goes somewhere, just not onto the screen.
	 */
	function failWith(status: number, body: Record<string, unknown>) {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => new Response(JSON.stringify({ ok: false, ...body }), { status }))
		);
	}

	it("a dead network reads as a network failure, not as a stack trace", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				throw new TypeError("Failed to fetch");
			})
		);

		await aiChat.analyzeJob("job");

		expect(aiChat.error).toBe(t.ai.errorNetwork);
	});

	it("a silent proxy stops the spinner instead of hanging on it", async () => {
		// `AbortSignal.timeout` rejects with exactly this; the wait itself is not
		// reproduced here, only what the controller does when it ends.
		vi.stubGlobal(
			"fetch",
			vi.fn(async () => {
				throw new DOMException("The operation timed out.", "TimeoutError");
			})
		);

		await aiChat.analyzeJob("job");

		expect(aiChat.error).toBe(t.ai.errorTimeout);
		expect(aiChat.isLoading, "the button must come back").toBe(false);
	});

	it("the request carries a deadline at all", async () => {
		respond({ result: null, rawText: "text" });
		await aiChat.analyzeJob("job");

		const call = (globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls.at(-1);
		expect((call?.[1] as RequestInit).signal, "without a signal the spinner runs forever").toBeInstanceOf(
			AbortSignal
		);
	});

	it("a minute limit and a day limit are different sentences", async () => {
		failWith(429, { error: "per-minute quota spent", code: "rate-limited", scope: "minute" });
		await aiChat.analyzeJob("job");
		expect(aiChat.error).toBe(t.ai.errorRateLimitMinute);

		failWith(429, { error: "per-IP daily quota spent", code: "rate-limited", scope: "day" });
		await aiChat.analyzeJob("job");
		expect(aiChat.error).toBe(t.ai.errorRateLimitDay);
	});

	it("an exhausted chain reads as an exhausted chain", async () => {
		failWith(502, { error: "every model in the chain is unavailable", code: "all-providers-failed" });

		await aiChat.analyzeJob("job");

		expect(aiChat.error).toBe(t.ai.errorUnavailable);
	});

	it("a proxy message never reaches the screen verbatim", async () => {
		// The whole point: whatever the worker writes there, it is a log line.
		failWith(500, { error: "groq/llama-3.3-70b: 500 upstream exploded" });

		await aiChat.analyzeJob("job");

		expect(aiChat.error).not.toContain("groq");
		expect(aiChat.error).toBe(t.ai.errorGeneric.replace("{status}", "500"));
	});
});

describe("the site's language travels with the request", () => {
	it("sends the current language so the model can answer in it", async () => {
		respond({ result: null, rawText: "text" });

		await aiChat.analyzeJob("job");

		const call = (globalThis.fetch as unknown as { mock: { calls: unknown[][] } }).mock.calls.at(-1);
		const body = JSON.parse((call?.[1] as RequestInit).body as string);
		expect(body.language).toBe("en");
	});
});
