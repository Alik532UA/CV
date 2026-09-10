// @vitest-environment node
import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Кінці рядків однакові в індексі І в робочому дереві
 * (AI-AGENT-PITFALLS-v9 § 1.5, `PIT-EOL-GATE`, HIGH; `GATE-EOL`).
 *
 * ЧОГО ТУТ БРАКУВАЛО. `.gitattributes` із `* text=auto eol=lf` у проєкті є з
 * `54bd574`, і обидва документи посилаються на нього як на закритий клас. Але
 * перевіряв його стан рівно ніхто: атрибут — це НАМІР, а не факт. Канон каже
 * про це прямо: «`.gitattributes` не переписує вже викачані файли» — дерево,
 * викладене до появи правила, лишається з CRLF назавжди, а документ поруч
 * стверджує протилежне. Заміряно 2026-09-02 у сусідніх проєктах пакета:
 * `DigitalWorkshop` мав 203 з 341 відстежуваних файлів `w/crlf` ПРИ `eol=lf`,
 * `VetCrewGames` — 162 з 588, сам репозиторій канону — 63 зі 141.
 *
 * ЧОМУ ЦЕ HIGH, А НЕ КОСМЕТИКА. Більшість гейтів цього проєкту читає ВЛАСНІ
 * джерела текстом — грепи по `.svelte`, розбір workflow, звірка CSS-змінних,
 * хеш інлайн-скрипта. У JavaScript `.` не збігається з `\r`, а `$` без
 * прапорця `m` стоїть перед `\n`, але не перед `\r`. Тобто той самий вираз на
 * LF-дереві знаходить усе, а на CRLF-дереві — НУЛЬ. Найгірший прояв не
 * червоний тест, а мовчазний нуль: перевірка звітує «порушень немає» й
 * виглядає зеленою, тобто стає рівно тією порожньою перевіркою, проти якої
 * написаний § 1.
 *
 * Ціна вже заплачена двічі в цьому репозиторії: хеш CSP над CRLF вимикав
 * скрипт першого кадру (`src/csp-hash.test.ts`), а розбір workflow бачив нуль
 * кроків на Windows-чекауті (`src/ci.test.ts`). Обидва полагоджені
 * нормалізацією В САМОМУ гейті — тобто по одному разу на гейт, доки причина не
 * зафіксована на рівні репозиторію. Оце і є фіксація причини.
 *
 * ЗВОРОТНИЙ ЕКСПЕРИМЕНТ (§ 1.1). Виконати `git add --renormalize .` після
 * `git config core.autocrlf true` і `git checkout-index -f -a` — перелік нижче
 * має назвати перевтягнуті файли поіменно. Перевірка «розбір живий» стоїть
 * саме проти протилежного результату: `git`, який нічого не віддав, дав би
 * порожній перелік порушень і зелений прогін.
 */

const ROOT = process.cwd();

/** Один рядок `git ls-files --eol`. */
type Entry = { index: string; worktree: string; attr: string; path: string };

/**
 * Формат рядка: `i/lf    w/lf    attr/text=auto eol=lf \tшлях`.
 *
 * Роздільник перед шляхом — ТАБУЛЯЦІЯ, і саме тому шлях береться після неї, а
 * не сьомим полем через пробіли: значення `attr/` містить пробіл (`text=auto
 * eol=lf`), а шлях може містити його теж.
 */
const LINE = /^i\/(\S+)\s+w\/(\S+)\s+attr\/(.*?)\s*\t(.+)$/;

function tracked(): Entry[] {
	const out = execFileSync("git", ["ls-files", "--eol"], {
		cwd: ROOT,
		encoding: "utf8",
		maxBuffer: 32 * 1024 * 1024
	});
	return out
		.split("\n")
		.map((line) => LINE.exec(line))
		.filter((m): m is RegExpExecArray => m !== null)
		.map((m) => ({ index: m[1], worktree: m[2], attr: m[3], path: m[4] }));
}

const ENTRIES = tracked();
const ATTRIBUTES = existsSync(resolve(ROOT, ".gitattributes"))
	? readFileSync(resolve(ROOT, ".gitattributes"), "utf8")
	: null;

describe("перевірка жива", () => {
	/**
	 * Без цього блока весь файл — це «порушень не знайдено» на будь-якому
	 * результаті `git`: не той робочий каталог, git поза PATH, зламана
	 * регулярка. Кожен із трьох дав би ПОРОЖНІЙ перелік, тобто зелене.
	 */
	it("git віддав перелік відстежуваних файлів, і рядки розібрано", () => {
		expect(
			ENTRIES.length,
			"`git ls-files --eol` не дав жодного розібраного рядка — перевірка дивиться не туди"
		).toBeGreaterThan(50);
		expect(
			ENTRIES.some((e) => e.path === "package.json"),
			"у переліку немає package.json — розбір читає не той репозиторій"
		).toBe(true);
	});

	it("розбір бере шлях після табуляції, а не сьоме поле", () => {
		// Регулярка — це весь тест; мовчки зламана звітує про успіх.
		const m = LINE.exec("i/lf    w/lf    attr/text=auto eol=lf \tsrc/app.css");
		expect(m).toBeTruthy();
		expect(m![1]).toBe("lf");
		expect(m![2]).toBe("lf");
		expect(m![4]).toBe("src/app.css");
		expect(LINE.exec("i/-text w/-text attr/-text            \tstatic/favicon.png")![4]).toBe(
			"static/favicon.png"
		);
	});
});

describe("кінці рядків зафіксовані правилом (PIT-EOL-GATE)", () => {
	it(".gitattributes оголошує `* text=auto eol=lf`", () => {
		expect(ATTRIBUTES, "у корені немає .gitattributes — форму кінців не фіксує ніщо").not.toBeNull();
		expect(
			/^\s*\*\s+text=auto\s+eol=lf\s*$/m.test(ATTRIBUTES ?? ""),
			"`* text=auto eol=lf` не оголошено: без нього чекаут на Windows віддає CRLF"
		).toBe(true);
	});

	/**
	 * Двійкові типи, що СПРАВДІ лежать у репозиторії, перелічені явно.
	 *
	 * Перелік береться з того, що git уже вважає двійковим (`w/-text`), а не
	 * пишеться наперед: інакше це був би список побажань. Значення в тому, що
	 * НОВИЙ двійковий тип (перше `.webp`, перший `.pdf`) валить прогін, доки
	 * його не оголосили — а не покладається на евристику `text=auto`, яка на
	 * межових файлах помиляється мовчки.
	 */
	it("кожне двійкове розширення з репозиторію оголошене в .gitattributes", () => {
		const extensions = [
			...new Set(
				ENTRIES.filter((e) => e.worktree === "-text")
					.map((e) => /\.([A-Za-z0-9]+)$/.exec(e.path)?.[1]?.toLowerCase())
					.filter((x): x is string => Boolean(x))
			)
		].sort();
		expect(extensions.length, "у репозиторії немає жодного двійкового файлу — перевірка мертва").toBeGreaterThan(0);

		const undeclared = extensions.filter(
			(ext) => !new RegExp(`^\\s*\\*\\.${ext}\\s+binary\\s*$`, "mi").test(ATTRIBUTES ?? "")
		);
		expect(
			undeclared,
			`двійковий тип у репозиторії, не оголошений у .gitattributes: ${undeclared
				.map((e) => `*.${e}`)
				.join(", ")} — евристика text=auto вирішує його долю сама`
		).toEqual([]);
	});
});

describe("індекс і робоче дерево читають той самий текст (GATE-EOL)", () => {
	/**
	 * ОБИДВІ КОЛОНКИ, а не лише індекс — саме цим v9 виправив правило v8.
	 *
	 * `i/crlf` означає, що CRLF лежить у самому репозиторії, тобто CI читає
	 * його так само зіпсовано. `w/crlf` при чистому `i/lf` — гірший випадок:
	 * репозиторій правильний, CI зелений, а локальний прогін читає інший текст
	 * і дає інший вердикт. Саме цю пару й розходиться шукати гейт.
	 */
	it("жоден файл не має crlf або mixed в індексі чи робочому дереві", () => {
		const offenders = ENTRIES.filter(
			(e) => /^(crlf|mixed)$/.test(e.index) || /^(crlf|mixed)$/.test(e.worktree)
		).map((e) => `${e.path} (i/${e.index} w/${e.worktree})`);

		expect(
			offenders,
			"локальний прогін і CI читають різний текст. Вирівняти:\n" +
				"  git add --renormalize .\n" +
				"  видалити файли з w/crlf і `git checkout-index -f -- <файли>`\n" +
				"(`git reset --hard` не потрібен і небезпечний для незакомічених змін):\n" +
				offenders.join("\n")
		).toEqual([]);
	});

	/**
	 * Самотній `\r` — той випадок, у якому `--renormalize` МОВЧИТЬ.
	 *
	 * Git вважає вміст із CR без `\n` після нього ДВІЙКОВИМ: `--renormalize`
	 * виходить із кодом 0 і не робить нічого. Канон приписує через це рахувати
	 * байти, а не вірити коду виходу, — і тут це заміряно ще раз, дорожче.
	 *
	 * ПЕРША РЕДАКЦІЯ ЦЬОГО ТЕСТУ ПРОПУСКАЛА ФАЙЛИ ЗА ВЕРДИКТОМ GIT (`w/-text`)
	 * і тому була сліпа рівно до того, заради чого існує: підставний файл із
	 * трьох рядків і одним самотнім CR приїхав як `w/-text`, тобто перевірка
	 * його не читала й лишалася зеленою. Вердикт git тут — НАСЛІДОК дефекту, а
	 * не фільтр перед ним.
	 *
	 * Тому двійкове визначається двома способами, жоден з яких не залежить від
	 * пропорції CR: оголошене розширення з `.gitattributes` і нульовий байт у
	 * вмісті. Справжній двійковий файл має NUL майже завжди; текстовий — ніколи.
	 *
	 * Випадок не гіпотетичний і не чужий: рівно один `\r\r\n` у рядку 242
	 * `src/lib/i18n/locales/ja.ts` блокував нормалізацію файлу на 287 рядків
	 * (знайдено 2026-08-24).
	 */
	it("жоден текстовий файл не містить самотнього CR", () => {
		const binaryExt = new Set(
			[...(ATTRIBUTES ?? "").matchAll(/^\s*\*\.([A-Za-z0-9]+)\s+binary\s*$/gm)].map((m) =>
				m[1].toLowerCase()
			)
		);
		const offenders: string[] = [];
		let scanned = 0;
		for (const entry of ENTRIES) {
			if (binaryExt.has(/\.([A-Za-z0-9]+)$/.exec(entry.path)?.[1]?.toLowerCase() ?? "")) continue;
			const full = resolve(ROOT, entry.path);
			if (!existsSync(full)) continue;
			const text = readFileSync(full, "latin1");
			if (text.includes("\0")) continue;
			scanned++;
			const cr = (text.match(/\r/g) ?? []).length;
			if (cr === 0) continue;
			const crlf = (text.match(/\r\n/g) ?? []).length;
			if (cr > crlf) offenders.push(`${entry.path}: CR ${cr}, CRLF ${crlf}`);
		}
		expect(scanned, "жодного текстового файлу не прочитано — перевірка мертва").toBeGreaterThan(50);
		expect(
			offenders,
			"самотній CR: `git add --renormalize` пройде повз такий файл і вийде з кодом 0.\n" +
				"Прибирати руками:\n" +
				offenders.join("\n")
		).toEqual([]);
	});
});
