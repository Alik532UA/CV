import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolveSiblingLocale, SIBLINGS, siblingUrl } from "./siblings";
import { DEFAULT_LANGUAGE, langUrl } from "./i18n/routing";

/**
 * `siblings.ts` — ОДНА таблиця, скопійована у вісім репозиторіїв, і кожен із них
 * знає правду лише про свій рядок.
 *
 * Сюди веде Slovko («Про розробника»), і сюди ж указує портфоліо
 * DigitalWorkshop. Обидва будують адресу з рядка `cv`: сорок дві мови,
 * англійська на голій адресі, решта сегментом. Розходження ламає ЧУЖІ сайти, а
 * симптом видно лише перейшовши сюди з них — тож перевірка стоїть тут, у репо,
 * яке цю розбіжність спричиняє, а не там, де вона проявиться.
 *
 * `I18nState.svelte.ts` читається як ТЕКСТ, а не імпортується: він тягне сорок
 * два словники. Перелік мов — це рядок оголошення, і зчитати його дешевше, ніж
 * підняти пів застосунку заради масиву.
 *
 * Середовище — jsdom, а не `node`, і це не смак: `i18n/routing` імпортує
 * `$app/paths`, а той тягне клієнтський рантайм SvelteKit, який на першому ж
 * рядку читає `window.fetch`. У `node` файл падає ще до першої перевірки —
 * тобто «зелений» прогін тут означав би лише те, що набір не запускався.
 *
 * Зворотний експеримент (AI-AGENT-PITFALLS-v8 § 1.1): прибрати `crh` із
 * `SUPPORTED_LANGUAGES` — червоніє звірка мов; поміняти `DEFAULT_LANGUAGE` на
 * `"uk"` — червоніють мова голої адреси й усі сорок дві звірки з `langUrl()`;
 * прибрати читання `?lang=` з `init()` — червоніє перевірка приймача.
 */

const ROW = SIBLINGS.cv;
const STATE = readFileSync("src/lib/controllers/I18nState.svelte.ts", "utf8");

/** Мови з оголошення `SUPPORTED_LANGUAGES`, а не переписані сюди руками. */
function declaredLanguages(): string[] {
	const block = /SUPPORTED_LANGUAGES: readonly Language\[\] = \[([\s\S]*?)\];/.exec(STATE);
	if (!block) return [];
	return [...block[1].matchAll(/"([\w-]+)"/g)].map((m) => m[1]).sort();
}

describe("рядок цього сайту в таблиці сусідів", () => {
	it("перелічує ті самі сорок дві мови, що сайт справді віддає", () => {
		const declared = declaredLanguages();
		expect(declared.length, "перелік мов більше не читається — перевірка мертва").toBeGreaterThan(0);
		expect([...ROW.locales].sort()).toEqual(declared);
	});

	it("називає ту саму мову на голій адресі", () => {
		expect(ROW.defaultLocale).toBe(DEFAULT_LANGUAGE);
	});

	it("несе той самий origin і базу, що й конфіг сайту", () => {
		const site = readFileSync("src/lib/config/site.js", "utf8");
		const origin = /SITE_ORIGIN = "([^"]+)"/.exec(site)?.[1];
		const base = /SITE_BASE = "([^"]+)"/.exec(site)?.[1];
		expect(origin, "site.js більше не оголошує SITE_ORIGIN").toBeTruthy();
		expect(ROW.origin).toBe(origin);
		expect(ROW.base).toBe(base);
	});

	it("узгоджений із макетом щодо кінцевого слеша", () => {
		const layout = readFileSync("src/routes/+layout.ts", "utf8");
		const declared = /trailingSlash = '(\w+)'/.exec(layout)?.[1];
		expect(declared, "макет більше не оголошує trailingSlash").toBeTruthy();
		expect(ROW.trailingSlash).toBe(declared === "always");
	});

	/*
	 * Найдорожча звірка: адреса, яку СУСІД побудує сюди, мусить збігатися з тією,
	 * яку цей сайт будує сам для canonical і hreflang. Розійшовшись, вони дають
	 * чужі посилання на 404 — і побачити це можна лише перейшовши за одним із них.
	 */
	it("будує ті самі адреси, що й langUrl цього сайту", () => {
		for (const language of ROW.locales) {
			expect(siblingUrl("cv", language).split("?")[0], `мова ${language}`).toBe(
				langUrl(ROW.origin, language as never)
			);
		}
	});
});

describe("приймач `?lang=` на голому шляху", () => {
	/*
	 * Приймач тут ОБОВ'ЯЗКОВИЙ: гола адреса цього сайту застосовує ЗБЕРЕЖЕНУ
	 * мову, тож без параметра відвідувач, що колись обрав тут українську,
	 * приходив би з англійської сторінки Slovko — і бачив українську.
	 */
	it("читає параметр раніше за збережений вибір", () => {
		const asked = STATE.indexOf('params.get("lang")');
		const saved = STATE.indexOf('storage.get("lang")');
		expect(asked, "читання ?lang= зникло").toBeGreaterThan(-1);
		expect(saved, "читання збереженої мови зникло").toBeGreaterThan(-1);
		expect(asked, "збережений вибір знову перекриває мову переходу").toBeLessThan(saved);
	});

	it("не пише мову з адреси у сховище", () => {
		const arrival = STATE.slice(
			STATE.indexOf('params.get("lang")'),
			STATE.indexOf('storage.get("lang")')
		);
		expect(arrival).not.toMatch(/storage\.set/);
	});

	/*
	 * Типова мова лишається в параметрі, решта переїжджає в шлях. `/CV/en/` не
	 * існує, тож прибрати `?lang=en` означало б голу адресу — «вибору не
	 * зроблено», — і перезавантаження віддало б сторінку збереженій мові.
	 */
	it("переписує адресу лише для мов, які шлях може назвати", () => {
		expect(STATE).toMatch(/asked !== DEFAULT_LANGUAGE/);
	});

	it("несе решту параметрів через переписування адреси", () => {
		expect(STATE).toMatch(/params\.delete\("lang"\)/);
		expect(STATE).toMatch(/rest \? `\?\$\{rest\}` : ""/);
	});
});

describe("посилання звідси несуть мову, якою читають тут", () => {
	it("кладе мову в шлях, коли в сусіда вона не типова", () => {
		expect(siblingUrl("mindstep", "uk")).toBe("https://alik532ua.github.io/MindStep/?lang=uk");
		expect(siblingUrl("digitalworkshop", "ja")).toBe(
			"https://alik532ua.github.io/DigitalWorkshop/ja/"
		);
		expect(siblingUrl("teatralo4ka", "en")).toBe("https://teatralo4ka.odesa.ua/en/");
	});

	it("кладе мову в параметр, коли шлях її назвати не може", () => {
		expect(siblingUrl("digitalworkshop", "uk")).toBe(
			"https://alik532ua.github.io/DigitalWorkshop/?lang=uk"
		);
		expect(siblingUrl("vetcrewgames", "uk")).toBe(
			"https://alik532ua.github.io/VetCrewGames/?lang=uk"
		);
		expect(siblingUrl("slovko", "pl")).toBe("https://alik532ua.github.io/Slovko/?lang=pl");
	});

	/*
	 * Сорок дві мови тут проти двох у школах. Японець, який читає це резюме
	 * японською, у as5 отримає англійську, а не українську: фолбек мусить бути
	 * ЧИТНИМ, а не просто дійсним.
	 */
	it("містить англійською там, де тутешньої мови немає", () => {
		expect(resolveSiblingLocale("as5", "ja")).toBe("en");
		expect(resolveSiblingLocale("mindstep", "he")).toBe("en");
		expect(resolveSiblingLocale("teatralo4ka", "ka")).toBe("en");
	});

	it("зводить en-us до наявної мови сусіда, а не вважає невідомим", () => {
		expect(resolveSiblingLocale("vetcrewgames", "en-us")).toBe("en");
		expect(resolveSiblingLocale("slovko", "en-us")).toBe("en");
	});
});
