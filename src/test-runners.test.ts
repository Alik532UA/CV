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
			const source = withoutComments(readFileSync(join(ROOT, file), 'utf8'));
			const runner = RUNNERS.find((r) =>
				new RegExp(`from\\s*['"]${r.imports.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')}['"]`).test(source)
			);

			if (!runner) {
				orphans.push(`${file}: не імпортує жодного відомого раннера`);
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
