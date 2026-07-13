import type { Translations } from "../../controllers/I18nState.svelte";

export const uk: Translations = {
    lastUpdate: "Останнє оновлення: 28 квітня 2026",
    title: ["AQA Engineer", "AI Explorer", "Game Maker"],
    title_mobile: "AQA Engineer\nAI Explorer\nGame Maker",
    nav: {
        about: "Про мене",
        experience: "Досвід",
        education: "Освіта",
        skills: "Навички",
        projects: "Проєкти",
        additional: "Додатково",
        contact: "Контакти",
        bottom_nav_label: "Нижня навігація"
    },
    hero: {
        greeting: "Привіт! Я Алік",
        description: "AQA інженер, який не просто тестує, а створює. Я використовую AI для розробки ігор та інтерактивного досвіду, поєднуючи якість та креативність.",
        contactMe: "Зв'язатися",
        downloadCV: "Завантажити CV",
        emailCopied: "Email скопійовано!",
        openMailClient: "Відкрити поштовий клієнт"
    },
    about: {
        title: "Про мене",
        location: "Одеса, Україна",
        content: "Я інженер із забезпечення якості з досвідом створення автоматизованих тестів для Desktop, Web та Mobile платформ. Окрім QA, я активний розробник, який втілив у життя стратегічну гру MindStep та інтерактивне 3D CV. Використовую AI-інструменти для прискорення розробки та написання високоякісного коду на різних технологічних стеках.",
        hobbiesTitle: "Хобі"
    },
    experience: {
        title: "Досвід роботи",
        showNonIT: "Показати non-IT досвід",
        hideNonIT: "Приховати non-IT досвід",
        present: "по теперішній час",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Технічна підтримка"
        },
        descriptions: {
            intellias_desc: "Тестування Web, Desktop та Mobile додатків. Автоматизація (C#, Selenium, WinAppDriver).",
            absoft_desc: "Тестування пристроїв та мобільних додатків.",
            singree_desc: "Аналіз пошукових систем.",
            unicorn_desc: "Монтаж відео для YouTube.",
            nutduet_desc: "Монтаж заходів та виступів.",
            channel7_desc: "Монтаж новин.",
            krug_desc: "Монтаж новин.",
            theater_desc: "Технічний супровід понад сотні вистав. Відповідальний за звук, світло, програмування пультів, зйомку та монтаж відео."
        }
    },
    education: {
        title: "Освіта",
        institutions: {
            polytech_name: "Одеський національний політехнічний університет",
            theater_school_name: "Дитяча театральна школа"
        },
        descriptions: {
            polytech_desc: "Магістр (спеціаліст) комп'ютерних систем та мереж, Інститут комп'ютерних систем",
            theater_school_desc: "Театральне відділення (2006-2012) // Музичне відділення (2009-2013)"
        }
    },
    skills: {
        title: "Навички",
        showMore: "Показати спеціалізовані навички",
        hideMore: "Приховати спеціалізовані навички",
        platforms: {
            desktop: "Desktop app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium",
            mobile: "Mobile app: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            it: "IT та автоматизація",
            design3d: "3D та дизайн",
            video: "Відео та медіа",
            tools: "Софт та інструменти"
        },
        items: {
            ai: "AI",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D-друк",
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
        driver: "Водійське посвідчення, з 2015 року",
        languages: {
            title: "Мови",
            uk: "Українська — рідна",
            en: "Англійська — A2",
            ru: "російська — вільно"
        },
        hobbies: ["AI", "Відеоігри", "Дизайн", "Скрипти", "Настільні ігри", "Гра Мафія", "3D-друк"]
    },
    projects: {
        slovko: {
            title: "Slovko",
            description: "Платформа для вивчення мов з персональною статистикою та змаганнями. Створюйте власні списки слів та вчіть мови на будь-якому пристрої.",
            button: "Почати вчитися"
        },
        mindstep: {
            title: "MindStep",
            description: "Стратегічна гра для тренування пам'яті та уяви. Ходіть як королева, уникайте пасток або спробуйте 'сліпий' режим!",
            button: "Спробувати гру"
        },
        cv3d: {
            title: "3D CV Experience",
            description: "Інтерактивне 3D резюме на Godot 4. Досліджуйте, взаємодійте та знайдіть черепашку!",
            button: "Відкрити 3D"
        }
    },
    pdf_modal: {
        title: "Виберіть версію PDF",
        ats: "ATS / RMS",
        dark: "Темна тема",
        light: "Світла тема"
    }
};
