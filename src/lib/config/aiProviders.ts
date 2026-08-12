/**
 * Єдиний реєстр AI-моделей: і ланцюжок fallback, і список для ручного вибору
 * в UI беруться звідси.
 *
 * До цього файлу ланцюжок існував двома незалежними літералами — у мертвому
 * `+server.ts` і в клієнтському контролері — з різними системними промптами.
 * Будь-яка правка в одному місці розходилася з іншим і ніхто цього не бачив,
 * бо на статичному хостингу працювала тільки клієнтська копія.
 *
 * Файл свідомо чистий: жодних `$lib`, `$app` чи інших SvelteKit-імпортів. Його
 * імпортує і браузер, і Cloudflare Worker (`worker/index.ts`), а воркер про
 * SvelteKit не знає нічого.
 */

/** Формат протоколу. Двох досить: Gemini native + усе OpenAI-сумісне. */
export type AiWire = "gemini" | "openai";

export interface AiProviderEntry {
	/**
	 * Стабільний kebab-case ідентифікатор. Використовується у `data-testid`,
	 * ключах cooldown-мапи і в localStorage — тому без точок і двокрапок, які
	 * зламали б конвенцію testid (див. src/testid-conventions.test.ts).
	 */
	id: string;
	/** Назва провайдера для UI. */
	provider: string;
	/** Назва моделі в API провайдера. */
	model: string;
	wire: AiWire;
	/** Ім'я секрету у Worker. Ключів у бандлі сайту не буває — тільки назви. */
	keyName: "GEMINI_API_KEY" | "GROQ_API_KEY" | "SAMBANOVA_API_KEY";
	/**
	 * Для `openai` — повний URL chat/completions.
	 * Для `gemini` — базовий шлях до моделей, до якого дописується `{model}:generateContent`.
	 */
	baseUrl: string;
	/**
	 * Вище значення — раніше в ланцюжку. Числа взяті з реальних замірів ADSS
	 * (швидкість × якість), звідти ж і склад провайдерів.
	 */
	score: number;
}

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";
const GROQ_CHAT = "https://api.groq.com/openai/v1/chat/completions";
const SAMBANOVA_CHAT = "https://api.sambanova.ai/v1/chat/completions";

/**
 * Порядок у масиві не має значення — ланцюжок будується сортуванням за `score`
 * (`buildChain` у src/lib/services/aiChain.ts). Тут групуємо за провайдером,
 * щоб було видно, який ключ що обслуговує.
 */
export const AI_PROVIDERS: readonly AiProviderEntry[] = [
	{
		id: "gemini-36-flash",
		provider: "Gemini",
		model: "gemini-3.6-flash",
		wire: "gemini",
		keyName: "GEMINI_API_KEY",
		baseUrl: GEMINI_BASE,
		score: 90
	},
	{
		id: "gemini-35-flash",
		provider: "Gemini",
		model: "gemini-3.5-flash",
		wire: "gemini",
		keyName: "GEMINI_API_KEY",
		baseUrl: GEMINI_BASE,
		score: 78
	},
	{
		id: "gemini-31-flash-lite",
		provider: "Gemini",
		model: "gemini-3.1-flash-lite",
		wire: "gemini",
		keyName: "GEMINI_API_KEY",
		baseUrl: GEMINI_BASE,
		score: 62
	},
	{
		id: "groq-gpt-oss-120b",
		provider: "Groq",
		model: "openai/gpt-oss-120b",
		wire: "openai",
		keyName: "GROQ_API_KEY",
		baseUrl: GROQ_CHAT,
		score: 82
	},
	{
		id: "groq-llama-33-70b",
		provider: "Groq",
		model: "llama-3.3-70b-versatile",
		wire: "openai",
		keyName: "GROQ_API_KEY",
		baseUrl: GROQ_CHAT,
		score: 74
	},
	{
		id: "samba-gpt-oss-120b",
		provider: "SambaNova",
		model: "gpt-oss-120b",
		wire: "openai",
		keyName: "SAMBANOVA_API_KEY",
		baseUrl: SAMBANOVA_CHAT,
		score: 85
	},
	{
		id: "samba-gemma-4-31b",
		provider: "SambaNova",
		model: "gemma-4-31B-it",
		wire: "openai",
		keyName: "SAMBANOVA_API_KEY",
		baseUrl: SAMBANOVA_CHAT,
		score: 80
	}
];

export function findProvider(id: string | null | undefined): AiProviderEntry | undefined {
	if (!id) return undefined;
	return AI_PROVIDERS.find((p) => p.id === id);
}

/** Підпис для бейджа: саме модель, бо саме її питають «а на чому це працює». */
export function providerLabel(entry: AiProviderEntry): string {
	return entry.model;
}
