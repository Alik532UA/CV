import { browser } from "$app/environment";
import { STORAGE_PREFIX } from "$lib/config/storage";
import { storage } from "$lib/services/storage";

/** Keys this project wrote before the namespace existed. */
const LEGACY_KEYS = ["theme", "backgroundType", "lang"];
const MIGRATION_KEY = "__migrated";

/**
 * Bring pre-namespace settings under the `cv-svelte_` prefix, once per browser.
 *
 * This is the one module allowed to touch unprefixed keys directly
 * (STORAGE-NAMESPACE-v8, step 4); the ESLint exemption for it is in
 * `eslint.config.js`. Two things about it are not obvious, and both used to be
 * wrong.
 *
 * ## It copies, it does not move
 *
 * The canon's step-4 example ends each key with `localStorage.removeItem(oldKey)`,
 * and that is what stood here. It is written for a project that owns its origin.
 * This one does not: `alik532ua.github.io` serves six applications out of one
 * `localStorage`, and `theme`, `lang` and `backgroundType` are exactly the names
 * every one of them would have used before namespacing. An unprefixed key on a
 * shared origin is not "our old key" — it is a key with no owner, and deleting it
 * is the same act the whole namespace exists to prevent.
 *
 * It is not hypothetical. `as5.odesa.ua/src/app.html` reads
 * `localStorage.getItem(prefix + 'theme') || localStorage.getItem('theme')` in its
 * first-frame script — the bare key is its fallback for visitors it has not
 * migrated yet. Opening this CV deleted that fallback, in another application, to
 * save three dozen bytes here.
 *
 * The price of copying instead: the legacy keys stay behind forever, and after a
 * `hardReset()` — which wipes `cv-svelte___migrated` along with the rest of the
 * namespace — they are imported again. Both are cheap and reversible; the theme
 * of a neighbouring site is not ours to spend.
 *
 * ## Nothing here throws
 *
 * `storage` is a facade whose entire second guarantee is that no storage failure
 * ever reaches a caller, and this module deliberately steps around it. That made
 * it the only unguarded storage access in the project — and it runs FIRST in
 * `onMount`, ahead of `theme.init()`, `scrollbar.init()`, `language.init()`,
 * `initAnalytics()` and `shortcuts.init()`.
 *
 * The old guard was `typeof localStorage === "undefined"`, which answers a
 * different question. Absence is not the failure mode: a browser configured to
 * block site data throws `SecurityError` when the `localStorage` property is
 * *read*, so `typeof` throws too. One such visitor got a page that rendered from
 * prerendered HTML and then did nothing at all — no theme switch, no language,
 * no hotkeys, no scrollbar — because the migration took the whole of `onMount`
 * down with it.
 *
 * The `try` sits inside the loop, as the canon writes it: one unreadable key does
 * not cancel the other two.
 *
 * Covered by `storageMigration.test.ts`.
 */
export function migrateStorageKeys() {
	// `storage.get` answers `null` off the browser and swallows a blocked store,
	// so this one line covers SSR and "storage is unavailable" both.
	if (!browser || storage.get(MIGRATION_KEY)) return;

	for (const key of LEGACY_KEYS) {
		try {
			const legacy = localStorage.getItem(key);
			// A prefixed value already there wins: it is newer by construction.
			if (legacy !== null && localStorage.getItem(STORAGE_PREFIX + key) === null) {
				localStorage.setItem(STORAGE_PREFIX + key, legacy);
			}
		} catch {
			// Storage blocked, quota full, or the key unreadable. Nothing to migrate
			// is a normal outcome, not an error worth breaking hydration over.
		}
	}

	// Through the facade: it cannot throw, and a failure here only costs one
	// repeat of the copy above, which is idempotent.
	storage.set(MIGRATION_KEY, "true");
}
