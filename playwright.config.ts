import { defineConfig, devices } from '@playwright/test';

/**
 * Окремий порт саме для тестів, і свій у кожному проєкті.
 *
 * Було `5173` плюс `reuseExistingServer: !process.env.CI`. 5173 — типовий порт
 * Vite, тобто той самий в усіх сімох проєктах. Якщо на ньому вже висить
 * dev-сервер ІНШОГО проєкту, Playwright спокійно бере його й перевіряє чужий
 * застосунок: тест зелений, перевірено не те (AI-AGENT-PITFALLS-v8 § 1).
 * Це не гіпотеза — саме так інваріант унікальності `data-testid` тут одного
 * разу «пройшов», дивлячись на сусідній сайт.
 *
 * 5299, а не 5273: на 5273 сидить `Slovko`, тобто «свій порт у кожному проєкті»
 * виконувалося лише наполовину. Обидва конфіги мають `--strictPort` і
 * `reuseExistingServer: false`, тож зіткнення давало голосне падіння, а не тихо
 * перевірений чужий сайт — але саме цього правило й мало уникати. Число
 * узгоджене з `cv-dev` (5199) у `.claude/launch.json` кореневої теки.
 */
const TEST_PORT = 5299;

export default defineConfig({
	testDir: './tests',
	timeout: 30 * 1000,
	expect: {
		timeout: 5000
	},
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		actionTimeout: 0,
		baseURL: `http://localhost:${TEST_PORT}`,
		trace: 'on-first-retry',
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] },
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] },
		},
	],
	webServer: {
		// `--strictPort`: зайнятий порт мусить УПАСТИ, а не тихо з'їхати на
		// наступний — інакше `port` нижче вказував би на чужий сервер.
		command: `npm run dev -- --port ${TEST_PORT} --strictPort`,
		port: TEST_PORT,
		reuseExistingServer: false,
		env: {
			// Адреса-заглушка AI-проксі: усі запити на неї перехоплює page.route у
			// tests/ai-matcher.spec.ts, тому нічого справді слухати цей порт не має.
			// Без цієї змінної модалка одразу каже «проксі не налаштований» і тест
			// не має що перевіряти.
			PUBLIC_AI_PROXY_URL: 'http://127.0.0.1:8788'
		}
	},
});
