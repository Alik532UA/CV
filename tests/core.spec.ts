// @ts-nocheck
import { test, expect } from '@playwright/test';

test.describe('Core Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('has correct title', async ({ page }) => {
		await expect(page).toHaveTitle(/Alik Zapolnov/);
	});

	test('language switching works', async ({ page }) => {
		// Default should be English or based on browser/storage, checking for EN default
		// Adjust this if logic depends on locale
		
		const langSwitcher = page.getByTestId('lang-switcher');
		await expect(langSwitcher).toBeVisible();

		// Switch to Ukrainian
		await page.getByTestId('lang-uk').click();
		await expect(page.locator('html')).toHaveAttribute('lang', 'uk');
		await expect(page).toHaveURL(/lang=uk/);
		
		// Verify some UK text if possible, e.g., Hero greeting
		// await expect(page.locator('h1')).toHaveText(/Привіт/); 

		// Switch back to English
		await page.getByTestId('lang-en').click();
		await expect(page.locator('html')).toHaveAttribute('lang', 'en');
		await expect(page).toHaveURL(/lang=en/);
	});

	test('theme toggling works', async ({ page }) => {
		const themeSwitcher = page.getByTestId('theme-switcher');
		await expect(themeSwitcher).toBeVisible();

		// Assuming default is dark
		const html = page.locator('html');
		await expect(html).toHaveAttribute('data-theme', 'dark');

		// Click light mode
		await page.getByTestId('theme-light').click();
		await expect(html).toHaveAttribute('data-theme', 'light');
		await expect(page).toHaveURL(/theme=light/);

		// Click dark mode
		await page.getByTestId('theme-dark').click();
		await expect(html).toHaveAttribute('data-theme', 'dark');
		await expect(page).toHaveURL(/theme=dark/);
	});

    test('mobile navigation and background switcher', async ({ page }) => {
        // Set viewport to mobile
        await page.setViewportSize({ width: 375, height: 667 });
        
        // Check background switcher visibility on mobile
        const mobileSwitcher = page.getByTestId('bg-switcher-mobile');
        await expect(mobileSwitcher).toBeVisible();
    });
});
