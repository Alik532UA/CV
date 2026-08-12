# Gemini CLI Context: CV-svelte

## Архітектура
- **Фреймворк:** SvelteKit 2 + Svelte 5 (Runes).
- **Стейт-менеджмент:** Патерн "Контролери" у `src/lib/controllers/`. Файли мають суфікс `.svelte.ts`.
- **Сховище:** Патерн **Storage Facade** у `src/lib/services/storage.ts`. Прямий доступ до `localStorage` заборонений.
- **AI:** запити йдуть у Cloudflare Worker-проксі (`worker/`), ключі провайдерів — його секрети. Реєстр моделей — `src/lib/config/aiProviders.ts`, ланцюжок і cooldown — `src/lib/services/aiChain.ts`, формати запитів — `aiWire.ts`, промпт — `aiPrompt.ts`. Ці чотири файли імпортує і сайт, і воркер, тому в них лише відносні шляхи, без `$lib`.

## Конвенції
- **Префікс сховища:** Усі ключі в `localStorage` мають префікс `cv-svelte_`.
- **Іменування:**
  - Компоненти: `PascalCase.svelte`
  - Контролери: `PascalCase.svelte.ts`
  - Сервіси/Утиліти: `camelCase.ts`
- **Тестування:**
  - Unit: Vitest (колокація з кодом).
  - E2E: Playwright (папка `tests/`).

## Правила (Anti-Patterns)
- **НЕ ВИКОРИСТОВУЙ** `localStorage` прямо. Тільки через сервіс `storage`.
- **НЕ ВИКОРИСТОВУЙ** Svelte 4 APIs (`writable`, `on:click`). Тільки руни (`$state`, `onclick`).
- **НЕ СТВОРЮЙ** скрипти в корені. Використовуй папку `scripts/`.
- **НЕ КЛАДИ** ключі AI у `PUBLIC_*` змінні. Сайт статичний — усе з бандла видно у DevTools; ключі тільки в секретах воркера.
