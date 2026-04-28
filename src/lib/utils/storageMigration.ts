import { storage } from "$lib/services/storage";

const LEGACY_KEYS = ["theme", "backgroundType", "lang"];
const MIGRATION_KEY = "__migrated";

/**
 * Migrates old localStorage keys to the new prefixed version.
 * This ensures that users don't lose their settings when the namespace isolation is implemented.
 */
export function migrateStorageKeys() {
	if (typeof localStorage === "undefined") return;

	// Check if already migrated
	if (storage.get(MIGRATION_KEY)) return;

	for (const key of LEGACY_KEYS) {
		const oldValue = localStorage.getItem(key);

		// If legacy key exists and new prefixed key doesn't, migrate it
		if (oldValue !== null && storage.get(key) === null) {
			storage.set(key, oldValue);
			localStorage.removeItem(key);
		}
	}

	// Mark migration as complete
	storage.set(MIGRATION_KEY, "true");
}
