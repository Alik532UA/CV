# cv-ai-proxy — AI-проксі на Cloudflare Workers

Сайт статичний (GitHub Pages), тому ключі AI-провайдерів не можуть жити у збірці:
все, що потрапило в бандл, видно у DevTools. Цей воркер тримає ключі у себе, а
браузер спілкується лише з ним.

Крім приховування ключів воркер робить те, чого клієнт зробити не може:

- **спільний ланцюжок і cooldown** — модель, що впала через ліміт, не пробується
  наново кожним відвідувачем;
- **ліміти запитів** — на IP (хвилина/доба) і сумарно на добу, бо відкритий
  проксі без лімітів вичерпує квоту так само, як публічний ключ;
- **повертає, яка модель відповіла** — бейдж у UI показує факт, а не літерал.

Логіка ланцюжка і форматів запитів лежить у `src/lib/services/ai*.ts` під тестами
`vitest`; тут — HTTP-обв'язка.

## Перший запуск

Потрібен акаунт Cloudflare (безкоштовний план, картка не потрібна).

```bash
npx wrangler login
```

Далі — ключі. Мінімум один, але сенс кількох провайдерів саме в тому, щоб їх було
більше одного:

```bash
npx wrangler secret put GEMINI_API_KEY --config worker/wrangler.toml
npx wrangler secret put GROQ_API_KEY --config worker/wrangler.toml
```

Де брати (обидва — безкоштовні, без картки):

| Секрет           | Звідки                                 |
| ---------------- | -------------------------------------- |
| `GEMINI_API_KEY` | https://aistudio.google.com/app/apikey |
| `GROQ_API_KEY`   | https://console.groq.com/keys          |

Третій провайдер у ланцюжку — **Workers AI**, і секрету він не потребує: доступ
дає біндінг `[ai]` у `wrangler.toml`. Квота — 10 000 neurons/добу на акаунт,
приблизно 50 аналізів вакансії, тому в ланцюжку він стоїть останнім.

> `SAMBANOVA_API_KEY` більше не використовується (13.08.2026): на безкоштовному
> плані інференс дозволений лише для однієї моделі, і навіть вона тарифікується
> за токени. Якщо секрет ще заданий — видали його:
> `npx wrangler secret delete SAMBANOVA_API_KEY --config worker/wrangler.toml`

Публікація:

```bash
npm run worker:deploy
```

Wrangler надрукує URL виду `https://cv-ai-proxy.<subdomain>.workers.dev`. Його
треба покласти у `PUBLIC_AI_PROXY_URL`:

- локально — у `.env`;
- у CI — секретом репозиторію `AI_PROXY_URL` (див. `.github/workflows/deploy.yml`).

Перевірка, що ключі підхопилися (`keyed` — список моделей, для яких є ключ):

```bash
curl https://cv-ai-proxy.<subdomain>.workers.dev/health
```

## Локальна розробка

```bash
npm run worker:dev   # воркер на http://localhost:8787
npm run dev          # сайт; у .env: PUBLIC_AI_PROXY_URL=http://localhost:8787
```

`wrangler dev` бере секрети з файлу `worker/.dev.vars` (він у `.gitignore`):

```
GEMINI_API_KEY=...
GROQ_API_KEY=...
```

## Автодеплой

Job `deploy-worker` у `.github/workflows/deploy.yml` публікує воркер на кожен push
у `main` (`wrangler deploy` ідемпотентний). Потрібен секрет репозиторію
`CLOUDFLARE_API_TOKEN` з правом *Edit Cloudflare Workers* (Cloudflare Dashboard →
My Profile → API Tokens → шаблон «Edit Cloudflare Workers»). Без цього секрету
job не падає, а лише попереджає — деплой сайту від нього не залежить.

## Ліміти безкоштовного плану

100 000 запитів на добу і 10 мс CPU на запит. Обмеження CPU нас не стосується:
очікування відповіді від AI не вважається CPU-часом, а власних обчислень тут на
одиниці мілісекунд.

## Що можна додати згодом

- **KV** замість cooldown-мапи в пам'яті — якщо трафік розповзеться на кілька
  ізолятів і стан почне губитися (`remainingCooldowns` та `prune` — єдині місця,
  які це зачіпає).
- **Turnstile** (безкоштовна капча Cloudflare) — якщо ліміти на IP почнуть
  обходити.
