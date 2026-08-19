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
import { createHash } from "node:crypto";
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

function allFiles(dir, out = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) allFiles(full, out);
		else out.push(full.replace(/\\/g, "/"));
	}
	return out;
}

/** Усе, що читається як текст. Решта (jpg, png, mp3, pdf) не сканується. */
const TEXT_ASSET = /\.(html|js|mjs|cjs|json|css|map|txt|xml|webmanifest)$/i;

const everything = allFiles(BUILD);
const files = everything.filter((f) => f.endsWith(".html"));
const textAssets = everything.filter((f) => TEXT_ASSET.test(f));

// Перевірка, яка захищає решту перевірок: порожній список дав би «проблем
// немає» на зламаній збірці (AI-AGENT-PITFALLS-v8 § 1).
if (files.length < 41) {
	console.error(`Знайдено лише ${files.length} HTML — перевірка мертва, очікується 44+.`);
	process.exit(1);
}

for (const file of files) {
	const html = readFileSync(file, "utf8");

	// 404.html — це оболонка SPA для GitHub Pages: вона свідомо порожня й не
	// має canonical. Решта правил до неї застосовні.
	const isShell = file.endsWith("/404.html");

	/*
	 * Службова сторінка перевіряється НАВПАКИ (BETA-CHECKLIST-v8 § 5.5).
	 *
	 * Прирівняти її до 404-оболонки було б дешевше на два рядки й неправильно:
	 * разом із canonical вона перестала б перевірятися на порожнє тіло й на
	 * <title>, і найслабше покритою стала б саме та сторінка, якою користуються
	 * тестувальники. Тому вона лишається в загальному потоці, і лише вимоги до
	 * неї дзеркальні: noindex Є, canonical і hreflang НЕМАЄ.
	 */
	const isHidden = file === `${BUILD}/beta-test-checklists/index.html`;

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

		// § 1.1 (продовження) — тіло не порожнє, але без основного вмісту.
		// Службова сторінка секцій резюме не має й мати не мусить.
		const missingSections = isHidden ? [] : SECTION_IDS.filter((id) => !html.includes(`id="${id}"`));
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

	/*
	 * SECURITY-v8 § 6.3 — політика покриває КОЖЕН інлайн-скрипт цієї сторінки.
	 *
	 * Перевіряється на артефакті, а не на джерелі, бо саме тут живе дефект:
	 * у dev SvelteKit віддає політику ЗАГОЛОВКОМ із nonce, і будь-який скрипт
	 * виконується; у збірці лишається `<meta>`, де працюють тільки хеші.
	 * Скрипт, чийого хеша немає, блокується мовчки — сторінка просто їде без
	 * теми, і жодного рядка в консолі розробника, який дивиться на dev.
	 *
	 * Береться КОЖЕН `<script>` без атрибутів: їх на сторінці два — скрипт
	 * першого кадру з app.html і завантажувач самого SvelteKit, і другий
	 * ловить те, чого не бачить перший (наприклад режим csp, збитий на nonce).
	 * Атрибут SvelteKit пише малими літерами — звідси прапорець `i`.
	 */
	{
		const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)"/i)?.[1];
		const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
		if (inline.length === 0) {
			fail(`${file}: жодного інлайн-скрипта — перевірка CSP мертва, шаблон змінився?`);
		} else if (!csp) {
			fail(`${file}: інлайн-скрипти є, а <meta> з політикою немає — csp.mode зламався`);
		} else {
			for (const [, source] of inline) {
				const hash = `sha256-${createHash("sha256").update(source).digest("base64")}`;
				if (!csp.includes(hash)) {
					fail(`${file}: інлайн-скрипт (${source.length} символів) не покритий CSP — ${hash}`);
				}
			}
		}
	}

	/*
	 * BETA-HIDDEN-PAGE (BETA-CHECKLIST-v8 § 5.5) — обіцянка перевіряється з
	 * ОБОХ боків, і кожен мусить червоніти окремо.
	 *
	 * Зворотний експеримент, який тут уже прогнано: прибрати `noindex` із
	 * зібраного HTML — код 1; дописати canonical — теж 1. І пильно: заміна в
	 * HTML, яка нічого не знайшла, дає зелений прогін, що виглядає як доказ,
	 * тому обидві підміни робилися по рядку, скопійованому з самого файлу.
	 */
	if (isHidden) {
		if (!/<meta name="robots" content="noindex/.test(html)) {
			fail(`${file}: службова сторінка без noindex — вона піде в індекс`);
		}
		if (/rel="canonical"/.test(html)) {
			fail(`${file}: службова сторінка з canonical — вона потрапить і в sitemap`);
		}
		if (/rel="alternate" hreflang/.test(html)) {
			fail(`${file}: службова сторінка з hreflang — вона запрошує кравлера`);
		}
		if (!/<title>[^<]{5,}<\/title>/.test(html)) {
			fail(`${file}: службова сторінка без title`);
		}
		// BETA-ASCII-SLUG: кириличний гомогліф у назві маршруту дає адресу, яка
		// виглядає правильною й не працює.
		if (/[^\x00-\x7F]/.test(file)) {
			fail(`${file}: у шляху службової сторінки є не-ASCII символ`);
		}
		const sitemap = readFileSync(join(BUILD, "sitemap.xml"), "utf8");
		if (sitemap.includes("beta-test-checklists")) {
			fail("sitemap.xml: службова сторінка в sitemap");
		}
		const robots = readFileSync(join(BUILD, "robots.txt"), "utf8");
		if (!robots.includes("Disallow: /CV/beta-test-checklists/")) {
			fail("robots.txt: немає Disallow для службової сторінки");
		}
	}

	// § 2.1 — рівно одна canonical
	if (!isShell && !isHidden) {
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

/*
 * Службова сторінка мусить ІСНУВАТИ, і це найважливіший з її чотирьох чеків.
 *
 * Усі дзеркальні перевірки вище живуть усередині `if (isHidden)`. Якщо сторінка
 * зникне — прибрали маршрут, зламався prerender, — блок не виконається жодного
 * разу, і гейт звітуватиме «проблем немає» про сторінку, якої не існує. Рівно
 * той хибний зелений, від якого застерігає § 5.5.
 */
if (!existsSync(join(BUILD, "beta-test-checklists", "index.html"))) {
	fail("немає build/beta-test-checklists/index.html — сторінка чеклиста не згенерована");
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

/**
 * Секретів у бандлі бути не може: усе з нього видно у DevTools
 * (SECURITY-v8 § 16 «Секрети в бандлі [static]», AI-PROVIDERS-v8 § 9).
 *
 * ЩО ТУТ БУЛО НЕ ТАК. Сканувалися `htmlFiles(BUILD)` плюс
 * `htmlFiles(BUILD + '/_app')` — а в `_app/` немає ЖОДНОГО `.html`: там 21
 * файл `.js`. Другий доданок повертав порожній масив, перший уже входив у
 * перший, і сам бандл не перевіряв ніхто. Гейт звітував «проблем немає» про
 * файли, у яких ключ опинитися й не може: інлайнить його бандлер саме в `.js`.
 * Класичний зелений, що виглядає як доказ (AI-AGENT-PITFALLS-v8 § 1).
 *
 * ДРУГА ПОЛОВИНА — за чим саме шукати. Ім'я змінної (`GEMINI_API_KEY: "…"`)
 * у зібраному коді не переживає мініфікацію: `import.meta.env.PUBLIC_X`
 * підставляється як ГОЛИЙ рядковий літерал, і від імені не лишається нічого.
 * Тому головний детектор — форма самого ключа, як і приписує канон
 * (`grep -rlE '(AIza|gsk_|sk-|cfut_)' build/`). Ім'я змінної лишається другим
 * детектором: воно ловить ключ, вписаний у джерела руками.
 *
 * Зворотний експеримент (AI-AGENT-PITFALLS-v8 § 1.1): дописати в будь-який
 * файл `build/_app/immutable/chunks/*.js` рядок `"AIzaSy` + 33 символи — гейт
 * мусить назвати цей файл. Перевірено 2026-08-19: назвав.
 */
const SECRET_PATTERNS = [
	// Google AI (Gemini) — `GEMINI_API_KEY` у секретах воркера.
	[/(?<![A-Za-z0-9_-])AIza[A-Za-z0-9_-]{20,}/g, "ключ Google AI (AIza…)"],
	// Groq — `GROQ_API_KEY` там само.
	[/(?<![A-Za-z0-9_-])gsk_[A-Za-z0-9]{20,}/g, "ключ Groq (gsk_…)"],
	// OpenAI-сумісні: жоден із них зараз не в реєстрі, але `wire: "openai"`
	// існує, тож наступний провайдер прийде саме такої форми.
	[/(?<![A-Za-z0-9_-])sk-[A-Za-z0-9-]{20,}/g, "ключ OpenAI-сумісного API (sk-…)"],
	[/(?<![A-Za-z0-9_-])cfut_[A-Za-z0-9_-]{20,}/g, "токен Cloudflare (cfut_…)"],
	// Не про AI, але в бандлі статичного сайту їм місця немає так само.
	[/(?<![A-Za-z0-9_-])(?:ghp|gho|github_pat)_[A-Za-z0-9_]{20,}/g, "токен GitHub"],
	// Ім'я секрету з присвоєним значенням — ключ, вписаний у джерела руками.
	[/(GEMINI|GROQ|CLOUDFLARE|OPENAI)_API_KEY\s*[:=]\s*["'][^"']{8,}/g, "ім'я секрету зі значенням"]
];

// Перевірка, яка захищає перевірку: набір без жодного `.js` означає, що
// структура `build/` змінилася і сканувати нічого — саме той стан, у якому
// гейт мовчав досі.
const scannedJs = textAssets.filter((f) => f.endsWith(".js"));
if (scannedJs.length === 0) {
	console.error("У build/ немає жодного .js — сканувати бандл нічим, перевірка мертва.");
	process.exit(1);
}

for (const file of textAssets) {
	const text = readFileSync(file, "utf8");
	for (const [pattern, what] of SECRET_PATTERNS) {
		for (const m of text.matchAll(pattern)) {
			fail(`${file}: ${what} у бандлі — ${m[0].slice(0, 24)}…`);
		}
	}
}

if (problems.length > 0) {
	console.error(`\nПеревірка збірки не пройдена — ${problems.length} проблем:\n`);
	for (const p of problems) console.error(`  • ${p}`);
	process.exit(1);
}

console.log(
	`Збірка перевірена: ${files.length} HTML, ${textAssets.length} текстових файлів просканованих на секрети (з них ${scannedJs.length} JS), проблем немає.`
);
