import { browser, dev } from "$app/environment";

export type LogLevel = "info" | "warn" | "error";

export interface LogEntry {
	timestamp: string;
	level: LogLevel;
	category: string;
	message: string;
}

const LOG_LIMIT = 1000;
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
		if (browser) {
			const saved = sessionStorage.getItem("cv-svelte_logs");
			if (saved) {
				try {
					this.logs = JSON.parse(saved);
				} catch {
					// Silent fail for logs
				}
			}
		}
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

		if (browser) {
			sessionStorage.setItem("cv-svelte_logs", JSON.stringify(this.logs));

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
		if (browser) {
			sessionStorage.removeItem("cv-svelte_logs");
		}
	}

	getReport(): string {
		const header = [
			"--- LOG REPORT ---",
			`VERSION: ${__APP_VERSION__}`,
			`DATE: ${new Date().toLocaleString()}`,
			`URL: ${browser ? window.location.href : "SSR"}`,
			`USER_AGENT: ${browser ? navigator.userAgent : "SSR"}`,
			"---"
		].join("\n");

		const body = this.logs
			.map((l) => `[${l.timestamp}] [${l.level.toUpperCase()}] [${l.category.toUpperCase()}] ${l.message}`)
			.join("\n");

		return `${header}\n${body}`;
	}
}

export const logService = new LogService();
