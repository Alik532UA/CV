import { SvelteMap } from "svelte/reactivity";

export type ToastType = "success" | "error" | "warn" | "info";

export interface ToastAction {
	label: string;
	onAction: () => void;
}

export interface ToastMessage {
	id: number;
	type: ToastType;
	message: string;
	action?: ToastAction;
	duration: number;
	/** When set, the toast is anchored next to this element (§5); otherwise it joins the global stack. */
	anchor?: HTMLElement;
}

interface TimerInfo {
	id: number;
	timerId: ReturnType<typeof setTimeout> | null;
	startTime: number;
	elapsed: number;
	duration: number;
	/** Number of active pause reasons (hover, focus) — reference counting. */
	holds: number;
}

const MAX_TOASTS = 4;

/**
 * Centralized toast state (logic separated from presentation).
 *
 * The auto-dismiss timer can be paused on hover AND focus (WCAG 2.2.1),
 * and resumes from the elapsed point rather than restarting. Pause/resume
 * are reference-counted so hover and focus never cancel each other out.
 *
 * Passing `anchor` (a trigger element) makes a toast anchored — it is rendered
 * next to that element (§5). The timer/pause/fallback logic is identical; only
 * the placement differs, so state never leaks back into a section component.
 */
export class ToastState {
	messages = $state<ToastMessage[]>([]);
	private nextId = 0;
	private timers = new SvelteMap<number, TimerInfo>();

	private _arm(info: TimerInfo) {
		const remaining = Math.max(0, info.duration - info.elapsed);
		info.startTime = Date.now();
		info.timerId = setTimeout(() => this.remove(info.id), remaining);
	}

	add(type: ToastType, message: string, duration = 4000, action?: ToastAction, anchor?: HTMLElement): number {
		const id = this.nextId++;
		this.messages.push({ id, type, message, action, duration, anchor });
		if (this.messages.length > MAX_TOASTS) this.remove(this.messages[0].id);

		const info: TimerInfo = { id, timerId: null, startTime: 0, elapsed: 0, duration, holds: 0 };
		this.timers.set(id, info);
		this._arm(info);
		return id;
	}

	success(message: string, duration = 4000, action?: ToastAction, anchor?: HTMLElement) {
		this.add("success", message, duration, action, anchor);
	}
	info(message: string, duration = 3000, action?: ToastAction, anchor?: HTMLElement) {
		this.add("info", message, duration, action, anchor);
	}
	warn(message: string, duration = 5000, action?: ToastAction, anchor?: HTMLElement) {
		this.add("warn", message, duration, action, anchor);
	}
	error(message: string, duration = 7000, action?: ToastAction, anchor?: HTMLElement) {
		this.add("error", message, duration, action, anchor);
	}

	/** Pause on hover OR focus. Reference-counted. */
	pause(id: number) {
		const info = this.timers.get(id);
		if (!info) return;
		info.holds += 1;
		if (info.holds > 1 || info.timerId === null) return; // already paused
		clearTimeout(info.timerId);
		info.elapsed = Math.min(info.elapsed + (Date.now() - info.startTime), info.duration);
		info.timerId = null;
	}

	/** Resume only once every pause reason is gone; continues from elapsed. */
	resume(id: number) {
		const info = this.timers.get(id);
		if (!info) return;
		if (info.holds > 0) info.holds -= 1;
		if (info.holds > 0 || info.timerId !== null) return; // still held / already running
		this._arm(info);
	}

	remove(id: number) {
		const info = this.timers.get(id);
		if (info?.timerId) clearTimeout(info.timerId);
		this.timers.delete(id);
		const index = this.messages.findIndex((m) => m.id === id);
		if (index !== -1) this.messages.splice(index, 1);
	}
}

export const toast = new ToastState();
