import { browser, dev } from "$app/environment";

/**
 * Google Analytics 4.
 *
 * The measurement ID sits here rather than in an environment variable on
 * purpose: it is public by design — it ships in the page source of every site
 * that uses GA — so hiding it would buy nothing while forcing the value through
 * the GitHub Actions build for the static adapter.
 *
 * Paste the real ID below to switch analytics on. Until then every export in
 * this file is a no-op: no script is loaded and nothing is sent, so a
 * half-finished setup cannot report into the wrong property.
 */
const GA_ID = "G-XXXXXXXXXX";

const isConfigured = /^G-[A-Z0-9]{6,}$/.test(GA_ID) && !GA_ID.includes("XXXX");

// `dev` keeps local work from landing in the same property as real traffic.
const enabled = browser && !dev && isConfigured;

type EventParams = Record<string, string | number | boolean>;

declare global {
	interface Window {
		dataLayer?: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

let started = false;

export function initAnalytics() {
	if (!enabled || started) return;
	started = true;

	const dataLayer = (window.dataLayer = window.dataLayer ?? []);
	window.gtag = function gtag() {
		// gtag.js reads the raw `arguments` object back off the queue, so this
		// cannot be an arrow function taking rest parameters.
		// eslint-disable-next-line prefer-rest-params
		dataLayer.push(arguments);
	};

	window.gtag("js", new Date());
	// Page views are sent by hand from the root layout instead: the automatic
	// one fires before the router has settled, and never fires again for
	// client-side route changes.
	window.gtag("config", GA_ID, { send_page_view: false });

	const script = document.createElement("script");
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
	document.head.appendChild(script);
}

export function trackPageView() {
	if (!enabled) return;
	// afterNavigate can fire before onMount on the initial load, so neither
	// caller may assume the other ran first. initAnalytics is idempotent, and
	// gtag queues into dataLayer until its script arrives.
	initAnalytics();
	const { origin, pathname } = window.location;
	// The active language lives in ?lang= and is rewritten in place on every
	// switch. Left in page_location it would split this one page into forty-odd
	// separate rows in the report, so the query string is dropped.
	window.gtag?.("event", "page_view", { page_location: `${origin}${pathname}` });
}

export function track(event: string, params: EventParams = {}) {
	if (!enabled) return;
	initAnalytics();
	window.gtag?.("event", event, params);
}
