/**
 * Locale-independent contact details.
 *
 * Single source of truth for values that must not be hardcoded inside
 * components. The links render in two places that must not drift: the sidebar
 * on desktop and the hero section on mobile.
 */
export const EMAIL = "alikzapolnov@gmail.com";

export const CONTACTS = {
	email: EMAIL,
	linkedin: "https://linkedin.com/in/alik-qa-engineer",
	telegram: "https://t.me/alik532",
	whatsapp: "https://wa.me/380937251208",
	// viber:// rather than an https link: the web fallback only offers to
	// install the app, while the scheme opens a chat on a device that has it.
	viber: "viber://chat?number=%2B380937251208"
} as const;
