// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { existsSync, globSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Кожен файл перевірки належить раннеру, який у проєкті справді є
 * (AI-AGENT-PITFALLS-v8 § 1.3).
 *
 * Клас дефекту: файл виглядає як перевірка, рахується в переліку «що в нас
 * тестується» — і не запускається ніде. Три способи, якими це стається:
 *
 *   1. Раннера немає в залежностях узагалі (файл під Playwright у проєкті,
 *      де Playwright не встановлений).
 *   2. Раннер є, конфігу немає.
 *   3. Раннер і конфіг є, але файл лежить поза `testDir` — Playwright його
 *      просто не бачить, і жодного слова про це не буде.
 *
 * Мовчазне зникнення перевірки гірше за порожню заглушку: заглушка хоч
 * виконується. Окремо ловиться `@ts-nocheck` — він вимикає останній гейт,
 * який міг би помітити мертвий імпорт.
 *
 * Зворотний експеримент (§ 1.1): тимчасово прибрати `vitest` із
 * `devDependencies` — перевірка має перелічити всі файли перевірок проєкту.
 */

/** Корінь проєкту: vitest завжди стартує звідти, на відміну від `__dirname` в ESM. */
const ROOT = process.cwd().replace(/\\/g, '/');

/** Каталоги, у яких взагалі можуть лежати файли перевірок. */
const SEARCH_DIRS = ['src', 'tests', 'e2e'];

const RUNNERS = [
	{ imports: '@playwright/test', dep: '@playwright/test', config: /^playwright\.config\./ },
	{ imports: 'vitest', dep: 'vitest', config: /^vitest\.config\.|^vite\.config\./ }
];

function playwrightTestDir(): string | null {
	const config = readdirSync(ROOT).find((f) => /^playwright\.config\./.test(f));
	if (!config) return null;
	const source = readFileSync(join(ROOT, config), 'utf8');
	const match = source.match(/testDir\s*:\s*['"`]\.?\/?([^'"`]+)['"`]/);
	return match ? match[1].replace(/\/$/, '') : null;
}

/**
 * Коментарі відрізаються перед пошуком імпорту, інакше перевірка оголосить
 * сиротою сама себе: у докблоці вище процитовано назви раннерів.
 */
function withoutComments(source: string): string {
	return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

function walk(dir: string, out: string[] = []): string[] {
	if (!existsSync(dir)) return out;
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/\.(spec|test)\.(ts|js)$/.test(entry)) out.push(full.replace(/\\/g, '/'));
	}
	return out;
}

const specFiles = SEARCH_DIRS.flatMap((dir) => walk(join(ROOT, dir))).map((f) => f.slice(ROOT.length + 1));

const importsRunner = (source: string, runner: { imports: string }) =>
	new RegExp(`from\\s*['"]${runner.imports.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')}['"]`).test(
		source
	);

/**
 * Раннер файлу — за його імпортами, ЗА ПОСИЛАННЯМИ на локальні модулі.
 *
 * Пряме порівняння рядка тут більше не годиться, і це не послаблення, а
 * виправлення. Специфікації Playwright беруть `test` не з `@playwright/test`,
 * а з власного модуля фікстур (ANALYTICS-v9 § 5.2, `AN-E2E-BLOCK`): глушилка
 * аналітики мусить діяти на КОЖНУ сторінку, а не лише там, де її згадали.
 * Після того переходу пряме порівняння оголосило б сиротами всі специфікації
 * одразу — тобто гейт червонів би на цілком правильному коді, а справжню
 * сироту в тій купі вже ніхто б не побачив.
 *
 * Гарантія лишається та сама: файл мусить ДОСЯГАТИ раннера. Обхід іде лише по
 * відносних шляхах і пам'ятає відвідане, тож цикл імпортів його не зациклює.
 */
function runnerOf(file: string, seen = new Set<string>()): (typeof RUNNERS)[number] | undefined {
	const abs = join(ROOT, file);
	if (seen.has(abs) || !existsSync(abs) || statSync(abs).isDirectory()) return undefined;
	seen.add(abs);

	const source = withoutComments(readFileSync(abs, 'utf8'));
	const direct = RUNNERS.find((r) => importsRunner(source, r));
	if (direct) return direct;

	for (const [, spec] of source.matchAll(/from\s*['"](\.[^'"]*)['"]/g)) {
		const base = join(file, '..', spec).replace(/\\/g, '/');
		// `./fixtures`, `./fixtures.ts` і `../lib/config/site.js` (TS-імпорт із розширенням JS).
		for (const candidate of [base, `${base}.ts`, `${base}.js`, base.replace(/\.js$/, '.ts')]) {
			const found = runnerOf(candidate, seen);
			if (found) return found;
		}
	}
	return undefined;
}

describe('файли перевірок', () => {
	it('перевірка жива: файли перевірок узагалі знайдено', () => {
		expect(specFiles.length, 'жодного файлу перевірки — сканер шукає не там').toBeGreaterThan(2);
	});

	it('кожен файл перевірки належить раннеру, який у проєкті є', () => {
		const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
		const deps: Record<string, string> = { ...pkg.dependencies, ...pkg.devDependencies };
		const rootEntries = readdirSync(ROOT);

		const orphans: string[] = [];
		for (const file of specFiles) {
			const runner = runnerOf(file);

			if (!runner) {
				orphans.push(`${file}: не досягає жодного раннера — ні прямо, ні через локальні імпорти`);
				continue;
			}
			if (!deps[runner.dep]) {
				orphans.push(`${file}: імпортує ${runner.dep}, якого немає в package.json`);
				continue;
			}
			if (!rootEntries.some((entry) => runner.config.test(entry))) {
				orphans.push(`${file}: імпортує ${runner.dep}, але конфігу для нього в корені немає`);
				continue;
			}
			if (runner.dep === '@playwright/test') {
				const dir = playwrightTestDir();
				if (dir && !file.startsWith(`${dir}/`)) {
					orphans.push(`${file}: під Playwright, але поза testDir «${dir}» — раннер його не бачить`);
				}
			}
		}

		expect(orphans, `перевірки, яких не запускає ніхто:\n${orphans.join('\n')}`).toEqual([]);
	});

	/**
	 * Глоб `include` із `vitest.config.ts` бачить усі юніт-перевірки, які лежать
	 * на диску.
	 *
	 * ЧОГО НЕ ЛОВИТЬ РЕШТА ФАЙЛУ. Перевірки вище питають «чи є в проєкту раннер
	 * для цього файлу» — і відповідають так навіть тоді, коли раннер його не
	 * добирає. Достатньо звузити глоб (`src/lib/**` замість `src/**`), і
	 * половина набору тихо перестає виконуватися: прогін зелений, кількість у
	 * звіті менша, а на неї ніхто не дивиться.
	 *
	 * Повне зникнення глоба цим не ловиться — тоді не запуститься й цей файл.
	 * Проти нуля стоїть інше: `passWithNoTests` прибрано з конфігу, тож нуль
	 * файлів тепер вихід із кодом 1, а не «успіх».
	 *
	 * Шаблон читається з конфігу, а не переписаний сюди: копія розійшлася б з
	 * оригіналом і почала б доводити щось про себе саму.
	 */
	it('глоб vitest добирає кожну юніт-перевірку, яка лежить на диску', () => {
		// Сирий текст: `withoutComments` з'їдає `/*` всередині самого глоба
		// `src/**/` і лишає шаблон, який не добирає нічого.
		const config = readFileSync(join(ROOT, 'vitest.config.ts'), 'utf8');
		const pattern = /include:\s*\[\s*'([^']+)'/.exec(config)?.[1];
		expect(pattern, 'у vitest.config.ts більше немає include — перевірка мертва').toBeTruthy();

		const collected = new Set(
			globSync(pattern!, { cwd: ROOT }).map((f) => f.replace(/\\/g, '/'))
		);
		// Playwright-специфікації живуть у `tests/` і до цього глоба не належать.
		const onDisk = specFiles.filter((f) => f.startsWith('src/'));

		expect(onDisk.length, 'у src/ не знайдено перевірок — сканер шукає не там').toBeGreaterThan(10);
		const missed = onDisk.filter((f) => !collected.has(f));
		expect(
			missed,
			`глоб vitest їх не добирає — вони не виконуються ніде:\n${missed.join('\n')}`
		).toEqual([]);
	});

	it('жоден файл перевірки не вимикає типи через @ts-nocheck', () => {
		const silenced = specFiles.filter((file) =>
			/^\s*\/\/\s*@ts-nocheck/m.test(readFileSync(join(ROOT, file), 'utf8'))
		);
		expect(
			silenced,
			`@ts-nocheck вимикає останній гейт, який міг би помітити мертвий імпорт:\n${silenced.join('\n')}`
		).toEqual([]);
	});
});

/**
 * Сетап-проєкт ідентичності підключений, а не просто існує
 * (CI-CD-AND-TOOLS-v9 § 1.11, `CI-E2E-TARGET-IDENTITY`, MEDIUM).
 *
 * ЧОМУ ЦЕ ОКРЕМИЙ ІНВАРІАНТ, А НЕ ДОВІРА ДО КОНФІГУ. `tests/identity.setup.ts`
 * не збігається з типовим шаблоном Playwright (`*.spec.ts` / `*.test.ts`) — і
 * це навмисно, інакше кожен браузерний проєкт запускав би його вдруге. Але та
 * сама властивість робить його НЕВИДИМИМ для перевірки «файл, якого не
 * запускає ніхто» вище: прибери `dependencies: ['identity']` з проєктів — і
 * файл лишиться на диску, зелений і мертвий, а прогін піде без звірки порту.
 *
 * Тобто це рівно `PIT-TEST-DISCOVERY-PROCESS` у формі, якої той гейт не ловить:
 * перевірка є, раннер є, конфіг є — не викликає ніхто.
 */
describe('сетап-проєкт E2E підключений (CI-E2E-TARGET-IDENTITY)', () => {
	const configName = readdirSync(ROOT).find((f) => /^playwright\.config\./.test(f));
	const config = configName ? readFileSync(join(ROOT, configName), 'utf8') : '';

	/** Блоки проєктів: імʼя, `testMatch` і залежності кожного. */
	function projects(): { name: string; testMatch: string | null; deps: string[] }[] {
		const list: { name: string; testMatch: string | null; deps: string[] }[] = [];
		// Проєкти оголошені як `{ name: 'x', … }` — беремо кожен блок від імені
		// до наступного імені (або до кінця файлу).
		const names = [...config.matchAll(/name:\s*['"`]([\w-]+)['"`]/g)];
		for (const [i, m] of names.entries()) {
			const from = m.index;
			const to = i + 1 < names.length ? (names[i + 1].index as number) : config.length;
			const body = config.slice(from, to);
			list.push({
				name: m[1],
				testMatch: /testMatch:\s*\/([^/]+)\//.exec(body)?.[1] ?? null,
				deps: [...body.matchAll(/dependencies:\s*\[([^\]]*)\]/g)].flatMap((d) =>
					[...d[1].matchAll(/['"`]([\w-]+)['"`]/g)].map((x) => x[1])
				)
			});
		}
		return list;
	}

	it('перевірка жива: конфіг Playwright прочитано й проєкти розібрано', () => {
		expect(configName, 'конфігу Playwright у корені немає').toBeTruthy();
		expect(projects().length, 'у конфізі не знайдено жодного проєкту').toBeGreaterThan(2);
	});

	it('сетап-проєкт існує, має свій файл і звіряє ідентичність', () => {
		const setup = projects().find((p) => p.testMatch !== null);
		expect(setup, 'у конфізі немає проєкту з власним testMatch — сетапу не існує').toBeTruthy();
		if (!setup) return;

		const dir = playwrightTestDir();
		const file = join(ROOT, dir ?? 'tests', (setup.testMatch as string).replace(/\\\./g, '.'));
		expect(
			existsSync(file),
			`сетап-проєкт «${setup.name}» вказує на ${file}, якого немає`
		).toBe(true);

		/*
		 * Файл мусить справді звіряти те, для чого існує: адресу ЦЬОГО
		 * репозиторію і штамп збірки. Інакше сетап є, залежність оголошена, а
		 * перевіряє він нічого — форма без змісту, яку видно лише читанням.
		 */
		const source = readFileSync(file, 'utf8');
		expect(source, 'сетап не звіряє SITE_ORIGIN/SITE_BASE — маркера ідентичності немає').toMatch(
			/SITE_ORIGIN[\s\S]*SITE_BASE|SITE_BASE[\s\S]*SITE_ORIGIN/
		);
		expect(source, 'сетап не читає app-version.json — штампа збірки немає').toContain(
			'app-version.json'
		);
	});

	it('кожен браузерний проєкт залежить від сетапу', () => {
		const all = projects();
		const setups = all.filter((p) => p.testMatch !== null).map((p) => p.name);
		expect(setups.length, 'сетап-проєкту немає').toBeGreaterThan(0);

		const missing = all
			.filter((p) => !setups.includes(p.name))
			.filter((p) => !setups.every((s) => p.deps.includes(s)))
			.map((p) => p.name);
		expect(
			missing,
			'проєкт не оголошує dependencies на сетап — прогін піде без звірки порту,\n' +
				'а сам сетап лишиться зеленим і мертвим:\n' +
				missing.join('\n')
		).toEqual([]);
	});
});
