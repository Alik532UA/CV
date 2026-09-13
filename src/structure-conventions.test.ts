// @vitest-environment node
import { describe, expect, it } from "vitest";
import { existsSync, globSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Структура й UI-конвенції (PROJECT-STRUCTURE-v8 § 8, SVELTE-UI-v8 § 4).
 *
 * Спільна риса всього, що тут перевіряється: жодне з цих порушень не робить
 * сайт зламаним. Осиротілий компонент збирається, `<slot>` компілюється з
 * попередженням, `svelte-ignore` без причини мовчить назавжди, а файл на 1066
 * рядків просто важко читати. Тому й потрібен інваріант: симптому немає, а
 * наслідок є — і платить за нього наступний, хто сюди прийде.
 */

const ROOT = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(ROOT, p), "utf8");
const rel = (p: string) => p.replace(/\\/g, "/");

const SOURCES = globSync("src/**/*.{ts,svelte}", { cwd: ROOT })
	.map(rel)
	.filter((p) => !/\.(test|spec)\.ts$/.test(p));

const COMPONENTS = SOURCES.filter((p) => p.endsWith(".svelte"));

/** Коментарі не рахуються: у них ці конструкції цитуються навмисно. */
const withoutComments = (source: string): string =>
	source
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/^\s*\/\/.*$/gm, "");

describe("перевірка жива", () => {
	it("бачить джерела й компоненти проєкту", () => {
		expect(SOURCES.length).toBeGreaterThan(100);
		expect(COMPONENTS.length).toBeGreaterThan(20);
	});
});

describe("PROJECT-STRUCTURE § 4.3 — існування ≠ досяжність", () => {
	/**
	 * Найдорожче правило файлу. Компонент, який існує і ніде не імпортований,
	 * читається як зроблена робота: його правлять, на нього посилаються в
	 * звітах, він не виконується. У канонічному прикладі це коштувало
	 * неправильно виставленої оцінки SEO цілому проєкту — `SEO.svelte` був
	 * написаний повністю й не підключений нікуди.
	 */
	/**
	 * ДОСЯЖНІСТЬ ГРАФОМ ІМПОРТІВ, А НЕ ЗГАДКА ІМЕНІ (`PS-REACHABILITY`, HIGH).
	 *
	 * Доти тут стояло «імʼя файлу трапляється в якомусь іншому джерелі», і ця
	 * форма пропускає рівно два випадки, які канон v9 називає окремо:
	 *
	 *   • ЗГАДКА В КОМЕНТАРІ. `theme.init()` у прозі JSDoc, `SEO.svelte` у
	 *     поясненні — і греп «знаходить» модуль, якого ніхто не імпортує.
	 *     Заміряно в сусідній перевірці цього ж комміт-ряду: закоментований
	 *     виклик лишав інваріант зеленим саме через таку згадку;
	 *   • ЛАНЦЮЖОК СИРІТ. `A.svelte` імпортує `B.svelte`, обидва недосяжні з
	 *     жодної точки входу — але кожен «десь згадується», тобто в іншому.
	 *
	 * Тепер будується справжній граф від точок входу SvelteKit: маршрути,
	 * гачки, матчери параметрів — і `worker/index.ts`, бо чотири модуля
	 * `src/lib/{config,services}` імпортує і сайт, і воркер (див.
	 * PROJECT-CONTEXT.md). Специфікатори `$lib/…`, відносні шляхи, `.js` у
	 * записі імпорту при `.ts` на диску, `index.ts` у теці й динамічний
	 * `import()` — усі розвʼязуються.
	 *
	 * `./$types` не розвʼязується навмисно: це віртуальний модуль, який
	 * генерує сам SvelteKit, і на диску його немає.
	 *
	 * Перший прогін цієї форми знайшов `src/lib/index.ts` — заглушку зі
	 * скафолда («place files you want to import through the `$lib` alias in
	 * this folder»), один рядок комментаря, нуль імпортів. Стара форма її не
	 * бачила, бо перевіряла лише `.svelte`.
	 */
	const ENTRY_POINTS = [
		...globSync("src/routes/**/+*.{ts,svelte}", { cwd: ROOT }).map(rel),
		...globSync("src/params/*.ts", { cwd: ROOT }).map(rel),
		...globSync("worker/*.ts", { cwd: ROOT }).map(rel),
		"src/hooks.client.ts",
		"src/hooks.server.ts"
	].filter((p) => existsSync(resolve(ROOT, p)));

	/** Специфікатор із `from "…"` або `import("…")`. */
	const SPECIFIER = /(?:from\s*|import\s*\(\s*)["']([^"']+)["']/g;

	/** Модуль, на який указує специфікатор; null — зовнішній або віртуальний. */
	function resolveSpecifier(spec: string, from: string): string | null {
		let base: string;
		if (spec === "$lib") base = "src/lib/index";
		else if (spec.startsWith("$lib/")) base = `src/lib/${spec.slice(5)}`;
		else if (spec.startsWith(".")) {
			const dir = from.slice(0, from.lastIndexOf("/"));
			const out: string[] = [];
			for (const part of `${dir}/${spec}`.split("/")) {
				if (part === "." || part === "") continue;
				if (part === "..") out.pop();
				else out.push(part);
			}
			base = out.join("/");
		} else return null;

		for (const candidate of [
			base,
			`${base}.ts`,
			`${base}.svelte`,
			`${base}.svelte.ts`,
			`${base}/index.ts`,
			base.replace(/\.js$/, ".ts")
		]) {
			if (GRAPH_FILES.includes(candidate)) return candidate;
		}
		return null;
	}

	/** Усе, що може бути вузлом графа: джерела плюс `.js` у `src/`. */
	const GRAPH_FILES = [
		...SOURCES,
		...globSync("src/**/*.js", { cwd: ROOT })
			.map(rel)
			.filter((p) => !/\.(test|spec)\.js$/.test(p)),
		...globSync("worker/*.ts", { cwd: ROOT }).map(rel)
	];

	function reachable(): Set<string> {
		const seen = new Set<string>();
		const queue = [...ENTRY_POINTS];
		while (queue.length > 0) {
			const file = queue.shift() as string;
			if (seen.has(file)) continue;
			seen.add(file);
			if (!existsSync(resolve(ROOT, file))) continue;
			for (const m of read(file).matchAll(SPECIFIER)) {
				const target = resolveSpecifier(m[1], file);
				if (target) queue.push(target);
			}
		}
		return seen;
	}

	it("точки входу знайдено, і граф із них справді розходиться", () => {
		expect(ENTRY_POINTS.length, "жодної точки входу — граф будувати нема з чого").toBeGreaterThan(
			5
		);
		const seen = reachable();
		// Граф мусить дотягтися ЗНАЧНО далі за самі точки входу, інакше
		// «недосяжних немає» означало б «розбір імпортів зламався».
		expect(
			seen.size,
			`граф дійшов лише до ${seen.size} файлів при ${ENTRY_POINTS.length} точках входу — ` +
				"розбір специфікаторів зламався"
		).toBeGreaterThan(ENTRY_POINTS.length * 5);
		// І доказ, що розвʼязувач розуміє саме ті форми, на які тут спираються.
		expect(resolveSpecifier("$lib/services/storage", "src/routes/+layout.svelte")).toBe(
			"src/lib/services/storage.ts"
		);
		expect(resolveSpecifier("$lib/config/site.js", "src/lib/i18n/routing.ts")).toBe(
			"src/lib/config/site.js"
		);
		expect(resolveSpecifier("./$types", "src/routes/+layout.ts")).toBeNull();
	});

	it("кожен модуль досяжний графом імпортів із точки входу", () => {
		const seen = reachable();
		const orphans = GRAPH_FILES.filter((f) => !seen.has(f) && !/\.d\.ts$/.test(f)).sort();
		expect(
			orphans,
			"модуль недосяжний із жодної точки входу — його ніхто не виконує. Це читається\n" +
				"як зроблена робота: файл правлять, на нього посилаються, він не працює.\n" +
				"Підключити там, де він потрібен, або видалити:\n" +
				orphans.join("\n")
		).toEqual([]);
	});

	/**
	 * § 5.2: розбіжність псевдоніма й імені файлу рве зв'язок
	 * «testid ↔ компонент ↔ файл». Проєкт уже платив за це один раз —
	 * `Sidebar`/`Header` замість `SidebarNav`/`HeaderSection`.
	 */
	it("локальний псевдонім імпорту збігається з іменем файлу (§ 5.2)", () => {
		const re = /import\s+([A-Z][A-Za-z0-9]*)\s+from\s+["'][^"']*\/([A-Z][A-Za-z0-9]*)\.svelte["']/g;
		const bad: string[] = [];
		for (const file of SOURCES) {
			for (const m of read(file).matchAll(re)) {
				if (m[1] !== m[2]) bad.push(`${file}: ${m[1]} -> ${m[2]}.svelte`);
			}
		}
		expect(bad, `розбіжність псевдоніма й файлу:\n${bad.join("\n")}`).toEqual([]);
	});

	/**
	 * CRITICAL у таблиці анти-патернів: компілятор не обробляє руни поза
	 * `.svelte` і `.svelte.ts`, тож `$state` у звичайному `.ts` — це мовчазна
	 * відсутність реактивності, а не помилка збірки.
	 */
	it("руни лише у .svelte та .svelte.ts", () => {
		const bad = SOURCES.filter(
			(f) => f.endsWith(".ts") && !f.endsWith(".svelte.ts")
		).filter((f) => /\$state[({<]|\$derived[({<.]|\$effect[({.]/.test(withoutComments(read(f))));
		expect(bad, `руни у звичайному .ts: ${bad.join(", ")}`).toEqual([]);
	});
});

describe("SVELTE-UI § 4 — застарілі API й непояснені винятки", () => {
	it("немає Svelte 4 API", () => {
		const bad = COMPONENTS.filter((f) =>
			/<slot[\s/>]|\son:[a-z]+=|<svelte:component/.test(withoutComments(read(f)))
		);
		expect(bad, `застарілі API: ${bad.join(", ")}`).toEqual([]);
	});

	/**
	 * HIGH в обох файлах канону (SVELTE-UI § анти-патерни, ACCESSIBILITY § 10.5):
	 * `svelte-ignore` без обґрунтування поруч. Правило не про стиль коментарів —
	 * директива вимикає ЄДИНИЙ сигнал, який проєкт має про цю проблему
	 * (компілятор через `svelte-check`). Далі вона мовчить назавжди, і за кодом
	 * не відрізнити свідомий виняток від забутого попередження.
	 *
	 * У проєкті таких було п'ять, усі — законні винятки, і жоден цього не казав.
	 *
	 * Обґрунтуванням рахується коментар, що стоїть безпосередньо ПЕРЕД
	 * директивою: після неї він уже не читається як пояснення, а `svelte-ignore`
	 * діє рівно на наступний тег.
	 */
	it("кожен svelte-ignore має обґрунтування перед собою", () => {
		const bad: string[] = [];
		for (const file of COMPONENTS) {
			const lines = read(file).split("\n");
			lines.forEach((line, i) => {
				const m = line.match(/<!--\s*svelte-ignore\s+(\S+)/);
				if (!m) return;
				// Попередній непорожній рядок: або текст коментаря-обґрунтування,
				// або ще одна директива (кілька правил на один тег — один привід).
				let prev = i - 1;
				while (prev >= 0 && lines[prev].trim() === "") prev--;
				const previous = prev >= 0 ? lines[prev] : "";
				const isAnotherDirective = /svelte-ignore/.test(previous);
				const isExplanation = /-->|^\s*<!--/.test(previous) && !isAnotherDirective;
				if (!isExplanation && !isAnotherDirective) {
					bad.push(`${file}:${i + 1}: ${m[1]} без обґрунтування`);
				}
			});
		}
		expect(
			bad,
			`svelte-ignore вимикає єдиний сигнал про цю проблему — поруч має стояти причина:\n${bad.join("\n")}`
		).toEqual([]);
	});
});

describe("PROJECT-STRUCTURE § 7 — межа розміру файлу", () => {
	/**
	 * Канон прямо каже, як вмикати це правило в проєкті з наявними
	 * порушеннями: «доти список перевищень тримається в тесті як явний
	 * allowlist, що тільки скорочується» (§ 8). Той самий патерн, що `warn` із
	 * числом для ESLint і базове число для axe — борг видимий і вимірний, а не
	 * схований за вимкненим правилом.
	 *
	 * СПИСОК СКОРОТИВСЯ. `SkillsSection.svelte` вийшов звідси 2026-08-20: три
	 * картки платформ, переписані розміткою тричі, стали одним `{#each}` —
	 * 301 → 298, тобто в межу 300. Це і є єдиний дозволений напрямок руху.
	 *
	 * `I18nState.svelte.ts` вийшов другим: 305 → 179, бо `TranslationSchema`
	 * переїхав у `src/lib/i18n/schema.ts` (126). Список зробив тут рівно те, для чого
	 * існує — не дав дописати шість ключів у файл, який і без них був
	 * найбільшим контролером проєкту, і показав, що більшість його рядків
	 * узагалі не про перемикання мови.
	 *
	 * Тоді ж підтягнуто вниз два числа, під якими з'явився запас: HeaderSection
	 * 1075 → 1073 і AiMatchModal 516 → 514. Запас, лишений у списку, — це тихий
	 * дозвіл відрости назад, і наступна правка скористалася б ним, не показавши
	 * нічого червоного.
	 *
	 * ЧИСЛА ВИМІРЯНІ, А НЕ ЗГАДАНІ. У PROJECT-CONTEXT.md стояло «дев'ять файлів
	 * понад межу, найбільший — 1057 рядків»; фактично їх одинадцять поза
	 * локалями, і найбільший — 1066 (AI-AGENT-PITFALLS-v8 § 5.5).
	 *
	 * Словники локалей до межі не рахуються взагалі: це дані, а не код —
	 * випадок «великий статичний вміст без логіки» з § 7.
	 */
	const LIMITS: Array<[RegExp, number]> = [
		[/\/routes\/.*\+page\.svelte$/, 400],
		[/\.svelte$/, 300],
		[/\.svelte\.ts$/, 300],
		[/\.ts$/, 250]
	];

	/**
	 * Чинні перевищення SLOC. Числа отримані підрахунком чистих рядків (SLOC)
	 * без коментарів і порожніх рядків. Вони лише спадають.
	 */
	const ALLOWED: Record<string, number> = {
		// 855 → 830 (2026-09-13): перемикач тем поїхав у `ui/ThemeToggle.svelte`
		// разом із власною палітрою кнопок. Число підтягнуте одразу — запас,
		// лишений у списку, це тихий дозвіл відрости назад.
		"src/lib/components/HeaderSection.svelte": 830,
		"src/lib/components/ui/AiMatchModal.svelte": 445,
		"src/lib/components/ui/Minimap.svelte": 378,
		"src/lib/components/ui/PdfModal.svelte": 325
	};

	/**
	 * Випадок «великий статичний вміст без логіки» з § 7 — не тека, а ПЕРЕЛІК.
	 *
	 * Словники локалей були тут від початку. Другим записом стали пункти
	 * чеклиста: це так само пари рядків uk/en без жодної логіки, і 35 пунктів
	 * не вміщуються у 250 рядків за побудовою (BETA-CHECKLIST-v8 § 2.4).
	 *
	 * Названий саме файл, а не тека `src/lib/data/`: виняток мусить бути видимий
	 * у diff. Теку довелося б розширювати мовчки щоразу, коли туди покладуть
	 * щось із логікою — а `schemas.ts` там уже лежить.
	 */
	const DATA_ONLY = [/^src\/lib\/i18n\/locales\//, /^src\/lib\/data\/betaChecklist\.ts$/];

	const countSloc = (code: string): number =>
		code
			.replace(/<!--[\s\S]*?-->/g, "")
			.replace(/\/\*[\s\S]*?\*\//g, "")
			.replace(/^\s*\/\/.*$/gm, "")
			.split(/\r?\n/)
			.filter((l) => l.trim().length > 0).length;

	const measured = SOURCES.filter((f) => !DATA_ONLY.some((re) => re.test(f))).map((f) => ({
		file: f,
		lines: countSloc(read(f)),
		limit: LIMITS.find(([re]) => re.test(f))?.[1] ?? Infinity
	}));

	it("жоден файл не перевищує межу вперше", () => {
		const fresh = measured
			.filter((m) => m.lines > m.limit && !(m.file in ALLOWED))
			.map((m) => `${m.file}: ${m.lines} рядків (межа ${m.limit})`);
		expect(
			fresh,
			`нове перевищення межі § 7 — розділити за відповідальністю або внести в ALLOWED із причиною:\n${fresh.join("\n")}`
		).toEqual([]);
	});

	it("жоден чинний борг не зростає", () => {
		const grown = measured
			.filter((m) => m.file in ALLOWED && m.lines > ALLOWED[m.file])
			.map((m) => `${m.file}: ${m.lines} рядків, було ${ALLOWED[m.file]}`);
		expect(grown, `борг § 7 може лише скорочуватися:\n${grown.join("\n")}`).toEqual([]);
	});

	it("список боргу не містить файлів, які вже вклалися в межу", () => {
		// Інакше allowlist перетворюється на смітник, у якому не видно прогресу.
		const stale = Object.keys(ALLOWED).filter((f) => {
			const m = measured.find((x) => x.file === f);
			return !m || m.lines <= m.limit;
		});
		expect(stale, `прибрати з ALLOWED — вони більше не порушують:\n${stale.join("\n")}`).toEqual([]);
	});
});

/**
 * Сироти у `static/` (`PS-STATIC-ORPHANS`, MEDIUM).
 *
 * Усе з `static/` їде на хостинг ЦІЛКОМ і безумовно: adapter копіює теку, а
 * не те, на що є посилання. Файл, який більше нікому не потрібен, лишається
 * назавжди — його ніхто не видалить, бо ніхто й не дізнається, що він зайвий.
 *
 * Заміряно тут при першому прогоні: `pdf-preview/Alik-Zapolnov-CV-ATS-RMS-EN.jpg`,
 * 144 КБ, посилань — НУЛЬ. Прев'ю мають лише оформлені версії резюме
 * (`THEMED_FILES`); ATS/RMS-версії роздаються посиланнями без картинки, і
 * поля `image` в них немає взагалі.
 *
 * Посилання шукається за ІМЕНЕМ файлу, а не за шляхом від `static/`: адреси в
 * цьому проєкті складаються з частин — `src="{base}/images/{project.image}"`,
 * `SOUND_DIR` + імʼя файлу. Пошук за повним шляхом дав би шістнадцять хибних
 * знахідок із двадцяти одного файлу, тобто перевірку, яку вимкнули б першого дня.
 */
describe("PROJECT-STRUCTURE § 2.1 — у static/ немає сиріт", () => {
	/**
	 * Файли, які запитує сам хостинг або браузер за конвенцією, без жодного
	 * посилання з коду. Кожен — із причиною; перелік звіряється нижче.
	 */
	const BY_CONVENTION: Record<string, string> = {};

	const STATIC = globSync("static/**/*", { cwd: ROOT })
		.map(rel)
		.filter((p) => statSync(resolve(ROOT, p)).isFile());

	/** Де взагалі може стояти посилання на статичний файл. */
	const REFERRERS = [
		...SOURCES,
		...globSync("src/**/*.js", { cwd: ROOT }).map(rel),
		// І `.js`, і `.mjs`: `bump-version.js` — той, хто ГЕНЕРУЄ
		// `static/app-version.json`, тобто його власник і його посилання.
		...globSync("scripts/*.{js,mjs}", { cwd: ROOT }).map(rel),
		...globSync("static/*.{txt,xml}", { cwd: ROOT }).map(rel),
		"src/app.html",
		"svelte.config.js"
	].filter((p) => existsSync(resolve(ROOT, p)));

	function orphans(): string[] {
		const haystack = REFERRERS.map((f) => ({ file: f, text: read(f) }));
		return STATIC.filter((path) => {
			const name = path.slice(path.lastIndexOf("/") + 1);
			if (name in BY_CONVENTION || path in BY_CONVENTION) return false;
			return !haystack.some(({ file, text }) => file !== path && text.includes(name));
		}).sort();
	}

	it("перевірка жива: статичні файли й місця посилань знайдено", () => {
		expect(STATIC.length, "у static/ не знайдено файлів").toBeGreaterThan(10);
		expect(REFERRERS.length, "місць, де може стояти посилання, не видно").toBeGreaterThan(50);
		// Доказ, що зіставлення за імʼям справді працює: `profile.jpg` стоїть у
		// розмітці й у `SEO.svelte`, тобто мусить знайтися.
		expect(STATIC).toContain("static/images/profile.jpg");
		expect(orphans()).not.toContain("static/images/profile.jpg");
		// І що воно не приймає за посилання будь-що: вигаданого файлу немає.
		expect(REFERRERS.some((f) => read(f).includes("ghost-asset-never-referenced.png"))).toBe(false);
	});

	it("перелік конвенційних файлів не тримає тих, на які вже є посилання", () => {
		const haystack = REFERRERS.map((f) => read(f));
		const stale = Object.keys(BY_CONVENTION).filter((name) =>
			haystack.some((text) => text.includes(name))
		);
		expect(stale, `виняток уже не потрібен — посилання є: ${stale.join(", ")}`).toEqual([]);
	});

	it("на кожен файл у static/ хтось посилається", () => {
		expect(
			orphans(),
			"файл у `static/` не згадує ніхто, а на хостинг він їде: adapter копіює теку\n" +
				"цілком. Видалити або підключити — або, якщо його запитує сам хостинг,\n" +
				"записати в BY_CONVENTION з причиною:\n" +
				orphans().join("\n")
		).toEqual([]);
	});
});
