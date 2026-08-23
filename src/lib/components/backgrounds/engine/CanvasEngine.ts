import { browser } from "$app/environment";
import { logService } from "$lib/services/logService.svelte";

export abstract class CanvasEngine {
	protected canvas: HTMLCanvasElement | null = null;
	protected ctx: CanvasRenderingContext2D | null = null;
	protected width = 0;
	protected height = 0;
	protected scrollY = 0;
	protected currentScrollY = 0;
	protected theme: string = "dark";

	private animationId: number = 0;
	private lastWidth = 0;

	constructor(initialTheme: string) {
		this.theme = initialTheme;
	}

	public mount(canvas: HTMLCanvasElement) {
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");

		if (!this.ctx) {
			logService.error("engine", "Failed to get 2D context");
			return;
		}

		if (browser) {
			logService.info("engine", "Mounting canvas engine...");
			// Initial setup
			this.width = this.canvas.clientWidth;
			this.height = this.canvas.clientHeight;
			this.canvas.width = this.width;
			this.canvas.height = this.height;
			this.lastWidth = this.width;
			this.scrollY = window.scrollY;
			this.currentScrollY = window.scrollY;

			this.init();
			this.startLoop();

			/*
			 * Тут стояв `requestAnimationFrame(() => canvas.classList.add("mounted"))`
			 * — спосіб змусити браузер побачити зміну `opacity` і запустити перехід
			 * появи. Тепер поява цілком у CSS: `@starting-style` у трьох
			 * компонентах тла (UI-ELEMENTS-v8 `UIE-STARTING-STYLE`).
			 *
			 * Прибрано не як зайвий рядок, а тому що двигун відповідав за
			 * ВИДИМІСТЬ тла. Рядок стояв нижче за `return` при `ctx === null`, тож
			 * будь-яка відмова контексту робила тло невидимим назавжди — при
			 * робочому журналі й робочому циклі малювання. Тепер спокійний стан
			 * елемента `opacity: 1`, і найгірший наслідок відмови — поява без
			 * плавності.
			 */

			window.addEventListener("resize", this.throttledResize);
			window.addEventListener("scroll", this.handleScroll, { passive: true });
		}
	}

	public unmount() {
		logService.info("engine", "Unmounting canvas engine");
		this.stopLoop();
		if (browser) {
			window.removeEventListener("resize", this.throttledResize);
			window.removeEventListener("scroll", this.handleScroll);
		}
		this.canvas = null;
		this.ctx = null;
	}

	public setTheme(theme: string) {
		this.theme = theme;
	}

	private startLoop() {
		const loop = () => {
			if (!this.canvas || !this.ctx) return;
			this.currentScrollY += (this.scrollY - this.currentScrollY) * 0.08;
			this.draw();
			this.animationId = requestAnimationFrame(loop);
		};
		loop();
	}

	private stopLoop() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = 0;
		}
	}

	// Throttle helper to limit execution frequency
	private throttle(func: (...args: unknown[]) => void, limit: number) {
		let inThrottle: boolean;
		return (...args: unknown[]) => {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}

	private throttledResize = this.throttle(() => this.handleResize(), 200);

	private handleScroll = () => {
		if (browser) {
			this.scrollY = window.scrollY;
		}
	};

	private handleResize() {
		if (!this.canvas) return;

		const newWidth = this.canvas.clientWidth;

		// Strict check: if width hasn't changed, ignore vertical resize.
		// This prevents mobile address bar from resetting animations.
		if (newWidth === this.lastWidth) return;

		logService.info("engine", `Canvas resize: ${newWidth}x${this.canvas.clientHeight}`);
		this.lastWidth = newWidth;
		this.width = newWidth;
		this.height = this.canvas.clientHeight;

		this.canvas.width = this.width;
		this.canvas.height = this.height;

		this.init();
	}

	protected abstract init(): void;
	protected abstract draw(): void;

	protected getColors() {
		if (this.theme === "light") {
			return {
				primary: "rgba(0, 113, 227, ",
				secondary: "rgba(94, 92, 230, ",
				rgbPrimary: "rgb(0, 113, 227)",
				rgbSecondary: "rgb(94, 92, 230)",
			};
		}
		return {
			primary: "rgba(0, 242, 255, ",
			secondary: "rgba(112, 0, 255, ",
			rgbPrimary: "rgb(0, 242, 255)",
			rgbSecondary: "rgb(112, 0, 255)",
		};
	}
}
