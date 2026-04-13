import { STORAGE_PREFIX, getStorageKey } from '$lib/config/storage';

const LEGACY_KEYS = ['theme', 'backgroundType', 'lang'];

/**
 * Migrates old localStorage keys to the new prefixed version.
 * This ensures that users don't lose their settings when the namespace isolation is implemented.
 */
export function migrateStorageKeys() {
    if (typeof localStorage === 'undefined') return;

    for (const key of LEGACY_KEYS) {
        const oldValue = localStorage.getItem(key);
        const newKey = getStorageKey(key);
        
        if (oldValue !== null && localStorage.getItem(newKey) === null) {
            localStorage.setItem(newKey, oldValue);
            localStorage.removeItem(key);
        }
    }
}
