/**
 * Реєстр файлів резюме, які роздає модалка завантаження.
 *
 * Раніше обидва списки лежали в тілі `PdfModal.svelte`, і компонент через це
 * тримав 484 рядки — найбільший борг § 7 у проєкті. Тут це не переїзд заради
 * рядків: адреси Google Drive, імена файлів прев'ю та їхні власні розміри —
 * дані, а не розмітка. У `config/` уже живуть `contacts.ts` і
 * `scrollbarModes.ts` рівно з цієї причини (PROJECT-STRUCTURE-v8 § 3).
 */

/** Формат файлу — від нього залежить лише значок у кнопці. */
export type CvFileFormat = "pdf" | "md";

export interface AtsFile {
	/** Стабільний kebab-case: іде в `data-testid` і в подію аналітики. */
	id: string;
	label: string;
	format: CvFileFormat;
	name: string;
	url: string;
}

/** ATS/RMS-версії — плаский текст для роботів-парсерів вакансій. */
export const ATS_FILES: readonly AtsFile[] = [
	{
		id: "en-pdf",
		label: "EN · PDF",
		format: "pdf",
		name: "AlikZapolnov-ATS-RMS-EN.pdf",
		url: "https://drive.google.com/file/d/1xieP4ItkVvk6_ly1r9sayGYGRZ9MRf06/view?usp=drive_link"
	},
	{
		id: "en-md",
		label: "EN · MD",
		format: "md",
		name: "AlikZapolnov-ATS-RMS-EN.md",
		url: "https://drive.google.com/file/d/1SQdR3vb2JNlVTiRH-vI-Hn2R-0E2MT_k/view?usp=drive_link"
	},
	{
		id: "ua-pdf",
		label: "UA · PDF",
		format: "pdf",
		name: "AlikZapolnov-ATS-RMS-UA.pdf",
		url: "https://drive.google.com/file/d/1vOJysOCzkn_bxVEugr3c2w5HPVfsT1nf/view?usp=drive_link"
	},
	{
		id: "ua-md",
		label: "UA · MD",
		format: "md",
		name: "AlikZapolnov-ATS-RMS-UA.md",
		url: "https://drive.google.com/file/d/1HF6J92xqrLjAdFPHwJTBthzF1Te8B-zA/view?usp=drive_link"
	}
];

/**
 * ВЛАСНІ розміри файлів прев'ю, а не розмір на екрані: із них браузер бере
 * пропорцію й резервує місце ще до завантаження (PERFORMANCE-v8 § 10.2).
 * Обидва JPEG однакові — 826×1168, звірено з самими файлами, а не з пам'яті.
 */
export const PREVIEW_WIDTH = 826;
export const PREVIEW_HEIGHT = 1168;

export interface ThemedCvFile {
	/** Збігається з ключем у `t.pdf_modal`, звідки береться підпис. */
	id: "dark" | "light";
	image: string;
	alt: string;
	/** Підпис, якщо словник мовчить. Сам підпис читається в розмітці. */
	fallback: string;
	url: string;
}

/** Оформлені версії — те, що читає людина. */
export const THEMED_FILES: readonly ThemedCvFile[] = [
	{
		id: "dark",
		image: "Alik-Zapolnov-CV-dark.jpg",
		alt: "Dark Theme CV Preview",
		fallback: "Dark Theme",
		url: "https://drive.google.com/file/d/169jkAHJDjx8P3zJODr-PtytX2HtkVaRv/view"
	},
	{
		id: "light",
		image: "Alik-Zapolnov-CV-light.jpg",
		alt: "Light Theme CV Preview",
		fallback: "Light Theme",
		url: "https://drive.google.com/file/d/1bNX2y5uD99DrQ1-jjjbFyYQJbeWeeCLB/view"
	}
];
