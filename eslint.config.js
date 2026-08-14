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
      "svelte/valid-compile": "error"
    }
  }
);
