import type { Icon } from "lucide-svelte";

/**
 * Форма даних резюме — типами, а не схемою рантайму.
 *
 * ЩО ТУТ БУЛО. Ті самі структури через `z.object()`, і три файли поруч
 * (`skills`, `experience`, `education`) викликали `.parse()` над власними
 * ЛІТЕРАЛАМИ на завантаженні модуля. Тобто zod звірявся з тим, що написано
 * двома рядками вище в тому ж файлі й уже перевірено компілятором.
 *
 * Ціна була не теоретична: `zod` їхав у початковий бандл — **103 КБ вихідного
 * коду, 30 КБ gzip, 12% усього бюджету JS сторінки** (`npm run check:bundle`).
 * Плюс сам розбір на кожному завантаженні. За це купувалася нульова гарантія:
 * дані не приходять ні з мережі, ні зі сховища, ні від користувача — вони
 * лежать у сусідньому файлі під контролем `svelte-check`.
 *
 * Zod лишається правильним інструментом там, де дані НЕ під контролем коду.
 * Тут такого місця немає: відповідь AI-проксі розбирає `AiChatState`
 * вручну (`normalizeResult`), і саме тому вона й переживає будь-яку форму
 * відповіді моделі.
 *
 * ЩО ВТРАТИЛОСЯ І ЧИМ ЗАМІНЕНО. Єдина умова, якої тип не виражає, — `level`
 * у межах 0–100 (`z.number().min(0).max(100)`). Вона переїхала в
 * `src/lib/data/data.test.ts`: гейт у CI замість перевірки в браузері
 * відвідувача. Різниця в тому, хто дізнається про помилку — прогін чи
 * випадковий гість.
 */

/**
 * Компонент значка з `lucide-svelte`.
 *
 * Тут стояло `icon: z.any()`. Це не «поле без типу», а гірше: `z.infer`
 * розкривав `any` у ВСІХ споживачів `Skill`, тож `<skill.icon size={16} />`
 * не перевірявся ніде, і забутий значок став би помилкою рантайму. Заборона
 * `any` в CODE-QUALITY-v8 § 6.4.1 саме про цей випадок, і ESLint його не
 * бачив, бо `any` тут писався не словом `any`, а викликом `z.any()`.
 */
export type IconComponent = typeof Icon;

export interface Skill {
	id: string;
	/** 0–100. Межу перевіряє `data.test.ts`, бо тип діапазонів не має. */
	level: number;
	icon: IconComponent;
}

export interface ExperienceItem {
	id: string;
	date: string;
	company: string;
	companyKey?: string;
	/** Ключ у словнику, а не готовий текст: назва посади перекладається. */
	roleKey: string;
	descKey: string;
}

export interface EducationItem {
	id: string;
	institutionKey: string;
	date: string;
	descKey: string;
}

export interface SkillsData {
	ai?: Skill[];
	it: Skill[];
	design3d: Skill[];
	video: Skill[];
	tools: Skill[];
}

export interface ExperienceData {
	it: ExperienceItem[];
	nonIT: ExperienceItem[];
}
