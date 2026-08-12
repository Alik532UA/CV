/**
 * Чиста логіка ланцюжка AI-провайдерів: класифікація помилок, cooldown, порядок
 * спроб. Виконується у Cloudflare Worker (`worker/index.ts` імпортує саме цей
 * файл), а живе під `src/`, бо vitest бере тести лише з `src/**` — інакше ядро
 * алгоритму лишилося б без жодного тесту, як було до цього.
 *
 * Без SvelteKit-імпортів і без побічних ефектів: усе на вхідних аргументах,
 * час теж передається (`now`), щоб тести не залежали від годинника.
 */

import type { AiProviderEntry } from "../config/aiProviders";

/**
 * Причина, чому провайдер не відповів. Розділення важливе: до цього будь-яка
 * помилка спалювала весь ланцюжок, тобто зламаний запит (400) витрачав три
 * моделі й повертав лише останню помилку.
 */
export type FailureKind =
	/** Ліміти вичерпані (429) або квота/ключ відхилені Google (403). */
	| "quota"
	/** Ключ невалідний (401). Наступні запити цим ключем теж не мають сенсу. */
	| "auth"
	/**
	 * Модель існує, але не для цього ключа: 402 (потрібна картка — так віддає
	 * SambaNova платні моделі на безкоштовному плані) або 404 (модель прибрали чи
	 * назву змінили). Саме по собі це не полагодиться, але сусідній провайдер
	 * відповість — тому довгий cooldown і одразу наступний у ланцюжку.
	 */
	| "unavailable"
	/** Тимчасове: 5xx, обрив мережі, таймаут. Та сама модель варта ще спроби. */
	| "transient"
	/** Наша вина: 400/404/422. Інші моделі відповіли б так само. */
	| "request"
	| "unknown";

/** Скільки провайдер вважається «остиглим» після відповідної помилки. */
export const COOLDOWN_MS: Record<FailureKind, number> = {
	quota: 30 * 60 * 1000,
	auth: 6 * 60 * 60 * 1000,
	unavailable: 12 * 60 * 60 * 1000,
	transient: 60 * 1000,
	request: 0,
	unknown: 5 * 60 * 1000
};

export function classifyStatus(status: number): FailureKind {
	if (status === 429) return "quota";
	// Gemini віддає 403 і на вичерпану квоту, і на ключ без доступу до моделі.
	// Для нас це однаково «зараз через цей ключ не працює».
	if (status === 403) return "quota";
	if (status === 401) return "auth";
	// 402 і 404 — саме про цю модель, а не про наш запит. Тому НЕ "request":
	// інакше платна модель у списку зупиняла б ланцюжок, і сусідній безкоштовний
	// провайдер, який відповів би за секунду, навіть не пробувався (так сталося з
	// SambaNova gpt-oss-120b, що на безкоштовному плані віддає 402).
	if (status === 402 || status === 404) return "unavailable";
	if (status === 400 || status === 422) return "request";
	if (status >= 500) return "transient";
	return "unknown";
}

/**
 * `Retry-After` шанується, коли провайдер його дав: чекати рівно стільки,
 * скільки просять, точніше за наш дефолт у 30 хвилин. Абсурдні значення
 * обрізаємо — інакше один недоречний заголовок вигасив би модель на добу.
 */
export function cooldownMsFor(kind: FailureKind, retryAfterSeconds?: number | null): number {
	const base = COOLDOWN_MS[kind];
	if (kind !== "quota" && kind !== "transient") return base;
	if (retryAfterSeconds == null || !Number.isFinite(retryAfterSeconds)) return base;
	const fromHeader = Math.max(0, retryAfterSeconds) * 1000;
	if (fromHeader === 0) return base;
	return Math.min(fromHeader, 2 * 60 * 60 * 1000);
}

/** Парсер `Retry-After`: або секунди, або HTTP-дата. */
export function parseRetryAfter(header: string | null, now: number): number | null {
	if (!header) return null;
	const asNumber = Number(header.trim());
	if (Number.isFinite(asNumber)) return Math.max(0, asNumber);
	const asDate = Date.parse(header);
	if (Number.isNaN(asDate)) return null;
	return Math.max(0, Math.round((asDate - now) / 1000));
}

/** Чи варто після такої помилки йти до наступного провайдера. */
export function shouldTryNextProvider(kind: FailureKind): boolean {
	return kind !== "request";
}

/** Чи варто повторити ту саму модель (один раз, з паузою). */
export function isRetryableOnSameProvider(kind: FailureKind): boolean {
	return kind === "transient";
}

export type CooldownMap = Record<string, number>;

/** Прибирає прострочені записи, щоб мапа не росла безкінечно. */
export function pruneCooldowns(cooldowns: CooldownMap, now: number): CooldownMap {
	const next: CooldownMap = {};
	for (const [id, until] of Object.entries(cooldowns)) {
		if (until > now) next[id] = until;
	}
	return next;
}

export function isCooling(cooldowns: CooldownMap, id: string, now: number): boolean {
	const until = cooldowns[id];
	return typeof until === "number" && until > now;
}

export interface ChainOptions {
	now: number;
	/** Ручний вибір користувача. Стає головою ланцюжка, але не скасовує fallback. */
	pinnedId?: string | null;
	cooldowns?: CooldownMap;
	/** Чи є ключ для цього провайдера (у Worker — чи заданий секрет). */
	hasKey: (entry: AiProviderEntry) => boolean;
}

/**
 * Порядок спроб: pin → доступні за score → остиглі як остання надія.
 *
 * Остиглих не викидаємо, а зсуваємо в хвіст — за зразком ADSS, який після
 * повного проходу очищає бани й пробує знову. Порожній ланцюжок означав би
 * «AI не працює зовсім», хоча ліміт міг скинутися хвилину тому.
 */
export function buildChain(
	providers: readonly AiProviderEntry[],
	options: ChainOptions
): AiProviderEntry[] {
	const { now, pinnedId, hasKey } = options;
	const cooldowns = options.cooldowns ?? {};

	const withKey = providers.filter((p) => hasKey(p));
	const byScore = [...withKey].sort((a, b) => b.score - a.score);

	const pinned = pinnedId ? byScore.find((p) => p.id === pinnedId) : undefined;
	const rest = pinned ? byScore.filter((p) => p.id !== pinned.id) : byScore;

	const ready = rest.filter((p) => !isCooling(cooldowns, p.id, now));
	const cooling = rest.filter((p) => isCooling(cooldowns, p.id, now));

	return pinned ? [pinned, ...ready, ...cooling] : [...ready, ...cooling];
}

/** Стан однієї моделі для popover ручного вибору. */
export type ProviderStatus = "ready" | "cooling" | "no-key";

export function providerStatus(
	entry: AiProviderEntry,
	options: { now: number; cooldowns?: CooldownMap; keyed?: readonly string[] }
): ProviderStatus {
	const { now, keyed } = options;
	if (keyed && !keyed.includes(entry.id)) return "no-key";
	return isCooling(options.cooldowns ?? {}, entry.id, now) ? "cooling" : "ready";
}
