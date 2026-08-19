// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Інваріанти гарячих клавіш (HOTKEYS-v8 § 6, гейт `GATE-HOTKEYS`).
 *
 * ЧОМУ ЦЕЙ ФАЙЛ З'ЯВИВСЯ ПІЗНО. Гаряча клавіша виглядає як десять рядків у
 * обробнику, і саме тому її пишуть щоразу заново — а перевірки не пише ніхто.
 * Звірка п'яти проєктів автора показала, до чого це доводить: у сусідньому
 * `DigitalWorkshop` пошук мови неможливо заповнити, бо літера `t` у полі
 * закриває саму панель; `Ctrl+T` там відкриває вкладку браузера І перемикає
 * мову. Обидва дефекти живуть у коді, який компілюється, лінтиться і проходить
 * усі інші гейти без жодного слова.
 *
 * Тут перевіряються рівно ті чотири речі з § 6, які взагалі піддаються машині:
 *
 *   1. кожен обробник, зареєстрований на вікні чи документі, має захист полів
 *      вводу (§ 2.2, CRITICAL);
 *   2. модифікатори лишаються браузеру (§ 2.1, HIGH);
 *   3. літерні скорочення читаються з `code`, а не з `key` (§ 1.3, HIGH);
 *   4. літера означає те саме, що в канонічній карті, а `V` і `R` зайняті лише
 *      службовими жестами (§ 1.1, § 4, MEDIUM).
 *
 * П'яте — WCAG SC 2.1.4 (§ 3) — навмисно НЕ перевіряється кодом: «є перемикач»
 * і «перемикач справді вимикає скорочення» — різні твердження. Перевіряється
 * лише те, що обраний шлях (або його відсутність) названий у PROJECT-CONTEXT.md,
 * бо мовчання читається як «виконано».
 *
 * ЗВОРОТНИЙ ЕКСПЕРИМЕНТ (AI-AGENT-PITFALLS-v8 § 1.1) — виконаний 2026-08-20, а
 * не припущений. Три дефекти повернуто в `ShortcutState.svelte.ts` по одному, і
 * кожен дав червоне рівно в тій перевірці, яка за нього відповідає:
 *
 *   - прибрано `if (event.ctrlKey || event.metaKey || event.altKey) return;`
 *     → впала § 2.1;
 *   - у гілку `case "KeyT"` дописано `if (event.key === "t")` → впала § 1.3;
 *   - прибрано рядок із `isContentEditable` → впала § 2.2.
 */

const SKIP = new Set(["node_modules", ".svelte-kit", "build", "dist", ".temp"]);

function walk(dir: string, out: string[] = []): string[] {
	for (const entry of readdirSync(dir)) {
		if (SKIP.has(entry)) continue;
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) walk(full, out);
		else out.push(full.replace(/\\/g, "/"));
	}
	return out;
}

const SOURCES = walk("src").filter((f) => /\.(ts|svelte)$/.test(f) && !/\.test\.ts$/.test(f));
const read = (p: string) => readFileSync(p, "utf8");

/** Джерело правди про скорочення. Названо тут, бо решта перевірок читає саме його. */
const HOTKEY_SOURCE = "src/lib/controllers/ShortcutState.svelte.ts";

/**
 * Коментарі відрізаються перед пошуком. Файл із поясненням анти-патерну мусить
 * його процитувати, і сканер, що читає коментарі, падає на власній документації
 * — рівно так впав перший прогін `fluid-sizing-canon.test.ts`.
 *
 * Переноси рядків зберігаються, щоб номер рядка в повідомленні лишався справжнім.
 */
function withoutComments(text: string): string {
	const blank = (m: string) => m.replace(/[^\n]/g, " ");
	return text
		.replace(/\/\*[\s\S]*?\*\//g, blank)
		.replace(/<!--[\s\S]*?-->/g, blank)
		.replace(/^[ \t]*\/\/.*$/gm, blank);
}

/**
 * Обробники, зареєстровані на ВІКНІ чи ДОКУМЕНТІ. Саме вони небезпечні:
 * `onkeydown` на самому полі вводу — це його власна клавіатура, і захищати її
 * від себе самої не потрібно.
 */
function globalKeydownSources(): string[] {
	return SOURCES.filter((f) =>
		/(?:window|document)\s*\.addEventListener\(\s*["']keydown/.test(withoutComments(read(f)))
	);
}

/**
 * Обробник, який розрізняє СИМВОЛЬНІ клавіші: `KeyT`, `Digit3`, `Numpad7` або
 * `key === "t"`.
 *
 * Саме тут і тільки тут потрібен захист § 2.2. Обробник на вікні, що реагує
 * лише на `Escape`, `Tab` чи стрілки, полю вводу нічого не забирає: `Escape` —
 * названий виняток самого канону (модалку зсередини більше нічим не закрити), а
 * `Tab` у полі означає перехід до наступного елемента, а не введений символ.
 * Вимагати захисту від них — це змусити наступного автора або додати мертвий
 * рядок, або вписати файл у виняток; обидва варіанти псують перевірку сильніше
 * за пропущений випадок.
 */
const CHARACTER_KEY = /["'](?:Key[A-Z]|Digit\d|Numpad\d)|\.key\s*===\s*["']\w["']|Digit\|Numpad/;

function characterKeyHandlers(): string[] {
	return globalKeydownSources().filter((f) => CHARACTER_KEY.test(withoutComments(read(f))));
}

/** Літерне скорочення, прочитане як символ, а не як фізична клавіша. */
const LETTER_BY_KEY = /\.key\s*===\s*["'][a-z]["']/i;

describe("перевірка жива", () => {
	it("джерела й обробники знайдено", () => {
		expect(SOURCES.length).toBeGreaterThan(50);
		expect(SOURCES).toContain(HOTKEY_SOURCE);
		// Порожній перелік зробив би всі перевірки нижче зеленими назавжди.
		expect(globalKeydownSources().length, "обробників на вікні не знайдено").toBeGreaterThan(0);
		expect(
			characterKeyHandlers(),
			"жодного обробника символьних клавіш — § 2.2 нема на чому перевіряти"
		).toContain(HOTKEY_SOURCE);
	});

	it("регулярки знаходять анти-патерн, коли він є", () => {
		expect(`if (event.key === "t") theme.toggle();`).toMatch(LETTER_BY_KEY);
		expect(`if (event.code === "KeyT") theme.toggle();`).not.toMatch(LETTER_BY_KEY);
		expect(withoutComments(`// event.key === "t"\nconst a = 1;`)).not.toMatch(LETTER_BY_KEY);

		// Символьну клавішу треба впізнати в обох формах, якими її пишуть:
		// порівнянням і гілкою switch. Друга — саме та, що в цьому проєкті.
		expect(`if (event.code === "KeyT")`).toMatch(CHARACTER_KEY);
		expect(`case "KeyM":`).toMatch(CHARACTER_KEY);
		// А ось це — не символьні клавіші, і захисту § 2.2 вони не потребують.
		expect(`if (e.key === "Escape") close();`).not.toMatch(CHARACTER_KEY);
		expect(`if (e.key === "Tab" && modalRef) {`).not.toMatch(CHARACTER_KEY);
	});
});

describe("§ 2.2 — набір тексту не виконує команд", () => {
	/**
	 * Захистом вважається `closest` по полях, `isContentEditable` або власна
	 * функція з назвою `isTypingTarget` — три форми того самого. Порівняння з
	 * `tagName` саме по собі недостатнє в `contenteditable`, де фокус стоїть на
	 * вкладеному вузлі і його `tagName` — це `SPAN`; тому воно тут не рахується
	 * без `isContentEditable` поруч.
	 */
	const GUARD = /isTypingTarget|isContentEditable|closest\(\s*["'][^"']*(?:textarea|input)/i;

	it("захист розпізнається, коли він є, і не вигадується, коли його немає", () => {
		expect(`if (target?.isContentEditable) return;`).toMatch(GUARD);
		expect(`if (TEXT_ENTRY.test(target?.tagName ?? ""))	return;`).not.toMatch(GUARD);
	});

	it("кожен обробник символьних клавіш виходить, коли фокус у полі вводу", () => {
		const unguarded = characterKeyHandlers().filter((f) => !GUARD.test(withoutComments(read(f))));
		expect(
			unguarded,
			"клавіші перехоплюються під час набору тексту — у полі пошуку літера " +
				`виконає команду замість того, щоб надрукуватися:\n  ${unguarded.join("\n  ")}`
		).toEqual([]);
	});
});

describe("§ 2.1 — комбінації з модифікаторами лишаються браузеру", () => {
	it("обробник перевіряє ctrlKey й metaKey", () => {
		const handler = withoutComments(read(HOTKEY_SOURCE));
		expect(
			/ctrlKey[\s\S]{0,40}metaKey/.test(handler),
			"без цієї перевірки Ctrl+T відкриває нову вкладку І перемикає тему, " +
				"а Ctrl+F викликає пошук браузера І дію застосунку"
		).toBe(true);
	});
});

describe("§ 1.3 — скорочення не залежить від розкладки", () => {
	it("жодне літерне скорочення не читається з event.key", () => {
		const bad: string[] = [];
		for (const file of SOURCES) {
			const text = withoutComments(read(file));
			for (const m of text.matchAll(new RegExp(LETTER_BY_KEY, "gi"))) {
				const line = text.slice(0, m.index).split("\n").length;
				bad.push(`${file}:${line}  ${m[0]}`);
			}
		}
		expect(
			bad,
			"на українській розкладці фізична KeyT віддає key === 'е', і скорочення " +
				`зникає для того, хто не перемкнув розкладку:\n  ${bad.join("\n  ")}`
		).toEqual([]);
	});
});

describe("§ 1.1, § 4 — літера означає те саме, що в каноні", () => {
	/**
	 * Карта з § 1.1. Перевіряється лише те, що ВИКОРИСТАНО: клавіша, якої в
	 * проєкті немає, — не порушення, а відсутня фіча (`F`, `C`, `H` тут саме
	 * такі, і про це є таблиця в самому контролері).
	 */
	const CANON: Record<string, RegExp> = {
		KeyT: /theme/i,
		KeyL: /lang/i,
		KeyM: /sound|audio|mute/i,
		KeyB: /background/i
	};

	const handler = withoutComments(read(HOTKEY_SOURCE));

	it.each(Object.entries(CANON))("%s робить те, що в § 1.1", (code, expected) => {
		const at = handler.indexOf(code);
		if (at < 0) return; // клавіша не використана — це нормально
		expect(handler.slice(at, at + 200), `${code} робить не те, що в § 1.1`).toMatch(expected);
	});

	it.each(["KeyV", "KeyR"])("%s зайнята лише службовим жестом (§ 4)", (reserved) => {
		const at = handler.indexOf(reserved);
		if (at < 0) return;
		expect(
			handler.slice(at, at + 200),
			`${reserved} зарезервована під службовий жест — звичайна дія на ній означала б, ` +
				"що жест або не спрацює, або спрацює разом із нею"
		).toMatch(/debug|version|reset|sequence/i);
	});
});

describe("§ 5 — скорочення виявне", () => {
	/**
	 * Скорочення, про яке ніде не написано, існує лише для автора. З трьох
	 * способів § 5 тут обрано `aria-keyshortcuts`: він не займає місця на екрані
	 * (шапка резюме й так щільна), і саме його прочитає читалка — тобто дістається
	 * він насамперед тим, кому клавіатура потрібна не для зручності.
	 *
	 * Перевіряється відповідність у ОБИДВА боки. Обробник без оголошення — це
	 * скорочення-привид; оголошення без обробника гірше: читалка обіцяє клавішу,
	 * якої вже немає, і людина вважає несправною себе.
	 *
	 * Цифри `1`–`9` і `PgUp`/`PgDn` сюди свідомо не входять. Вони ведуть на
	 * секції, а порядок секцій `SectionState` бере з DOM — оголосити «3» на
	 * пункті меню означало б завести ДРУГЕ джерело правди про порядок і чекати,
	 * поки воно розійдеться з першим.
	 */
	const ANNOUNCED = new Set(
		SOURCES.filter((f) => f.endsWith(".svelte")).flatMap((f) =>
			[...read(f).matchAll(/aria-keyshortcuts="([^"]+)"/g)].map((m) => m[1])
		)
	);

	/** Літери з § 1.1, які цей проєкт справді обробляє. */
	const LETTERS = ["T", "L", "M", "B"];

	it.each(LETTERS)("%s оголошена через aria-keyshortcuts", (letter) => {
		const handler = withoutComments(read(HOTKEY_SOURCE));
		if (!handler.includes(`Key${letter}`)) return; // клавіші немає — нема про що казати
		expect(
			ANNOUNCED,
			`${letter} працює, але про неї ніде не сказано: читалка озвучить кнопку без ` +
				"згадки про клавішу, і скорочення лишиться відомим самому лише авторові"
		).toContain(letter);
	});

	it("жодне оголошення не обіцяє клавіші, якої немає", () => {
		const handler = withoutComments(read(HOTKEY_SOURCE));
		const ghosts = [...ANNOUNCED].filter(
			(shortcut) => LETTERS.includes(shortcut) && !handler.includes(`Key${shortcut}`)
		);
		expect(
			ghosts,
			`aria-keyshortcuts обіцяє те, чого обробник не робить: ${ghosts.join(", ")}`
		).toEqual([]);
	});

	it("службові жести в довідці не згадуються (§ 5, LOW)", () => {
		// `V` і `R` — не для відвідувача. Оголошена службова клавіша перетворює
		// жест на кнопку, яку хтось натисне випадково.
		expect([...ANNOUNCED].filter((s) => s === "V" || s === "R")).toEqual([]);
	});
});

describe("§ 3 — шлях WCAG SC 2.1.4 названий, а не мається на увазі", () => {
	/**
	 * Код цього не доводить і не має доводити (§ 6, остання вимога): «є
	 * перемикач» і «перемикач справді вимикає скорочення» — різні твердження.
	 * Машині лишається одне: пересвідчитися, що питання взагалі поставлене в
	 * PROJECT-CONTEXT.md — обраний шлях або записаний борг. Мовчання тут
	 * читається як «виконано», і саме так критерій рівня A тихо не виконує ніхто.
	 */
	it("PROJECT-CONTEXT.md називає стан SC 2.1.4", () => {
		const context = readFileSync("PROJECT-CONTEXT.md", "utf8");
		expect(
			/2\.1\.4/.test(context),
			"жодного слова про SC 2.1.4 у PROJECT-CONTEXT.md: одиночні літерні " +
				"скорочення мусять мати спосіб вимкнути, перепризначити або діяти лише " +
				"у фокусі — а який із трьох обрано, знає лише той, хто писав обробник"
		).toBe(true);
	});
});
