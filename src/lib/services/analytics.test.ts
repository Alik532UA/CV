import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

vi.mock('$app/environment', () => ({
	browser: true,
	dev: true
}));

describe('CV analytics service (dev guard)', () => {
	beforeEach(() => {
		vi.resetModules();
	});

	it('мовчить у dev-режимі (ANALYTICS-v8 § 2.1, § 5)', async () => {
		const { track, trackPageView, initAnalytics } = await import('./analytics');
		const gtag = vi.fn();
		vi.stubGlobal('gtag', gtag);

		initAnalytics();
		track('project_click', { project: 'Slovko' });
		trackPageView();

		expect(gtag, 'у dev-режимі не повинно надсилатися жодної події').not.toHaveBeenCalled();
	});
});

/**
 * ANALYTICS-v8 § 4.2 — мінімум приватності, який не залежить від того, є банер
 * згоди чи ні. Тут банера немає свідомо (`PROJECT-CONTEXT.md`), і саме тому
 * сигнал браузера — єдине, чим відвідувач може сказати «ні».
 *
 * `dev: false` навмисно: у dev усе мовчить і без сигналу, тож перевірка в
 * dev-режимі доводила б нуль. Контрольний випадок (сигналу немає → скрипт
 * вантажиться) обов'язковий — без нього обидві перевірки пройшли б і на коді,
 * який просто ніколи нічого не надсилає.
 */
describe('сигнал приватності від браузера (ANALYTICS-v8 § 4.2)', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.doMock('$app/environment', () => ({ browser: true, dev: false }));
	});

	afterEach(() => {
		vi.unstubAllGlobals();
		vi.doUnmock('$app/environment');
	});

	/** Підміняє `navigator`, лишаючи решту jsdom на місці. */
	function withNavigator(extra: Record<string, unknown>) {
		vi.stubGlobal('navigator', { ...globalThis.navigator, ...extra });
	}

	it('контроль: без сигналу скрипт GA таки додається', async () => {
		withNavigator({ doNotTrack: null });
		document.head.innerHTML = '';

		const { initAnalytics } = await import('./analytics');
		initAnalytics();

		expect(
			document.querySelector('script[src*="googletagmanager.com"]'),
			'без цього випадку решта файлу доводила б лише те, що код мовчить завжди'
		).not.toBeNull();
	});

	it.each([
		['Global Privacy Control', { globalPrivacyControl: true }],
		['doNotTrack: "1"', { doNotTrack: '1' }],
		['doNotTrack: "yes"', { doNotTrack: 'yes' }]
	])('%s — жодного запиту до Google', async (_name, signal) => {
		withNavigator({ doNotTrack: null, ...signal });
		document.head.innerHTML = '';

		const { initAnalytics, track, trackPageView } = await import('./analytics');
		const gtag = vi.fn();
		vi.stubGlobal('gtag', gtag);

		initAnalytics();
		track('project_click', { project: 'Slovko' });
		trackPageView();

		expect(
			document.querySelector('script[src*="googletagmanager.com"]'),
			'скрипт не мусить навіть вантажитися — це не Consent Mode'
		).toBeNull();
		expect(gtag, 'жодної події').not.toHaveBeenCalled();
	});

	it('"unspecified" і "0" сигналом не вважаються', async () => {
		// Firefox віддає "unspecified", коли вибору не зроблено. Прийняти це за
		// відмову означало б вимкнути аналітику для всіх його користувачів.
		for (const value of ['unspecified', '0']) {
			vi.resetModules();
			withNavigator({ doNotTrack: value });
			document.head.innerHTML = '';

			const { initAnalytics } = await import('./analytics');
			initAnalytics();

			expect(
				document.querySelector('script[src*="googletagmanager.com"]'),
				`doNotTrack: "${value}" — це «вибору немає», а не «ні»`
			).not.toBeNull();
		}
	});
});
