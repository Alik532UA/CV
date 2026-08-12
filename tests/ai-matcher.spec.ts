import { test, expect, type Page, type Route } from '@playwright/test';

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
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({
					ok: true,
					modelId: options.modelId ?? 'groq-gpt-oss-120b',
					model: options.model ?? 'openai/gpt-oss-120b',
					provider: options.provider ?? 'Groq',
					isFirstAnalysis: isFirst,
					result: isFirst ? (options.result ?? MATCH_RESULT) : null,
					rawText: options.rawText ?? JSON.stringify(options.result ?? MATCH_RESULT),
					reply: isFirst ? undefined : 'Готовий обговорити деталі.',
					cooldowns: options.cooldowns ?? {}
				})
			});
		}
	);

	return stub;
}

async function openMatcher(page: Page) {
	await page.goto('/CV/');
	await page.getByTestId('ai-matcher-open-btn').click();
	await expect(page.getByTestId('ai-job-input-textarea')).toBeVisible();
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
		await expect(page.getByTestId('ai-model-gemini-36-flash-status')).toContainText('ліміт');
		await expect(page.getByTestId('ai-model-groq-gpt-oss-120b-status')).toContainText('відповіла');
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
		await page.reload();
		await page.getByTestId('ai-matcher-open-btn').click();
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

	test('помилка проксі показується користувачеві, а не тихо ковтається', async ({ page }) => {
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
						error: 'Усі моделі в ланцюжку недоступні.',
						code: 'all-providers-failed'
					})
				});
			}
		);

		await openMatcher(page);
		await analyze(page);

		await expect(page.getByText('Усі моделі в ланцюжку недоступні.')).toBeVisible();
	});
});
