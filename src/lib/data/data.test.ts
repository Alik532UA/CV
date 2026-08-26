// @vitest-environment node
import { describe, expect, it } from "vitest";
import { skillsData } from "./skills";
import { experienceData } from "./experience";
import { educationData } from "./education";
import type { Skill } from "./schemas";

/**
 * Умови даних резюме, яких ТИП не виражає.
 *
 * Звідки взявся цей файл. `skills`, `experience` й `education` викликали
 * `.parse()` зі схеми zod над власними літералами на завантаженні модуля —
 * тобто перевіряли в БРАУЗЕРІ ВІДВІДУВАЧА те, що написано двома рядками вище
 * в тому ж файлі. Коштувало це 30 КБ gzip у початковому бандлі (весь zod), а
 * ловило рівно одну умову, яку не ловить компілятор: `level` у межах 0–100.
 *
 * Умова лишилася, місце перевірки змінилося: прогін замість сторінки. Хто
 * дізнається про помилку — CI чи випадковий відвідувач — і є вся різниця.
 *
 * Заразом перевіряється те, чого zod не перевіряв ніколи: унікальність `id` і
 * несуперечність ключів. Дублікат `id` не порушує жодної схеми, зате дає два
 * однакові ключі в `{#each}` — Svelte перемальовує не той елемент, і виглядає
 * це як «іконка не та», а не як помилка в даних.
 */

const allSkills: Skill[] = Object.values(skillsData).flat();

describe("дані резюме", () => {
	it("перевірка жива: набори не порожні", () => {
		// CODE-QUALITY-v8 § 3.5: порожній вхід зробив би решту файлу зеленою
		// назавжди — і тим імовірніше, чим сильніше зміниться форма даних.
		expect(allSkills.length).toBeGreaterThan(15);
		expect(experienceData.it.length + experienceData.nonIT.length).toBeGreaterThan(3);
		expect(educationData.length).toBeGreaterThan(1);
	});

	it("рівень навички лежить у 0–100", () => {
		const wrong = allSkills
			.filter((s) => !Number.isFinite(s.level) || s.level < 0 || s.level > 100)
			.map((s) => `${s.id}: ${s.level}`);
		expect(wrong, `шкала навички — відсоток, а не бали:\n${wrong.join("\n")}`).toEqual([]);
	});

	it("кожна навичка має значок", () => {
		// Поле мало тип `z.any()`, тож забутий значок не був помилкою ніде:
		// `<skill.icon />` з `undefined` падає вже в браузері.
		const missing = allSkills.filter((s) => !s.icon).map((s) => s.id);
		expect(missing, `значок відсутній:\n${missing.join("\n")}`).toEqual([]);
	});

	it.each([
		["навички", () => allSkills.map((s) => s.id)],
		["досвід", () => [...experienceData.it, ...experienceData.nonIT].map((e) => e.id)],
		["освіта", () => educationData.map((e) => e.id)]
	])("%s: жоден id не повторюється", (_name, ids) => {
		const seen = ids();
		const duplicates = seen.filter((id, i) => seen.indexOf(id) !== i);
		expect(duplicates, `дублікат id ламає ключі {#each}:\n${duplicates.join("\n")}`).toEqual([]);
	});
});
