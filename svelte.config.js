import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { SITE_BASE } from './src/lib/config/site.js';

/**
 * Хеш інлайн-скрипта першого кадру — ОБЧИСЛЕНИЙ із `src/app.html`, а не
 * вписаний рядком (SECURITY-v8 § 16).
 *
 * Рядком він тут уже стояв і вже розходився зі скриптом: правка скрипта міняє
 * хеш, і зібраний сайт починає блокувати власний скрипт — у dev при цьому все
 * зелено, бо там політика приїжджає заголовком із nonce. Наступного разу
 * розійтися нічому: значення береться з того самого файлу, який SvelteKit
 * покладе у `<head>`.
 *
 * Регулярка бере ПЕРШИЙ `<script>` без атрибутів — саме таким є скрипт першого
 * кадру; `<script type="application/ld+json">` під неї не підпадає. Порожній
 * результат означав би хеш порожнього рядка в політиці, тому це помилка збірки,
 * а не мовчазний фолбек.
 */
const inlineScript = readFileSync('src/app.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)?.[1];
if (!inlineScript) {
	throw new Error('svelte.config.js: у src/app.html немає інлайн-скрипта — CSP нічого хешувати');
}
const inlineScriptHash = `sha256-${createHash('sha256').update(inlineScript).digest('base64')}`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		// Типове `handleMissingId: 'fail'` повернуто навмисно. Стояло `'ignore'`,
		// і саме воно глушило найдорожчий дефект проєкту: бокове меню веде на
		// `#experience`, `#skills`, `#projects`, `#education`, `#other`, а секції
		// були обгорнуті в `{#await import(...)}` і в prerender не потрапляли
		// зовсім. Кравлер бачив п'ять посилань у нікуди на кожній із 44 сторінок і
		// мовчав саме через цей рядок.
		prerender: {},
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			// Звідти ж, звідки canonical, hreflang і гейт над `build/`
			// (CUSTOM-DOMAIN-v8: origin і base міняються ОДНИМ комітом, інакше
			// адреси або подвоюються, або втрачають префікс). Літерал тут був
			// четвертою копією рядка `/CV`.
			base: SITE_BASE
		},
		csp: {
			mode: 'hash',
			directives: {
				'script-src': [
					'self',
					'https://fonts.googleapis.com',
					// gtag.js is injected at runtime by the analytics service; without
					// this the browser blocks it and analytics silently never starts.
					'https://www.googletagmanager.com',
					// Hash of the first-frame script in src/app.html — theme, then the
					// class that hides the native scrollbar. SvelteKit hashes only the
					// scripts it emits itself, so one living in the template has to be
					// listed here.
					//
					// Обчислюється вгорі цього файлу з самого app.html. Рядком тут
					// стояло значення, яке вже одного разу розійшлося зі скриптом і
					// заблокувало його у зібраному сайті; тепер розходитися нічому.
					inlineScriptHash
				],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'img-src': ['self', 'data:', 'https:'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'object-src': ['none'],
				'base-uri': ['self']
				// NO frame-ancestors, AND THAT IS NOT AN OVERSIGHT. It used to be
				// here as ['none'] and did nothing at all: `frame-ancestors` is one
				// of the three directives (with `report-uri` and `sandbox`) that a
				// <meta http-equiv> policy is required to ignore, and a static site
				// on GitHub Pages has no server to send a real header. SvelteKit
				// duly dropped it from the built HTML — verified by reading
				// build/index.html, not the config — so the project counted itself
				// protected from clickjacking while being no such thing.
				//
				// A dead directive is worse than an absent one: it answers the
				// question "do we have clickjacking protection?" with a yes. The
				// honest answer here is no, and the exposure is accepted: this site
				// has no authenticated actions and nothing that a click delivered
				// through an invisible frame could do on the visitor's behalf.
				// src/security-canon.test.ts fails if anyone puts it back.
				//
				// Note: there is deliberately no connect-src here. Adding one would
				// need to allow https://*.google-analytics.com and
				// https://*.analytics.google.com, or the analytics beacons break.
			}
		}
	}
};

export default config;
