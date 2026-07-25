import type { Translations } from "../../controllers/I18nState.svelte";

export const uk: Translations = {
    lastUpdate: "Останнє оновлення: 25 липня 2026",
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
        description: "Automation QA Engineer та AI Integrator. Створюю масштабовані тестові фреймворки, розробляю ігри та інтегрую нейромережі (LLM, STT, TTS, autonomous agents).",
        contactMe: "Зв'язатися",
        downloadCV: "Завантажити CV",
        emailCopied: "Email скопійовано!",
        openMailClient: "Відкрити поштовий клієнт"
    },
    about: {
        title: "Про мене",
        location: "Одеса, Україна",
        content: "Я інженер із забезпечення якості з 4+ роками досвіду (з них 2+ у AQA). Автоматизую Web, Desktop (C#/WinAppDriver) та Mobile (Java/Appium/Playwright). Як розробник, я створив продуктову екосистему з 9 проєктів, включно зі стратегічною грою MindStep (з 23 E2E тестами на Playwright) та масштабним AI-модом для Valheim. Активно використовую AI CLI та агентні інструменти (Claude Code, Gemini CLI, Antigravity IDE) для прискорення розробки та автоматизації.",
        hobbiesTitle: "Хобі",
        philosophyTitle: "Ключові інженерні принципи",
        philosophyItems: {
            greenfield: "Greenfield & Solo QA Лідерство: Практичний досвід побудови QA-процесів та автоматизації з нуля за відсутності початкової інфраструктури.",
            dynamicTests: "Динамічне автотестування: Написання складних автотестів з динамічним вибором даних.",
            aiWorkflows: "AI-продуктивність: Інтеграція AI-інструментів (Claude Code, Gemini CLI, Antigravity IDE) для прискорення розробки автотестів."
        }
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
            intellias_desc: "Тестування Web, Desktop та Mobile додатків. Автоматизація (C#, Selenium, WinAppDriver, Appium). Дослідження витоків пам'яті та race conditions.",
            absoft_desc: "Тестування пристроїв та мобільних додатків для військового відеореєстратора на C.",
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
        title: "Навички та Технології",
        showMore: "Показати спеціалізовані навички",
        hideMore: "Приховати спеціалізовані навички",
        platforms: {
            desktop: "Desktop app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobile app: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI & Agentic Workflows",
            it: "IT та автоматизація",
            design3d: "3D та дизайн",
            video: "Відео та медіа",
            tools: "Софт та інструменти"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "AI / LLM Integration",
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
            en: "Англійська — A2 (Technical / AI Assisted)",
            ru: "Російська — вільно"
        },
        hobbies: ["AI", "Відеоігри", "Дизайн", "Скрипти", "Настільні ігри", "Гра Мафія", "3D-друк"]
    },
    projects: {
        title: "Проєкти та Портфоліо",
        featuredBadge: "Featured AI Showcase",
        categories: {
            all: "Усі проєкти",
            games: "Ігри",
            apps: "Застосунки",
            websites: "Вебсайти"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Масштабна AI-модифікація для Valheim. Інтегрує LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS та автономних NPC-агентів (фермери, збирачі, ремонтники, кур'єри).",
                button: "Відеоогляд",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Стратегічна гра для тренування пам'яті та уяви. Повністю покрита 23 E2E автотестами на Playwright для забезпечення стабільності та якості.",
                button: "Спробувати гру",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Кросплатформовий додаток для вивчення слів та гра-головоломка з персональною статистикою, акаунтами, дошкою лідерів та 7 мовами (i18n).",
                button: "Почати вчитися",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Морський інтерактивний портал-шоукейс, що об'єднує всі мої вебдодатки, ігри та інструменти в єдиному адаптивному інтерфейсі.",
                button: "Відкрити Портал",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Інтерактивне 3D резюме, створене з нуля на Godot 4. Досліджуйте світ, взаємодійте з об'єктами та знайдіть великодки!",
                button: "Відкрити 3D",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D Graphics"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Інтерактивний вебсайт-портфоліо на Svelte з підтримкою тост-сповіщень, збереженням стану та повноцінним i18n.",
                button: "Переглянути CV",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Офіційний сайт та адмін-портал Одеської театральної школи з інтерактивними віджетами, темною океанською темою та галереями.",
                button: "Відвідати сайт",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Мистецька школа №5",
                description: "Офіційний сайт Мистецької школи №5 м. Одеси з підтримкою мультимовності, новин та адаптивного дизайну.",
                button: "Відвідати сайт",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Інтерактивний ігровий проєкт, присвячений підтримці зоозахисних ініціатив та порятунку тварин.",
                button: "Відкрити проєкт",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Виберіть версію PDF",
        ats: "ATS / RMS",
        dark: "Темна тема",
        light: "Світла тема"
    },
    common: {
        close: "Закрити"
    }
};
