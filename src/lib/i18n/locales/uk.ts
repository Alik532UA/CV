import type { Translations } from "../index.svelte";

export const uk: Translations = {
    lastUpdate: "Останнє оновлення: 10 лютого 2026",
    title: ["AQA Engineer", "AI Explorer", "Game Maker"],
    title_mobile: "AQA Engineer\nAI Explorer\nGame Maker",
    nav: {
        about: "Про мене",
        experience: "Досвід",
        education: "Освіта",
        skills: "Навички",
        projects: "Проєкти",
        additional: "Додатково",
        contact: "Контакти"
    },
    hero: {
        greeting: "Привіт! Я Алік",
        description: "AQA Engineer, який не просто тестує, а створює. Я використовую AI для розробки ігор та інтерактивних рішень, поєднуючи якість та креативність.",
        contactMe: "Зв'язатися",
        downloadCV: "Завантажити CV"
    },
    about: {
        title: "Про мене",
        location: "Одеса, Україна",
        content: "Я інженер з автоматизації тестування (AQA) з досвідом розробки автотестів для Desktop, Web та Mobile платформ. Окрім тестування, я активно займаюся розробкою: створив стратегічний тренажер MindStep та інтерактивне 3D резюме. Активно використовую можливості AI для прискорення розробки та забезпечення високої якості коду в різних технологічних стеках.",
        hobbiesTitle: "Хобі"
    },
    experience: {
        title: "Досвід роботи",
        showNonIT: "Показати досвід не пов'язаний з IT",
        hideNonIT: "Приховати додатковий досвід",
        present: "дотепер",
        it: [
            {
                date: "12/2021 - дотепер",
                company: "Intellias (Digitally Inspired Ltd)",
                role: "Manual & Automation QA Engineer",
                desc: "Тестування Web, Desktop та Mobile додатків. Автоматизація (C#, Selenium, WinAppDriver)."
            },
            {
                date: "06/2021 - 12/2021",
                company: "AB Soft",
                role: "Manual QA Engineer",
                desc: "Тестування пристроїв та мобільних додатків."
            },
            {
                date: "08/2017 – 09/2017",
                company: "Singree (IT компанія)",
                role: "SEO Analyst",
                desc: "Аналіз пошукових систем."
            }
        ],
        nonIT: [
            {
                date: "07/2019 – 06/2021",
                company: "UNICORN MEDIA",
                role: "Video Editor",
                desc: "Монтаж для YouTube."
            },
            {
                date: "06/2014 – 03/2020",
                company: "LEADERS 'NUT DUET'",
                role: "Video Editor & SDE",
                desc: "Монтаж заходів та виступів."
            },
            {
                date: "11/2017 – 07/2019",
                company: "7 Канал Одеса",
                role: "Video Editor",
                desc: "Монтаж новин."
            },
            {
                date: "09/2017 – 11/2017",
                company: "Телеканал 'КРУГ' Одеса",
                role: "Video Editor",
                desc: "Монтаж новин."
            },
            {
                date: "02/2012 – 09/2015",
                company: "ДИТЯЧА ТЕАТРАЛЬНА ШКОЛА",
                role: "Технічна підтримка",
                desc: "Технічне забезпечення понад сотні вистав та десятків заходів. Звук, світло, програмування пультів, зйомка та монтаж відео."
            }
        ]
    },
    education: {
        title: "Освіта",
        items: [
            {
                institution: "ОДЕСЬКИЙ НАЦІОНАЛЬНИЙ ПОЛІТЕХНІЧНИЙ УНІВЕРСИТЕТ",
                date: "2012 – 2017",
                desc: "Магістр (Спеціаліст), Комп'ютерні системи та мережі, Інститут комп'ютерних систем"
            },
            {
                institution: "ДИТЯЧА ТЕАТРАЛЬНА ШКОЛА",
                date: "2006 – 2013",
                desc: "Театральне відділення (2006-2012) // Музичне відділення (2009-2013)"
            }
        ]
    },
    skills: {
        title: "Навички",
        showMore: "Показати спеціалізовані навички",
        hideMore: "Приховати спеціалізовані навички",
        platforms: {
            desktop: "Desktop: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium",
            mobile: "Mobile: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            it: "IT та Автоматизація",
            design3d: "3D та Дизайн",
            video: "Відео та Медіа",
            tools: "ПЗ та Інструменти"
        },
        items: {
            ai: "AI",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D друк",
            godot: "Godot (GDScript)",
            premiere: "Premiere Pro",
            photoshop: "Photoshop",
            topaz: "Topaz AI",
            vmix: "vMix",
            jira: "Jira / Confluence",
            git: "Git",
            figma: "Figma",
            firebase: "Firebase"
        }
    },
    other: {
        title: "Додатково",
        iq: "125 (вище середнього)",
        olympics: "3 місце - 2016, Всеукраїнська олімпіада з діагностики комп'ютерних систем",
        driver: "Посвідчення водія, з 2015 року",
        languages: {
            title: "Мови",
            uk: "Українська — вільна",
            en: "Англійська — A2",
            ru: "російська — вільна"
        },
        hobbies: ["AI", "Відеоігри", "Дизайн", "Скрипти", "Настільні ігри", "Мафія", "3D друк"]
    },
    projects: {
        slovko: {
            title: "Slovko",
            description: "Повноцінна платформа для вивчення мов із персональною статистикою, системою акаунтів та змаганнями з друзями. Створюйте власні списки слів та опановуйте нові мови на будь-якому пристрої без зайвих перешкод.",
            button: "Почати вчити"
        },
        mindstep: {
            title: "MindStep",
            description: "Стратегічний тренажер для пам'яті та просторової уяви. Ходіть як ферзь, оминайте заблоковані клітинки або пориньте в режим гри наосліп!",
            button: "Спробувати гру"
        },
        cv3d: {
            title: "3D CV Інтерактив",
            description: "Інтерактивне резюме на Godot 4. Досліджуйте, взаємодійте, знайдіть черепаху!",
            button: "Дослідити 3D"
        }
    },
    pdf_modal: {
        title: "Виберіть версію PDF",
        dark: "Темна тема",
        light: "Світла тема"
    }
};
