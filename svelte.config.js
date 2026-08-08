import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		prerender: {
			handleMissingId: 'ignore'
		},
		adapter: adapter({
			fallback: '404.html'
		}),
		paths: {
			base: '/CV'
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
					'sha256-5kCri4c6Kc63HNipVm8tK0VilaNPrqM9D8fdBdzcuVI='
				],
				'style-src': ['self', 'unsafe-inline', 'https://fonts.googleapis.com'],
				'img-src': ['self', 'data:', 'https:'],
				'font-src': ['self', 'https://fonts.gstatic.com'],
				'object-src': ['none'],
				'base-uri': ['self'],
				'frame-ancestors': ['none']
				// Note: there is deliberately no connect-src here. Adding one would
				// need to allow https://*.google-analytics.com and
				// https://*.analytics.google.com, or the analytics beacons break.
			}
		}
	}
};

export default config;
