/**
 * Єдиний системний промпт AI Job Matcher.
 *
 * До цього їх було два — у `+server.ts` і в клієнтському контролері — з різними
 * правилами й різними прикладами JSON. Модель відповідала по-різному залежно
 * від того, чи сайт зібраний статично, і зрозуміти це з коду було неможливо.
 *
 * Чистий модуль без SvelteKit-імпортів: викликається з Cloudflare Worker.
 */

// Шляхи відносні, а не через `$lib`: цей модуль збирає esbuild усередині
// wrangler, який про алiаси SvelteKit не знає. Те саме в aiChain.ts і aiWire.ts.
import { KNOWLEDGE_BASE_UA } from "../data/knowledgeBase";
import type { AiPromptMessage } from "./aiWire";

/**
 * Схема першої відповіді. Живе окремим рядком, бо потрапляє і в промпт, і в
 * перевірку відповіді — розійтись вони не мають права.
 */
export const MATCH_RESULT_FIELDS = [
	"matchPercentage",
	"keyStrengths",
	"potentialGaps",
	"summary",
	"recommendedResponse"
] as const;

/**
 * Мова, якою модель має відповідати, за тегом мови сайту.
 *
 * Раніше промпт казав «відповідай українською», і це не залежало ні від чого:
 * англомовний рекрутер відкривав /CV/ і отримував український аналіз своєї ж
 * англійської вакансії. Мова інтерфейсу — єдиний сигнал про те, якою мовою
 * відвідувач читає, тож вона тепер і вирішує.
 *
 * Значення — назва мови англійською, бо саме так її надійніше розпізнають
 * моделі, а не ендонім.
 *
 * ПʼЯТЬ ТЕГІВ НАВМИСНО ВКАЗУЮТЬ НА АНГЛІЙСЬКУ. Кримськотатарською і чотирма
 * мікронезійськими жодна з моделей ланцюжка не пише впевнено — у самих файлах
 * локалей це записано як «unverified machine translation». Каліченa відповідь
 * про досвід кандидата гірша за англійську: перша виглядає як недбалість
 * автора, друга — як розумний фолбек.
 */
const REPLY_LANGUAGE: Record<string, string> = {
	en: "English",
	"en-us": "English",
	uk: "Ukrainian",
	ja: "Japanese",
	es: "Spanish",
	fr: "French",
	pt: "Portuguese",
	it: "Italian",
	de: "German",
	nl: "Dutch",
	be: "Belarusian",
	pl: "Polish",
	cs: "Czech",
	sk: "Slovak",
	bg: "Bulgarian",
	hr: "Croatian",
	sl: "Slovenian",
	mk: "Macedonian",
	ro: "Romanian",
	sv: "Swedish",
	no: "Norwegian",
	da: "Danish",
	is: "Icelandic",
	ca: "Catalan",
	fi: "Finnish",
	el: "Greek",
	ga: "Irish",
	cy: "Welsh",
	et: "Estonian",
	lv: "Latvian",
	lt: "Lithuanian",
	ka: "Georgian",
	sq: "Albanian",
	ko: "Korean",
	tr: "Turkish",
	he: "Hebrew",
	mt: "Maltese",
	crh: "English",
	chk: "English",
	pon: "English",
	kos: "English",
	yap: "English"
};

export const DEFAULT_REPLY_LANGUAGE = "English";

/**
 * Назва мови відповіді за тегом. Невідомий тег дає англійську, а не виняток:
 * тег приходить із запиту, тобто ззовні, і промпт не місце для падіння.
 */
export function replyLanguageName(tag: unknown): string {
	if (typeof tag !== "string") return DEFAULT_REPLY_LANGUAGE;
	return REPLY_LANGUAGE[tag] ?? DEFAULT_REPLY_LANGUAGE;
}

export function buildSystemPrompt(replyLanguage: string = DEFAULT_REPLY_LANGUAGE): string {
	return `Ти — AI-асистент Аліка Заполнова (Automation QA Engineer & AI Integration Specialist).
Твоя мета — проаналізувати вимоги вакансії від HR або рекрутера, порівняти їх зі знаннями про Аліка та дати об'єктивний, професійний висновок.

ОСНОВНА БАЗА ЗНАНЬ ПРО АЛІКА:
${KNOWLEDGE_BASE_UA}

ПРАВИЛА ТА КРИТЕРІЇ:
1. Будь ввічливим, професійним та переконливим.
2. Не вигадуй досвід, якого немає в базі знань. Оцінюй відповідність строго за фактами.
3. Якщо це перша обробка вакансії (без історії діалогу), твоя відповідь ПОВИННА БУТИ STRICT VALID JSON — без пояснень до чи після, без markdown-фенсів — у такому форматі:
{
  "matchPercentage": 88,
  "keyStrengths": ["5+ років QA / 2+ роки AQA", "Greenfield досвід та самостійне ведення проектів", "Глибока інтеграція AI інструментів (Claude Code, Gemini CLI, Antigravity IDE)"],
  "potentialGaps": ["Потрібно детальніше уточнити особливості внутрішньої CI/CD системи компанії"],
  "summary": "Алік чудово підходить на цю позицію завдяки багатому досвіду в AQA та автоматизації з нуля.",
  "recommendedResponse": "Привіт! Дякую за цікаву вакансію. Алік має релевантний досвід і буде радий обговорити деталі."
}
4. Якщо в запиті є історія діалогу (продовження чату з HR), відповідай звичайним текстом від імені AI-асистента Аліка.
5. МОВА ВІДПОВІДІ: ${replyLanguage}. Це мова, якою відвідувач читає сайт — тримайся її, навіть якщо текст вакансії іншою мовою. Виняток один: поле "recommendedResponse" — це готовий текст, який відвідувач надішле рекрутерові, тому воно пишеться мовою самої вакансії.`;
}

/**
 * Перший аналіз — це JSON-режим. Ознака одна: порожня історія. Так само її
 * визначає і клієнт, тому окремого флага в запиті не існує (менше того, чим
 * можна збрехати проксі).
 */
export function isFirstAnalysis(history: readonly AiPromptMessage[]): boolean {
	return history.length === 0;
}

export function buildMessages(
	input: string,
	history: readonly AiPromptMessage[] = []
): AiPromptMessage[] {
	if (isFirstAnalysis(history)) {
		return [{ role: "user", content: `ВАКАНСІЯ ДЛЯ АНАЛІЗУ:\n${input}` }];
	}

	const messages = history.map((m) => ({ role: m.role, content: m.content }));
	if (input) messages.push({ role: "user", content: input });
	return messages;
}
