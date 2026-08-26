import { existsSync } from 'node:fs';
import { ESLint } from 'eslint';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * CODE-QUALITY-v8 § 6.4.2 — базовий набір ESLint увімкнений.
 *
 * Чому цей тест існує. У цьому проєкті всі 15 правил стоять у `error`, і порушень
 * немає в жодного. Тест не про борг — він про те, щоб цей нуль лишався
 * ПЕРЕВІРЕНИМ: у трьох сусідніх проєктах такий самий нуль у звіті `lint`
 * означав не «порушень немає», а «правила вимкнені, і ніхто не питав».
 *
 * Тест читає ЗІБРАНИЙ конфіг (`calculateConfigForFile`), а не текст файлу:
 * правило може зникнути через зміну пресету, і в тексті цього не видно.
 *
 * Правила з боргом (`warn`) навмисно проходять перевірку: борг у звіті — це не
 * те саме, що вимкнене правило. Тест ловить лише `off`.
 */
const BASELINE = [
	'no-restricted-imports',
	'no-eval',
	'no-implied-eval',
	'no-new-func',
	'no-script-url',
	'no-restricted-syntax',
	'no-console',
	'@typescript-eslint/no-explicit-any',
	'@typescript-eslint/no-unused-vars',
	'@typescript-eslint/ban-ts-comment',
	'svelte/no-at-html-tags',
	'svelte/require-each-key',
	'svelte/valid-compile',
	'svelte/prefer-svelte-reactivity',
	'svelte/no-navigation-without-resolve'
] as const;

/**
 * Файл-зразок мусить бути `.svelte`: частина правил (`svelte/*`) живе лише в
 * overrides-блоці для цього розширення, і на `.ts` їх у зібраному конфігу немає.
 * Файли зі списку винятків для `svelte/no-at-html-tags` для зразка не годяться.
 *
 * І він мусить ІСНУВАТИ. Тут стояло `src/routes/+page.svelte` — шлях, якого в
 * цьому проєкті немає: сторінка живе в `src/routes/[[lang=lang]]/`. Тест від
 * цього не червонів, бо `calculateConfigForFile` розв'язує конфіг за формою
 * шляху й до диска не звертається, — тобто чотирнадцять правил перевірялися для
 * ВИГАДАНОГО файлу. Збігом воно й працювало: `.svelte` є `.svelte`. Але жоден
 * зі списків винятків за шляхом (`storage.ts`, `tests/**`) на такому зразку не
 * спрацював би, і перевірка мовчки перестала б відповідати проєкту.
 */
const SAMPLE = 'src/routes/[[lang=lang]]/+page.svelte';

function levelOf(entry: unknown): string | number | undefined {
	return Array.isArray(entry) ? (entry[0] as string | number) : (entry as string | number);
}

describe('базовий набір ESLint (CODE-QUALITY-v8 § 6.4.1)', () => {
	// Node API замість `npx eslint --print-config`: з Node 22+ спроба запустити
	// `.cmd` без `shell: true` падає з EINVAL, а `shell: true` дає DEP0190.
	// Через API це той самий зібраний конфіг, тільки без підпроцесу й швидше.
	let rules: Record<string, unknown>;

	beforeAll(async () => {
		const config = (await new ESLint().calculateConfigForFile(SAMPLE)) as {
			rules: Record<string, unknown>;
		};
		rules = config.rules;
		// 30 c, а не типові 5: розвʼязання конфігу тягне пресети svelte та
		// typescript-eslint і в найбільшому з проєктів займає 3,5 c. Під
		// паралельним прогоном у CI типового ліміту не вистачає — файл падав
		// з усіма пропущеними перевірками, тобто гейт червонів без порушення.
	}, 30_000);

	it('перевірка жива: файл-зразок існує', () => {
		expect(
			existsSync(SAMPLE),
			`${SAMPLE} немає на диску — конфіг розв'язується для шляху, якого не існує`
		).toBe(true);
	});

	it.each(BASELINE)('%s не вимкнене', (rule) => {
		const level = levelOf(rules[rule]);
		expect(
			level,
			'правило відсутнє у зібраному конфігу — звіт lint не покриває цей клас порушень'
		).toBeDefined();
		expect(level, 'правило вимкнене — зелений lint нічого не доводить').not.toBe('off');
		expect(level, 'правило вимкнене — зелений lint нічого не доводить').not.toBe(0);
	});
});

/**
 * Борг у режимі `warn` — число, яке ЛИШЕ спадає (CODE-QUALITY-v8 § 6.4.3).
 *
 * ## Навіщо ще одна перевірка поруч із попередньою
 *
 * Та вище доводить, що правило не `off`. Вона нічого не каже про КІЛЬКІСТЬ, а
 * саме кількість і є боргом: `warn` лишає порушення у звіті рівно для того, щоб
 * за ним можна було стежити. Без гейта стежити нічим — і це не гіпотеза. У
 * `DigitalWorkshop`, єдиному проєкті, де цей ратчет уже стояв, числа перед тим
 * розійшлися з дійсністю двічі в одному файлі: 17 проти реальних 16 і 66 проти
 * 65. Клас, який AI-AGENT-PITFALLS-v8 § 5.5 називає прямо: «число зі звіту
 * старіє саме тоді, коли робота йде добре».
 *
 * ## Чому мапа порожня — і чому це найцінніший випадок
 *
 * У цьому проєкті всі правила базового набору стоять у `error`, а порушень
 * немає жодного: `npm run lint` віддає 0/0. Ратчет тут не стежить за боргом —
 * він тримає НУЛЬ. Перша ж поява попередження (нове правило пресету, новий
 * `any`, нова адреса без `resolve()`) валить прогін з іменем правила, замість
 * тихо додати рядок у звіт, який ніхто не порівнює з попереднім.
 *
 * ## Чому саме РІВНІСТЬ, а не «не більше»
 *
 * «Не більше» ловить зростання й пропускає застарівання: виправив три місця —
 * число лишилося старим, і наступний читач бачить борг, якого немає. Рівність
 * змушує опустити число тим самим комітом, яким борг скоротили.
 *
 * ## Чому перебір у тілі `it`, а не `it.each`
 *
 * `it.each` над ПОРОЖНЬОЮ мапою не падає — він створює нуль перевірок і
 * звітує зелено. Тобто в проєкті з нульовим боргом ратчет виглядав би робочим
 * і не перевіряв нічого: рівно та тест-заглушка, яку пакет називає CRITICAL.
 * Перебір у тілі одного `it` дає той самий звіт і не має цього стану.
 */
const DEBT: Readonly<Record<string, number>> = {};

describe('борг ESLint — число, що лише спадає (CODE-QUALITY-v8 § 6.4.3)', () => {
	let counts: Record<string, number>;
	let errors = 0;
	let linted = 0;

	beforeAll(async () => {
		// Той самий прохід, що й `npm run lint`, тільки через Node API: запуск
		// `.cmd` без `shell: true` з Node 22+ падає з EINVAL, а `shell: true`
		// дає DEP0190. Запас за таймаутом навмисний — плаваючий гейт гірший за
		// відсутній, бо на нього перестають дивитися.
		const results = await new ESLint().lintFiles(['.']);
		counts = {};
		linted = results.length;
		for (const result of results) {
			for (const message of result.messages) {
				const rule = message.ruleId ?? '(без правила)';
				counts[rule] = (counts[rule] ?? 0) + 1;
				if (message.severity === 2) errors++;
			}
		}
	}, 120_000);

	it('перевірка жива: lint пройшов по джерелах проєкту', () => {
		/*
		 * Межа не нуль, і це різні твердження.
		 *
		 * `> 0` ловить лише повністю мертвий прохід. Але гейт так само міряє
		 * порожнечу, коли `eslint.config` почав ігнорувати майже все: один
		 * узятий файл дасть нуль попереджень, мапа боргу зійдеться, і це
		 * прочитається як «боргу немає».
		 *
		 * 222 — заміряно прогоном на момент коміту. Межа вдвічі нижча: не
		 * падає на звичайному рості й скороченні дерева, але порожнечу називає.
		 * Взято з `adoptananimal` (`bfaa531`), де цей клас і знайшли.
		 */
		expect(linted, 'ESLint не взяв жодного файлу — гейт міряє порожнечу').toBeGreaterThan(
			100
		);
	});

	it('помилок немає — борг це попередження, а не поламана збірка', () => {
		expect(errors, 'lint червоний: це вже не борг, а зламаний гейт').toBe(0);
	});

	it('борг не зріс і жодне число не застаріло', () => {
		const drift: string[] = [];
		for (const [rule, declared] of Object.entries(DEBT)) {
			const actual = counts[rule] ?? 0;
			if (actual > declared) {
				drift.push(
					`${rule}: борг ВИРІС — ${actual} проти записаних ${declared}. ` +
						'Правило в режимі warn лише для того, щоб число спадало.'
				);
			} else if (actual < declared) {
				drift.push(
					`${rule}: борг скоротився до ${actual}, а в DEBT досі ${declared}. ` +
						'Опустіть число тим самим комітом — інакше воно застаріє мовчки.'
				);
			}
		}
		expect(drift, drift.join('\n')).toEqual([]);
	});

	it('немає боргу без записаного числа', () => {
		const unlisted = Object.keys(counts).filter((rule) => !(rule in DEBT));
		expect(
			unlisted,
			`правило дає попередження, а числа для нього немає:\n${unlisted.join('\n')}`
		).toEqual([]);
	});

	it('сума боргу дорівнює тому, що звітує lint', () => {
		const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
		const declared = Object.values(DEBT).reduce((sum, n) => sum + n, 0);
		expect(total, 'сума в DEBT розійшлася з прогоном').toBe(declared);
	});
});
