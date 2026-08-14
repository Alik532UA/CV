import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Fixed to `true` rather than left to whatever the test environment resolves:
// the whole point of these cases is the browser branch, and a silent `false`
// would make every one of them pass by never touching storage at all.
vi.mock("$app/environment", () => ({ browser: true }));

const { storage, storageFailures, resetStorageFailures } = await import("./storage");
const { STORAGE_PREFIX } = await import("$lib/config/storage");

/**
 * Storage facade invariants (STORAGE-NAMESPACE-v8).
 *
 * Two of the document's rules are CRITICAL, and both are the kind that never
 * shows up in normal use — the developer's browser has quota to spare and an
 * origin to itself. They only appear on someone else's machine, as a dead
 * button with nothing in the console.
 */

/** Minimal in-memory Storage. `throwOn` makes the named operation fail. */
function fakeStorage(throwOn: Set<string> = new Set()): Storage {
	const map = new Map<string, string>();
	const guard = (op: string) => {
		if (throwOn.has(op)) throw new DOMException("quota", "QuotaExceededError");
	};
	return {
		get length() {
			guard("length");
			return map.size;
		},
		key(i: number) {
			guard("key");
			return [...map.keys()][i] ?? null;
		},
		getItem(k: string) {
			guard("getItem");
			return map.get(k) ?? null;
		},
		setItem(k: string, v: string) {
			guard("setItem");
			map.set(k, v);
		},
		removeItem(k: string) {
			guard("removeItem");
			map.delete(k);
		},
		clear() {
			guard("clear");
			map.clear();
		}
	} as Storage;
}

beforeEach(() => {
	resetStorageFailures();
	vi.stubGlobal("localStorage", fakeStorage());
	vi.stubGlobal("sessionStorage", fakeStorage());
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("namespacing", () => {
	it("every key written carries the project prefix", () => {
		storage.set("theme", "dark");
		expect(localStorage.getItem(`${STORAGE_PREFIX}theme`)).toBe("dark");
		expect(localStorage.getItem("theme")).toBeNull();
	});

	it("reads back what it wrote, through the prefix", () => {
		storage.set("lang", "uk");
		expect(storage.get("lang")).toBe("uk");
		storage.remove("lang");
		expect(storage.get("lang")).toBeNull();
	});

	/**
	 * The one that matters most. This origin is shared with the other projects
	 * on alik532ua.github.io, and a facade that forwarded to localStorage.clear()
	 * would delete their saved state as well as ours.
	 */
	it("clear() removes only this project's keys", () => {
		localStorage.setItem(`${STORAGE_PREFIX}theme`, "dark");
		localStorage.setItem(`${STORAGE_PREFIX}lang`, "uk");
		localStorage.setItem("digitalworkshop_theme", "light");
		localStorage.setItem("teatr_session", "abc");

		storage.clear();

		expect(localStorage.getItem(`${STORAGE_PREFIX}theme`)).toBeNull();
		expect(localStorage.getItem(`${STORAGE_PREFIX}lang`)).toBeNull();
		expect(localStorage.getItem("digitalworkshop_theme")).toBe("light");
		expect(localStorage.getItem("teatr_session")).toBe("abc");
	});

	/**
	 * Removing while walking forward shifts every later index, so a naive loop
	 * deletes every second key and reports success. Three keys is the smallest
	 * number that catches it.
	 */
	it("clear() does not skip keys while walking the store", () => {
		for (const k of ["a", "b", "c"]) localStorage.setItem(STORAGE_PREFIX + k, "1");
		storage.clear();
		expect(localStorage.length).toBe(0);
	});
});

describe("the facade never throws", () => {
	it("survives a write that exceeds the quota", () => {
		vi.stubGlobal("localStorage", fakeStorage(new Set(["setItem"])));
		expect(() => storage.set("theme", "dark")).not.toThrow();
		expect(storage.set("theme", "dark")).toBe(false);
		expect(storageFailures()).toBeGreaterThan(0);
	});

	it("survives a store that refuses to be read", () => {
		vi.stubGlobal("localStorage", fakeStorage(new Set(["getItem"])));
		expect(() => storage.get("theme")).not.toThrow();
		expect(storage.get("theme")).toBeNull();
	});

	it("survives a store that throws while being enumerated", () => {
		vi.stubGlobal("localStorage", fakeStorage(new Set(["length"])));
		expect(() => storage.clear()).not.toThrow();
	});

	/**
	 * A browser told to block site data throws on the *property access*, not on
	 * the method. That is why the facade fetches the store per call inside a
	 * try, instead of capturing it once at module scope where the throw would
	 * happen at import time and take the bundle down.
	 */
	it("survives a browser that throws on the localStorage property itself", () => {
		const descriptor = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
		Object.defineProperty(globalThis, "localStorage", {
			configurable: true,
			get() {
				throw new DOMException("blocked", "SecurityError");
			}
		});

		try {
			expect(() => storage.get("theme")).not.toThrow();
			expect(() => storage.set("theme", "dark")).not.toThrow();
			expect(() => storage.clear()).not.toThrow();
			expect(storage.get("theme")).toBeNull();
		} finally {
			if (descriptor) Object.defineProperty(globalThis, "localStorage", descriptor);
			else Reflect.deleteProperty(globalThis, "localStorage");
		}
	});

	it("survives a value that cannot be serialised", () => {
		const cyclic: Record<string, unknown> = {};
		cyclic.self = cyclic;
		expect(() => storage.setJSON("draft", cyclic)).not.toThrow();
		expect(storage.setJSON("draft", cyclic)).toBe(false);
	});
});

describe("JSON helpers", () => {
	it("round-trips an object", () => {
		storage.setJSON("logs", [{ level: "info" }]);
		expect(storage.getJSON("logs")).toEqual([{ level: "info" }]);
	});

	/**
	 * A half-written entry from an older format reads as "nothing saved", and
	 * that is NOT counted as a storage failure — the report line exists to say
	 * "this device could not save", and corrupt data would make it lie.
	 */
	it("treats a corrupt value as absent without counting an outage", () => {
		localStorage.setItem(`${STORAGE_PREFIX}logs`, "{not json");
		expect(storage.getJSON("logs")).toBeNull();
		expect(storageFailures()).toBe(0);
	});
});

describe("session twin", () => {
	it("writes to sessionStorage, not localStorage", () => {
		storage.session.set("logs", "[]");
		expect(sessionStorage.getItem(`${STORAGE_PREFIX}logs`)).toBe("[]");
		expect(localStorage.getItem(`${STORAGE_PREFIX}logs`)).toBeNull();
	});
});
