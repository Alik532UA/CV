export const STORAGE_PREFIX = 'cv-svelte_';

/**
 * Returns a prefixed storage key for namespace isolation.
 */
export function getStorageKey(key: string): string {
    return STORAGE_PREFIX + key;
}
