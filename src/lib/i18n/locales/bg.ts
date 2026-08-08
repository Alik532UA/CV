import type { Translations } from "../../controllers/I18nState.svelte";

export const bg: Translations = {
    lastUpdate: "Последна актуализация: 8 август 2026",
    title: ["AQA Инженер", "AI Изследовател", "Създател на Игри"],
    title_mobile: "AQA Инженер\nAI Изследовател\nСъздател на Игри",
    nav: {
        about: "За мен",
        experience: "Опит",
        education: "Образование",
        skills: "Умения",
        projects: "Проекти",
        additional: "Допълнително",
        contact: "Контакти",
        bottom_nav_label: "Долна навигация"
    },
    hero: {
        greeting: "Здравей! Аз съм Алик",
        description: "Automation QA инженер и AI интегратор. Изграждам мащабируеми тест фреймуърци, създавам уеб приложения и игри, и интегрирам AI системи (LLM, STT, TTS, автономни агенти).",
        contactMe: "Свържете се с мен",
        downloadCV: "Изтегли CV",
        emailCopied: "Имейлът е копиран!",
        openMailClient: "Отвори пощенски клиент"
    },
    about: {
        title: "За мен",
        location: "Одеса, Украйна",
        content: "QA Automation инженер с над 5 години общ опит в QA (от които над 2 години в AQA). Автоматизирам Web, Desktop (C#/WinAppDriver) и Mobile (Java/Appium/Playwright). Като разработчик изградих екосистема от 9 продукта, включително MindStep (с 23 E2E теста в Playwright) и мащабен AI мод за Valheim. Активно използвам агентни AI инструменти (Claude Code, Gemini CLI, Antigravity IDE), за да ускоря разработката и създаването на автотестове.",
        hobbiesTitle: "Хобита",
        philosophyTitle: "Основни инженерни принципи",
        philosophyItems: {
            greenfield: "Соло QA лидерство от нулата: Практически опит в изграждането на цялостни QA процеси и автоматизация на тестове от нулата, без предварителна инфраструктура.",
            dynamicTests: "Сложни динамични автотестове: Писане на напреднали автоматизирани тестове с динамичен избор на данни.",
            aiWorkflows: "Продуктивност, задвижвана от AI: Интеграция на AI инструменти (Claude Code, Gemini CLI, Antigravity IDE) за ускоряване на създаването на тестове."
        }
    },
    experience: {
        title: "Опит",
        showNonIT: "Покажи опит извън IT",
        hideNonIT: "Скрий опит извън IT",
        present: "Настояще",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Техническа поддръжка"
        },
        descriptions: {
            intellias_desc: "Тестване на Web, Desktop и Mobile приложения. Автоматизация на тестове (C#, Selenium, WinAppDriver, Appium). Изследване на изтичания на памет и race conditions.",
            absoft_desc: "Тестване на устройства и мобилни приложения за военен видеорекордер на C.",
            singree_desc: "Оптимизация и анализ за търсачки.",
            unicorn_desc: "Видео монтаж за YouTube канали.",
            nutduet_desc: "Монтаж на събития и сценични изпълнения.",
            channel7_desc: "Монтаж на новинарски емисии.",
            krug_desc: "Монтаж на новинарски емисии.",
            theater_desc: "Техническа поддръжка на над 100 театрални постановки. Звук, осветление, програмиране на пултове, заснемане и монтаж на видео."
        }
    },
    education: {
        title: "Образование",
        institutions: {
            polytech_name: "Одески национален политехнически университет",
            theater_school_name: "Детско театрално училище"
        },
        descriptions: {
            polytech_desc: "Магистър по компютърни системи и мрежи, Институт по компютърни системи",
            theater_school_desc: "Театрален отдел (2006-2012) // Музикален отдел (2009-2013)"
        }
    },
    skills: {
        title: "Умения и технологии",
        showMore: "Покажи специализирани умения",
        hideMore: "Скрий специализирани умения",
        platforms: {
            desktop: "Desktop приложение: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobile приложение: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI и агентни работни процеси",
            it: "IT и автоматизация",
            design3d: "3D и дизайн",
            video: "Видео и медия",
            tools: "Софтуер и инструменти"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "AI / LLM интеграция",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D печат",
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
        title: "Допълнителна информация",
        iq: "125 (над средното)",
        olympics: "3-то място - 2016, Всеукраинска олимпиада по диагностика на компютърни системи",
        driver: "Шофьорска книжка (от 2015 г.)",
        languages: {
            title: "Езици",
            uk: "Украински — Роден",
            en: "Английски — A2 (Технически / С помощ на AI)",
            ru: "Руски — Свободно"
        },
        hobbies: ["AI", "Видеоигри", "Дизайн", "Скриптинг", "Настолни игри", "Игра Мафия", "3D печат"]
    },
    projects: {
        title: "Проекти и портфолио",
        featuredBadge: "Избрана AI витрина",
        categories: {
            all: "Всички проекти",
            games: "Игри",
            apps: "Приложения",
            websites: "Уебсайтове"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Модификация с усъвършенстван AI за Valheim. Интегрира LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS и автономни NPC агенти (фермери, събирачи, поправчици, куриерски гарвани).",
                button: "Гледай видео",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Стратегическа уеб игра за тренировка на мозъка. Напълно покрита с 23 E2E теста в Playwright за гарантиране на стабилност, качество на регресията и производителност.",
                button: "Играй",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Крос-платформено приложение за учене на думи и пъзел в стил Wordle с лична статистика, потребителски акаунти, състезателна класация и поддръжка на i18n на 7 езика.",
                button: "Започни да учиш",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Интерактивен витринен портал с морска тематика, обединяващ всички уеб приложения, игри и инструменти в един отзивчив интерфейс.",
                button: "Отвори портала",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Интерактивна 3D игра-автобиография, изградена от нулата на Godot 4. Изследвайте света, взаимодействайте с обекти и открийте easter eggs!",
                button: "Стартирай 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D графика"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Интерактивен уеб сайт-портфолио, изграден със Svelte 5, с toast известия, запазване на състоянието и пълна поддръжка на i18n.",
                button: "Виж портфолиото",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Официален сайт и административен портал на Одеското театрално училище с интерактивни джаджи, тъмна океанска тема и фото галерии.",
                button: "Посети сайта",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Художествено училище №5",
                description: "Официален сайт на Одеското художествено училище №5 с поддръжка на много езици, новини и отзивчив дизайн.",
                button: "Посети сайта",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Интерактивен игрови проект в подкрепа на инициативи за спасяване на животни и повишаване на осведомеността за защитата на животните.",
                button: "Отвори проекта",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Избери версия на PDF",
        ats: "ATS / RMS",
        dark: "Тъмна тема",
        light: "Светла тема"
    },
    common: {
        close: "Затвори"
    }
};
