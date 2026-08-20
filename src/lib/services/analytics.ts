import { browser, dev } from "$app/environment";

/**
 * Google Analytics 4.
 *
 * The measurement ID sits here rather than in an environment variable on
 * purpose: it is public by design — it ships in the page source of every site
 * that uses GA — so hiding it would buy nothing while forcing the value through
 * the GitHub Actions build for the static adapter.
 *
 * Replacing the ID with a placeholder turns every export here into a no-op —
 * no script is loaded and nothing is sent — so the file can be carried into a
 * new project without it reporting into this property.
 */
const GA_ID = "G-0G0N13KZG6";

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
	// Рядок запиту відкидається, і після переїзду мови в СЕГМЕНТ ШЛЯХУ причина
	// стала інша, ніж була. Раніше мова жила в `?lang=`, і залишений запит
	// розбив би одну сторінку на сорок із гаком рядків звіту. Тепер мова — у
	// `pathname`, тож `/CV/uk/` і `/CV/` — окремі рядки за побудовою, і це саме
	// те, що потрібно: глибина читання цікава окремо на кожній мові.
	//
	// Відкидається натомість службовий шум: `?theme=`, `?debug=1` і будь-яка
	// utm-мітка. Кожен із них інакше створив би дублікат тієї самої сторінки.
	window.gtag?.("event", "page_view", { page_location: `${origin}${pathname}` });
}

export function track(event: string, params: EventParams = {}) {
	if (!enabled) return;
	initAnalytics();
	window.gtag?.("event", event, params);
}
