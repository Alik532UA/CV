import { test, expect } from "./fixtures";
import { readFileSync } from "node:fs";
import { SITE_BASE, SITE_ORIGIN } from "../src/lib/config/site.js";

/**
 * Порт відповідає — ще не означає, що це наш сайт
 * (CI-CD-AND-TOOLS-v9 § 1.11, `CI-E2E-TARGET-IDENTITY`, MEDIUM).
 *
 * ЧОГО НЕ ЗАКРИВАЮТЬ `--strictPort` І `reuseExistingServer: false`. Обидва
 * дивляться на порт ОДИН РАЗ — перед запуском команди `webServer`. А команда
 * тут починається зі збірки на ~25 секунд, тобто вікно відкрите: сусідній
 * проєкт цієї ж машини встигає підняти свій сервер на 5299, і прогін іде на
 * чужий застосунок. Падіння виглядає як помилка коду («element(s) not
 * found»), а не як помилка середовища, і шукати її йдуть у компоненти.
 *
 * Це не гіпотеза двічі. У `VetCrewGames` 2026-08-27 на тестовому порті
 * піднявся `vite dev` сусіднього `MindStep`. А в цьому проєкті інваріант
 * унікальності `data-testid` одного разу «пройшов», дивлячись на сусідній
 * сайт, — саме тому порти тут власні й записані в PROJECT-CONTEXT.md.
 *
 * ЩО САМЕ ЗВІРЯЄТЬСЯ, І ЧОМУ БЕЗ НОВОЇ РОЗМІТКИ. Канон пропонує маркер
 * `<meta name="application-name">` або `data-site`. Тут для цього вже є
 * `canonical`: він несе `SITE_ORIGIN + SITE_BASE`, тобто адресу ЦЬОГО
 * репозиторію, і його вже стереже `check:build`. Сторінка сусіда на тому
 * самому порті принесла б інший префікс — або не принесла б canonical зовсім.
 *
 * Штамп збірки — `app-version.json`: він ловить не чужий сайт, а СТАРУ збірку
 * власного, тобто прогін проти прев'ю, яке підняли до останнього `npm run
 * build`. Це окремий клас: сайт наш, знахідки чужі.
 *
 * Розбіжність зупиняє ВЕСЬ прогін одним зрозумілим повідомленням, бо цей
 * файл — сетап-проєкт, від якого залежать усі браузерні (`dependencies`).
 */

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };

test("на тестовому порті саме цей сайт і саме свіжа збірка", async ({ page, request }) => {
	const response = await page.goto(`${SITE_BASE}/`);
	expect(
		response?.ok(),
		`${SITE_BASE}/ не віддав 200 — на порті або ніхто, або чужий сервер`
	).toBe(true);

	const canonical = await page
		.locator('link[rel="canonical"]')
		.first()
		.getAttribute("href");
	expect(
		canonical,
		"на сторінці немає canonical — це не наш пререндер (або взагалі не наш сайт)"
	).toBeTruthy();
	expect(
		canonical,
		`canonical «${canonical}» не з цього репозиторію: на тестовому порті чужий сайт. ` +
			`Порти проєкту записані в PROJECT-CONTEXT.md і всі з --strictPort`
	).toContain(`${SITE_ORIGIN}${SITE_BASE}/`);

	const stamp = await request.get(`${SITE_BASE}/app-version.json`);
	expect(stamp.ok(), `${SITE_BASE}/app-version.json не віддано — збірка не наша`).toBe(true);
	const served = (await stamp.json()) as { version?: string };
	expect(
		served.version,
		`сервер віддає версію ${served.version}, у package.json ${pkg.version} — ` +
			"прев'ю підняте над СТАРОЮ збіркою, і всі падіння нижче будуть про неї"
	).toBe(pkg.version);
});
