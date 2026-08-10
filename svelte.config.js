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
					// Hash of the first-frame script in src/app.html — theme, then the
					// class that hides the native scrollbar. SvelteKit hashes only the
					// scripts it emits itself, so one living in the template has to be
					// listed here by hand.
					//
					// EDITING THAT SCRIPT CHANGES THIS HASH. The previous value had gone
					// stale exactly that way, and the built site was blocking the script
					// outright; src/scrollbar-canon.test.ts now recomputes it and fails
					// when the two disagree.
					'sha256-AI5o/y+VHjRKg1MdVNz9bdfv1HxQjYTru8WN+qI1dss='
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
