// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Інваріанти по джерелах для SVELTE-CORE-v9 (`GATE-SVELTE-SOURCES`).
 *
 * Три класи дефектів, які обʼєднує одна властивість: **усі троє мовчать**.
 * Компілятор про них не каже, `svelte-check` не каже, юніт-тест сервісу
 * зелений, сторінка працює.
 *
 *   SC-SUBSCRIPTION-WIRED   HIGH    підписка, дописана й ніким не викликана
 *   SC-SNAPSHOT-BOUNDARY    HIGH    проксі `$state` за межею серіалізації
 *   SC-LISTENER-CLEANUP     MEDIUM  слухач без парного зняття
 *
 * Заміряно в сусідніх проєктах пакета. `MindStep`, серпень 2026:
 * `authService.init()` не мав жодного виклику — разом із ним не працювали
 * злиття рекорду з хмарним і жива підписка на профіль, а
 * `roomService.subscribeToPublicRooms()` лежав готовим, поки лобі читало
 * перелік одноразово. Скарга автора звучала як «список оновлюється лише
 * кнопкою» — тобто симптом навіть не вказував у бік підписки.
 *
 * Тут усі три перевірки зараз ЗЕЛЕНІ, і це сказано вголос: вони заводяться не
 * під знахідку, а під клас, який у цьому проєкті вже має всі передумови.
 * Контролерів із `init()` тут сім, і кожен викликається рівно з одного місця —
 * `+layout.svelte`; додати восьмий і забути рядок у макеті нічого не коштує.
 */

const SKIP = new Set(["node_modules", ".svelte-kit", "build", "dist", ".temp"]);

function walk(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		if (SKIP.has(name)) return [];
		const full = join(dir, name);
		return statSync(full).isDirectory() ? walk(full) : [full];
	});
}

const ALL = walk("src").map((f) => f.replace(/\\/g, "/"));
const isTest = (f: string) => /\.test\.ts$/.test(f);

/** Сервісний шар: там підписки оголошуються, і там же вони не рахуються. */
const SERVICE_LAYER = ALL.filter(
	(f) => /^src\/lib\/(services|controllers)\//.test(f) && !isTest(f)
);
/** Усе інше, що виконується: макет, сторінки, компоненти, утиліти, гачки. */
const CONSUMER_LAYER = ALL.filter(
	(f) =>
		!isTest(f) &&
		!/^src\/lib\/(services|controllers)\//.test(f) &&
		/\.(svelte|ts)$/.test(f) &&
		!/\.d\.ts$/.test(f)
);

const read = (f: string) => readFileSync(f, "utf8");

/**
 * Той самий текст без комментарів — і без цього перевірка підписок бреше.
 *
 * Заміряно на зворотному експерименті: `theme.init()` у `+layout.svelte`
 * закоментували — інваріант лишився ЗЕЛЕНИМ. Причина не в регулярці: рядком
 * вище в тому ж файлі стоїть коментар «theme.init() підписується на
 * prefers-color-scheme…», тобто виклик можна було видалити НАЗОВСІМ, а греп
 * усе одно знаходив би імʼя. Це той самий клас, що «ланцюжок сиріт, чиє імʼя
 * греп знаходить» (PROJECT-STRUCTURE-v9 § 4.3.1).
 *
 * `//` знімається лише там, де перед ним не `:` і не `/` — інакше з
 * `https://` лишалося б `https:`.
 */
const codeOnly = (source: string) =>
	source
		.replace(/<!--[\s\S]*?-->/g, "")
		.replace(/\/\*[\s\S]*?\*\//g, "")
		.replace(/(^|[^:/])\/\/.*$/gm, "$1");

/**
 * Імена, під якими підписка мусить бути ПІДКЛЮЧЕНА (§ 3.2.1). `init` тут
 * навмисно: у цьому проєкті це головний спосіб завести контролер.
 */
const WIRED_NAMES = /^(subscribe[A-Za-z0-9_]*|init|start[A-Za-z0-9_]*|listen[A-Za-z0-9_]*)$/;

interface Subscription {
	file: string;
	/** Як цей метод викликають зовні: `shortcuts.init` або `initAnalytics`. */
	call: string;
}

/**
 * Підписки сервісного шару разом із формою їхнього виклику.
 *
 * Форма важлива: `init` є у семи контролерів, тож пошук просто за іменем
 * `init(` вважав би сімох підключеними через один виклик восьмого. Тому для
 * методу класу шукається `<екземпляр>.<метод>(`, а екземпляр беруться з
 * `export const x = new XState()` — це конвенція проєкту, і вона перевіряється
 * канаркою нижче.
 */
function subscriptions(): Subscription[] {
	const found: Subscription[] = [];
	for (const file of SERVICE_LAYER) {
		const source = read(file);

		// Клас → екземпляр, під яким його експортують.
		const instances = new Map<string, string>();
		for (const m of source.matchAll(/export\s+const\s+(\w+)\s*=\s*new\s+(\w+)\s*\(/g)) {
			instances.set(m[2], m[1]);
		}

		// Методи класів: один рівень відступу всередині `class X {`.
		for (const cls of source.matchAll(/(?:export\s+)?class\s+(\w+)\s*\{/g)) {
			const start = cls.index + cls[0].length;
			const body = source.slice(start, closingBrace(source, start - 1));
			const instance = instances.get(cls[1]);
			if (!instance) continue;
			for (const method of body.matchAll(/^\t(?:async\s+)?(\w+)\s*\(/gm)) {
				if (WIRED_NAMES.test(method[1])) found.push({ file, call: `${instance}.${method[1]}` });
			}
		}

		// Вільні функції сервісу: `export function initAnalytics()`.
		for (const fn of source.matchAll(/export\s+(?:async\s+)?function\s+(\w+)\s*\(/g)) {
			if (WIRED_NAMES.test(fn[1]) || /^(init|start|listen|subscribe)[A-Z]/.test(fn[1])) {
				found.push({ file, call: fn[1] });
			}
		}
	}
	return found;
}

/** Позиція `}`, що закриває дужку, яка стоїть у `open`. */
function closingBrace(text: string, open: number): number {
	let depth = 0;
	for (let i = open; i < text.length; i++) {
		if (text[i] === "{") depth++;
		else if (text[i] === "}" && --depth === 0) return i;
	}
	return text.length;
}

describe("підписка, яку ніхто не кличе (SC-SUBSCRIPTION-WIRED)", () => {
	const subs = subscriptions();

	it("перевірка жива: підписки й обидва шари знайдено", () => {
		expect(SERVICE_LAYER.length, "сервісного шару не видно").toBeGreaterThan(10);
		expect(CONSUMER_LAYER.length, "шару споживачів не видно").toBeGreaterThan(20);
		expect(
			subs.length,
			"жодного `init`/`subscribe*`/`start*` у сервісному шарі — сканер читає не те"
		).toBeGreaterThan(5);
		// Конвенція `export const x = new XState()` справді тримається: інакше
		// методи класів не потрапили б у перелік узагалі.
		expect(
			subs.filter((s) => s.call.includes(".")).length,
			"жодного методу класу через екземпляр — конвенція експорту змінилася"
		).toBeGreaterThan(3);
	});

	/**
	 * Канарка стоїть НЕ на тому, що перевіряє інваріант нижче, і це важливо:
	 * «у макеті є `theme.init()`» було б тим самим твердженням, тільки
	 * записаним двічі. Тут перевіряється те, БЕЗ ЧОГО інваріант бреше —
	 * зняття комментарів і те, що шар споживачів узагалі прочитаний.
	 */
	it("детектор не приймає закоментований виклик за виклик", () => {
		expect(codeOnly("\t\t// const teardown = theme.init();")).not.toMatch(/theme\.init/);
		expect(codeOnly("/** ahead of `theme.init()`, `scrollbar.init()` */")).not.toMatch(
			/theme\.init/
		);
		// `//` у середині рядка — але не в `https://`.
		expect(codeOnly("const url = 'https://example.com'; // sound.init()")).toMatch("https://");
		expect(codeOnly("const url = 'https://example.com'; // sound.init()")).not.toMatch(
			/sound\.init/
		);

		const consumers = CONSUMER_LAYER.map((f) => codeOnly(read(f))).join("\n");
		expect(consumers, "шар споживачів не читається — макета в ньому немає").toMatch(
			/\bonMount\s*\(/
		);
		expect(consumers.length, "шар споживачів порожній").toBeGreaterThan(10_000);
	});

	it("кожна підписка сервісного шару викликається поза ним", () => {
		const consumers = CONSUMER_LAYER.map((f) => codeOnly(read(f))).join("\n");
		const orphans = subs
			.filter(({ call }) => {
				const name = call.split(".").at(-1) as string;
				const pattern = call.includes(".")
					? new RegExp(`\\b${call.replace(".", "\\s*\\.\\s*")}\\s*\\(`)
					: new RegExp(`\\b${name}\\s*\\(`);
				return !pattern.test(consumers);
			})
			.map(({ file, call }) => `${file}: ${call}()`);

		expect(
			[...new Set(orphans)],
			"підписка написана й ніким не викликана: юніт-тест сервісу зелений, бо він\n" +
				"перевіряє метод, а не те, що метод підключено. Закривається одним із двох —\n" +
				"викликом там, де вона потрібна, або видаленням методу:\n" +
				orphans.join("\n")
		).toEqual([]);
	});
});

/**
 * Межа серіалізації (§ 1.6, SC-SNAPSHOT-BOUNDARY, HIGH).
 *
 * `structuredClone` на проксі `$state` кидає `DataCloneError`; `postMessage` —
 * те саме; `JSON.stringify` серіалізує, але без вкладених `Map`/`Set`, а
 * сторонній SDK отримує обʼєкт, який змінюється під ним. Тому за межу їде
 * `$state.snapshot(...)`, а не сам проксі.
 */
describe("проксі $state не переходить межу серіалізації (SC-SNAPSHOT-BOUNDARY)", () => {
	const RUNE_FILES = ALL.filter((f) => /\.(svelte|svelte\.ts)$/.test(f) && !isTest(f));
	const BOUNDARY = /(JSON\.stringify|structuredClone|postMessage)\s*\(\s*([A-Za-z_$][\w$]*)/g;

	/** Знахідки: імʼя стану їде за межу без `$state.snapshot`. */
	function crossings(files: string[] = RUNE_FILES): string[] {
		const found: string[] = [];
		for (const file of files) {
			const source = read(file);
			const states = new Set(
				[...source.matchAll(/\b(?:let|const|var)\s+([\w$]+)[^=\n]*=\s*\$state[<(]/g)].map(
					(m) => m[1]
				)
			);
			// Поля класів: `count = $state(0)` без `let`.
			for (const m of source.matchAll(/^\s*(?:#|readonly\s+)?([\w$]+)\s*=\s*\$state[<(]/gm)) {
				states.add(m[1]);
			}
			if (states.size === 0) continue;
			for (const m of source.matchAll(BOUNDARY)) {
				if (!states.has(m[2])) continue;
				const line = source.slice(0, m.index).split("\n").length;
				if (/\$state\.snapshot/.test(source.split("\n")[line - 1])) continue;
				found.push(`${file}:${line}: ${m[1]}(${m[2]})`);
			}
		}
		return found.sort();
	}

	it("перевірка жива: файли з рунами знайдено, і стани в них розпізнаються", () => {
		expect(RUNE_FILES.length, "файлів із рунами не видно").toBeGreaterThan(20);
		const withState = RUNE_FILES.filter((f) => /=\s*\$state[<(]/.test(read(f)));
		expect(withState.length, "жодного `$state` — сканер читає не те").toBeGreaterThan(10);
	});

	it("детектор знаходить проксі за межею, коли він там є", () => {
		// Синтетичний файл: сканер на ньому мусить спрацювати, інакше зелений
		// результат нижче не означає нічого.
		const bad = "let draft = $state({});\nsdk.save(structuredClone(draft));\n";
		const good = "let draft = $state({});\nsdk.save(structuredClone($state.snapshot(draft)));\n";
		const scan = (source: string) => {
			const states = new Set(
				[...source.matchAll(/\b(?:let|const|var)\s+([\w$]+)[^=\n]*=\s*\$state[<(]/g)].map(
					(m) => m[1]
				)
			);
			return [...source.matchAll(BOUNDARY)].filter(
				(m) =>
					states.has(m[2]) &&
					!/\$state\.snapshot/.test(source.split("\n")[source.slice(0, m.index).split("\n").length - 1])
			).length;
		};
		expect(scan(bad), "проксі за межею не знайдено").toBe(1);
		expect(scan(good), "`$state.snapshot` не порахований як межа").toBe(0);
	});

	it("жоден стан не їде за межу серіалізації без snapshot", () => {
		expect(
			crossings(),
			"проксі `$state` за межею серіалізації: `structuredClone` кине DataCloneError,\n" +
				"`JSON.stringify` втратить вкладені Map/Set, SDK побачить обʼєкт, що\n" +
				"змінюється під ним. Потрібен `$state.snapshot(...)`:\n" +
				crossings().join("\n")
		).toEqual([]);
	});
});

/**
 * Слухач знімається в тому ж модулі, де ставиться (§ 2.2.2,
 * SC-LISTENER-CLEANUP, MEDIUM).
 *
 * Витік на SPA-навігації не видно нічим: сторінка працює, тест зелений, а
 * через двадцять переходів на `window` висить двадцять обробників `resize`, і
 * кожен тримає свій компонент у памʼяті.
 *
 * Евристика ФАЙЛОВА, і це навмисно груба межа: вона не доводить, що знято
 * правильний слухач — вона ловить файл, де про зняття не думали взагалі.
 */
describe("слухач знімається там, де ставиться (SC-LISTENER-CLEANUP)", () => {
	const ATTACHES = /addEventListener\s*\(|\.observe\s*\(|setInterval\s*\(/;
	const DETACHES =
		/removeEventListener\s*\(|\.disconnect\s*\(|\.unobserve\s*\(|clearInterval\s*\(|once:\s*true|signal:\s*/;

	/**
	 * Файли, звільнені від правила, з причиною. ПОРОЖНІЙ, і це результат: усі
	 * тринадцять файлів проєкту зі слухачами мають парне зняття.
	 *
	 * Законний виняток, який тут не потрібен, але який варто знати: слухачі
	 * інлайн-скрипта першого кадру в `app.html` живуть стільки ж, скільки
	 * документ, і знімати їх нема кому. Той файл не `.ts` і в скан не входить.
	 */
	const EXEMPT: Record<string, string> = {};

	const SOURCES = ALL.filter((f) => /\.(svelte|ts)$/.test(f) && !isTest(f) && !/\.d\.ts$/.test(f));

	function leaks(): string[] {
		return SOURCES.filter((f) => !(f in EXEMPT))
			.filter((f) => {
				const source = read(f);
				return ATTACHES.test(source) && !DETACHES.test(source);
			})
			.sort();
	}

	it("перевірка жива: файли зі слухачами знайдено", () => {
		const attaching = SOURCES.filter((f) => ATTACHES.test(read(f)));
		expect(
			attaching.length,
			"жодного `addEventListener`/`observe`/`setInterval` — сканер читає не те"
		).toBeGreaterThan(8);
		expect(ATTACHES.test('window.addEventListener("resize", onResize)')).toBe(true);
		expect(DETACHES.test('window.removeEventListener("resize", onResize)')).toBe(true);
		expect(DETACHES.test('window.addEventListener("resize", onResize)')).toBe(false);
	});

	it("перелік винятків не тримає файлів, які вже мають зняття", () => {
		const stale = Object.keys(EXEMPT).filter((f) => {
			const source = read(f);
			return !ATTACHES.test(source) || DETACHES.test(source);
		});
		expect(stale, `виняток уже не потрібен: ${stale.join(", ")}`).toEqual([]);
	});

	it("кожен файл зі слухачем містить і його зняття", () => {
		expect(
			leaks(),
			"слухач поставлено й ніде не знято в тому ж модулі. На SPA-навігації це\n" +
				"витік, якого не видно нічим: сторінка працює, тести зелені:\n" +
				leaks().join("\n")
		).toEqual([]);
	});
});

/**
 * Мережевий виклик у тілі руни скасовується сигналом, а не прапорцем
 * (SVELTE-CORE-v9 § 2.2.1, `SC-ABORT-SIGNAL`, MEDIUM).
 *
 * Повернена з `$effect` функція очищення знімає підписки й таймери, але НЕ
 * скасовує запит, що вже в дорозі. Класична латка — прапорець `cancelled`,
 * який cleanup ставить у `true`, а продовження `await` перевіряє. Вона працює
 * і має два невидимі наслідки: мережу займає відповідь, якої ніхто не
 * прочитає, а прапорець прикриває ЛИШЕ те присвоєння, яке згадали — будь-яке
 * інше продовження ланцюжка (запис у сховище, аналітика, тост) виконається на
 * результаті мертвого ефекту.
 *
 * `getAbortSignal()` (svelte 5.36+) віддає сигнал, який обривається разом із
 * перезапуском або знищенням поточного `$effect`/`$derived` — та сама межа
 * життя, тільки її розуміє платформа, тож скасовується сам запит.
 *
 * ЧОМУ ТУТ ЗАРАЗ ПОРОЖНЬО. Усі три `fetch` проєкту лежать в асинхронних
 * методах контролерів, які кличе користувач — перевірка здоровʼя проксі,
 * запит до AI, догрузка звуку. Жодного в тілі руни немає. Найближчий
 * кандидат очевидний: рядок про ліниві словники в PROJECT-CONTEXT.md — це
 * `await import` за мовою маршруту, тобто саме мережевий виклик, прив'язаний
 * до реактивного значення.
 */
describe("мережа в тілі руни скасовується сигналом (SC-ABORT-SIGNAL)", () => {
	const RUNE_SOURCES = ALL.filter((f) => /\.(svelte|svelte\.ts)$/.test(f) && !isTest(f));

	/** Тіла `$effect(...)` і `$derived(...)` — із урахуванням вкладених дужок. */
	function runeBodies(source: string): string[] {
		const bodies: string[] = [];
		for (const m of source.matchAll(/\$(?:effect(?:\.pre)?|derived)(?:\.by)?\s*\(/g)) {
			const open = m.index + m[0].length - 1;
			let depth = 0;
			for (let i = open; i < source.length; i++) {
				if (source[i] === "(") depth++;
				else if (source[i] === ")" && --depth === 0) {
					bodies.push(source.slice(open, i + 1));
					break;
				}
			}
		}
		return bodies;
	}

	/**
	 * Виклики мережі в тілі руни без сигналу скасування.
	 *
	 * ЛИШЕ `fetch`, І ЦЕ ВИПРАВЛЕННЯ, А НЕ СПРОЩЕННЯ. Перша редакція ловила й
	 * динамічний `import()` — і одразу дала дві хибні знахідки в
	 * `[[lang=lang]]/+page.svelte`, де в `$effect` ліниво вантажаться чанки
	 * двох модалок. Це не той клас: модульний імпорт скасувати НЕМОЖЛИВО в
	 * принципі, `AbortSignal` він не приймає, а від застарілого присвоєння там
	 * стоїть інший захист — `if (!isOpen || Component) return` плюс `catch`,
	 * який закриває модалку й показує тост. Перевірка, що вимагає неможливого,
	 * закінчується списком винятків, а список винятків ніхто не читає.
	 */
	function unabortable(files: string[] = RUNE_SOURCES): string[] {
		const found: string[] = [];
		for (const file of files) {
			const source = codeOnly(read(file));
			for (const body of runeBodies(source)) {
				if (!/\bfetch\s*\(/.test(body)) continue;
				if (/getAbortSignal\s*\(|signal\s*:/.test(body)) continue;
				const line = source.slice(0, source.indexOf(body)).split("\n").length;
				found.push(`${file}:${line}`);
			}
		}
		return [...new Set(found)].sort();
	}

	it("перевірка жива: тіла рун знаходяться, і детектор бачить дефект", () => {
		const withRunes = RUNE_SOURCES.filter((f) => runeBodies(codeOnly(read(f))).length > 0);
		expect(withRunes.length, "жодного тіла руни — сканер читає не те").toBeGreaterThan(5);

		// Зворотний експеримент інлайном: прапорець замість сигналу — знахідка,
		// сигнал — ні, а руна без мережі не знахідка взагалі.
		const probe = (source: string) =>
			runeBodies(source).filter(
				(b) => /\bfetch\s*\(/.test(b) && !/getAbortSignal\s*\(|signal\s*:/.test(b)
			).length;
		expect(probe("$effect(() => { let c = false; fetch(u).then(() => { if (!c) x = 1; }); });")).toBe(
			1
		);
		expect(probe("$effect(() => { fetch(u, { signal: getAbortSignal() }); });")).toBe(0);
		expect(probe("$effect(() => { count = items.length; });")).toBe(0);
		// Вкладені дужки не обривають тіло на середині.
		expect(probe("$effect(() => { go({ a: (1 + 2) }); fetch(u); });")).toBe(1);
		// Динамічний імпорт чанка — не цей клас: скасувати його неможливо.
		expect(probe("$effect(() => { void import('./Modal.svelte').then((m) => (C = m)); });")).toBe(
			0
		);
	});

	it("жоден мережевий виклик у тілі руни не лишається без сигналу", () => {
		expect(
			unabortable(),
			"запит у тілі руни без `getAbortSignal()`: cleanup знімає підписки, але запит\n" +
				"лишається в дорозі, і на його результаті виконається все, що йде після\n" +
				"`await`, — не лише те присвоєння, яке згадали:\n" + unabortable().join("\n")
		).toEqual([]);
	});
});
