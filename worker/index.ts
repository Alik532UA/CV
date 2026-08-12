/**
 * Cloudflare Worker — проксі між статичним сайтом на GitHub Pages і AI-провайдерами.
 *
 * ЧОМУ ВІН ІСНУЄ. До цього ключ Gemini підставлявся у збірку як
 * `PUBLIC_GEMINI_API_KEY` і лежав у бандлі відкритим текстом: будь-хто з
 * DevTools забирав його і вичерпував ліміти. Автоперемикання моделей лікувало
 * симптом. Тут ключі — секрети воркера, у браузер не потрапляє жоден.
 *
 * ЩО ВІН РОБИТЬ, крім приховування ключів:
 *  - тримає ланцюжок провайдерів (Gemini → Groq → SambaNova) і cooldown моделей,
 *    що впали через ліміт, — спільний для всіх відвідувачів, а не для кожної
 *    вкладки окремо;
 *  - обмежує частоту запитів на IP і сумарно на добу, бо відкритий проксі без
 *    лімітів вичерпує квоту так само легко, як публічний ключ;
 *  - повертає, ЯКА модель насправді відповіла — бейдж у UI більше не вигадує.
 *
 * Уся логіка ланцюжка і форматів запитів лежить у `src/lib/services/ai*.ts`, під
 * тестами vitest. Тут — тільки HTTP-обв'язка.
 */

import { AI_PROVIDERS, type AiProviderEntry } from "../src/lib/config/aiProviders";
import {
	buildChain,
	classifyStatus,
	cooldownMsFor,
	isRetryableOnSameProvider,
	parseRetryAfter,
	pruneCooldowns,
	shouldTryNextProvider,
	type CooldownMap,
	type FailureKind
} from "../src/lib/services/aiChain";
import { buildMessages, buildSystemPrompt, isFirstAnalysis } from "../src/lib/services/aiPrompt";
import {
	buildWireRequest,
	extractJsonObject,
	extractProviderError,
	extractReplyText,
	type AiPromptMessage
} from "../src/lib/services/aiWire";

interface Env {
	GEMINI_API_KEY?: string;
	GROQ_API_KEY?: string;
	SAMBANOVA_API_KEY?: string;
	/** Кома-розділений список. Порожній — беремо DEFAULT_ORIGINS. */
	ALLOWED_ORIGINS?: string;
	RATE_PER_MINUTE?: string;
	RATE_PER_DAY?: string;
	DAILY_TOTAL?: string;
}

const DEFAULT_ORIGINS = [
	"https://alik532ua.github.io",
	"http://localhost:5173",
	"http://localhost:4173"
];

/** Скільки моделей максимум пробуємо в межах одного запиту. */
const MAX_ATTEMPTS = 4;
/** Ліміт на один виклик провайдера. Gemini на довгій вакансії думає ~10-30 с. */
const PROVIDER_TIMEOUT_MS = 40_000;
/** Після цього часу нових спроб не починаємо — краще помилка, ніж вічне колесо. */
const TOTAL_DEADLINE_MS = 90_000;
const URL_FETCH_TIMEOUT_MS = 8_000;

const MAX_INPUT_CHARS = 20_000;
const MAX_HISTORY_MESSAGES = 20;
const MAX_HISTORY_CHARS = 24_000;
const MAX_URL_TEXT_CHARS = 8_000;

/**
 * Cooldown-и живуть у пам'яті ізоляту. Для трафіку портфоліо це фактично один
 * ізолят, тобто стан спільний — і саме тому наступний відвідувач не витрачає
 * зайвий круг на модель, що вичерпалася хвилину тому. Ціна: при перезапуску
 * ізоляту стан губиться, і перший запит знову спробує «найкращу» модель. Це
 * дешевше за KV-біндінг, який довелося б створювати руками; якщо колись стане
 * мало — сюда підставляється KV без змін решти коду.
 */
const cooldowns: CooldownMap = {};

interface RateBucket {
	minuteReset: number;
	minuteCount: number;
	dayReset: number;
	dayCount: number;
}
const rateByIp = new Map<string, RateBucket>();
let globalDayReset = 0;
let globalDayCount = 0;

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const origin = request.headers.get("Origin");
		const allowed = allowedOrigins(env);

		if (request.method === "OPTIONS") {
			return isAllowedOrigin(origin, allowed)
				? new Response(null, { status: 204, headers: corsHeaders(origin) })
				: new Response(null, { status: 403 });
		}

		const url = new URL(request.url);

		if (request.method === "GET" && url.pathname === "/health") {
			// Дає сайту знати, для яких моделей узагалі є ключі — саме так popover
			// показує «немає ключа» замість того, щоб дати обрати модель, якої
			// насправді немає.
			return json(
				{ ok: true, keyed: keyedProviderIds(env), cooldowns: remainingCooldowns(Date.now()) },
				200,
				corsHeaders(origin)
			);
		}

		if (request.method === "GET" && url.pathname === "/models") {
			// Діагностика: що реально доступно кожному ключу. Реєстр моделей інакше
			// перевіряється лише живим запитом — а модель, яку провайдер прибрав,
			// проявляється як 404 у першого ж відвідувача.
			//
			// Origin-gated, бо це службова інформація про наш акаунт, хоч і не
			// секретна: жодного ключа у відповіді немає, тільно назви моделей.
			if (!isAllowedOrigin(origin, allowed)) {
				return json({ ok: false, error: "Origin not allowed" }, 403);
			}
			return json(await listProviderModels(env), 200, corsHeaders(origin));
		}

		if (request.method !== "POST") {
			return json({ ok: false, error: "Method not allowed" }, 405, corsHeaders(origin));
		}

		if (!isAllowedOrigin(origin, allowed)) {
			// Без CORS-заголовків: чужий сайт не має використовувати проксі як
			// безкоштовний AI від імені цього домену.
			console.warn(`[proxy] blocked origin: ${origin ?? "(none)"}`);
			return json({ ok: false, error: "Origin not allowed" }, 403);
		}

		const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
		const limit = checkRateLimit(ip, env, Date.now());
		if (!limit.ok) {
			console.warn(`[proxy] rate limit (${limit.scope}) for ${ip}`);
			return json({ ok: false, error: limit.message, code: "rate-limited" }, 429, {
				...corsHeaders(origin),
				"Retry-After": String(limit.retryAfterSeconds)
			});
		}

		let body: unknown;
		try {
			body = await request.json();
		} catch {
			return json({ ok: false, error: "Invalid JSON body" }, 400, corsHeaders(origin));
		}

		const parsed = parseBody(body);
		if ("error" in parsed) {
			return json({ ok: false, error: parsed.error }, 400, corsHeaders(origin));
		}

		return handleMatch(parsed, env, origin);
	}
};

interface MatchRequest {
	input: string;
	history: AiPromptMessage[];
	pinnedId: string | null;
}

async function handleMatch(
	req: MatchRequest,
	env: Env,
	origin: string | null
): Promise<Response> {
	const startedAt = Date.now();
	const firstAnalysis = isFirstAnalysis(req.history);

	const input =
		firstAnalysis && /^https?:\/\//i.test(req.input)
			? await fetchJobTextFromUrl(req.input)
			: req.input;

	const system = buildSystemPrompt();
	const messages = buildMessages(input, req.history);

	prune(startedAt);
	const chain = buildChain(AI_PROVIDERS, {
		now: startedAt,
		pinnedId: req.pinnedId,
		cooldowns,
		hasKey: (entry) => Boolean(apiKeyFor(entry, env))
	});

	if (chain.length === 0) {
		console.error("[proxy] no providers with keys configured");
		return json(
			{ ok: false, error: "AI-провайдери не налаштовані на сервері.", code: "no-providers" },
			503,
			corsHeaders(origin)
		);
	}

	if (chain.length > MAX_ATTEMPTS) {
		// Обрізання не мовчить: інакше «спробували все» читалося б як факт.
		console.log(
			`[proxy] chain trimmed to ${MAX_ATTEMPTS}/${chain.length}: ` +
				chain
					.slice(MAX_ATTEMPTS)
					.map((p) => p.id)
					.join(", ") +
				" not tried"
		);
	}

	const attempts: Array<{ id: string; status?: number; kind?: FailureKind; error?: string }> = [];
	let lastError = "Усі моделі в ланцюжку недоступні.";

	for (const entry of chain.slice(0, MAX_ATTEMPTS)) {
		if (Date.now() - startedAt > TOTAL_DEADLINE_MS) {
			console.warn("[proxy] total deadline reached, stopping chain");
			break;
		}

		const apiKey = apiKeyFor(entry, env) as string;
		const request = buildWireRequest(entry, {
			apiKey,
			system,
			messages,
			jsonMode: firstAnalysis
		});

		const outcome = await callProvider(entry, request);

		if (outcome.ok) {
			const rawText = extractReplyText(entry.wire, outcome.payload);
			const result = firstAnalysis ? extractJsonObject(rawText) : null;

			console.log(
				`[proxy] ${entry.id} answered in ${Date.now() - startedAt}ms` +
					(attempts.length ? ` after ${attempts.length} failed attempt(s)` : "")
			);

			return json(
				{
					ok: true,
					modelId: entry.id,
					model: entry.model,
					provider: entry.provider,
					isFirstAnalysis: firstAnalysis,
					result,
					rawText,
					reply: firstAnalysis ? undefined : rawText,
					attempts,
					cooldowns: remainingCooldowns(Date.now())
				},
				200,
				corsHeaders(origin)
			);
		}

		attempts.push({ id: entry.id, status: outcome.status, kind: outcome.kind, error: outcome.error });
		lastError = outcome.error;

		const cooldown = cooldownMsFor(outcome.kind, outcome.retryAfterSeconds);
		if (cooldown > 0) {
			cooldowns[entry.id] = Date.now() + cooldown;
			console.warn(
				`[proxy] ${entry.id} → ${outcome.kind} (HTTP ${outcome.status ?? "-"}), ` +
					`cooldown ${Math.round(cooldown / 1000)}s`
			);
		}

		if (!shouldTryNextProvider(outcome.kind)) {
			// 400/404 — наша вина. Решта моделей відповіла б так само, тож не
			// витрачаємо ні їхню квоту, ні час користувача.
			console.error(`[proxy] request rejected by ${entry.id}, not falling back: ${outcome.error}`);
			return json(
				{ ok: false, error: outcome.error, code: "bad-request", attempts },
				400,
				corsHeaders(origin)
			);
		}
	}

	return json(
		{
			ok: false,
			error: lastError,
			code: "all-providers-failed",
			attempts,
			cooldowns: remainingCooldowns(Date.now())
		},
		502,
		corsHeaders(origin)
	);
}

type ProviderOutcome =
	| { ok: true; payload: unknown }
	| {
			ok: false;
			kind: FailureKind;
			status?: number;
			error: string;
			retryAfterSeconds?: number | null;
	  };

/** Один провайдер: запит, і для тимчасових помилок — рівно одна повторна спроба. */
async function callProvider(
	entry: AiProviderEntry,
	request: { url: string; init: { method: "POST"; headers: Record<string, string>; body: string } }
): Promise<ProviderOutcome> {
	for (let attempt = 0; attempt < 2; attempt++) {
		if (attempt > 0) await sleep(600);

		let response: Response;
		try {
			response = await fetch(request.url, {
				method: request.init.method,
				headers: request.init.headers,
				body: request.init.body,
				signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS)
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			if (attempt === 0) continue;
			return { ok: false, kind: "transient", error: `${entry.provider}: ${message}` };
		}

		if (response.ok) {
			try {
				return { ok: true, payload: await response.json() };
			} catch {
				// 200 з нечитабельним тілом — теж тимчасова біда цього провайдера.
				return { ok: false, kind: "transient", error: `${entry.provider}: malformed JSON` };
			}
		}

		const kind = classifyStatus(response.status);
		const retryAfterSeconds = parseRetryAfter(response.headers.get("Retry-After"), Date.now());
		const detail = extractProviderError(await response.text());

		if (isRetryableOnSameProvider(kind) && attempt === 0) continue;

		return {
			ok: false,
			kind,
			status: response.status,
			error: `${entry.provider}/${entry.model}: ${response.status} ${detail}`,
			retryAfterSeconds
		};
	}

	return { ok: false, kind: "unknown", error: `${entry.provider}: no response` };
}

/**
 * Питає кожного провайдера, які моделі бачить його ключ. Один запит на ключ, а не
 * на модель: ключі спільні для всіх записів реєстру.
 */
async function listProviderModels(env: Env): Promise<Record<string, unknown>> {
	const endpoints: Array<{ provider: string; url: string; headers: Record<string, string> }> = [];
	const seen = new Set<string>();

	for (const entry of AI_PROVIDERS) {
		const key = apiKeyFor(entry, env);
		if (!key || seen.has(entry.keyName)) continue;
		seen.add(entry.keyName);

		endpoints.push(
			entry.wire === "gemini"
				? {
						provider: entry.provider,
						url: `${entry.baseUrl}?pageSize=100`,
						headers: { "x-goog-api-key": key }
					}
				: {
						provider: entry.provider,
						// .../chat/completions → .../models
						url: entry.baseUrl.replace(/\/chat\/completions$/, "/models"),
						headers: { Authorization: `Bearer ${key}` }
					}
		);
	}

	const results = await Promise.all(
		endpoints.map(async ({ provider, url, headers }) => {
			try {
				const res = await fetch(url, { headers, signal: AbortSignal.timeout(15_000) });
				const text = await res.text();
				if (!res.ok) {
					return [provider, { status: res.status, error: extractProviderError(text) }] as const;
				}
				const payload = JSON.parse(text) as {
					data?: Array<{ id?: string }>;
					models?: Array<{ name?: string }>;
				};
				const ids = payload.data
					? payload.data.map((m) => m.id ?? "")
					: (payload.models ?? []).map((m) => (m.name ?? "").replace(/^models\//, ""));
				return [provider, { status: res.status, models: ids.filter(Boolean).sort() }] as const;
			} catch (err) {
				return [provider, { error: err instanceof Error ? err.message : String(err) }] as const;
			}
		})
	);

	return { ok: true, providers: Object.fromEntries(results) };
}

function apiKeyFor(entry: AiProviderEntry, env: Env): string | undefined {
	const key = env[entry.keyName];
	return key && key.trim().length > 10 ? key.trim() : undefined;
}

function keyedProviderIds(env: Env): string[] {
	return AI_PROVIDERS.filter((p) => apiKeyFor(p, env)).map((p) => p.id);
}

function prune(now: number): void {
	const kept = pruneCooldowns(cooldowns, now);
	for (const id of Object.keys(cooldowns)) {
		if (!(id in kept)) delete cooldowns[id];
	}
}

/** Клієнту віддаємо залишок у мс, а не абсолютний час — годинники розходяться. */
function remainingCooldowns(now: number): Record<string, number> {
	const out: Record<string, number> = {};
	for (const [id, until] of Object.entries(cooldowns)) {
		if (until > now) out[id] = until - now;
	}
	return out;
}

function parseBody(body: unknown): MatchRequest | { error: string } {
	if (!body || typeof body !== "object") return { error: "Body must be an object" };
	const raw = body as { input?: unknown; history?: unknown; model?: unknown };

	const input = typeof raw.input === "string" ? raw.input.trim().slice(0, MAX_INPUT_CHARS) : "";

	let history: AiPromptMessage[] = [];
	if (raw.history !== undefined) {
		if (!Array.isArray(raw.history)) return { error: "history must be an array" };
		history = raw.history
			.filter(
				(m): m is AiPromptMessage =>
					Boolean(m) &&
					typeof m === "object" &&
					(m as AiPromptMessage).role !== undefined &&
					["user", "model"].includes((m as AiPromptMessage).role) &&
					typeof (m as AiPromptMessage).content === "string"
			)
			.slice(-MAX_HISTORY_MESSAGES)
			.map((m) => ({ role: m.role, content: m.content }));

		let total = 0;
		history = history.filter((m) => {
			total += m.content.length;
			return total <= MAX_HISTORY_CHARS;
		});
	}

	if (!input && history.length === 0) return { error: "Input text or URL is required." };

	const pinnedId =
		typeof raw.model === "string" && AI_PROVIDERS.some((p) => p.id === raw.model)
			? raw.model
			: null;

	return { input, history, pinnedId };
}

/**
 * Дістає текст вакансії за посиланням. Не вийшло — віддаємо саме посилання:
 * модель хоча б скаже, що не бачить опису, замість того, щоб аналізувати HTML
 * сторінки-заглушки.
 */
async function fetchJobTextFromUrl(urlStr: string): Promise<string> {
	try {
		const res = await fetch(new URL(urlStr).toString(), {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
			},
			signal: AbortSignal.timeout(URL_FETCH_TIMEOUT_MS)
		});
		if (!res.ok) return urlStr;

		const text = (await res.text())
			.replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
			.replace(/<style\b[^<]*>([\s\S]*?)<\/style>/gi, "")
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim();

		return text.length > 100 ? text.slice(0, MAX_URL_TEXT_CHARS) : urlStr;
	} catch {
		return urlStr;
	}
}

interface RateVerdict {
	ok: boolean;
	scope?: "minute" | "day" | "global";
	message?: string;
	retryAfterSeconds?: number;
}

/**
 * Проксі приховує ключ, але сам відкритий для всіх — без лімітів квоту вичерпає
 * будь-хто, і ми повернемося до того, з чого починали.
 */
function checkRateLimit(ip: string, env: Env, now: number): RateVerdict {
	const perMinute = numberFrom(env.RATE_PER_MINUTE, 6);
	const perDay = numberFrom(env.RATE_PER_DAY, 40);
	const globalPerDay = numberFrom(env.DAILY_TOTAL, 300);

	if (now > globalDayReset) {
		globalDayReset = now + 86_400_000;
		globalDayCount = 0;
	}
	if (globalDayCount >= globalPerDay) {
		return {
			ok: false,
			scope: "global",
			message: "Денний ліміт запитів до AI вичерпано. Спробуйте завтра.",
			retryAfterSeconds: Math.ceil((globalDayReset - now) / 1000)
		};
	}

	let bucket = rateByIp.get(ip);
	if (!bucket) {
		bucket = { minuteReset: now + 60_000, minuteCount: 0, dayReset: now + 86_400_000, dayCount: 0 };
		rateByIp.set(ip, bucket);
	}
	if (now > bucket.minuteReset) {
		bucket.minuteReset = now + 60_000;
		bucket.minuteCount = 0;
	}
	if (now > bucket.dayReset) {
		bucket.dayReset = now + 86_400_000;
		bucket.dayCount = 0;
	}

	if (bucket.minuteCount >= perMinute) {
		return {
			ok: false,
			scope: "minute",
			message: "Занадто багато запитів. Спробуйте за хвилину.",
			retryAfterSeconds: Math.ceil((bucket.minuteReset - now) / 1000)
		};
	}
	if (bucket.dayCount >= perDay) {
		return {
			ok: false,
			scope: "day",
			message: "Ліміт запитів на сьогодні вичерпано.",
			retryAfterSeconds: Math.ceil((bucket.dayReset - now) / 1000)
		};
	}

	bucket.minuteCount++;
	bucket.dayCount++;
	globalDayCount++;

	// Мапа не має рости безкінечно: ізолят живе годинами, IP-адрес за цей час
	// може бути багато.
	if (rateByIp.size > 5_000) {
		for (const [key, value] of rateByIp) {
			if (now > value.dayReset) rateByIp.delete(key);
		}
	}

	return { ok: true };
}

function numberFrom(value: string | undefined, fallback: number): number {
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function allowedOrigins(env: Env): string[] {
	const configured = (env.ALLOWED_ORIGINS ?? "")
		.split(",")
		.map((o) => o.trim().toLowerCase())
		.filter(Boolean);
	return configured.length > 0 ? configured : DEFAULT_ORIGINS;
}

function isAllowedOrigin(origin: string | null, allowed: string[]): boolean {
	if (!origin) return false;
	const normalized = origin.toLowerCase();
	if (allowed.includes(normalized)) return true;

	// Будь-який порт локальної машини. Список фіксованих портів тут не працює:
	// vite бере наступний вільний (5173 → 5174 → …), а IDE-харнеси й Playwright
	// підставляють свій. Origin `localhost` може прийти тільки зі сторінки, яку
	// розробник сам відкрив у себе, тому дозволяти всі порти безпечно — на відміну
	// від публічних доменів, які лишаються строгим списком.
	return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalized);
}

function corsHeaders(origin: string | null): Record<string, string> {
	if (!origin) return {};
	return {
		"Access-Control-Allow-Origin": origin,
		"Access-Control-Allow-Methods": "POST, GET, OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
		"Access-Control-Max-Age": "86400",
		Vary: "Origin"
	};
}

function json(payload: unknown, status: number, headers: Record<string, string> = {}): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: { "Content-Type": "application/json; charset=utf-8", ...headers }
	});
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
