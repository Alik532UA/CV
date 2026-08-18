// @vitest-environment node
import { describe, expect, it } from "vitest";
import { globSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";

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
	it("кожен компонент десь імпортується", () => {
		const orphans = COMPONENTS.filter((file) => {
			const name = basename(file);
			return !SOURCES.some((other) => other !== file && read(other).includes(name));
		});
		expect(orphans, `ніде не імпортовані — підключити або видалити:\n${orphans.join("\n")}`).toEqual(
			[]
		);
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
	 * Чинні перевищення. Числа отримані `node scripts/…`-подібним прогоном тим
	 * самим способом, яким їх міряє тест (`split("\n").length`), станом на
	 * 2026-08-16. Вони лише спадають.
	 */
	const ALLOWED: Record<string, number> = {
		"src/lib/components/HeaderSection.svelte": 1075,
		"src/lib/components/ui/Minimap.svelte": 613,
		"src/lib/components/ui/AiMatchModal.svelte": 516,
		"src/lib/components/ui/PdfModal.svelte": 446,
		"src/lib/controllers/I18nState.svelte.ts": 374,
		"src/lib/components/ui/PageScrollbar.svelte": 369,
		"src/lib/components/sections/HeroSection.svelte": 336,
		"src/lib/components/ui/Toast.svelte": 319,
		"src/lib/components/ui/AiModelPicker.svelte": 311,
		"src/lib/controllers/AiChatState.svelte.ts": 303,
		"src/lib/components/sections/SkillsSection.svelte": 301,
		"src/lib/services/aiWire.ts": 255
	};

	const measured = SOURCES.filter((f) => !f.startsWith("src/lib/i18n/locales/")).map((f) => ({
		file: f,
		lines: read(f).split("\n").length,
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
