import { browser, dev } from "$app/environment";
import { storage, storageFailures } from "$lib/services/storage";

export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
	timestamp: string;
	level: LogLevel;
	category: string;
	message: string;
}

const LOG_LIMIT = 1000;
/** Key inside the facade — the `cv-svelte_` prefix is added there, not here. */
const LOG_KEY = "logs";
const LOG_CONFIG: Record<string, boolean> = {
	ui: true,
	storage: true,
	i18n: true,
	sfx: true,
	engine: true,
	app: true
};

class LogService {
	logs = $state<LogEntry[]>([]);
	errorCount = $derived(this.logs.filter((l) => l.level === "error").length);

	constructor() {
		// Through the facade rather than sessionStorage directly: the prefix used
		// to be spelled out here as a second copy of the one in config/storage.ts,
		// and a full quota threw out of the constructor — that is, out of module
		// initialisation, taking the whole app down before the first paint.
		const saved = storage.session.getJSON<LogEntry[]>(LOG_KEY);
		if (Array.isArray(saved)) this.logs = saved;
	}

	private add(level: LogLevel, category: string, message: string) {
		const entry: LogEntry = {
			timestamp: new Date().toISOString(),
			level,
			category,
			message
		};

		this.logs.push(entry);
		if (this.logs.length > LOG_LIMIT) {
			this.logs.shift();
		}

		storage.session.setJSON(LOG_KEY, this.logs);

		if (browser) {
			// Console output logic
			if (dev || level === "error") {
				if (LOG_CONFIG[category] !== false) {
					const color =
						level === "error" ? "color: #ff4444" : level === "warn" ? "color: #ffbb33" : "color: #00C851";
					console.log(`%c[${category.toUpperCase()}] %c${message}`, color, "color: inherit");
				}
			}
		}
	}

	info(category: string, message: string) {
		this.add("info", category, message);
	}

	warn(category: string, message: string) {
		this.add("warn", category, message);
	}

	error(category: string, message: string) {
		this.add("error", category, message);
	}

	clear() {
		this.logs = [];
		storage.session.remove(LOG_KEY);
	}

	getReport(): string {
		const header = [
			"--- LOG REPORT ---",
			`VERSION: ${__APP_VERSION__}`,
			// ISO rather than toLocaleString(): the report is read by whoever
			// debugs it, not by the visitor who copied it, and a bare
			// toLocaleString() renders in the visitor's locale — 03.08 or 08.03
			// depending on where they live, with no way to tell which.
			`DATE: ${new Date().toISOString()}`,
			`URL: ${browser ? window.location.href : "SSR"}`,
			`USER_AGENT: ${browser ? navigator.userAgent : "SSR"}`,
			// Non-zero means preferences were not saved this session — private
			// mode, a full quota, or site data blocked. Without this line the
			// report from such a device looks identical to a healthy one.
			`STORAGE_FAILURES: ${storageFailures()}`,
			"---"
		].join("\n");

		const body = this.logs
			.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.category.toUpperCase()}] ${l.message}`)
			.join("\n");

		return `${header}\n${body}`;
	}
}

export const logService = new LogService();
