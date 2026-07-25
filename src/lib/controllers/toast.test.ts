import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ToastState } from "./toast.svelte";

describe("ToastState", () => {
	let toast: ToastState;

	beforeEach(() => {
		vi.useFakeTimers();
		toast = new ToastState();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("adds a message and auto-removes it after its duration", () => {
		toast.success("hi", 4000);
		expect(toast.messages).toHaveLength(1);

		vi.advanceTimersByTime(3999);
		expect(toast.messages).toHaveLength(1);

		vi.advanceTimersByTime(1);
		expect(toast.messages).toHaveLength(0);
	});

	it("pauses the timer so a hovered/focused toast does not auto-dismiss", () => {
		const id = toast.add("info", "stay", 4000);
		vi.advanceTimersByTime(1000);

		toast.pause(id);
		vi.advanceTimersByTime(10_000);

		expect(toast.messages).toHaveLength(1);
	});

	it("resumes from the elapsed point, not from the full duration", () => {
		const id = toast.add("info", "resume", 4000);
		vi.advanceTimersByTime(3000); // 1000ms remaining

		toast.pause(id);
		vi.advanceTimersByTime(5000); // paused — clock advances, timer does not

		toast.resume(id);
		vi.advanceTimersByTime(999);
		expect(toast.messages).toHaveLength(1); // 1ms short of the remaining 1000ms

		vi.advanceTimersByTime(1);
		expect(toast.messages).toHaveLength(0);
	});

	it("is reference-counted: hover + focus need equal resumes before it restarts", () => {
		const id = toast.add("info", "refcount", 4000);
		vi.advanceTimersByTime(1000);

		toast.pause(id); // hover
		toast.pause(id); // focus
		toast.resume(id); // mouseleave while still focused

		vi.advanceTimersByTime(10_000);
		expect(toast.messages).toHaveLength(1); // still held by focus

		toast.resume(id); // blur — now armed with the remaining 3000ms
		vi.advanceTimersByTime(2999);
		expect(toast.messages).toHaveLength(1);

		vi.advanceTimersByTime(1);
		expect(toast.messages).toHaveLength(0);
	});

	it("caps simultaneous toasts and evicts the oldest", () => {
		for (let i = 0; i < 6; i++) toast.info(`msg ${i}`, 10_000);

		expect(toast.messages.length).toBeLessThanOrEqual(4);
		expect(toast.messages.at(-1)?.message).toBe("msg 5");
		expect(toast.messages.at(0)?.message).toBe("msg 2");
	});

	it("stores an anchor element so the toast can render next to its trigger", () => {
		const el = document.createElement("a");
		const id = toast.add("success", "copied", 6000, undefined, el);
		expect(toast.messages.find((m) => m.id === id)?.anchor).toBe(el);
	});

	it("remove clears the timer and drops the message", () => {
		const id = toast.add("error", "bye", 7000);
		toast.remove(id);

		expect(toast.messages).toHaveLength(0);

		// Timer was cleared: advancing past the duration must not throw or re-remove.
		vi.advanceTimersByTime(10_000);
		expect(toast.messages).toHaveLength(0);
	});
});
