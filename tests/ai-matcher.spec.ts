import { test, expect, type Page, type Route } from '@playwright/test';
import { en } from '../src/lib/i18n/locales/en';

/**
 * Тексти інтерфейсу беруться зі словника, а не з літералів у тесті.
 *
 * Три перевірки нижче були написані з українськими рядками («ліміт»,
 * «відповіла»), а голий шлях `/CV/` за рішенням проєкту англійський — тож вони
 * падали на `Received string: "limit ~15 min"`. Це саме той випадок, від якого
 * застерігає CODE-QUALITY-v8 § 5.7: локаль браузера в Playwright — `en-US`, і
 * тест, написаний у своїй мові, перевіряє не те, що бачить відвідувач.
 *
 * Словник замість літерала знімає питання цілком: перевірка лишається чинною і
 * після зміни формулювання, і при зміні типової мови.
 */
const t = en.ai;

/** Стабільна частина рядка з підстановкою: "limit ~{minutes} min" → "limit ~". */
const upTo = (template: string) => template.split('{')[0].trim();

/**
 * AI-проксі тут завжди підроблений: справжній витрачав би квоту Gemini на кожен
 * прогін і падав би разом з нею. Перевіряємо те, що ламалося раніше:
 *
 *  1. бейдж показує модель, яка НАСПРАВДІ відповіла (був літерал
 *     `gemini-3.6-flash`, тому після fallback він брехав);
 *  2. ручний вибір моделі доїжджає до проксі полем `model`;
 *  3. відповідь без JSON більше не перетворюється на вигадані 85%.
 */

const PROXY_HOST = '127.0.0.1:8788';

const MATCH_RESULT = {
	matchPercentage: 91,
	keyStrengths: ['5+ років QA', 'AI-інтеграції'],
	potentialGaps: ['Уточнити CI/CD'],
	summary: 'Дуже добра відповідність.',
	recommendedResponse: 'Дякую за вакансію!'
};

interface ProxyStub {
	/** Тіла POST-запитів у порядку надходження — для перевірки поля `model`. */
	requests: Array<{ input?: string; model?: string; history?: unknown[] }>;
}

/**
 * Перехоплює і `/health`, і сам POST. Матчер за хостом, а не за рядком URL:
 * контролер звертається до кореня («http://127.0.0.1:8788» без шляху), і
 * glob-патерн з таким URL поводиться неочевидно.
 */
async function stubProxy(
	page: Page,
	options: {
		modelId?: string;
		model?: string;
		provider?: string;
		result?: unknown;
		rawText?: string;
		cooldowns?: Record<string, number>;
		keyed?: string[];
	} = {}
): Promise<ProxyStub> {
	const stub: ProxyStub = { requests: [] };

	const keyed = options.keyed ?? [
		'gemini-36-flash',
		'gemini-35-flash',
		'gemini-31-flash-lite',
		'groq-gpt-oss-120b',
		'groq-llama-33-70b',
		'cloudflare-gpt-oss-120b'
	];

	await page.route(
		(url) => url.host === PROXY_HOST,
		async (route: Route) => {
			const request = route.request();

			if (new URL(request.url()).pathname === '/health') {
				await route.fulfill({
					status: 200,
					contentType: 'application/json',
					body: JSON.stringify({ ok: true, keyed, cooldowns: options.cooldowns ?? {} })
				});
				return;
			}

			stub.requests.push(request.postDataJSON());

			const isFirst = stub.requests.length === 1;
			// `options.result ?? MATCH_RESULT` тут стояло — і воно скасовувало сенс
			// виклику `stubProxy(page, { result: null })`: `null ?? X` дає X, тож
			// «модель не віддала JSON» перетворювалося на звичайну вдалу відповідь.
			// Тест «відповідь без JSON показується як текст» шукав панель сирого
			// тексту й не знаходив її, бо на екрані був score. Розрізняємо
			// «не передали» і «передали null» явно.
			const result = 'result' in options ? options.result : MATCH_RESULT;
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					ok: true,
					modelId: options.modelId ?? 'groq-gpt-oss-120b',
					model: options.model ?? 'openai/gpt-oss-120b',
					provider: options.provider ?? 'Groq',
					isFirstAnalysis: isFirst,
					result: isFirst ? result : null,
					rawText: options.rawText ?? JSON.stringify(result),
					reply: isFirst ? undefined : 'Готовий обговорити деталі.',
					cooldowns: options.cooldowns ?? {}
				})
			});
		}
	);

	return stub;
}

/**
 * Клік по кнопці, яка щось відкриває, робиться з перевіркою стану, а не всліпу
 * (CODE-QUALITY-v8 § 5.3).
 *
 * Тут стояв голий `click()` одразу після `goto()`, і чотири тести з цього файлу
 * падали постійно: `ai-job-input-textarea` не з'являвся за 5 с. Причина не в
 * модалці — вона працює. Причина в тому, що `onclick={() => aiChat.open()}` до
 * гідрації ще не навішаний: клік по кнопці, яку намалював prerender, не робить
 * нічого й нічого про це не каже.
 *
 * Симптом при цьому вказує не туди: у виводі падає очікування текстової області,
 * тому шукати починають у модалці. Саме так у tests/invariants.spec.ts опинився
 * коментар «клік проходить, а панель до екрана не доїжджає, причина не з'ясована».
 *
 * `toPass` повторює пару «клік + очікування», доки застосунок не оживе. Той
 * самий патерн уже стоїть у tests/toast.spec.ts (`copyEmail`) — з тієї ж
 * причини, лише знайденої раніше.
 */
async function openMatcher(page: Page) {
	await page.goto('/CV/');
	const textarea = page.getByTestId('ai-job-input-textarea');
	await expect(async () => {
		await page.getByTestId('ai-matcher-open-btn').click();
		await expect(textarea).toBeVisible({ timeout: 1000 });
	}).toPass({ timeout: 15000 });
}

async function analyze(page: Page) {
	await page.getByTestId('ai-job-input-textarea').fill('Шукаємо Automation QA Engineer');
	await page.getByTestId('ai-analyze-btn').click();
}

test.describe('AI Job Matcher', () => {
	test('бейдж показує модель, яка справді відповіла', async ({ page }) => {
		await stubProxy(page, {
			modelId: 'groq-gpt-oss-120b',
			model: 'openai/gpt-oss-120b',
			provider: 'Groq',
			cooldowns: { 'gemini-36-flash': 900_000 }
		});
		await openMatcher(page);

		const badge = page.getByTestId('ai-model-badge-btn');
		// До першої відповіді — голова ланцюжка: те, що буде спробовано першим.
		await expect(badge).toContainText('gemini-3.6-flash');

		await analyze(page);

		await expect(page.getByTestId('ai-match-score-value')).toContainText('91%');
		// Головне: fallback відбувся, і бейдж це показує.
		await expect(badge).toContainText('openai/gpt-oss-120b');

		// Модель, що впала через ліміт, позначена в списку як «остигає».
		await badge.click();
		await expect(page.getByTestId('ai-model-gemini-36-flash-status')).toContainText(
			upTo(t.statusCooldown)
		);
		await expect(page.getByTestId('ai-model-groq-gpt-oss-120b-status')).toContainText(
			t.statusAnswered
		);
	});

	test('ручний вибір моделі доїжджає до проксі й не скасовує fallback', async ({ page }) => {
		const stub = await stubProxy(page);
		await openMatcher(page);

		await page.getByTestId('ai-model-badge-btn').click();
		await page.getByTestId('ai-model-gemini-35-flash-btn').click();
		await expect(page.getByTestId('ai-model-menu')).toBeHidden();

		await analyze(page);
		await expect(page.getByTestId('ai-match-score-value')).toBeVisible();

		expect(stub.requests[0].model).toBe('gemini-35-flash');
		// Проксі відповів іншою моделлю (fallback) — і бейдж показує саме її, а не
		// закріплену: закріплення це «спробуй спочатку», а не «тільки її».
		await expect(page.getByTestId('ai-model-badge-btn')).toContainText('openai/gpt-oss-120b');

		// Вибір переживає перезавантаження — він у localStorage.
		// Після reload діє те саме правило, що й у openMatcher: до гідрації клік
		// по кнопці нічого не робить і нічого про це не каже.
		await page.reload();
		const textarea = page.getByTestId('ai-job-input-textarea');
		await expect(async () => {
			await page.getByTestId('ai-matcher-open-btn').click();
			await expect(textarea).toBeVisible({ timeout: 1000 });
		}).toPass({ timeout: 15000 });
		await page.getByTestId('ai-model-badge-btn').click();
		await expect(page.getByTestId('ai-model-gemini-35-flash-btn')).toHaveAttribute(
			'aria-checked',
			'true'
		);
	});

	test('відповідь без JSON показується як текст, а не вигаданими відсотками', async ({ page }) => {
		await stubProxy(page, {
			result: null,
			rawText: 'Не можу оцінити цю вакансію — надто мало деталей.'
		});
		await openMatcher(page);
		await analyze(page);

		const raw = page.getByTestId('ai-raw-analysis-panel');
		await expect(raw).toContainText('надто мало деталей');
		await expect(page.getByTestId('ai-match-score-value')).toHaveCount(0);
	});

	/**
	 * Збій показується — і саме тим реченням, яке відвідувач уміє прочитати.
	 *
	 * Доти тут очікувався рядок З ВОРКЕРА, показаний як є, — тобто тест
	 * закріплював дефект: сайт віддає 42 мови, а повідомлення про збій
	 * приїжджало українською в усіх сорока двох. Тепер проксі віддає код, а речення
	 * обирає сайт — тож перевіряється ОБИДВІ половини: що збій видно, і
	 * що технічний рядок воркера на екран не потрапляє.
	 *
	 * Голий шлях `/CV/` англійський, тож рядок береться зі словника `en`,
	 * як і в решті файлу.
	 */
	test('збій показується мовою сайту, а не рядком проксі', async ({ page }) => {
		const proxyDetail = 'groq/llama-3.3-70b: 502 upstream exploded';

		await page.route(
			(url) => url.host === PROXY_HOST,
			async (route) => {
				if (new URL(route.request().url()).pathname === '/health') {
					await route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: JSON.stringify({ ok: true, keyed: [], cooldowns: {} })
					});
					return;
				}
				await route.fulfill({
					status: 502,
					contentType: 'application/json',
					body: JSON.stringify({
						ok: false,
						error: proxyDetail,
						code: 'all-providers-failed'
					})
				});
			}
		);

		await openMatcher(page);
		await analyze(page);

		await expect(page.getByText(t.errorUnavailable)).toBeVisible();
		await expect(
			page.getByText(proxyDetail),
			'технічний рядок належить журналу, а не вікну відвідувача'
		).toHaveCount(0);
	});

	/**
	 * Хвилинна й денна межі — різні речення, бо це різні дії: зачекати
	 * чи повернутися завтра. За самим `code: "rate-limited"` між ними не вибрати,
	 * тому воркер надсилає ще й `scope`.
	 */
	test('хвилинна межа й денна читаються по-різному', async ({ page }) => {
		await page.route(
			(url) => url.host === PROXY_HOST,
			async (route) => {
				if (new URL(route.request().url()).pathname === '/health') {
					await route.fulfill({
						status: 200,
						contentType: 'application/json',
						body: JSON.stringify({ ok: true, keyed: [], cooldowns: {} })
					});
					return;
				}
				await route.fulfill({
					status: 429,
					contentType: 'application/json',
					body: JSON.stringify({
						ok: false,
						error: 'per-minute quota spent',
						code: 'rate-limited',
						scope: 'minute'
					})
				});
			}
		);

		await openMatcher(page);
		await analyze(page);

		await expect(page.getByText(t.errorRateLimitMinute)).toBeVisible();
		await expect(page.getByText(t.errorRateLimitDay)).toHaveCount(0);
	});
});
