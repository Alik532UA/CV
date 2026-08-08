import { test, expect } from '@playwright/test';

test.describe('Core Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/CV/');
	});

	test('has correct title', async ({ page }) => {
		await expect(page).toHaveTitle(/Alik Zapolnov/);
	});

	test('language switching works', async ({ page }) => {
		// Default should be English or based on browser/storage, checking for EN default
		// Adjust this if logic depends on locale

		const langSwitcher = page.getByTestId('lang-select');
		await expect(langSwitcher).toBeVisible();

		// The switcher is a single trigger + searchable panel (scales past a
		// handful of languages), so each option needs the panel open first.
		//
		// Клікаємо лише коли панель закрита, і чекаємо саме на неї: сліпий клік
		// іноді ловив уже відкриту панель і закривав її назад, від чого тест
		// падав через раз.
		const openLangPanel = async () => {
			const trigger = langSwitcher.getByRole('button').first();
			await expect(async () => {
				if ((await trigger.getAttribute('aria-expanded')) !== 'true') await trigger.click();
				await expect(langSwitcher.getByRole('menu')).toBeVisible({ timeout: 1000 });
			}).toPass({ timeout: 15000 });
		};

		// Switch to Ukrainian
		await openLangPanel();
		await page.getByTestId('lang-uk-btn').click();
		await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
		await expect(page).toHaveURL(/\/CV\/uk\//);

		// Verify some UK text if possible, e.g., Hero greeting
		// await expect(page.locator('h1')).toHaveText(/Привіт/);

		// Switch to Spanish
		await openLangPanel();
		await page.getByTestId('lang-es-btn').click();
		await expect(page.locator('html')).toHaveAttribute('lang', 'es');
		await expect(page).toHaveURL(/\/CV\/es\//);

		// The search box filters the list down to a single match
		await openLangPanel();
		await langSwitcher.getByPlaceholder('Search language...').fill('English');
		const results = langSwitcher.getByRole('menuitemradio');
		await expect(results).toHaveCount(1);
		await results.first().click();
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
		// Англійська — типова мова, тому живе на голому шляху без сегмента.
		// Хеш лишається від якоря секції, тому кінець шляху може бути і `#about`.
		await expect(page).toHaveURL(/\/CV\/([?#]|$)/);
	});

	test('theme toggling works', async ({ page }) => {
		const themeSwitcher = page.getByTestId('theme-toggle-toolbar');
		await expect(themeSwitcher).toBeVisible();

		// Початкову тему не фіксуємо: без збереженого вибору вона йде від
		// prefers-color-scheme, а Playwright за замовчуванням світлий. Перевіряємо
		// перехід, а не стартовий стан.
		const html = page.locator('html');

		// Click light mode
		await page.getByTestId('theme-light-btn').click();
		await expect(html).toHaveAttribute('data-theme', 'light');
		await expect(page).toHaveURL(/theme=light/);

		// Click dark mode
		await page.getByTestId('theme-dark-btn').click();
		await expect(html).toHaveAttribute('data-theme', 'dark');
		await expect(page).toHaveURL(/theme=dark/);
	});

    test('mobile navigation and background switcher', async ({ page }) => {
        // Set viewport to mobile
        await page.setViewportSize({ width: 375, height: 667 });
        
        // Check background switcher visibility on mobile
        const mobileSwitcher = page.getByTestId('bg-toggle-mobile-toolbar');
        await expect(mobileSwitcher).toBeVisible();
    });
});
