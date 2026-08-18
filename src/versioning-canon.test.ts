// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

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
