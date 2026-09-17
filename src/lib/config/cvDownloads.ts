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
		url: "https://drive.google.com/file/d/1t5S61DGwLtSL3EgR6NgVx3_tzKNetwws/view?usp=sharing"
	},
	{
		id: "en-md",
		label: "EN · MD",
		format: "md",
		name: "AlikZapolnov-ATS-RMS-EN.md",
		url: "https://drive.google.com/file/d/1Nm_qygC3PtIjpKQ0CfsWY15bzcaU0amn/view?usp=sharing"
	},
	{
		id: "ua-pdf",
		label: "UA · PDF",
		format: "pdf",
		name: "AlikZapolnov-ATS-RMS-UA.pdf",
		url: "https://drive.google.com/file/d/1C9iHAacWD4xcI2yQS9xpc7nlyXQ0RFUg/view?usp=sharing"
	},
	{
		id: "ua-md",
		label: "UA · MD",
		format: "md",
		name: "AlikZapolnov-ATS-RMS-UA.md",
		url: "https://drive.google.com/file/d/1zjkqUyBHPZuWvExiu0dQym9JGPDgq7M3/view?usp=sharing"
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
	url: string;
}

/** Оформлені версії — те, що читає людина. */
export const THEMED_FILES: readonly ThemedCvFile[] = [
	{
		id: "dark",
		image: "Alik-Zapolnov-CV-dark.jpg",
		url: "https://drive.google.com/file/d/169jkAHJDjx8P3zJODr-PtytX2HtkVaRv/view"
	},
	{
		id: "light",
		image: "Alik-Zapolnov-CV-light.jpg",
		url: "https://drive.google.com/file/d/1bNX2y5uD99DrQ1-jjjbFyYQJbeWeeCLB/view"
	}
];
