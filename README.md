# CV — резюме Аліка Заполнова

Статичний сайт-резюме: 42 мови, чотири режими смуги прокрутки з мінімапою і
AI Job Matcher, який звіряє текст вакансії з досвідом кандидата.

**Живий сайт:** https://alik532ua.github.io/CV/

SvelteKit 2 + Svelte 5 (руни), `@sveltejs/adapter-static`, GitHub Pages.
Стандарти якості — пакет `sveltekit-canon/selection_criteria/v8`; те, що
специфічне саме для цього проєкту, лежить у [PROJECT-CONTEXT.md](PROJECT-CONTEXT.md)
і читається **перед** пакетом.

## Швидкий старт

```bash
npm ci
npm run dev
```

## Команди

| Команда | Що робить |
|---------|-----------|
| `npm run dev` | Vite dev-сервер |
| `npm run build` | Прод-збірка в `build/` |
| `npm run preview` | Перегляд зібраного сайту |
| `npm run check` | `svelte-check` — типи, руни, невикористані CSS-селектори |
| `npm run check:worker` | `tsc` над Cloudflare Worker |
| `npm run check:build` | Перевірка **зібраного** сайту; вимагає `npm run build` |
| `npm run lint` | eslint |
| `npm run test:unit` | vitest (інваріанти й контролери) |
| `npm run test:e2e` | Playwright |
| `npm run bump` | patch-версія в `package.json` і `static/app-version.json` |
| `npm run worker:dev` / `worker:deploy` | AI-проксі локально / у Cloudflare |

`npm run check:build` читає `build/`, а не `src/`, і саме тому ловить те, чого
в коді не видно: зсув мов під час prerender, `sveltekit-prerender` в адресах,
порожнє тіло сторінки, зламані абсолютні URL. Він знайшов `lang="en"` на всіх
42 мовних версіях першим же запуском.

## Як усе влаштоване

```
src/
├── routes/
│   ├── +layout.svelte          # чрома сайту: шапка, навігація, смуга, тости
│   ├── +error.svelte           # 404 і несподівані помилки
│   └── [[lang=lang]]/          # одна сторінка на мову, prerender за entries()
├── params/lang.ts              # матчер: невідомий сегмент не збігається з маршрутом
├── hooks.server.ts             # lang на <html> під час prerender
├── hooks.client.ts             # неперехоплені помилки клієнта → logService
├── lib/
│   ├── components/             # ui/, sections/, backgrounds/, flags/, icons/
│   ├── controllers/*.svelte.ts # стан і бізнес-логіка (руни)
│   ├── services/               # чисті async-сервіси: storage, analytics, ai*
│   ├── i18n/locales/           # 42 словники, кожен `const xx: Translations`
│   ├── config/                 # реєстри: моделі AI, режими смуги, префікс сховища
│   └── data/                   # вміст резюме
└── *.test.ts                   # інваріанти по джерелах
worker/                         # Cloudflare Worker — проксі до AI-провайдерів
```

Кілька рішень, які інакше довелося б виводити з коду:

- **Стан живе в класах-контролерах** (`.svelte.ts`), компоненти лише рендерять.
- **Прямий доступ до `localStorage` заборонений** — тільки `storage` і
  `storage.session`. Origin спільний із пʼятьма іншими проєктами, тому
  `clear()` видаляє лише ключі з префіксом `cv-svelte_`.
- **Жодного рядка інтерфейсу в компонентах** — усе через `t` зі словників.
  Паритет ключів тримає система типів: забутий ключ ловить `svelte-check`.
- **Ключів AI в сайті немає.** Вони — секрети Cloudflare Worker; сайт знає лише
  URL проксі. Див. [worker/README.md](worker/README.md).

## Мови

42 локалі. В індексі — чотири вичитані: `en` (на голому шляху), `en-us`, `uk`,
`ja`. Решта 38 — машинний переклад без перегляду носієм: адреси справжні, вміст
prerendered, але сторінки позначені `noindex`. Підвищити мову до індексованої —
один рядок у `src/lib/i18n/routing.ts` після вичитки.

## Перевірки

Усе, що нижче, стоїть кроком у [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

`check` → `check:worker` → `lint` → `test:unit` → `npm audit --audit-level=high`
→ інваріант унікальності `data-testid` у Playwright → `build` → `check:build`.

Юніт-набір — це переважно **інваріанти по джерелах**, а не тести поведінки:
конвенції `data-testid`, кнопка закриття, збіг першокадрового скрипта смуги з
контролером і хеша CSP, безпека, локалізація, ланцюжок AI.

Чого в CI **немає** — перелічено в
[PROJECT-CONTEXT.md § «Що не перевіряється автоматично»](PROJECT-CONTEXT.md).
Цей список — борг, і він має скорочуватися.

## Деплой і адреса

🌐 **https://alik532ua.github.io/CV/** — спільний домен, власного тут немає. Тому `paths.base` дорівнює `/CV`, а всі ключі сховища мають префікс `cv-svelte_`: origin ділиться з сусідніми проєктами.

Про переїзд на власний домен (якщо колись) — [CUSTOM-DOMAIN-v8.md](../sveltekit-canon/selection_criteria/v8/ops/CUSTOM-DOMAIN-v8.md): міняти `base` наосліп не можна, там зібрані граблі двох уже наявних переїздів.

Push у `main` → GitHub Actions збирає сайт і викладає на Pages через OIDC.
Окремою job деплоїться воркер — щоб падіння Cloudflare не блокувало сайт і
навпаки. Без секрету `CLOUDFLARE_API_TOKEN` крок воркера пропускається з
попередженням, а не падає.
