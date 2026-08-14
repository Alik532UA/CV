import { browser } from "$app/environment";
import { STORAGE_PREFIX } from "$lib/config/storage";

/**
 * Facade over Web Storage (STORAGE-NAMESPACE-v8).
 *
 * It exists for two guarantees, and the second one is why this file looks the
 * way it does rather than being three one-liners:
 *
 *  1. **Every key carries the project prefix.** This origin is shared —
 *     alik532ua.github.io serves DigitalWorkshop and the other projects from
 *     the same localStorage — so `clear()` here removes only what starts with
 *     `cv-svelte_` and leaves the neighbours alone.
 *
 *  2. **Nothing here throws.** Storage is not a plain object. A full quota
 *     throws on any write; Safari in private mode has historically thrown on
 *     the very first `setItem`; a browser configured to block site data throws
 *     on merely *reading* the `localStorage` property. Before this, such a
 *     throw travelled straight out into whichever controller called — theme,
 *     language, sound, scrollbar mode — and killed that interaction along with
 *     everything after it in the same handler. Losing a saved preference is a
 *     nuisance; losing the click that set it is a broken site.
 *
 * Failures are **counted, not logged**: `logService` persists its own buffer
 * through this facade, so importing it here would close an import cycle. The
 * count rides along in the copied bug report instead, which is the only place
 * anyone would look for it.
 */
let failures = 0;

/** Storage operations swallowed so far. Reported in the log header. */
export function storageFailures(): number {
	return failures;
}

/** Test seam: the counter is module state and would leak between cases. */
export function resetStorageFailures(): void {
	failures = 0;
}

type Area = "local" | "session";

/**
 * The `Storage` object is fetched per call rather than captured once at module
 * scope. Reading the property is itself the throwing operation in a browser
 * that blocks site data, and at module scope that throw happens at import time,
 * before any guard in this file could run.
 */
function area(kind: Area): Storage | null {
	if (!browser) return null;
	try {
		return kind === "local" ? localStorage : sessionStorage;
	} catch {
		failures += 1;
		return null;
	}
}

function makeStorage(kind: Area) {
	const get = (key: string): string | null => {
		const store = area(kind);
		if (!store) return null;
		try {
			return store.getItem(STORAGE_PREFIX + key);
		} catch {
			failures += 1;
			return null;
		}
	};

	/** Returns whether the value was actually stored, for callers that care. */
	const set = (key: string, value: string): boolean => {
		const store = area(kind);
		if (!store) return false;
		try {
			store.setItem(STORAGE_PREFIX + key, value);
			return true;
		} catch {
			failures += 1;
			return false;
		}
	};

	const remove = (key: string): void => {
		const store = area(kind);
		if (!store) return;
		try {
			store.removeItem(STORAGE_PREFIX + key);
		} catch {
			failures += 1;
		}
	};

	/**
	 * Prefix-scoped by construction. The keys are collected first and removed
	 * afterwards because removing during the walk shifts every later index —
	 * a plain forward loop with `removeItem` inside skips every second key.
	 */
	const clear = (): void => {
		const store = area(kind);
		if (!store) return;
		try {
			const doomed: string[] = [];
			for (let i = 0; i < store.length; i++) {
				const key = store.key(i);
				if (key?.startsWith(STORAGE_PREFIX)) doomed.push(key);
			}
			for (const key of doomed) store.removeItem(key);
		} catch {
			failures += 1;
		}
	};

	const getJSON = <T>(key: string): T | null => {
		const raw = get(key);
		if (raw === null) return null;
		try {
			return JSON.parse(raw) as T;
		} catch {
			// Corrupt value, not a storage failure: a half-written entry from an
			// older format should read as "nothing saved", not as an outage.
			return null;
		}
	};

	const setJSON = (key: string, value: unknown): boolean => {
		try {
			return set(key, JSON.stringify(value));
		} catch {
			// JSON.stringify throws on cyclic structures and on BigInt.
			failures += 1;
			return false;
		}
	};

	return { get, set, remove, clear, getJSON, setJSON };
}

export const storage = {
	...makeStorage("local"),
	/** Same contract, session lifetime. Used by logService for its buffer. */
	session: makeStorage("session")
};
