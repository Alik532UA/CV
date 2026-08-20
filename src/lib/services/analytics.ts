import { browser, dev } from "$app/environment";

/**
 * Google Analytics 4 (ANALYTICS-v8 § 1).
 */
const GA_ID: string = "G-0G0N13KZG6";
const PLACEHOLDER: string = "G-XXXXXXXXXX";

const isConfigured = GA_ID !== PLACEHOLDER && /^G-[A-Z0-9]{6,}$/.test(GA_ID);

// `dev` keeps local work from landing in the same property as real traffic.
const enabled = browser && !dev && isConfigured;

export type AnalyticsEvent =
	| 'pdf_download'
	| 'cv_download'
	| 'project_click'
	| 'ai_match_open'
	| 'section_view'
	| 'language_change'
	| 'theme_change'
	| 'contact_click'
	| 'service_badge_click';

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
	window.gtag?.("event", "page_view", { page_location: `${origin}${pathname}` });
}

export function track(event: AnalyticsEvent, params: EventParams = {}) {
	if (!enabled) return;
	initAnalytics();
	window.gtag?.("event", event, params);
}
