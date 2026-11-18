// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { STRUCTURED_PROFILE } from "./lib/data/knowledgeBase";

/**
 * VERSIONING-v8 § 6 — інваріантів не було, а `static/app-version.json` тим
 * часом стверджував неправду.
 *
 * Файл лежав із `buildTime: "2026-04-28T16:45:00.000Z"` при версії 1.0.41.
 * Дата — це момент, коли хтось востаннє запустив `npm run bump`, а не момент
 * збірки, і на кожній наступній збірці вона лишалася тією самою. Канон
 * (§ 1.4) забороняє комітити дані моменту збірки саме тому: у баг-репорті
 * такий рядок відповідає на питання «яку збірку бачив користувач» упевнено й
 * неправильно, а це гірше, ніж не відповідати зовсім.
 *
 * Що лишається в файлі — сама версія, і вона мусить збігатися з `package.json`.
 * Розійтися їм є як: `bump` пише обидва, а руки правлять один.
 *
 * Джерело версії для КОДУ — `__APP_VERSION__` із `vite.config.ts`, тобто те
 * саме `package.json`. Тому третій випадок нижче: літерал версії в джерелах
 * означає третю копію, яка застаріє першою.
 */

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };
const appVersion = JSON.parse(readFileSync("static/app-version.json", "utf8")) as Record<
	string,
	unknown
>;

const walk = (dir: string, out: string[] = []): string[] => {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else if (/\.(ts|svelte)$/.test(entry)) out.push(full.replace(/\\/g, "/"));
	}
	return out;
};

const sources = walk("src").filter((f) => !/\.(test|spec)\.ts$/.test(f));

describe("версіонування (VERSIONING-v8 § 6)", () => {
	it("перевірка жива: версія прочитана й має форму semver", () => {
		expect(sources.length).toBeGreaterThan(20);
		expect(pkg.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it("app-version.json не містить даних моменту збірки (§ 1.4)", () => {
		expect(
			Object.keys(appVersion),
			"buildTime дописується при збірці, а не комітиться — інакше він показує момент bump і бреше"
		).toEqual(["version"]);
	});

	it("версія у app-version.json збігається з package.json", () => {
		expect(appVersion.version).toBe(pkg.version);
	});

	it("версія ніде не захардкоджена в джерелах", () => {
		const bad = sources.filter((f) =>
			/const\s+\w*VERSION\w*\s*=\s*['"]\d+\.\d+\.\d+['"]/.test(readFileSync(f, "utf8"))
		);
		expect(bad, `третя копія версії, яка застаріє першою: ${bad.join(", ")}`).toEqual([]);
	});

	it("звіт логів несе версію — інакше баг-репорт не прив'язати до збірки", () => {
		const log = readFileSync("src/lib/services/logService.svelte.ts", "utf8");
		expect(log).toMatch(/VERSION:\s*\$\{__APP_VERSION__\}/);
	});
});

/**
 * Відлік професійного стажу від зафіксованої дати.
 * Дозволяє контролювати актуальність резюме й не заявляти більше років,
 * ніж минуло насправді.
 */
const AQA_START = "2022-11";
const QA_TOTAL_START = "2021-06";

function elapsedFullYears(startIso: string, now: Date = new Date()): number {
	const start = new Date(startIso.length === 7 ? `${startIso}-01T00:00:00Z` : `${startIso}T00:00:00Z`);
	if (Number.isNaN(start.getTime())) return 0;

	let years = now.getUTCFullYear() - start.getUTCFullYear();
	const monthDiff = now.getUTCMonth() - start.getUTCMonth();
	if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < start.getUTCDate())) {
		years--;
	}
	return Math.max(0, years);
}

describe("досвід та стаж (календарні інваріанти та нагадування)", () => {
	it("роки AQA в резюме не перевищують фактично минулий календарний час", () => {
		const elapsedAqa = elapsedFullYears(AQA_START);
		const currentAqa = STRUCTURED_PROFILE.experienceYearsAutomation;

		// Інваріант правдивості: не можна стверджувати більше років, ніж минуло
		expect(currentAqa).toBeGreaterThanOrEqual(1);
		expect(currentAqa).toBeLessThanOrEqual(elapsedAqa);

		// М'яке нагадування, якщо минув ще один календарний рік і планку можна підняти
		if (currentAqa < elapsedAqa) {
			// eslint-disable-next-line no-console
			console.info(
				`\n[CV Experience Reminder] Минув ще один календарний рік: з дати старту AQA (${AQA_START}) пройшло вже ${elapsedAqa} р., а в резюме вказано ${currentAqa}+ р. Можна розглянути підвищення планки.\n`
			);
		}
	});

	it("загальні роки QA в резюме не перевищують фактично минулий час", () => {
		const elapsedTotal = elapsedFullYears(QA_TOTAL_START);
		const currentTotal = STRUCTURED_PROFILE.experienceYearsTotal;

		expect(currentTotal).toBeGreaterThanOrEqual(1);
		expect(currentTotal).toBeLessThanOrEqual(elapsedTotal);

		if (currentTotal < elapsedTotal) {
			// eslint-disable-next-line no-console
			console.info(
				`\n[CV Experience Reminder] З дати старту QA (${QA_TOTAL_START}) пройшло вже ${elapsedTotal} р., а в резюме вказано ${currentTotal}+ р. Можна розглянути підвищення планки.\n`
			);
		}
	});

	it("усі 42 мовні файли синхронізовані за числом років AQA з knowledgeBase", () => {
		const localesDir = "src/lib/i18n/locales";
		const files = readdirSync(localesDir).filter((f) => f.endsWith(".ts") && f !== "en-us.ts");
		const expectedDigit = String(STRUCTURED_PROFILE.experienceYearsAutomation);
		const mismatches: string[] = [];

		for (const file of files) {
			const content = readFileSync(join(localesDir, file), "utf8");
			const match = content.match(/\([^)]*AQA[^)]*\)/i) || content.match(/（[^）]*AQA[^）]*）/);
			if (!match || !match[0].includes(expectedDigit)) {
				mismatches.push(`${file}: очікувалось число ${expectedDigit}, знайдено ${match ? match[0] : "нічого"}`);
			}
		}

		expect(
			mismatches,
			`Незбіг років AQA між knowledgeBase (${expectedDigit}) та локалями:\n${mismatches.join("\n")}`
		).toEqual([]);
	});
});
