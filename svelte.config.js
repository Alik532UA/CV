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
					'sha256-++fBQYhblTP7n81ZDDjJeFGYQXAzTnYXBKA2PeKk8ZY='
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
