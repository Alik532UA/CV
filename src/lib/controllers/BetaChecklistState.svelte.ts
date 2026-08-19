import { storage } from "$lib/services/storage";
import { ALL_CHECKS, BETA_TABS, type BetaCheck } from "$lib/data/betaChecklist";

/**
 * Прогрес ручної перевірки (BETA-CHECKLIST-v8 § 3, § 6).
 *
 * ЧОТИРИ СТАНИ, А НЕ ДВА (§ 3.2). Середній — `weird`, «працює, але дивно» — і
 * він найдорожчий: бінарне «так/ні» округляє його до «так», а саме там живуть
 * дефекти, які потім знаходить користувач.
 *
 * ПОЗНАЧКА НЕСЕ ВЕРСІЮ ЗБІРКИ (§ 3.1, BETA-VERSION-STAMP). Без цього список
 * поступово перетворюється на звіт про минуле, який читають як звіт про
 * теперішнє: галочка «працює» з-перед сорока комітів виглядає точно так само,
 * як сьогоднішня. Позначка з іншої версії не зникає — вона все ще щось
 * означає, — але не рахується в поступі й підписана на сторінці.
 *
 * ВІДПОВІДІ ЛИШАЮТЬСЯ В БРАУЗЕРІ (§ 6.1). Збирати на сервер означало б таблицю,
 * правила доступу до неї й чужі імена в ній — заради даних, яких поки ніхто не
 * читає. Рішення дешево скасувати: агрегація доклеюється пізніше, не
 * переписуючи сторінку.
 *
 * Запис іде НАСКРІЗНИЙ — у мутаторі, а не в `$effect` (SVELTE-CORE-v8 § 1.9):
 * це module-level синглтон, у його конструкторі `$effect` кинув би
 * `effect_orphan`.
 */

export type Vote = "fail" | "weird" | "ok";

export interface Mark {
	vote: Vote;
	/** Версія застосунку, на якій поставили. */
	version: string;
}

/** Ключ у фасаді сховища — префікс `cv-svelte_` додає він сам. */
const STORAGE_KEY = "betaChecklist";

const VOTES: readonly Vote[] = ["fail", "weird", "ok"];

function isMark(value: unknown): value is Mark {
	if (typeof value !== "object" || value === null) return false;
	const m = value as Record<string, unknown>;
	return VOTES.includes(m.vote as Vote) && typeof m.version === "string";
}

/**
 * Зіпсоване або чуже значення дорівнює відсутньому. Ключ живе в спільному
 * `localStorage` шести застосунків, і будь-що з нього — недовірений ввід.
 * Заразом відсіюються `id`, яких у чеклисті вже немає: пункт видалили, а
 * позначка лишилася б рахуватися в поступі.
 */
function readMarks(): Record<string, Mark> {
	const raw = storage.getJSON<unknown>(STORAGE_KEY);
	if (typeof raw !== "object" || raw === null) return {};

	const known = new Set(ALL_CHECKS.map((c) => c.id));
	const out: Record<string, Mark> = {};
	for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
		if (known.has(id) && isMark(value)) out[id] = value;
	}
	return out;
}

class BetaChecklistState {
	marks = $state<Record<string, Mark>>({});
	/** Текст звіту, показаний у полі, коли буфер обміну відмовив (§ 6.2). */
	reportFallback = $state("");

	/** Позначено на ЦІЙ версії — саме це й означає «пройдено». */
	done = $derived(
		Object.values(this.marks).filter((m) => m.version === __APP_VERSION__).length
	);

	total = ALL_CHECKS.length;

	/** Викликає сторінка після монтування: сховище на сервері недоступне. */
	load() {
		this.marks = readMarks();
	}

	markOf(id: string): Mark | undefined {
		return this.marks[id];
	}

	/** Позначка з іншої версії: показується, але не рахується (§ 3.1). */
	isStale(id: string): boolean {
		const mark = this.marks[id];
		return mark !== undefined && mark.version !== __APP_VERSION__;
	}

	/** Повторне натискання того самого стану знімає позначку. */
	vote(id: string, vote: Vote) {
		const current = this.marks[id];
		const next = { ...this.marks };
		if (current?.vote === vote && current.version === __APP_VERSION__) {
			delete next[id];
		} else {
			next[id] = { vote, version: __APP_VERSION__ };
		}
		this.marks = next;
		storage.setJSON(STORAGE_KEY, next);
	}

	clear() {
		this.marks = {};
		this.reportFallback = "";
		storage.remove(STORAGE_KEY);
	}

	/**
	 * У звіті: версія збірки, час в ISO, `userAgent`, мова, тема, ЛИШЕ позначені
	 * пункти і поламане вгорі (§ 6.1). Перелік недивленого зробив би звіт
	 * нечитним — а читає його той, хто шукає, що саме полагодити.
	 *
	 * Пункт, позначений зламаним при `coverage: "covered"`, несе окремий рядок:
	 * це звіт про дефект ТЕСТА, а не сайту, і новина гірша за звичайний баг, бо
	 * знецінює всі зелені прогони (§ 3).
	 */
	report(lang: "uk" | "en"): string {
		// Локальні довідники на один виклик, а не стан. Складаються з масиву, а
		// не мутацією: `SvelteMap` дав би реактивність, на яку ніхто не
		// підписаний, і пережив би сам звіт.
		const byId = new Map(ALL_CHECKS.map((c) => [c.id, c]));
		const tabOf = new Map(
			BETA_TABS.flatMap((tab) => tab.checks.map((c) => [c.id, tab.title[lang]] as const))
		);

		const order: Record<Vote, number> = { fail: 0, weird: 1, ok: 2 };
		const label: Record<Vote, string> = {
			fail: "[НЕ ПРАЦЮЄ]",
			weird: "[ПРАЦЮЄ, АЛЕ ДИВНО]",
			ok: "[ПРАЦЮЄ]"
		};

		const marked = Object.entries(this.marks)
			.map(([id, mark]) => ({ id, mark, check: byId.get(id) }))
			.filter((row): row is { id: string; mark: Mark; check: BetaCheck } => row.check !== undefined)
			.sort((a, b) => order[a.mark.vote] - order[b.mark.vote]);

		const head = [
			"--- BETA CHECKLIST REPORT ---",
			`VERSION: ${__APP_VERSION__}`,
			`DATE: ${new Date().toISOString()}`,
			`URL: ${window.location.href}`,
			`USER_AGENT: ${navigator.userAgent}`,
			`LANG: ${lang}`,
			`THEME: ${document.documentElement.getAttribute("data-theme") ?? "?"}`,
			`MARKED: ${marked.length}/${this.total}`,
			"---"
		];

		if (marked.length === 0) return [...head, "(жодного позначеного пункта)"].join("\n");

		const body = marked.flatMap(({ id, mark, check }) => {
			const lines = [
				`${label[mark.vote]} ${id} (${tabOf.get(id) ?? "?"})`,
				`    ${check.text[lang]}`
			];
			if (mark.version !== __APP_VERSION__) {
				lines.push(`    (позначено на версії ${mark.version})`);
			}
			if (mark.vote !== "ok" && check.coverage === "covered" && check.test) {
				lines.push(`    !!! ПУНКТ ПОКРИТО АВТОТЕСТОМ ${check.test} —`);
				lines.push("        тест не побачив цієї помилки");
			}
			return lines;
		});

		return [...head, ...body].join("\n");
	}
}

export const betaChecklist = new BetaChecklistState();
