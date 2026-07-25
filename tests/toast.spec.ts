import { test, expect, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
	await page.waitForFunction(() => "__svelte" in window);
}

async function primeClipboard(page: Page) {
	// Deterministic success path: a real writeText() rejects in an unfocused
	// headless page, so replace it with a resolving stub on the live document.
	await page.evaluate(() => {
		Object.defineProperty(navigator, "clipboard", {
			configurable: true,
			value: { writeText: () => Promise.resolve() }
		});
	});
}

/**
 * Click the email link and wait for the toast, retrying until the app has
 * hydrated. A click before hydration just follows the mailto: link (a no-op
 * in headless), so no toast appears and the retry fires again.
 */
async function copyEmail(page: Page) {
	const toast = page.getByTestId("toast-message-success");
	await expect(async () => {
		await page.getByTestId("hero-email-link").click();
		await expect(toast).toBeVisible({ timeout: 1000 });
	}).toPass({ timeout: 15000 });
	return toast;
}

test.describe("Email toast", () => {
	// Run one at a time so parallel workers don't all cold-start the dev server.
	test.describe.configure({ mode: "serial" });
	// The toast logic is browser-agnostic; these tests override the Clipboard API,
	// which is only reliably overridable in Chromium here.
	test.skip(({ browserName }) => browserName !== "chromium", "clipboard stubbing is chromium-only");

	test.describe("clipboard available", () => {
		test.beforeEach(async ({ page }) => {
			await page.goto("/");
			await waitForHydration(page);
			await page.getByTestId("hero-email-link").waitFor({ state: "visible" });
			await primeClipboard(page);
		});

		test("copying the email shows a success toast with an action", async ({ page }) => {
			const toast = await copyEmail(page);

			await expect(toast).toBeVisible();
			await expect(page.getByTestId("toast-action-button")).toBeVisible();
			await expect(page.getByTestId("toast-progress-bar")).toBeVisible();
		});

		test("anchors the toast to the button and flips to stay on-screen", async ({ page }) => {
			await copyEmail(page);

			const wrapper = page.getByTestId("toast-anchored-wrapper");
			await expect(wrapper).toBeVisible();

			// On desktop the email toast is anchored, not in the global corner stack.
			await expect(
				page.getByTestId("toast-notifications-container").getByTestId("toast-message-success")
			).toHaveCount(0);

			// Measure both rects in viewport space (matches positionAnchored's getBoundingClientRect).
			const m = await page.evaluate(() => {
				const b = document.querySelector('[data-testid="hero-email-link"]')!.getBoundingClientRect();
				const w = document.querySelector('[data-testid="toast-anchored-wrapper"]')!.getBoundingClientRect();
				return {
					btn: { top: b.top, bottom: b.bottom, cx: b.left + b.width / 2, cy: b.top + b.height / 2 },
					toast: { top: w.top, bottom: w.bottom, left: w.left, right: w.right, cx: w.left + w.width / 2 },
					vw: window.innerWidth,
					vh: window.innerHeight
				};
			});

			// The core guarantee: the toast is never rendered off-screen.
			expect(m.toast.top).toBeGreaterThanOrEqual(0);
			expect(m.toast.bottom).toBeLessThanOrEqual(m.vh);
			expect(m.toast.left).toBeGreaterThanOrEqual(0);
			expect(m.toast.right).toBeLessThanOrEqual(m.vw);

			// Horizontally centered over the button (it is not near a viewport edge here).
			expect(Math.abs(m.toast.cx - m.btn.cx)).toBeLessThan(16);

			// Flip: button center in the lower half → toast above; upper half → below.
			if (m.btn.cy > m.vh / 2) {
				expect(m.toast.bottom).toBeLessThanOrEqual(m.btn.top + 2); // above the button
			} else {
				expect(m.toast.top).toBeGreaterThanOrEqual(m.btn.bottom - 2); // below the button
			}
		});

		test("pauses the countdown on hover (WCAG 2.2.1)", async ({ page }) => {
			const toast = await copyEmail(page);

			await toast.hover();
			await expect(page.getByTestId("toast-progress-bar")).toHaveCSS("animation-play-state", "paused");

			// Would otherwise auto-dismiss within 6s; still present while hovered.
			await page.waitForTimeout(1000);
			await expect(toast).toBeVisible();
		});

		test("pauses on keyboard focus of the action button", async ({ page }) => {
			const toast = await copyEmail(page);

			await page.getByTestId("toast-action-button").focus();
			await expect(page.getByTestId("toast-progress-bar")).toHaveCSS("animation-play-state", "paused");
			await expect(toast).toBeVisible();
		});

		test("the action button dismisses the toast", async ({ page }) => {
			const toast = await copyEmail(page);

			await page.getByTestId("toast-action-button").click();
			await expect(toast).toBeHidden();
		});
	});

	test("on a narrow screen the email toast falls back to the global stack", async ({ page }) => {
		await page.setViewportSize({ width: 375, height: 812 });
		await page.goto("/");
		await waitForHydration(page);
		await page.getByTestId("hero-email-link").waitFor({ state: "visible" });
		await primeClipboard(page);

		await copyEmail(page);

		await expect(page.getByTestId("toast-anchored-wrapper")).toHaveCount(0);
		await expect(
			page.getByTestId("toast-notifications-container").getByTestId("toast-message-success")
		).toBeVisible();
	});

	test("falls back to a mailto link when clipboard is unavailable", async ({ page }) => {
		await page.goto("/");
		await waitForHydration(page);
		await page.getByTestId("hero-email-link").waitFor({ state: "visible" });
		await page.evaluate(() => {
			Object.defineProperty(navigator, "clipboard", { configurable: true, get: () => undefined });
		});

		const link = page.getByTestId("hero-email-link");
		await expect(link).toHaveAttribute("href", /^mailto:/);

		await link.click();
		// The fallback path opens the mail client directly, without a toast.
		await expect(page.getByTestId("toast-message-success")).toHaveCount(0);
	});
});
