import svelte from "eslint-plugin-svelte";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".svelte-kit/", "build/", "dist/", ".temp/"]
  },
  ...tseslint.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
  {
    /**
     * Gates for the rules this project already follows.
     *
     * Every rule below currently has zero violations — that is the point. The
     * codebase has no Svelte 4 idioms and no `any`, and until now nothing at
     * all held it that way: the next person (or the next agent) to reach for
     * `writable()` would have got a green build. A standard that is only
     * written down is a wish; these are the same statements as errors.
     */
    rules: {
      /**
       * Svelte 4 stores and the deprecated `$app/stores` (SVELTE-CORE-v8 § 6).
       * Both still work, which is exactly why they come back: nothing breaks,
       * the file just stops matching the rest of the project.
       */
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "svelte/store",
              importNames: ["writable", "readable", "derived"],
              message:
                "Svelte 5: стан — $state/$derived у класі-контролері (.svelte.ts). SVELTE-CORE-v8 § анти-патерни."
            },
            {
              name: "$app/stores",
              message:
                "Deprecated із SvelteKit 2.12: `import { page } from '$app/state'`. SVELTE-CORE-v8 § 1.8."
            }
          ]
        }
      ],

      // CODE-QUALITY-v8: `any` — HIGH. Зараз у проєкті нуль звернень;
      // recommended лишає це попередженням, тобто дозволом із докором.
      "@typescript-eslint/no-explicit-any": "error",

      // SECURITY-v8 § 16. `eval` тут не буває й не має зʼявитися: CSP його не
      // дозволяє, тож помилка виявилася б лише в рантаймі у відвідувача.
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",

      /**
       * SVELTE-UI-v8 § 4. `require-each-key` і `no-at-html-tags` уже є у
       * flat/recommended — тут вони підняті явно, щоб зміна пресету не зняла
       * їх мовчки.
       *
       * `svelte/no-deprecated-slot` із канону НЕ додано: такого правила в
       * eslint-plugin-svelte 3.x не існує (перевірено списком p.rules).
       * `<slot>` ловить компілятор через svelte/valid-compile.
       */
      "svelte/require-each-key": "error",
      "svelte/no-at-html-tags": "error",
      "svelte/valid-compile": "error",

      /**
       * Решта базового набору CODE-QUALITY-v8 § 6.4.1. У кожного — нуль
       * порушень у проєкті на 2026-08-14, тож усі одразу в `error`: правило з
       * нулем порушень ставиться в error, а не лишається невимкненим і
       * неперевіреним.
       */

      // CODE-QUALITY-v8 § 1: `@ts-ignore` без записаної причини.
      "@typescript-eslint/ban-ts-comment": "error",

      /**
       * DEBUGGING-v8 § 4, перший пункт. Писати в консоль має право рівно один
       * файл — `logService.svelte.ts`; виняток для нього нижче, разом зі
       * скриптами й воркером, де консоль і є вихідним каналом.
       *
       * Правило додане після коміту, який прибирав `console.error` руками:
       * порушень у `src/` лишилося нуль, і саме тому воно одразу `error`, а не
       * `warn` (той самий принцип, що для решти набору вище). Без гейта
       * наступний `console.log` доїде у продакшн — він нічого не ламає, тож
       * ніхто його не помітить, а разом із ним у консоль відвідувача поїде те,
       * що мало залишитися в журналі.
       */
      "no-console": "error",

      // SVELTE-CORE-v8 § 1.5: голі Set/Map/Date як реактивний стан.
      "svelte/prefer-svelte-reactivity": "error",

      /**
       * SEO-v8 § 1.5. `resolve()` типізований проти списку реальних маршрутів,
       * тож помилка в адресі — зайва велика літера, застарілий шлях — стає
       * помилкою компіляції. Саме такий баг тримав сторінку зламаною в
       * продакшні сусіднього проєкту; тут порушень нуль, і правило тримає це.
       */
      "svelte/no-navigation-without-resolve": "error",

      /**
       * I18N-v8 § 4.3, HIGH. Без аргументу метод бере локаль СИСТЕМИ, а не мову
       * сайту. Помилка невидима саме там, де її шукають: у розробника система
       * українська, сайт українською, вивід збігається. Для сайту на 42 мовах
       * це найдешевший спосіб отримати дату, яку відвідувач прочитає навпаки.
       *
       * Селектор дивиться на ВІДСУТНІСТЬ аргументів: із локаллю це правильний
       * виклик. `logService` уже пише ISO — причина записана в коді поруч.
       */
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "CallExpression[arguments.length=0][callee.property.name=/^toLocale(String|DateString|TimeString)$/]",
          message:
            "I18N-v8 § 4.3: передайте локаль явно — без неї береться локаль системи, а не мова сайту."
        }
      ]
    }
  },

  /**
   * STORAGE-NAMESPACE-v8, Крок 3: прямий доступ до Web Storage заборонений.
   *
   * Origin спільний із сусідніми проєктами, тож ключ без префікса — це не
   * дрібниця, а чужі дані. Доти заборона трималася лише на рядку в AGENTS.md,
   * і три проєкти з восьми вже її порушували, чого не помітив ніхто.
   *
   * Правил два, і друге не зайве: `no-restricted-globals` НЕ ловить
   * `window.localStorage`. Канон у Кроці 3 наводить лише його — а саме ця
   * форма й трапилася в DigitalWorkshop, тричі поспіль.
   */
  {
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'localStorage', message: 'STORAGE-NAMESPACE-v8: лише через фасад storage.' },
        { name: 'sessionStorage', message: 'STORAGE-NAMESPACE-v8: лише через фасад storage.' }
      ],
      'no-restricted-properties': [
        'error',
        { object: 'window', property: 'localStorage', message: 'STORAGE-NAMESPACE-v8: лише через фасад storage.' },
        { object: 'window', property: 'sessionStorage', message: 'STORAGE-NAMESPACE-v8: лише через фасад storage.' }
      ]
    }
  },
  {
    // Три категорії, і кожна законна за самим каноном:
    //   1. Фасад — тут прямий доступ Є реалізацією (Крок 3).
    //   2. Модуль міграції — читає ключі БЕЗ префікса, і це єдине легальне
    //      місце, де так можна (Крок 4). Лежить у services/ або utils/
    //      залежно від проєкту, тому шаблон без шляху.
    //   3. Тести фасаду й e2e — вони мусять читати й засівати сирі ключі,
    //      інакше нічим довести, що префікс справді додається.
    files: [
      'src/lib/services/storage.ts',
      'src/lib/services/storage/**',
      'src/lib/config/storage.ts',
      '**/storageMigration.ts',
      '**/storage.test.ts',
      '**/storage.spec.ts',
      'tests/**',
      'e2e/**'
    ],
    rules: {
      'no-restricted-globals': 'off',
      'no-restricted-properties': 'off'
    }
  },
  {
    /**
     * Три місця, де консоль — не залишений дебаг, а вихідний канал
     * (DEBUGGING-v8 § 4):
     *
     *   1. `logService` — єдиний, кому канон дозволяє писати в консоль
     *      браузера; решта коду ходить через нього;
     *   2. `scripts/` — гейти над `build/`. Їхній звіт читає людина в
     *      терміналі й CI-лог, іншого виводу в них немає;
     *   3. `worker/` — Cloudflare Worker. Там `console` пише у `wrangler tail`,
     *      тобто це і є серверний журнал проксі, а не дебаг у чужому браузері.
     */
    files: ['src/lib/services/logService.svelte.ts', 'scripts/**', 'worker/**'],
    rules: {
      'no-console': 'off'
    }
  }
);
