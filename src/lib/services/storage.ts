import { browser } from "$app/environment";
import { STORAGE_PREFIX } from "$lib/config/storage";

export const storage = {
	get(key: string): string | null {
		if (!browser) return null;
		return localStorage.getItem(STORAGE_PREFIX + key);
	},
	set(key: string, value: string): void {
		if (!browser) return;
		localStorage.setItem(STORAGE_PREFIX + key, value);
	},
	remove(key: string): void {
		if (!browser) return;
		localStorage.removeItem(STORAGE_PREFIX + key);
	},
	clear(): void {
		if (!browser) return;
		const keysToRemove: string[] = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key?.startsWith(STORAGE_PREFIX)) {
				keysToRemove.push(key);
			}
		}
		keysToRemove.forEach((k) => localStorage.removeItem(k));
	},
	getJSON<T>(key: string): T | null {
		const raw = this.get(key);
		if (raw === null) return null;
		try {
			return JSON.parse(raw) as T;
		} catch {
			return null;
		}
	},
	setJSON(key: string, value: unknown): void {
		this.set(key, JSON.stringify(value));
	}
};
