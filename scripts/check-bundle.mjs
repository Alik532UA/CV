/**
 * Бюджет початкового JavaScript (PERFORMANCE-v8 § 1, § 10.1).
 *
 * Запускається після `npm run build`. Вихід ≠ 0 — перевищення бюджету.
 *
 * ЧОМУ НЕ ШАБЛОН ІЗ КАНОНУ. § 10.1 пропонує підсумувати `build/_app/immutable/
 * entry/*.js`. У цьому проєкті там лежать два файли-завантажувачі на 2 КБ
 * gzip разом — гейт із порогом 150 КБ над ними не впав би НІКОЛИ, скільки б
 * коду не приїхало на сторінку. Це рівно той клас, від якого застерігає сам
 * канон: перевірка, що дивиться поруч із дефектом і лишається зеленою
 * назавжди (AI-AGENT-PITFALLS-v8 § 1.1).
 *
 * Тому міряється те, що браузер справді тягне на першу сторінку: усі `.js`,
 * на які посилається `build/index.html` — і `<script src>`, і `modulepreload`.
 * Саме цей набір визначає, коли сторінка стане інтерактивною.
 *
 * ЧОМУ ПОРІГ НЕ 150 КБ. Типовий бюджет канону — 150 КБ gzip на маршрут.
 * Фактичний вимір цього проєкту вищий: 42 словники перекладів і три canvas-
 * рушії тла їдуть у першому навантаженні. Поставити 150 означало б додати
 * червоний гейт, який доведеться вимкнути наступного дня, — а вимкнений гейт
 * гірший за відсутній (CODE-QUALITY-v8 § 6.4.1 про те саме для ESLint,
 * ACCESSIBILITY-v8 § 10.1.1 — для axe). Тому борг оформлений як число, що
 * лише спадає: BUDGET_KB дорівнює зміряному з невеликим запасом, і кожне
 * скорочення бандла супроводжується його зменшенням.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const BUILD = "build";
const ENTRY_HTML = join(BUILD, "index.html");

/**
 * Стеля початкового JS у КБ gzip. Виміряно цим самим скриптом:
 *
 *   242  2026-08-16
 *   244  2026-08-19  маршрут `/beta-test-checklists/` додав два кілобайти в
 *                    маніфест роутера; сама сторінка окремим чанком
 *   228  2026-08-27  `zod` пішов із бандла — він перевіряв літерали,
 *                    які вже перевірив компілятор
 *   235  2026-08-27  шість повідомлень про збій AI × 42 словники
 *
 * Число рухається ЛИШЕ вниз, і це не гасло: бюджет стояв на 250 при
 * зміряних 244, і цей запас у шість кілобайт був тихим дозволом відрости.
 * Запас понад зміряним — це бюджет, який пропускає перший приріст.
 */
const BUDGET_KB = 240;

/** Найбільший окремий чанк. Ловить те, чого не видно в сумі: одна залежність,
 *  яка тихо подвоїлася, поки решта худла. Це словники 42 мов, які їдуть
 *  одним чанком: 131 КБ (2026-08-16) → 119 КБ (2026-08-27). */
const LARGEST_CHUNK_KB = 124;

if (!existsSync(ENTRY_HTML)) {
	console.error(`Немає ${ENTRY_HTML} — спершу \`npm run build\`.`);
	process.exit(1);
}

const html = readFileSync(ENTRY_HTML, "utf8");

// І `<script src>`, і `<link rel="modulepreload">`: браузер тягне обидва до
// того, як сторінка стане інтерактивною.
const refs = [...html.matchAll(/(?:href|src)="\.(\/_app\/[^"]*\.js)"/g)].map((m) => m[1]);
const unique = [...new Set(refs)];

// Перевірка, яка захищає перевірку: якщо структура build/ зміниться і регулярка
// перестане знаходити файли, гейт мусить УПАСТИ, а не відзвітувати нуль.
if (unique.length < 5) {
	console.error(
		`Знайдено лише ${unique.length} JS-посилань у ${ENTRY_HTML} — перевірка мертва, ` +
			`структура build/ змінилася?`
	);
	process.exit(1);
}

const sizes = [];
for (const ref of unique) {
	const path = join(BUILD, ref);
	if (!existsSync(path)) {
		console.error(`${ENTRY_HTML} посилається на ${ref}, якого немає у build/`);
		process.exit(1);
	}
	sizes.push({ ref, gz: gzipSync(readFileSync(path)).length });
}

sizes.sort((a, b) => b.gz - a.gz);
const totalKb = Math.round(sizes.reduce((sum, s) => sum + s.gz, 0) / 1024);
const largestKb = Math.round(sizes[0].gz / 1024);

console.log(`Початковий JS: ${totalKb} КБ gzip у ${unique.length} файлах (бюджет ${BUDGET_KB}).`);
for (const { ref, gz } of sizes.slice(0, 3)) {
	console.log(`  ${(gz / 1024).toFixed(1)} КБ  ${ref}`);
}

const problems = [];
if (totalKb > BUDGET_KB) {
	problems.push(`початковий JS ${totalKb} КБ gzip перевищує бюджет ${BUDGET_KB} КБ`);
}
if (largestKb > LARGEST_CHUNK_KB) {
	problems.push(
		`найбільший чанк ${largestKb} КБ gzip (${sizes[0].ref}) перевищує ${LARGEST_CHUNK_KB} КБ`
	);
}

if (problems.length > 0) {
	console.error("\nБюджет перевищено:");
	for (const p of problems) console.error(`  • ${p}`);
	console.error(
		"\nЦе число рухається лише вниз. Або скоротити навантаження, або — якщо приріст\n" +
			"свідомий — підняти поріг разом із записом причини в PROJECT-CONTEXT.md."
	);
	process.exit(1);
}
