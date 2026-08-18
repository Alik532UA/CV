// @vitest-environment node
import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";

/**
 * GATE-DEPS (DEPENDENCIES-v8 § 6) — гейт, який канон називає обов'язковим, а в
 * проєкті його не було зовсім.
 *
 * Три класи дефектів, і жодного з них не видно ні в `npm run check`, ні в
 * `npm run lint`, ні у зібраному сайті:
 *
 *   кілька lockfile     кожен менеджер ставить СВОЇ версії. Локально працює
 *                       один, у CI (`npm ci`) — інший, і різниця виявляється
 *                       падінням, у якому винен «дивний CI»;
 *   плаваюча версія     `*` або `latest` означає, що вчорашня збірка й сьогоднішня
 *                       зібрані з різного коду. Відтворити баг-репорт неможливо;
 *   інструмент у deps   `vite`, `typescript`, `@playwright/test` у `dependencies`
 *                       їдуть у продакшн-встановлення. На статичному хостингу це
 *                       не роздуває бандл, але ламає `npm audit --omit=dev`:
 *                       вразливість інструмента звітується як вразливість
 *                       продакшну, і гейт починають ігнорувати.
 *
 * `npm audit` перевіряється тут же — як факт наявності кроку в CI. Сам аудит
 * виконує пайплайн; тут доводиться, що крок не зник.
 */

const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
};

const WORKFLOWS = ".github/workflows";

describe("залежності (DEPENDENCIES-v8 § 6)", () => {
	it("перевірка жива: package.json прочитано й він не порожній", () => {
		expect(Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).length).toBeGreaterThan(5);
	});

	it("менеджер пакетів один", () => {
		const locks = ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb"].filter(
			existsSync
		);
		expect(locks, `знайдено кілька lockfile: ${locks.join(", ")}`).toHaveLength(1);
	});

	it("немає плаваючих версій", () => {
		const all = { ...pkg.dependencies, ...pkg.devDependencies };
		const floating = Object.entries(all)
			.filter(([, v]) => v === "*" || v === "latest" || v.startsWith("git") || v.includes("://"))
			.map(([k, v]) => `${k}: ${v}`);
		expect(floating, `невідтворювані версії: ${floating.join(", ")}`).toEqual([]);
	});

	it("інструменти збірки не в dependencies", () => {
		const runtime = Object.keys(pkg.dependencies ?? {});
		const buildOnly = runtime.filter((d) =>
			/^(vite|vitest|typescript|svelte-check|eslint|prettier|jsdom|globals|@sveltejs\/|@playwright\/|@types\/|@testing-library\/|@axe-core\/)/.test(
				d
			)
		);
		expect(buildOnly, `мають бути у devDependencies: ${buildOnly.join(", ")}`).toEqual([]);
	});

	/**
	 * DEP-DEPENDABOT (HIGH). `npm audit` каже, що вразливість Є; Dependabot —
	 * те, що приносить виправлення, не чекаючи, поки хтось згадає його запустити.
	 */
	it("Dependabot налаштований", () => {
		expect(existsSync(".github/dependabot.yml"), "немає .github/dependabot.yml").toBe(true);
	});

	it("у CI є крок npm audit", () => {
		const all = readdirSync(WORKFLOWS)
			.filter((f) => /\.ya?ml$/.test(f))
			.map((f) => readFileSync(`${WORKFLOWS}/${f}`, "utf8"))
			.join("\n");
		expect(all.length, "жодного workflow — перевірка мертва").toBeGreaterThan(0);
		expect(
			/npm audit\b[^\n]*--audit-level=(high|critical)/.test(all),
			"крок `npm audit --audit-level=high` зник із пайплайна"
		).toBe(true);
	});
});
