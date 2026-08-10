import { browser } from "$app/environment";
import { base } from "$app/paths";
import { storage } from "$lib/services/storage";
import { logService } from "$lib/services/logService.svelte";

const SOUND_DIR = "gta-san-andreas-menu-sound";

const SOUND_FILES = {
	hover: "gta-san-andreas-menu-hover-sound.ogg",
	selected: "gta-san-andreas-menu-selected-sound.ogg",
	cheat: "gta-san-andreas-menu-cheat-sound.ogg"
} as const;

export type SoundName = keyof typeof SOUND_FILES;

/** Half volume as a linear gain multiplier — about -6 dB off the files' own level. */
const VOLUME = 0.5;

/**
 * Sweeping a cursor down the sidebar fires one hover per item; without a floor
 * the clip stacks on itself into a rattle.
 */
const HOVER_THROTTLE_MS = 60;

/**
 * Text inputs are deliberately absent. The language search box is the only one
 * on the site, and a beep every time the pointer crosses it while typing is
 * noise rather than feedback.
 */
const INTERACTIVE_SELECTOR =
	'a[href], button, summary, [role="button"], [tabindex]:not([tabindex="-1"])';

/** Schemes that hand the visitor to another app, for links added without a target. */
const HANDOFF_SCHEMES = ["tel:", "sms:", "viber:"];

class SoundState {
	enabled = $state(true);

	private ctx: AudioContext | null = null;
	private buffers = new Map<SoundName, AudioBuffer>();
	private lastHovered: Element | null = null;
	private lastHoverAt = 0;
	private hoverCapable = false;

	constructor() {}

	/** @returns a teardown function, or undefined where there is no audio to set up. */
	init(): (() => void) | undefined {
		if (!browser || typeof AudioContext === "undefined") return;

		this.enabled = storage.get("sfxEnabled") !== "false";
		// On a touch screen pointerover fires as part of the tap, so leaving hover
		// on there would play two clips at once on every press.
		this.hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
		logService.info(
			"sfx",
			`Initializing sounds: ${this.enabled ? "on" : "off"}, hover ${this.hoverCapable ? "enabled" : "disabled"}`
		);

		// decodeAudioData works on a suspended context, so the clips can be decoded
		// up front and the first click is not the one that pays for the fetch.
		this.ctx = new AudioContext();
		void this.preload();

		const unlock = () => void this.ctx?.resume();
		// A pointer entering an element is not a user activation, so the context
		// stays suspended and the opening hovers of a session are silent however
		// many elements they cross. These two gestures are what actually lift it.
		document.addEventListener("pointerdown", unlock, { capture: true, once: true });
		document.addEventListener("keydown", unlock, { capture: true, once: true });

		// Capture phase throughout: the header's dropdown triggers call
		// stopPropagation(), so a bubble-phase listener on document never hears
		// those clicks at all.
		document.addEventListener("pointerover", this.handlePointerOver, true);
		document.addEventListener("click", this.handleClick, true);

		return () => {
			document.removeEventListener("pointerdown", unlock, true);
			document.removeEventListener("keydown", unlock, true);
			document.removeEventListener("pointerover", this.handlePointerOver, true);
			document.removeEventListener("click", this.handleClick, true);
			void this.ctx?.close();
			this.ctx = null;
			this.buffers.clear();
		};
	}

	toggle() {
		this.set(!this.enabled);
	}

	set(enabled: boolean) {
		this.enabled = enabled;
		storage.set("sfxEnabled", String(enabled));
		logService.info("sfx", `Sounds ${enabled ? "enabled" : "disabled"}`);

		// The click that switched them on is skipped by the delegated handler (the
		// toggle carries data-sfx-ignore, so turning them off stays silent), which
		// would otherwise leave switching on with no audible confirmation.
		if (enabled) {
			void this.ctx?.resume().then(() => this.play("selected"));
		}
	}

	play(name: SoundName) {
		const ctx = this.ctx;
		const buffer = this.buffers.get(name);
		// A suspended context is the normal state before the first gesture, and a
		// missing buffer means the browser could not decode the file.
		if (!this.enabled || !ctx || !buffer || ctx.state !== "running") return;

		const source = ctx.createBufferSource();
		const gain = ctx.createGain();
		gain.gain.value = VOLUME;
		source.buffer = buffer;
		source.connect(gain).connect(ctx.destination);
		source.start();
	}

	private async preload() {
		const ctx = this.ctx;
		if (!ctx) return;

		await Promise.all(
			(Object.keys(SOUND_FILES) as SoundName[]).map(async (name) => {
				try {
					const response = await fetch(`${base}/${SOUND_DIR}/${SOUND_FILES[name]}`);
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					this.buffers.set(name, await ctx.decodeAudioData(await response.arrayBuffer()));
				} catch (error) {
					// Safari plays no Ogg Vorbis, so a decode failure here is expected
					// rather than exceptional: that browser just stays silent.
					const reason = error instanceof Error ? error.message : String(error);
					logService.warn("sfx", `Could not load "${name}": ${reason}`);
				}
			})
		);
	}

	private handlePointerOver = (event: Event) => {
		if (!this.hoverCapable) return;

		const target = this.interactiveTarget(event);
		// Everything inside a button resolves back to that button, so this also
		// keeps a single element from retriggering on each inner icon and span.
		if (target === this.lastHovered) return;
		this.lastHovered = target;
		if (!target) return;

		const now = performance.now();
		if (now - this.lastHoverAt < HOVER_THROTTLE_MS) return;
		this.lastHoverAt = now;
		this.play("hover");
	};

	private handleClick = (event: Event) => {
		const target = this.interactiveTarget(event);
		if (!target || target.closest("[data-sfx-ignore]")) return;
		this.play(this.leavesSite(target) ? "cheat" : "selected");
	};

	private interactiveTarget(event: Event): HTMLElement | null {
		const node = event.target;
		if (!(node instanceof Element)) return null;

		const element = node.closest<HTMLElement>(INTERACTIVE_SELECTOR);
		if (!element) return null;
		if (element.hasAttribute("disabled") || element.getAttribute("aria-disabled") === "true") {
			return null;
		}
		return element;
	}

	/**
	 * target="_blank" covers every hand-off on the site today: LinkedIn, WhatsApp,
	 * Telegram, Viber and the three Google Drive CV files.
	 *
	 * mailto: is deliberately not treated as leaving. handleEmailCopy() calls
	 * preventDefault() and copies the address to the clipboard, so that link keeps
	 * the visitor exactly where they were.
	 */
	private leavesSite(element: HTMLElement): boolean {
		if (element.getAttribute("target") === "_blank") return true;
		const href = element.getAttribute("href");
		return !!href && HANDOFF_SCHEMES.some((scheme) => href.startsWith(scheme));
	}
}

export const sound = new SoundState();
