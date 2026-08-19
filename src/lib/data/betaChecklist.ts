/**
 * Чеклист ручної перевірки як ДАНІ (BETA-CHECKLIST-v8).
 *
 * ЧОМУ ВІН ТУТ І ЩО САМЕ ЗАМІНЮЄ. У PROJECT-CONTEXT.md є таблиця «Що не
 * перевіряється автоматично»: прохід клавіатурою й читалкою, відсутність FOUC
 * теми, RTL-верстка, поведінка на справжньому телефоні. Кожен її рядок — робота
 * для людини, у якої не було ні власника, ні списку, ні способу сказати «я це
 * перевірив на версії 1.0.41». Тепер є все три.
 *
 * ФОРМА — дані, а не `QA.md`. Текстовий файл ніхто не звіряє з кодом: він
 * застаріває мовчки й починає казати «перевірено» про те, чого вже немає
 * (BETA-CHECKLIST-v8, анти-патерн HIGH). Тут за кожним пунктом стежить
 * `src/beta-checklist-canon.test.ts`: назва тесту в `test` мусить існувати на
 * диску, локатор у `testid` — у розмітці, у вкладці мусить бути пункт для
 * людини і пункт-межа.
 *
 * ДВІ МОВИ В ОДНОМУ ОБ'ЄКТІ, і жодного ключа в словниках інтерфейсу (§ 2.4).
 * Словників тут 42; правка одного пункта коштувала б 42 правок, а сам пункт
 * читає автор або той, кого він попросив. Решта мов бачить англійський текст.
 *
 * КОЖЕН ПУНКТ НАПИСАНИЙ ПІСЛЯ ЧИТАННЯ КОДУ, який його виконує (§ 7.2). Це не
 * формальність: у джерелі канону з 90 пунктів вісім описували неправду, і три
 * були просто вигадані. Тестувальник ставить «не працює» справному коду, і
 * такий пункт коштує двічі — його перевіряють, а потім розбирають звіт.
 */

export type Coverage = "manual" | "testable" | "covered";

export interface Localized {
	uk: string;
	en: string;
}

export interface BetaCheck {
	/**
	 * Стабільний назавжди — це ключ прогресу в сховищі. Перейменувати означає
	 * стерти людині позначку. Нові пункти ДОПИСУЮТЬСЯ з новим номером;
	 * перенумеровувати наявні не можна навіть тоді, коли порядок змінився
	 * (§ 2.2). Номер, який видно на сторінці, малюється з позиції в списку.
	 */
	id: string;
	category: Localized;
	text: Localized;
	coverage: Coverage;
	/** Обов'язковий для `covered`, заборонений для решти (§ 5.2). */
	test?: string;
	/** Обов'язковий там, де в тексті є «натисніть» (§ 5.3). */
	testid?: string;
	/** Перевірка МЕЖІ: «не мусить». Обов'язкова в кожній вкладці (§ 2.3). */
	negative?: true;
}

export interface BetaTab {
	id: string;
	title: Localized;
	/**
	 * Маршрути в тій формі, у якій їх повідомляє SvelteKit. Вкладка називає
	 * МАРШРУТИ, а не сторінку словами: перелік маршрутів у проєкті вже є на
	 * диску, і його ніхто не забуде поповнити — без нього сторінки просто не
	 * буде. Другий список, який тримають узгодженим руками, розійдеться з
	 * першим на першому ж новому маршруті (§ 5.1).
	 */
	routes: readonly string[];
	checks: readonly BetaCheck[];
}

const CV_ROUTE = "/[[lang=lang]]";
const CHECKLIST_ROUTE = "/beta-test-checklists";

export const BETA_TABS: readonly BetaTab[] = [
	{
		id: "theme",
		title: { uk: "Тема", en: "Theme" },
		routes: [CV_ROUTE],
		checks: [
			{
				id: "theme_1",
				category: { uk: "Перший кадр", en: "First paint" },
				text: {
					uk: "Поставте в системі темне оформлення й відкрийте сайт у новому вікні, не торкаючись перемикача теми. Сайт мусить відкритися темним.",
					en: "Set your system to dark and open the site in a new window without touching the theme switch. The site must open dark."
				},
				coverage: "manual"
			},
			{
				id: "theme_2",
				category: { uk: "Перший кадр", en: "First paint" },
				text: {
					uk: "Перезавантажте сторінку з темною темою. У першому кадрі НЕ мусить майнути білий фон.",
					en: "Reload the page with the dark theme on. No white background may flash in the first frame."
				},
				coverage: "manual"
			},
			{
				id: "theme_3",
				category: { uk: "Слідування системі", en: "Following the system" },
				text: {
					uk: "Не торкаючись перемикача теми, змініть оформлення в системі, поки сайт відкритий. Кольори мусять змінитися одразу, без перезавантаження.",
					en: "Without touching the theme switch, change your system appearance while the site is open. The colours must change at once, with no reload."
				},
				coverage: "manual"
			},
			{
				id: "theme_4",
				category: { uk: "Слідування системі", en: "Following the system" },
				text: {
					uk: "Виберіть світлу тему кнопкою, тоді змініть системне оформлення на темне. Сайт НЕ мусить потемніти: ваш вибір сильніший за систему.",
					en: "Pick the light theme with the button, then switch your system to dark. The site must not go dark: your choice outranks the system."
				},
				coverage: "manual",
				negative: true,
				testid: "theme-light-btn"
			},
			{
				id: "theme_5",
				category: { uk: "Вибір теми", en: "Choosing a theme" },
				text: {
					uk: "Натисніть кнопку світлої теми в шапці. Кольори мусять стати світлими, а в адресі — з’явитися theme=light.",
					en: "Press the light theme button in the header. The colours must turn light and theme=light must appear in the address."
				},
				coverage: "covered",
				test: "tests/core.spec.ts",
				testid: "theme-light-btn"
			}
		]
	},
	{
		id: "scrollbar",
		title: { uk: "Смуга прокрутки", en: "Scrollbar" },
		routes: [CV_ROUTE],
		checks: [
			{
				id: "scrollbar_1",
				category: { uk: "Режими", en: "Modes" },
				text: {
					uk: "Натисніть правою кнопкою по смузі прокрутки праворуч. Мусить відкритися меню з чотирьох режимів, у якому позначено поточний.",
					en: "Right-click the scrollbar on the right. A menu of four modes must open, with the current one marked."
				},
				coverage: "manual",
				testid: "scrollbar-context-menu"
			},
			{
				id: "scrollbar_2",
				category: { uk: "Режими", en: "Modes" },
				text: {
					uk: "Виберіть режим мінімапи на широкому екрані й потягніть смугу мишею вгору-вниз. Сторінка мусить їхати за курсором без ривків і без стрибків на початок.",
					en: "Pick the minimap mode on a wide screen and drag the strip up and down with the mouse. The page must follow the cursor smoothly and must not jump back to the top."
				},
				coverage: "manual"
			},
			{
				id: "scrollbar_3",
				category: { uk: "Вузький екран", en: "Narrow screen" },
				text: {
					uk: "Звузьте вікно до ширини телефона з вибраним режимом мінімапи. Мінімапа НЕ мусить з’явитися, а сторінка НЕ мусить лишитися взагалі без смуги прокрутки.",
					en: "Narrow the window to phone width with the minimap mode selected. The minimap must not appear, and the page must not be left with no scrollbar at all."
				},
				coverage: "manual",
				negative: true
			},
			{
				id: "scrollbar_4",
				category: { uk: "Пам’ять вибору", en: "Remembering the choice" },
				text: {
					uk: "Виберіть режим і перезавантажте сторінку. Режим мусить лишитися тим самим уже в першому кадрі, без миготіння системної смуги.",
					en: "Pick a mode and reload the page. The mode must survive from the very first frame, with no flash of the system scrollbar."
				},
				coverage: "testable"
			}
		]
	},
	{
		id: "lang",
		title: { uk: "Мови", en: "Languages" },
		routes: [CV_ROUTE],
		checks: [
			{
				id: "lang_1",
				category: { uk: "Напрямок письма", en: "Writing direction" },
				text: {
					uk: "Виберіть іврит. Текст мусить починатися від правого краю, а сторінка — читатися справа наліво.",
					en: "Pick Hebrew. Text must start at the right edge and the page must read right to left."
				},
				coverage: "manual"
			},
			{
				id: "lang_2",
				category: { uk: "Напрямок письма", en: "Writing direction" },
				text: {
					uk: "Лишаючись на івриті, прогорніть сторінку до кінця. Жоден напис НЕ мусить вилазити за край екрана або накладатися на сусідній.",
					en: "Staying on Hebrew, scroll the page to the end. No text may run off the edge of the screen or overlap its neighbour."
				},
				coverage: "manual",
				negative: true
			},
			{
				id: "lang_3",
				category: { uk: "Вибір мови", en: "Choosing a language" },
				text: {
					uk: "Натисніть кнопку мови в шапці й наберіть кілька літер назви мови в полі пошуку. Список мусить лишити тільки ті мови, що збігаються.",
					en: "Press the language button in the header and type a few letters of a language name in the search field. The list must keep only the languages that match."
				},
				coverage: "manual",
				testid: "lang-trigger-btn"
			},
			{
				id: "lang_4",
				category: { uk: "Вибір мови", en: "Choosing a language" },
				text: {
					uk: "Натисніть кнопку мови й виберіть English (UK). Сторінка мусить стати англійською, а мовний відрізок — зникнути з адреси.",
					en: "Press the language button and pick English (UK). The page must switch to English and the language segment must disappear from the address."
				},
				coverage: "covered",
				test: "tests/core.spec.ts",
				testid: "lang-trigger-btn"
			},
			{
				id: "lang_5",
				category: { uk: "Посилання", en: "Links" },
				text: {
					uk: "Скопіюйте адресу японської версії та відкрийте її в іншому браузері. Сторінка мусить одразу відкритися японською, ще до того як спрацює будь-який скрипт.",
					en: "Copy the address of the Japanese version and open it in another browser. The page must come up in Japanese immediately, before any script runs."
				},
				coverage: "testable"
			}
		]
	},
	{
		id: "ai",
		title: { uk: "AI Job Matcher", en: "AI Job Matcher" },
		routes: [CV_ROUTE],
		checks: [
			{
				id: "ai_1",
				category: { uk: "Відповідь", en: "The answer" },
				text: {
					uk: "Перемкніть сайт на українську, вставте опис вакансії й запустіть аналіз. Відповідь мусить бути українською, а не англійською.",
					en: "Switch the site to Ukrainian, paste a job description and run the analysis. The answer must come back in Ukrainian, not English."
				},
				coverage: "manual"
			},
			{
				id: "ai_2",
				category: { uk: "Відповідь", en: "The answer" },
				text: {
					uk: "Прочитайте відповідь до кінця. Вона мусить називати навички зі справжнього резюме, а не вигадані.",
					en: "Read the answer through. It must name skills that are actually in the CV, not invented ones."
				},
				coverage: "manual"
			},
			{
				id: "ai_3",
				category: { uk: "Порожній ввід", en: "Empty input" },
				text: {
					uk: "Натисніть кнопку аналізу, не вписавши нічого в поле. Аналіз НЕ мусить розпочатися, а відсотки НЕ мусять з’явитися.",
					en: "Press the analyse button with nothing typed in the field. The analysis must not start and no percentage may appear."
				},
				coverage: "manual",
				negative: true,
				testid: "ai-analyze-btn"
			},
			{
				id: "ai_4",
				category: { uk: "Модель", en: "The model" },
				text: {
					uk: "Натисніть бейдж моделі над відповіддю. Мусить відкритися список моделей, у якому позначено ту, що справді відповіла.",
					en: "Press the model badge above the answer. A list of models must open with the one that actually answered marked."
				},
				coverage: "covered",
				test: "tests/ai-matcher.spec.ts",
				testid: "ai-model-badge-btn"
			},
			{
				id: "ai_5",
				category: { uk: "Збій", en: "Failure" },
				text: {
					uk: "Вимкніть мережу й запустіть аналіз. Мусить з’явитися видиме повідомлення про помилку, а не порожня панель і не нескінченне очікування.",
					en: "Turn the network off and run the analysis. A visible error message must appear, not an empty panel and not an endless wait."
				},
				coverage: "covered",
				test: "tests/ai-matcher.spec.ts",
				testid: "ai-analyze-btn"
			}
		]
	},
	{
		id: "mobile",
		title: { uk: "Телефон", en: "Phone" },
		routes: [CV_ROUTE],
		checks: [
			{
				id: "mobile_1",
				category: { uk: "Пальцем", en: "By finger" },
				text: {
					uk: "На справжньому телефоні натисніть пальцем перемикач теми в шапці. Він мусить спрацювати з першого разу, без прицілювання й без збільшення масштабу.",
					en: "On a real phone, press the theme switch in the header with your finger. It must respond first time, with no aiming and no zooming in."
				},
				coverage: "manual",
				testid: "theme-toggle-toolbar"
			},
			{
				id: "mobile_2",
				category: { uk: "Ширина", en: "Width" },
				text: {
					uk: "Відкрийте сайт на найвужчому екрані, який маєте, і проведіть пальцем убік. Сторінка НЕ мусить їхати вбік: горизонтальної прокрутки бути не мусить.",
					en: "Open the site on the narrowest screen you have and swipe sideways. The page must not move: there must be no horizontal scrolling."
				},
				coverage: "manual",
				negative: true
			},
			{
				id: "mobile_3",
				category: { uk: "Ландшафт", en: "Landscape" },
				text: {
					uk: "Покладіть телефон набік і відкрийте вікно вибору резюме. Хрестик закриття мусить лишатися видимим на екрані.",
					en: "Turn the phone on its side and open the CV chooser. The close cross must stay visible on screen."
				},
				coverage: "manual",
				testid: "hero-pdf-btn"
			},
			{
				id: "mobile_4",
				category: { uk: "Нижнє меню", en: "Bottom bar" },
				text: {
					uk: "Прогорніть сторінку на телефоні згори донизу. Позначка в нижньому меню мусить переходити на той розділ, який зараз на екрані.",
					en: "Scroll the page top to bottom on a phone. The mark in the bottom bar must move to whichever section is on screen."
				},
				coverage: "manual"
			},
			{
				id: "mobile_5",
				category: { uk: "Тло", en: "Background" },
				text: {
					uk: "Прогорніть сторінку з увімкненим рухомим тлом на телефоні. Прокрутка мусить лишатися плавною, без ривків.",
					en: "Scroll the page on a phone with the animated background on. Scrolling must stay smooth, with no stutter."
				},
				coverage: "testable"
			}
		]
	},
	{
		id: "a11y",
		title: { uk: "Клавіатура й читалка", en: "Keyboard and screen reader" },
		routes: [CV_ROUTE],
		checks: [
			{
				id: "a11y_1",
				category: { uk: "Фокус", en: "Focus" },
				text: {
					uk: "Пройдіть сторінку клавішею Tab від початку до кінця. Рамка фокуса мусить бути видима на кожному кроці, а порядок — іти згори вниз, без стрибків назад.",
					en: "Walk the page with the Tab key from start to end. The focus ring must be visible at every step and the order must run top to bottom, with no jumps backwards."
				},
				coverage: "manual"
			},
			{
				id: "a11y_2",
				category: { uk: "Фокус", en: "Focus" },
				text: {
					uk: "Відкрийте вікно вибору резюме й тисніть Tab по колу. Фокус НЕ мусить вийти за межі вікна на сторінку під ним.",
					en: "Open the CV chooser and press Tab around the loop. Focus must not leave the dialog for the page underneath."
				},
				coverage: "manual",
				negative: true,
				testid: "hero-pdf-btn"
			},
			{
				id: "a11y_3",
				category: { uk: "Читалка", en: "Screen reader" },
				text: {
					uk: "Увімкніть NVDA і пройдіть сторінку. Кожна кнопка-значок мусить називатися словами, а не «кнопка».",
					en: "Turn NVDA on and go through the page. Every icon button must be announced by name, not just as “button”."
				},
				coverage: "manual"
			},
			{
				id: "a11y_4",
				category: { uk: "Контраст", en: "Contrast" },
				text: {
					uk: "Перемкніть на темну тему і прочитайте дрібний текст під заголовками секцій. Він мусить читатися без напруження.",
					en: "Switch to the dark theme and read the small text under the section headings. It must be readable without effort."
				},
				coverage: "covered",
				test: "tests/a11y.spec.ts"
			},
			{
				id: "a11y_5",
				category: { uk: "Рух", en: "Motion" },
				text: {
					uk: "Увімкніть у системі зменшення анімації й перезавантажте сторінку. Рухоме тло й переходи мусять або зупинитися, або помітно сповільнитися.",
					en: "Turn on reduced motion in your system and reload the page. The animated background and transitions must either stop or slow down noticeably."
				},
				coverage: "manual"
			}
		]
	},
	{
		id: "checklist",
		title: { uk: "Сам чеклист", en: "The checklist itself" },
		routes: [CHECKLIST_ROUTE],
		checks: [
			{
				id: "checklist_1",
				category: { uk: "Прогрес", en: "Progress" },
				text: {
					uk: "Позначте кілька пунктів і перезавантажте сторінку. Усі позначки мусять лишитися на місці.",
					en: "Mark a few items and reload the page. Every mark must still be there."
				},
				coverage: "manual"
			},
			{
				id: "checklist_2",
				category: { uk: "Версія", en: "Version" },
				text: {
					uk: "Відкрийте чеклист після того, як вийшла нова збірка сайту. Позначки, поставлені на старій версії, мусять бути підписані як зроблені на іншій версії.",
					en: "Open the checklist after a new build of the site has shipped. Marks made on the old version must be labelled as made on a different version."
				},
				coverage: "manual"
			},
			{
				id: "checklist_3",
				category: { uk: "Версія", en: "Version" },
				text: {
					uk: "Подивіться на лічильник пройденого після виходу нової збірки. Позначки з попередньої версії НЕ мусять у ньому рахуватися.",
					en: "Look at the progress counter after a new build has shipped. Marks from the previous version must not count towards it."
				},
				coverage: "manual",
				negative: true
			},
			{
				id: "checklist_4",
				category: { uk: "Звіт", en: "The report" },
				text: {
					uk: "Позначте хоча б один пункт як зламаний і натисніть кнопку звіту. У буфері обміну мусить опинитися текст, у якому зламане стоїть першим.",
					en: "Mark at least one item as broken and press the report button. The clipboard must hold text with the broken items first."
				},
				coverage: "manual",
				testid: "beta-report-btn"
			},
			{
				id: "checklist_5",
				category: { uk: "Звіт", en: "The report" },
				text: {
					uk: "Заборонте браузеру доступ до буфера обміну й натисніть кнопку звіту. Звіт мусить з’явитися текстом у полі поруч, а не зникнути.",
					en: "Deny the browser access to the clipboard and press the report button. The report must appear as text in the field next to it, not vanish."
				},
				coverage: "manual",
				testid: "beta-report-btn"
			}
		]
	}
];

/**
 * Написи самої сторінки — тут, а не в 42 словниках, і не літералами в
 * компоненті.
 *
 * Причина та сама, що для пунктів (§ 2.4): це двомовний службовий інструмент,
 * і його заголовки не мають сенсу японською. А в компоненті вони жити не
 * можуть через інший інваріант проєкту — `src/i18n-canon.test.ts` забороняє
 * кирилицю в `src/routes/**` саме для того, щоб ніхто не лишив рядок повз
 * переклад. Обидва правила виконуються, коли двомовний текст лежить у даних.
 */
export const BETA_UI = {
	title: { uk: "Чеклист ручної перевірки", en: "Manual test checklist" },
	subtitle: {
		uk: "Те, чого не перевіряє жоден автотест. Позначка запам’ятовує версію збірки.",
		en: "What no automated test covers. A mark remembers the build it was made on."
	},
	copy: { uk: "Звіт у буфер", en: "Copy report" },
	copied: { uk: "Скопійовано", en: "Copied" },
	clear: { uk: "Стерти позначки", en: "Clear marks" },
	clipboardFailed: {
		uk: "Буфер обміну недоступний. Звіт тут — виділіть і скопіюйте вручну.",
		en: "The clipboard is unavailable. The report is here — select and copy it by hand."
	},
	staleMark: {
		uk: "Позначено на іншій версії — не рахується в поступі",
		en: "Marked on a different version — not counted towards progress"
	},
	level: {
		manual: {
			title: { uk: "Тільки людина", en: "Human only" },
			hint: {
				uk: "Око, палець, справжній пристрій. Машина цього не вміє.",
				en: "Eye, finger, a real device. No machine does this."
			}
		},
		testable: {
			title: { uk: "Можна покрити тестом", en: "Could be a test" },
			hint: {
				uk: "Це беклог тестів: покрити можна, покриття поки немає.",
				en: "This is the test backlog: coverable, not yet covered."
			}
		},
		covered: {
			title: { uk: "Покрито тестом — контрольна група", en: "Covered by a test — control group" },
			hint: {
				uk: "Помилка тут — звіт про дефект ТЕСТА, а не сайту.",
				en: "A failure here reports a defect in the TEST, not the site."
			}
		}
	},
	vote: {
		fail: { uk: "Не працює", en: "Broken" },
		weird: { uk: "Працює, але дивно", en: "Works, but odd" },
		ok: { uk: "Працює", en: "Works" }
	}
} as const;

/** Порядок показу: людина витрачається спершу там, де машини немає (§ 3). */
export const COVERAGE_ORDER: readonly Coverage[] = ["manual", "testable", "covered"];

/**
 * Сортування зберігає порядок ОГОЛОШЕННЯ всередині рівня: він тематичний, і
 * від довільного пересортування розділи розсипалися б (§ 5.4).
 */
export function sortChecks(checks: readonly BetaCheck[]): BetaCheck[] {
	return [...checks].sort(
		(a, b) => COVERAGE_ORDER.indexOf(a.coverage) - COVERAGE_ORDER.indexOf(b.coverage)
	);
}

export const ALL_CHECKS: readonly BetaCheck[] = BETA_TABS.flatMap((tab) => tab.checks);
