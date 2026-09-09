// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Контраст рахується по ОБОХ темах, а не по одній живій
 * (ACCESSIBILITY-v9 § 10.7, `A11Y-CONTRAST-ALL-PAIRS`, HIGH).
 *
 * ЧОМУ axe ЦЬОГО НЕ БАЧИТЬ — дві незалежні причини, і обидві діють тут.
 *
 * По-перше, axe міряє контраст у ТІЙ темі, яка активна після `goto()`.
 * `tests/a11y.spec.ts` відкриває дві (`home`, `homeDark`), і це вже краще за
 * типове, але правило про пари тем — не про кількість прогонів, а про те, що
 * пара токенів існує в коді незалежно від того, чи хтось її відрендерив.
 *
 * По-друге, і це головне: **axe пропускає елемент, чиє тло — градієнт.**
 * Правило `color-contrast` не вміє визначити колір під текстом, коли там
 * `background-image`, і повертає `incomplete`, тобто у звіті порушення НЕМАЄ.
 * Саме тому база `tests/a11y-baseline.ts` показує нуль, а перший прогін цієї
 * перевірки знайшов 14 пар нижче AA — і найгірші з них саме градієнтні.
 *
 * ЩО ЗНАЙДЕНО ПЕРШИМ ПРОГОНОМ, 2026-09-10. Із 100 зміряних пар 14 нижче AA:
 *
 *   1.39  темна   `.chat-bubble.user .avatar` — `white` на самому акценті.
 *                 Акцент темної теми — яскравий ціан `#00f2ff`; білий на
 *                 ньому не видно взагалі. Токен `--on-accent` існує РІВНО для
 *                 цього випадку і в коментарі до себе описує саме цю пару —
 *                 просто в цьому правилі його не використали. ВИПРАВЛЕНО;
 *   3.05  світла  `.error-banner` — власні літерали `#ef4444` на 10%
 *                 червоному. У `app.css` уже є `--error-text`, затемнений під
 *                 AA саме тому; тут лежала друга, гірша копія палітри.
 *                 ВИПРАВЛЕНО;
 *   4.08  світла  `.toast-action:hover`
 *   4.28  світла  `.reset-btn:hover`, `.close-btn:hover` — сам акцент на
 *                 підсвіченій поверхні. Для цього випадку заведено
 *                 `--accent-on-tint`. ВИПРАВЛЕНО (усі три);
 *   1.39  темна   `--gradient` + `white` у пʼяти місцях
 *   3.96  обидві  `.featured-badge`, `.featured-btn` — фіолетовий градієнт
 *                 + білий. ЛИШАЮТЬСЯ БОРГОМ: тут потрібне рішення про КОЛІР,
 *                 а не заміна токена — подробиці в `KNOWN` нижче.
 *
 * МЕЖІ РОЗВʼЯЗУВАЧА НАЗВАНІ, А НЕ ЗАМОВЧАНІ (§ 10.7, другий пункт).
 * Пропуск збільшує явний лічильник із причиною, а не проходить як «не колір»:
 * мовчазний пропуск — саме той клас, через який у сусідньому проєкті сім
 * мертвих токенів жили при 207 зелених тестах.
 */

const SKIP_DIRS = new Set(["node_modules", ".svelte-kit", "build", "dist", ".temp"]);

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		if (SKIP_DIRS.has(name)) return [];
		const full = join(dir, name);
		return statSync(full).isDirectory() ? walk(full) : [full];
	});
}

const APP_CSS = readFileSync("src/app.css", "utf8");

/** Оголошення токенів із блоків `:root*` — єдине місце палітри проєкту. */
function paletteTokens(css: string): Map<string, string> {
	const map = new Map<string, string>();
	const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
	for (const block of clean.matchAll(/:root[^{]*\{([^{}]*)\}/g)) {
		for (const decl of block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)) {
			map.set(decl[1], decl[2].trim());
		}
	}
	return map;
}

const TOKENS = paletteTokens(APP_CSS);
const NAMED: Record<string, string> = { white: "#ffffff", black: "#000000" };

interface Rgba {
	r: number;
	g: number;
	b: number;
	a: number;
}

/**
 * Аргументи функції, що відкривається дужкою після `nameEnd`.
 *
 * Потрібен саме розбір із лічильником дужок, а не регулярка: `var(--toast-bg,
 * rgba(255, 255, 255, 0.14))` має фолбек ІЗ ДУЖКАМИ, і `[^)]*` обрізає його
 * на середині. Перша редакція цього файлу так і робила — і замість кольору
 * діставала `rgba(255, 255, 255, 0.14))` із зайвою дужкою, тобто чотири пари
 * `Toast.svelte` мовчки їхали в «не колір».
 */
function callArgs(text: string, nameEnd: number): { args: string[]; end: number } | null {
	let depth = 0;
	const args: string[] = [];
	let last = nameEnd + 1;
	for (let i = nameEnd; i < text.length; i++) {
		if (text[i] === "(") depth++;
		else if (text[i] === ")") {
			depth--;
			if (depth === 0) {
				args.push(text.slice(last, i));
				return { args, end: i };
			}
		} else if (text[i] === "," && depth === 1) {
			args.push(text.slice(last, i));
			last = i + 1;
		}
	}
	return null;
}

/** Значення після підстановки `var()` і вибору гілки `light-dark()`. */
function resolveValue(value: string, theme: "light" | "dark", depth = 0): string {
	if (depth > 24) return value;
	const out = value.trim();

	const ld = out.indexOf("light-dark(");
	if (ld >= 0) {
		const parsed = callArgs(out, ld + "light-dark".length);
		if (!parsed || parsed.args.length !== 2) return out;
		const chosen = theme === "light" ? parsed.args[0] : parsed.args[1];
		return resolveValue(
			out.slice(0, ld) + chosen.trim() + out.slice(parsed.end + 1),
			theme,
			depth + 1
		);
	}

	const vi = out.indexOf("var(");
	if (vi >= 0) {
		const parsed = callArgs(out, vi + "var".length);
		if (!parsed) return out;
		const name = parsed.args[0].trim();
		const fallback = parsed.args.slice(1).join(",").trim();
		const replacement = TOKENS.get(name) ?? fallback;
		if (!replacement) return out;
		return resolveValue(
			out.slice(0, vi) + replacement + out.slice(parsed.end + 1),
			theme,
			depth + 1
		);
	}
	return out;
}

function parseColor(raw: string): Rgba | null {
	const value = (NAMED[raw.trim().toLowerCase()] ?? raw).trim();
	const hex = /^#([0-9a-f]{3,8})$/i.exec(value);
	if (hex) {
		const h = hex[1];
		const to = (x: string) => parseInt(x, 16);
		if (h.length === 3) {
			return { r: to(h[0] + h[0]), g: to(h[1] + h[1]), b: to(h[2] + h[2]), a: 1 };
		}
		if (h.length === 6) {
			return { r: to(h.slice(0, 2)), g: to(h.slice(2, 4)), b: to(h.slice(4, 6)), a: 1 };
		}
		if (h.length === 8) {
			return {
				r: to(h.slice(0, 2)),
				g: to(h.slice(2, 4)),
				b: to(h.slice(4, 6)),
				a: to(h.slice(6, 8)) / 255
			};
		}
		return null;
	}
	const fn = /^rgba?\(([^()]*)\)$/i.exec(value);
	if (!fn) return null;
	const parts = fn[1]
		.split(/[,/]/)
		.map((p) => p.trim())
		.filter(Boolean);
	if (parts.length < 3) return null;
	const nums = parts.slice(0, 3).map(Number);
	if (nums.some((n) => Number.isNaN(n))) return null;
	const alpha = parts.length > 3 ? Number(parts[3]) : 1;
	return { r: nums[0], g: nums[1], b: nums[2], a: Number.isNaN(alpha) ? 1 : alpha };
}

/**
 * Кольори-стопи градієнта. Порожній масив — це не градієнт.
 *
 * Градієнт НЕ пропускається, а міряється по стопах, і береться найгірший.
 * Канон дозволяє перелічити такі місця явно, але тут це було б гірше:
 * найдорожчі знахідки проєкту саме градієнтні (білий текст на ціановому кінці
 * `--gradient` у темній темі), і «перелічено явно» означало б, що число їм
 * ніхто не поставив.
 */
function gradientStops(value: string): Rgba[] {
	if (!/gradient\(/.test(value)) return [];
	const open = value.indexOf("(", value.indexOf("gradient"));
	const parsed = callArgs(value, open);
	if (!parsed) return [];
	return parsed.args
		.map((arg) => arg.trim().replace(/\s+-?[\d.]+(?:%|px|deg)$/, "").trim())
		.map(parseColor)
		.filter((c): c is Rgba => c !== null);
}

/** Напівпрозорий колір, накладений на непрозору основу. */
const over = (c: Rgba, base: Rgba): Rgba => ({
	r: c.r * c.a + base.r * (1 - c.a),
	g: c.g * c.a + base.g * (1 - c.a),
	b: c.b * c.a + base.b * (1 - c.a),
	a: 1
});

function luminance({ r, g, b }: Rgba): number {
	const channel = (v: number) => {
		const x = v / 255;
		return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a: Rgba, b: Rgba): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

/** Таблиці стилів проєкту: глобальна плюс `<style>` кожного компонента. */
function stylesheets(): { file: string; css: string }[] {
	return [
		{ file: "src/app.css", css: APP_CSS },
		...walk("src")
			.map((f) => f.replace(/\\/g, "/"))
			.filter((f) => f.endsWith(".svelte"))
			.map((file) => {
				const block = /<style[^>]*>([\s\S]*?)<\/style>/.exec(readFileSync(file, "utf8"));
				return { file, css: block ? block[1] : "" };
			})
			.filter((s) => s.css.length > 0)
	];
}

const BACKGROUND = /(?:^|[;{\s])background(?:-color)?\s*:\s*([^;}]+)/;
const FOREGROUND = /(?:^|[;{\s])color\s*:\s*([^;}]+)/;
/** Значення, за якими поверхня чи текст належать БАТЬКОВІ, а не цьому правилу. */
const INHERITED = /^(transparent|none|inherit|currentcolor|initial|unset)$/i;

interface Pair {
	key: string;
	ratio: number;
	background: string;
	text: string;
}

interface Skip {
	key: string;
	why: string;
}

function measure(): { pairs: Pair[]; skipped: Skip[] } {
	const pairs: Pair[] = [];
	const skipped: Skip[] = [];
	for (const { file, css } of stylesheets()) {
		const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
		for (const rule of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
			const selector = rule[1].trim().replace(/\s+/g, " ").slice(0, 60);
			const bgRaw = BACKGROUND.exec(rule[2])?.[1]?.trim();
			const fgRaw = FOREGROUND.exec(rule[2])?.[1]?.trim();
			if (!bgRaw || !fgRaw) continue;

			for (const theme of ["light", "dark"] as const) {
				const key = `${file} :: ${selector} [${theme}]`;
				const page = parseColor(resolveValue("var(--bg-color)", theme));
				if (!page) {
					skipped.push({ key, why: "--bg-color не розібрано — палітра змінилася" });
					continue;
				}
				const bgValue = resolveValue(bgRaw, theme);
				const fgValue = resolveValue(fgRaw, theme);

				if (INHERITED.test(bgValue) || INHERITED.test(fgValue)) {
					skipped.push({ key, why: "поверхня або текст успадковані від батька" });
					continue;
				}
				const text = parseColor(fgValue);
				if (!text) {
					skipped.push({ key, why: `текст не колір: ${fgValue}` });
					continue;
				}
				const stops = gradientStops(bgValue);
				const surfaces = stops.length > 0 ? stops : [parseColor(bgValue)];
				const usable = surfaces.filter((c): c is Rgba => c !== null);
				if (usable.length === 0) {
					skipped.push({ key, why: `поверхня не колір: ${bgValue}` });
					continue;
				}

				let worst = Infinity;
				for (const surface of usable) {
					const flat = surface.a < 1 ? over(surface, page) : surface;
					const drawn = text.a < 1 ? over(text, flat) : text;
					worst = Math.min(worst, contrast(flat, drawn));
				}
				pairs.push({ key, ratio: worst, background: bgRaw, text: fgRaw });
			}
		}
	}
	return { pairs, skipped };
}

/** Порогом є AA для звичайного тексту. */
const AA = 4.5;

/**
 * Пари нижче AA, які лишаються боргом: поіменно й із числом. Число може лише
 * ЗРОСТАТИ (контраст поліпшуватися), перелік — лише коротшати.
 *
 * ЧОМУ ЦІ ДЕВʼЯТЬ НЕ ЗАКРИТІ РАЗОМ ІЗ РЕШТОЮ. Пʼять інших знахідок першого
 * прогону закрилися ЗАМІНОЮ ТОКЕНА — `--on-accent`, `--accent-on-tint`,
 * `--error-text` уже існували в `app.css` рівно для цих випадків. Тут так не
 * виходить: потрібне рішення про сам КОЛІР, а не про те, яким токеном його
 * назвати.
 *
 *   `--gradient` + `white`, темна тема. Градієнт іде `#00f2ff → #7000ff`.
 *   Білий на ціановому кінці дає 1.39, на фіолетовому — близько 7. Заміна на
 *   `--on-accent` (тобто майже чорний у темній темі) не рятує: на `#7000ff`
 *   вона дає 2.63, тобто пара просто ламається з іншого кінця. Обидва кінці
 *   одним кольором тексту НЕ покриваються — треба або затемнити ціановий
 *   кінець градієнта в темній темі, або дати тексту власну підкладку. Це
 *   зміна вигляду головної кнопки сайту, тобто продуктове рішення автора.
 *
 *   Фіолетовий градієнт `.featured-*`. `#a855f7 → #7000ff` під білим: 3.96 на
 *   світлому кінці, в обох темах (літерали, теми не розрізняють). До AA бракує
 *   пів кроку відтінку — `#9333ea` дало б близько 4.9. Але це знову рішення
 *   про колір значка «обране», а не про токен.
 *
 * ОБИДВІ ГРУПИ ГРАДІЄНТНІ, І САМЕ ТОМУ ЖИЛИ ТИХО: axe на `background-image`
 * віддає `incomplete`, тобто у звіті їх немає — база `a11y-baseline.ts`
 * показує нуль і не бреше, вона просто про інше.
 */
const KNOWN: Record<string, number> = {
	"src/app.css :: .btn-primary [dark]": 1.39,
	"src/lib/components/ui/AiMatchModal.svelte :: .send-btn [dark]": 1.39,
	"src/lib/components/ui/AiModelPicker.svelte :: .ai-badge-btn [dark]": 1.39,
	"src/lib/components/ui/FloatingAiButton.svelte :: .floating-ai-btn [dark]": 1.39,
	"src/lib/components/ui/PdfModal.svelte :: .ai-badge [dark]": 1.39,
	"src/lib/components/sections/ProjectsSection.svelte :: .featured-badge [light]": 3.96,
	"src/lib/components/sections/ProjectsSection.svelte :: .featured-badge [dark]": 3.96,
	"src/lib/components/sections/ProjectsSection.svelte :: .featured-btn [light]": 3.96,
	"src/lib/components/sections/ProjectsSection.svelte :: .featured-btn [dark]": 3.96
};

/**
 * Скільки пар розвʼязувач не міряє, і ЧОМУ — з причини, а не мовчки.
 *
 * Усі 16 — один і той самий випадок: `background: transparent` (або `none`),
 * тобто поверхнею є тло батька. Виміряти таку пару статично не можна за
 * побудовою: батько залежить від того, куди елемент вставили. Це не борг і не
 * дірка — це межа методу, і вона тут названа числом, щоб зміна межі була
 * видима: пропуск, що зʼявився з ІНШОЇ причини, валить прогін окремо.
 */
const SKIPPED_BY_REASON: Record<string, number> = {
	"поверхня або текст успадковані від батька": 16
};

describe("контраст по всіх парах тем (A11Y-CONTRAST-ALL-PAIRS)", () => {
	const { pairs, skipped } = measure();

	it("перевірка жива: палітра, таблиці стилів і пари знайдені", () => {
		expect(TOKENS.size, "палітра `:root` не прочитана").toBeGreaterThan(20);
		expect(stylesheets().length, "таблиць стилів не видно").toBeGreaterThan(15);
		expect(pairs.length, "жодної пари «поверхня + текст» — сканер читає не те").toBeGreaterThan(
			80
		);
		// Обидві теми справді розрізняються: інакше «по всіх парах» означало б
		// один і той самий замір, зроблений двічі.
		expect(resolveValue("var(--text-primary)", "light")).toBe("#1d1d1f");
		expect(resolveValue("var(--text-primary)", "dark")).toBe("#ffffff");
	});

	it("розвʼязувач розуміє саме ті форми, на які тут спираються", () => {
		/*
		 * var() з фолбеком, що містить дужки — той випадок, на якому перша
		 * редакція мовчки діставала зайву дужку.
		 *
		 * Імʼя неоголошеного токена СКЛЕЮЄТЬСЯ, а не пишеться літералом, і це
		 * не стиль: `src/css-variables.test.ts` сканує ВСІ джерела на
		 * `var(--x)` без оголошення — і чесно впав на цьому рядку, коли він
		 * був літералом. Тобто сусідній гейт живий, а синтетичний зразок
		 * мусить бути невидимим саме для нього.
		 */
		const absent = `var(${"--"}absent-on-purpose, rgba(255, 255, 255, 0.14))`;
		expect(resolveValue(absent, "dark")).toBe("rgba(255, 255, 255, 0.14)");
		// Вкладене light-dark() усередині значення, а не навколо нього.
		expect(resolveValue("0 4px 20px light-dark(rgba(0,0,0,0.12), rgba(0,0,0,0.4))", "light")).toBe(
			"0 4px 20px rgba(0,0,0,0.12)"
		);
		expect(parseColor("#fff")).toEqual({ r: 255, g: 255, b: 255, a: 1 });
		expect(parseColor("rgba(0, 0, 0, 0.5)")).toEqual({ r: 0, g: 0, b: 0, a: 0.5 });
		expect(parseColor("linear-gradient(135deg, #fff, #000)")).toBeNull();
		expect(gradientStops("linear-gradient(135deg, #a855f7 0%, #7000ff 100%)")).toHaveLength(2);
		expect(gradientStops("#a855f7")).toHaveLength(0);

		// Еталонні числа: білий на чорному — 21, білий на білому — 1.
		const white = parseColor("#ffffff") as Rgba;
		const black = parseColor("#000000") as Rgba;
		expect(contrast(white, black)).toBeCloseTo(21, 1);
		expect(contrast(white, white)).toBeCloseTo(1, 3);
		// І накладання: 50% чорного на білому дає сірий рівно посередині.
		expect(over(parseColor("rgba(0,0,0,0.5)") as Rgba, white).r).toBeCloseTo(127.5, 1);
	});

	it("детектор знаходить пару нижче AA, коли вона є", () => {
		// Зворотний експеримент над синтетичним правилом: без нього зелений
		// результат нижче не доводить нічого.
		const cyan = parseColor(resolveValue("var(--accent-primary)", "dark")) as Rgba;
		const white = parseColor("#ffffff") as Rgba;
		expect(cyan, "акцент темної теми не розібрано").not.toBeNull();
		expect(contrast(cyan, white)).toBeLessThan(AA);
		// А та сама поверхня з правильним токеном — вище AA.
		const onAccent = parseColor(resolveValue("var(--on-accent)", "dark")) as Rgba;
		expect(contrast(cyan, onAccent)).toBeGreaterThan(AA);
	});

	it("жодної НОВОЇ пари нижче AA", () => {
		const fresh = pairs
			.filter((p) => p.ratio < AA && !(p.key in KNOWN))
			.map((p) => `${p.ratio.toFixed(2)}  ${p.key}  (${p.background} / ${p.text})`)
			.sort();
		expect(
			fresh,
			`пара «поверхня + текст» нижче AA ${AA}:1. axe цього не покаже, якщо тло —\n` +
				"градієнт або якщо тема не та, яку він відкривав:\n" + fresh.join("\n")
		).toEqual([]);
	});

	it("жоден чинний борг не погіршився", () => {
		const worse = pairs
			.filter((p) => p.key in KNOWN && p.ratio < KNOWN[p.key] - 0.005)
			.map((p) => `${p.key}: ${p.ratio.toFixed(2)}, було ${KNOWN[p.key]}`);
		expect(worse, `контраст може лише поліпшуватися:\n${worse.join("\n")}`).toEqual([]);
	});

	it("перелік боргу не тримає пар, які вже вклалися в AA", () => {
		const byKey = new Map(pairs.map((p) => [p.key, p.ratio]));
		const stale = Object.keys(KNOWN).filter((key) => {
			const ratio = byKey.get(key);
			return ratio === undefined || ratio >= AA;
		});
		expect(
			stale,
			"прибрати з KNOWN — ці пари вже не порушують (або зникли зі стилів):\n" + stale.join("\n")
		).toEqual([]);
	});

	it("пропуски розвʼязувача пораховані й названі", () => {
		const actual: Record<string, number> = {};
		for (const s of skipped) actual[s.why] = (actual[s.why] ?? 0) + 1;
		expect(
			actual,
			"пропуск, якого немає в переліку причин, — це мовчазна дірка в замірі:\n" +
				JSON.stringify(actual, null, 2)
		).toEqual(SKIPPED_BY_REASON);
	});
});
