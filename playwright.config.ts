import { defineConfig, devices } from '@playwright/test';

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
		baseURL: 'http://localhost:5173',
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
		command: 'npm run dev',
		port: 5173,
		reuseExistingServer: !process.env.CI,
		env: {
			// Адреса-заглушка AI-проксі: усі запити на неї перехоплює page.route у
			// tests/ai-matcher.spec.ts, тому нічого справді слухати цей порт не має.
			// Без цієї змінної модалка одразу каже «проксі не налаштований» і тест
			// не має що перевіряти.
			PUBLIC_AI_PROXY_URL: 'http://127.0.0.1:8788'
		}
	},
});
