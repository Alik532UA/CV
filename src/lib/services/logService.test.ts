import { describe, it, expect, beforeEach } from "vitest";
import { logService } from "./logService.svelte";

describe("CV logService", () => {
	beforeEach(() => {
		logService.clear();
	});

	it("records logs and maintains error count", () => {
		expect(logService.errorCount).toBe(0);
		logService.info("ui", "test info message");
		expect(logService.errorCount).toBe(0);

		logService.error("ui", "test error message");
		expect(logService.errorCount).toBe(1);

		logService.warn("storage", "test warning message");
		expect(logService.errorCount).toBe(1);
		expect(logService.logs.length).toBe(3);
	});

	it("scrubs email addresses from log messages", () => {
		logService.info("app", "User user@example.com logged in");
		expect(logService.logs[0].message).not.toContain("user@example.com");
		expect(logService.logs[0].message).toContain("***@***.***");
	});

	it("generates structured diagnostic report", () => {
		logService.error("app", "Critical issue occurred");
		const report = logService.getReport();
		expect(report).toContain("--- LOG REPORT ---");
		expect(report).toContain("VERSION:");
		expect(report).toContain("Critical issue occurred");
	});
});
