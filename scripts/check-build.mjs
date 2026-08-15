/**
 * Перевірка ЗІБРАНОГО сайту (SEO-v8 § 6.1, SVELTEKIT-DATA-v8 § 6.1).
 *
 * Усе тут читає `build/`, а не `src/`, і саме в цьому сенс. Клас дефектів,
 * який ловить цей файл, у коді не видно взагалі:
 *
 *  - prerender виконує сторінки послідовно в одному процесі, тому модульний
 *    синглтон переносить значення попередньої сторінки — і /uk/ виїжджає
 *    англійською. Код при цьому правильний;
 *  - під час prerender `page.url.origin` дорівнює `http://sveltekit-prerender`,
 *    і цей неіснуючий хост потрапляє в canonical та og:image;
 *  - `base` з `$app/paths` відносний, тож склеєний з абсолютним origin дає
 *    `https://host./images/...`;
 *  - сторінка може опинитися в індексі з порожнім `<body>`.
 *
 * Запускається після `npm run build`. Вихід ≠ 0 — це помилка збірки.
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const BUILD = "build";
const SITE_ORIGIN = "https://alik532ua.github.io";
const BASE = "/CV";

/** Мови, які мають бути в індексі. Має збігатися з INDEXED_LANGUAGES. */
const INDEXED = ["en", "en-us", "uk", "ja"];

/** Мінімум видимого тексту на сторінці. Порожнє тіло — це § 1.1. */
const MIN_BODY_TEXT = 200;

/**
 * Якорі секцій, на які веде бокове меню, — і саме той інваріант, якого тут
 * бракувало.
 *
 * `MIN_BODY_TEXT` міряє тіло сторінки цілком, тому одна Hero-секція його
 * задовольняла з запасом. Тим часом решта п'яти були обгорнуті в
 * `{#await import(...)}`, під час prerender віддавали порожню pending-гілку, і
 * в кожній із 44 сторінок їх не було зовсім (SVELTEKIT-DATA-v8 § 2.5).
 * Перевірка «тіло не порожнє» на це не реагує ніяк — потрібен перелік того, що
 * саме має бути.
 *
 * Список звіряється з `navItems` у SidebarNav.svelte: меню посилається на
 * `#id`, тож відсутній якір — це ще й посилання в нікуди.
 */
const SECTION_IDS = ["about", "experience", "skills", "projects", "education", "other"];

const problems = [];
const fail = (msg) => problems.push(msg);

if (!existsSync(BUILD)) {
	console.error(`Немає каталогу ${BUILD}/ — спершу \`npm run build\`.`);
	process.exit(1);
}

function htmlFiles(dir, out = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) htmlFiles(full, out);
		else if (entry.endsWith(".html")) out.push(full.replace(/\\/g, "/"));
	}
	return out;
}

const files = htmlFiles(BUILD);

// Перевірка, яка захищає решту перевірок: порожній список дав би «проблем
// немає» на зламаній збірці (AI-AGENT-PITFALLS-v8 § 1).
if (files.length < 40) {
	console.error(`Знайдено лише ${files.length} HTML — перевірка мертва, очікується 43+.`);
	process.exit(1);
}

for (const file of files) {
	const html = readFileSync(file, "utf8");

	// 404.html — це оболонка SPA для GitHub Pages: вона свідомо порожня й не
	// має canonical. Решта правил до неї застосовні.
	const isShell = file.endsWith("/404.html");

	// § 1.1 — сторінка в індексі з порожнім тілом
	if (!isShell) {
		const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? "";
		const text = body
			.replace(/<script[\s\S]*?<\/script>/g, "")
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
		if (text.length < MIN_BODY_TEXT) {
			fail(`${file}: видимого тексту ${text.length} символів (мінімум ${MIN_BODY_TEXT})`);
		}

		// § 1.1 (продовження) — тіло не порожнє, але без основного вмісту
		const missingSections = SECTION_IDS.filter((id) => !html.includes(`id="${id}"`));
		if (missingSections.length > 0) {
			fail(`${file}: у prerender немає секцій — ${missingSections.join(", ")}`);
		}
	}

	// § 1.2 — плейсхолдер prerender просочився в адреси
	if (html.includes("sveltekit-prerender")) {
		fail(`${file}: у розмітці лишився sveltekit-prerender`);
	}

	// § 1.3 — абсолютний URL, склеєний із відносним base
	for (const m of html.matchAll(/https?:\/\/[^"'\s]*\.\/[^"'\s]*/g)) {
		fail(`${file}: зламаний абсолютний URL — ${m[0].slice(0, 80)}`);
	}

	// § 2.1 — рівно одна canonical
	if (!isShell) {
		const canonicals = html.match(/<link[^>]+rel="canonical"[^>]*>/g) ?? [];
		if (canonicals.length !== 1) {
			fail(`${file}: canonical знайдено ${canonicals.length} разів, очікується 1`);
		} else {
			const href = canonicals[0].match(/href="([^"]+)"/)?.[1] ?? "";
			if (!href.startsWith(`${SITE_ORIGIN}${BASE}/`)) {
				fail(`${file}: canonical не з цього сайту — ${href}`);
			}
			// § 2.4 — trailingSlash: 'always'
			if (!href.endsWith("/")) {
				fail(`${file}: canonical без завершального слеша — ${href}`);
			}
		}
	}
}

// SVELTEKIT-DATA § 6.1 — згенеровано те, що очікували
if (!existsSync(join(BUILD, "index.html"))) {
	fail("немає build/index.html — головна сторінка не згенерована");
}
for (const lang of INDEXED) {
	if (!existsSync(join(BUILD, lang, "index.html"))) {
		fail(`немає build/${lang}/index.html — мова в індексі без власної сторінки`);
	}
}

// § 1.4 — мова сторінки має відповідати каталогу, у якому вона лежить.
// Саме тут видно зсув від модульного синглтона: /uk/ англійською, /ja/
// українською. У коді цього не побачити ніколи.
for (const lang of INDEXED) {
	const file = join(BUILD, lang, "index.html").replace(/\\/g, "/");
	if (!existsSync(file)) continue;
	const html = readFileSync(file, "utf8");
	const declared = html.match(/<html[^>]+lang="([^"]+)"/)?.[1]?.toLowerCase() ?? "";
	if (declared !== lang.toLowerCase()) {
		fail(`${file}: <html lang="${declared}">, а каталог — /${lang}/ (зсув мов під час prerender)`);
	}
}

// I18N-v8 § 6 — мова, яка пишеться справа наліво, має це оголосити.
//
// Іврит був у списку мов від початку, а `dir="rtl"` у проєкті не існував ніде:
// /he/ рендерився зліва направо. Симптом видно лише тому, хто читає івритом,
// тому перевірка тут, а не «подивимося перед релізом».
{
	const rtlPages = { he: "rtl" };
	for (const [lang, expected] of Object.entries(rtlPages)) {
		const file = join(BUILD, lang, "index.html").replace(/\\/g, "/");
		if (!existsSync(file)) {
			fail(`немає build/${lang}/index.html — сторінка RTL-мови не згенерована`);
			continue;
		}
		const dir = readFileSync(file, "utf8").match(/<html[^>]+dir="([^"]+)"/)?.[1] ?? "";
		if (dir !== expected) {
			fail(`${file}: <html dir="${dir}">, очікується "${expected}"`);
		}
	}

	// Зворотний бік того самого: LTR-сторінка не має роз'їхатися в rtl.
	const home = readFileSync(join(BUILD, "index.html"), "utf8");
	const homeDir = home.match(/<html[^>]+dir="([^"]+)"/)?.[1] ?? "";
	if (homeDir !== "ltr") {
		fail(`build/index.html: <html dir="${homeDir}">, очікується "ltr"`);
	}
}

// Секретів у бандлі бути не може: усе з нього видно у DevTools.
for (const file of htmlFiles(BUILD).concat(
	existsSync(join(BUILD, "_app")) ? htmlFiles(join(BUILD, "_app")) : []
)) {
	const text = readFileSync(file, "utf8");
	for (const m of text.matchAll(/(GEMINI|GROQ|CLOUDFLARE|OPENAI)_API_KEY\s*[:=]\s*["'][^"']{8,}/g)) {
		fail(`${file}: схоже на ключ у бандлі — ${m[0].slice(0, 40)}`);
	}
}

if (problems.length > 0) {
	console.error(`\nПеревірка збірки не пройдена — ${problems.length} проблем:\n`);
	for (const p of problems) console.error(`  • ${p}`);
	process.exit(1);
}

console.log(`Збірка перевірена: ${files.length} HTML, проблем немає.`);
