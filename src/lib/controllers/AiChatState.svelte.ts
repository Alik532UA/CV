import { env } from "$env/dynamic/public";
import { AI_PROVIDERS, findProvider, type AiProviderEntry } from "$lib/config/aiProviders";
import { pruneCooldowns, type CooldownMap } from "$lib/services/aiChain";
import { logService } from "$lib/services/logService.svelte";
import { storage } from "$lib/services/storage";
import { language, t } from "$lib/controllers/I18nState.svelte";

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

/** Відповідь проксі (`worker/index.ts`). */
interface ProxyResponse {
	ok?: boolean;
	modelId?: string;
	model?: string;
	provider?: string;
	isFirstAnalysis?: boolean;
	result?: Partial<MatchResult> | null;
	rawText?: string;
	reply?: string;
	error?: string;
	code?: string;
	/** id → скільки мілісекунд моделі ще «остигати». */
	cooldowns?: Record<string, number>;
	keyed?: string[];
}

const PINNED_KEY = "ai-pinned-model";

/** Голова ланцюжка за замовчуванням — те, що проксі спробує першим. */
const CHAIN_HEAD: AiProviderEntry = [...AI_PROVIDERS].sort((a, b) => b.score - a.score)[0];

function proxyUrl(): string {
	return (env.PUBLIC_AI_PROXY_URL ?? "").replace(/\/+$/, "");
}

/**
 * Стан AI Job Matcher.
 *
 * Ключів тут немає і не буде: усі запити йдуть у Cloudflare Worker
 * (`worker/index.ts`), який тримає ключі провайдерів у себе. Раніше цей файл
 * містив другу копію ланцюжка моделей і викликав Gemini напряму з браузера
 * публічним ключем — саме тому ліміти й вичерпувалися.
 */
class AiChatState {
	isOpen = $state(false);
	isLoading = $state(false);
	error = $state<string | null>(null);
	matchResult = $state<MatchResult | null>(null);
	/** Відповідь, з якої не вийшло дістати JSON. Показуємо як є — без вигаданих цифр. */
	rawAnalysis = $state<string | null>(null);
	history = $state<ChatMessage[]>([]);
	initialInput = $state<string>("");

	/** Модель, яка НАСПРАВДІ відповіла останньою. Саме її показує бейдж. */
	activeModelId = $state<string | null>(null);
	/** Ручний вибір: стає головою ланцюжка, але не вимикає fallback. */
	pinnedId = $state<string | null>(null);
	/** id → абсолютний час, до якого модель у проксі вважається вичерпаною. */
	cooldowns = $state<CooldownMap>({});
	/** Моделі, для яких на проксі є ключ. `null` — ще не питали. */
	keyedIds = $state<string[] | null>(null);

	hasAnalysis = $derived(Boolean(this.matchResult || this.rawAnalysis));

	/** Що показує бейдж: підтверджена модель → закріплена → голова ланцюжка. */
	activeEntry = $derived(
		findProvider(this.activeModelId) ?? findProvider(this.pinnedId) ?? CHAIN_HEAD
	);

	/** true — модель уже відповідала; false — це лише те, що спробуємо першим. */
	isModelConfirmed = $derived(Boolean(this.activeModelId));

	isConfigured = $derived(proxyUrl().length > 0);

	constructor() {
		this.pinnedId = storage.get(PINNED_KEY);
	}

	open() {
		this.isOpen = true;
		logService.info("ui", "AI Matcher modal opened");
		void this.refreshHealth();
	}

	close() {
		this.isOpen = false;
		logService.info("ui", "AI Matcher modal closed");
	}

	reset() {
		this.isLoading = false;
		this.error = null;
		this.matchResult = null;
		this.rawAnalysis = null;
		this.history = [];
		this.initialInput = "";
		logService.info("ui", "AI Matcher state reset");
	}

	/** Закріпити модель. Не «замість ланцюжка», а «спочатку ця». */
	setPinned(id: string | null) {
		const entry = findProvider(id);
		if (id && !entry) return;

		this.pinnedId = id;
		if (id) {
			storage.set(PINNED_KEY, id);
			logService.info("ui", `AI model pinned manually: ${entry?.model}`);
		} else {
			storage.remove(PINNED_KEY);
			logService.info("ui", "AI model pin cleared — chain order restored");
		}
	}

	/** Питає проксі, для яких моделей є ключі та які зараз остигають. */
	async refreshHealth() {
		if (!this.isConfigured || this.keyedIds !== null) return;

		try {
			const res = await fetch(`${proxyUrl()}/health`);
			if (!res.ok) return;
			const data = (await res.json()) as ProxyResponse;
			if (Array.isArray(data.keyed)) this.keyedIds = data.keyed;
			this.applyCooldowns(data.cooldowns);
		} catch {
			// Health — довідкова інформація. Її відсутність не має ламати чат:
			// popover просто не позначить моделі без ключа.
		}
	}

	async analyzeJob(input: string) {
		if (!input.trim() || this.isLoading) return;

		this.initialInput = input.trim();
		this.error = null;
		this.isLoading = true;

		try {
			logService.info("ui", "Analyzing job description via AI proxy...");
			const data = await this.post({ input: this.initialInput });

			const result = this.normalizeResult(data.result);
			const rawText = data.rawText?.trim() ?? "";

			if (result) {
				this.matchResult = result;
				this.rawAnalysis = null;
			} else if (rawText) {
				// Модель не віддала JSON, але щось сказала. Раніше на цьому місці
				// підставлялося `matchPercentage: 85` з вигаданими сильними
				// сторонами — HR бачив дані, яких ніхто не рахував. Тепер — сирий
				// текст із позначкою (AI-PROVIDERS-v8 § 7.2).
				this.matchResult = null;
				this.rawAnalysis = rawText;
				logService.warn("ui", "AI answer was not valid JSON — showing raw text");
			} else {
				// «Успіх, у якому нічого не сказано» (§ 6.1.1). HTTP 200, ланцюжок
				// відпрацював, тіло порожнє. Доти сюди підставлявся текст-заглушка,
				// тобто збій показувався як результат. Це помилка, і виглядати вона
				// має як помилка.
				this.matchResult = null;
				this.rawAnalysis = null;
				this.error = t.ai.emptyAnswer;
				logService.error("ui", `AI returned an empty answer (model: ${data.model ?? "?"})`);
				return;
			}

			this.history = [
				{ role: "user", content: this.initialInput },
				{ role: "model", content: rawText }
			];

			logService.info(
				"ui",
				`Job analyzed by ${data.model ?? "?"}. Match: ${this.matchResult?.matchPercentage ?? "n/a"}%`
			);
		} catch (err) {
			this.error = (err as Error).message || "An unexpected error occurred.";
			logService.error("ui", `Job analysis error: ${this.error}`);
		} finally {
			this.isLoading = false;
		}
	}

	async sendMessage(text: string) {
		if (!text.trim() || this.isLoading) return;

		const userMsg = text.trim();
		const context = this.history;
		this.history = [...this.history, { role: "user", content: userMsg }];
		this.error = null;
		this.isLoading = true;

		try {
			logService.info("ui", "Sending follow-up message to AI proxy...");
			const data = await this.post({ input: userMsg, history: context });
			const modelReply = (data.reply || data.rawText || "").trim();

			if (!modelReply) {
				// Те саме, що й у analyzeJob: порожня відповідь — це збій, а не
				// репліка. Тут раніше вставлялося «Дякую за запитання!» — ввічлива
				// фраза від імені моделі, якої модель не казала, і після якої HR
				// чекав відповіді по суті.
				this.error = t.ai.emptyAnswer;
				logService.error("ui", `AI returned an empty reply (model: ${data.model ?? "?"})`);
				return;
			}

			this.history = [...this.history, { role: "model", content: modelReply }];
			logService.info("ui", `Received reply from ${data.model ?? "?"}`);
		} catch (err) {
			this.error = (err as Error).message || "An error occurred while sending message.";
			logService.error("ui", `Send message error: ${this.error}`);
		} finally {
			this.isLoading = false;
		}
	}

	private async post(payload: { input: string; history?: ChatMessage[] }): Promise<ProxyResponse> {
		if (!this.isConfigured) {
			throw new Error(
				"AI-проксі не налаштований: вкажіть PUBLIC_AI_PROXY_URL (див. worker/README.md)."
			);
		}

		let res: Response;
		try {
			res = await fetch(proxyUrl(), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...payload,
					model: this.pinnedId ?? undefined,
					// Мова інтерфейсу — єдиний сигнал про те, якою мовою читає
					// відвідувач. Проксі зводить тег до назви мови й підставляє її в
					// системний промпт; доти промпт беззастережно вимагав української,
					// і англомовний рекрутер отримував український аналіз власної
					// англійської вакансії.
					language: language.current
				})
			});
		} catch (err) {
			throw new Error(`Не вдалося звернутися до AI-проксі: ${(err as Error).message}`);
		}

		const rawBody = await res.text();
		let data: ProxyResponse;
		try {
			data = JSON.parse(rawBody) as ProxyResponse;
		} catch {
			throw new Error(`Проксі повернув не JSON (${res.status}): ${rawBody.slice(0, 150)}`);
		}

		this.applyCooldowns(data.cooldowns);

		if (!res.ok || data.ok === false) {
			throw new Error(data.error || `Помилка проксі (${res.status})`);
		}

		if (data.modelId) this.activeModelId = data.modelId;
		return data;
	}

	/** Проксі надсилає залишок у мс — переводимо в абсолютний час клієнта. */
	private applyCooldowns(remaining: Record<string, number> | undefined) {
		if (!remaining) return;
		const now = Date.now();
		const next: CooldownMap = {};
		for (const [id, ms] of Object.entries(remaining)) {
			if (Number.isFinite(ms) && ms > 0) next[id] = now + ms;
		}
		this.cooldowns = pruneCooldowns(next, now);
	}

	/** Довіряємо лише повному об'єкту: половина полів = зламана картка результату. */
	private normalizeResult(raw: Partial<MatchResult> | null | undefined): MatchResult | null {
		if (!raw || typeof raw.matchPercentage !== "number" || typeof raw.summary !== "string") {
			return null;
		}

		return {
			matchPercentage: Math.max(0, Math.min(100, Math.round(raw.matchPercentage))),
			keyStrengths: Array.isArray(raw.keyStrengths) ? raw.keyStrengths.filter(Boolean) : [],
			potentialGaps: Array.isArray(raw.potentialGaps) ? raw.potentialGaps.filter(Boolean) : [],
			summary: raw.summary,
			recommendedResponse: typeof raw.recommendedResponse === "string" ? raw.recommendedResponse : ""
		};
	}
}

export const aiChat = new AiChatState();
