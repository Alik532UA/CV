import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		environment: 'jsdom',
		setupFiles: ['./vitest-setup.ts'],
		globals: true
		/*
		 * `passWithNoTests: true` СТОЯЛО ТУТ, і це був найдорожчий рядок файлу.
		 *
		 * Він означає «нуль знайдених файлів — це успіх». Перевірено дослідом:
		 * одна літера в `include` (`test` → `tset`) давала
		 *
		 *     No test files found, exiting with code 0
		 *
		 * тобто `npm run test:unit` звітував УСПІХ, не виконавши жодного з 304
		 * тестів, а CI малював зелену галочку. Це той самий клас, що й
		 * тест-заглушка під назвою перевірки: звіт про якість стає
		 * недостовірним, і кожна інша перевірка пакета знецінюється разом із ним
		 * (AI-AGENT-PITFALLS-v8 § 1.2, severity CRITICAL).
		 *
		 * Без прапорця vitest виходить із кодом 1 і каже те саме вголос. Ціна
		 * прапорця — зручність у порожньому репозиторії; ціна його наявності —
		 * гейт, який не може почервоніти.
		 *
		 * Часткове звуження `include` (глоб знайшов 3 файли з 34) цим не
		 * ловиться: тести ж запустилися. Це стереже `src/test-runners.test.ts`,
		 * який глобить тим самим шаблоном із ЦЬОГО файлу й звіряє з тим, що
		 * лежить на диску.
		 */
	}
});
