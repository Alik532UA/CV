import type { Translations } from "../../controllers/I18nState.svelte";

export const be: Translations = {
    lastUpdate: "Апошняе абнаўленне: 8 жніўня 2026",
    title: ["Інжынер AQA", "Даследчык ШІ", "Стваральнік гульняў"],
    title_mobile: "Інжынер AQA\nДаследчык ШІ\nСтваральнік гульняў",
    nav: {
        about: "Пра мяне",
        experience: "Досвед",
        education: "Адукацыя",
        skills: "Навыкі",
        projects: "Праекты",
        additional: "Дадаткова",
        contact: "Кантакты",
        bottom_nav_label: "Ніжняя навігацыя"
    },
    hero: {
        greeting: "Прывітанне! Я Алік",
        description: "Automation QA Engineer і AI-інтэгратар. Я будую маштабаваныя тэставыя фрэймворкі, ствараю вэб-дадаткі і гульні, а таксама інтэгрую сістэмы ШІ (LLM, STT, TTS, аўтаномныя агенты).",
        contactMe: "Звязацца са мной",
        downloadCV: "Спампаваць CV",
        emailCopied: "Email скапіяваны!",
        openMailClient: "Адкрыць паштовы кліент"
    },
    about: {
        title: "Пра мяне",
        location: "Адэса, Украіна",
        content: "Інжынер па аўтаматызацыі QA з больш чым 5-гадовым агульным досведам у QA (у тым ліку больш за 2 гады ў AQA). Я аўтаматызую Web, Desktop (C#/WinAppDriver) і Mobile (Java/Appium/Playwright). Як распрацоўшчык, я стварыў экасістэму з 9 прадуктаў, уключаючы MindStep (з 23 E2E-тэстамі на Playwright) і маштабны AI-мод для Valheim. Я актыўна выкарыстоўваю агентныя AI-інструменты (Claude Code, Gemini CLI, Antigravity IDE) для паскарэння распрацоўкі і стварэння аўтатэстаў.",
        hobbiesTitle: "Хобі",
        philosophyTitle: "Асноўныя інжынерныя прынцыпы",
        philosophyItems: {
            greenfield: "Лідарства ў QA з нуля і сола: Практычны досвед стварэння скразных QA-працэсаў і аўтаматызацыі тэставання з нуля, без папярэдняй інфраструктуры.",
            dynamicTests: "Складаныя дынамічныя аўтатэсты: Напісанне прасунутых аўтаматызаваных тэстаў з дынамічным выбарам даных.",
            aiWorkflows: "Прадукцыйнасць на аснове AI: Інтэграцыя AI-інструментаў (Claude Code, Gemini CLI, Antigravity IDE) для паскарэння стварэння тэстаў."
        }
    },
    experience: {
        title: "Вопыт працы",
        showNonIT: "Паказаць non-IT вопыт",
        hideNonIT: "Схаваць non-IT вопыт",
        present: "па цяперашні час",
        companies: {
            theater_company: "Тэатральная школа"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Тэхнічная падтрымка"
        },
        descriptions: {
            intellias_desc: "Тэставанне Web, Desktop і Mobile прыкладанняў. Аўтаматызацыя тэставання (C#, Selenium, WinAppDriver, Appium). Даследаванне вытокаў памяці і race conditions.",
            absoft_desc: "Тэставанне прылад і мабільных прыкладанняў для відэарэгістратара",
            singree_desc: "Пошукавая аптымізацыя і аналіз.",
            unicorn_desc: "Мантаж відэа для YouTube-каналаў.",
            nutduet_desc: "Мантаж мерапрыемстваў і сцэнічных выступленняў.",
            channel7_desc: "Мантаж навінных выпускаў.",
            krug_desc: "Мантаж навінных выпускаў.",
            theater_desc: "Тэхнічная падтрымка больш за 100 тэатральных пастановак. Гук, святло, праграмаванне пультаў, відэаздымка і мантаж."
        }
    },
    education: {
        title: "Адукацыя",
        institutions: {
            polytech_name: "Адэскі нацыянальны політэхнічны ўніверсітэт",
            theater_school_name: "Дзіцячая тэатральная школа"
        },
        descriptions: {
            polytech_desc: "Магістр камп'ютарных сістэм і сетак, Інстытут камп'ютарных сістэм",
            theater_school_desc: "Тэатральнае аддзяленне (2006-2012) // Музычнае аддзяленне (2009-2013)"
        }
    },
    skills: {
        title: "Навыкі і тэхналогіі",
        showMore: "Паказаць спецыялізаваныя навыкі",
        hideMore: "Схаваць спецыялізаваныя навыкі",
        platforms: {
            desktop: "Desktop-праграма: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobile-праграма: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI і агентныя працоўныя працэсы",
            it: "IT і аўтаматызацыя",
            design3d: "3D і дызайн",
            video: "Відэа і медыя",
            tools: "ПЗ і інструменты"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Інтэграцыя AI / LLM",
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
        title: "Дадатковая інфармацыя",
        iq: "125 (вышэй за сярэдняе)",
        olympics: "3-е месца - 2016, Усеўкраінская алімпіяда па дыягностыцы камп'ютарных сістэм",
        driver: "Вадзіцельскае пасведчанне (з 2015 года)",
        languages: {
            title: "Мовы",
            uk: "Украінская — родная",
            en: "Англійская — A2 (тэхнічная / са штучным інтэлектам)",
            ru: "Руская — свабодна"
        },
        hobbies: ["ШІ", "Відэагульні", "Дызайн", "Скрыптынг", "Настольныя гульні", "Гульня «Мафія»", "3D-друк"]
    },
    projects: {
        title: "Праекты і партфоліа",
        featuredBadge: "Рэкамендаваная AI-падборка",
        categories: {
            all: "Усе праекты",
            games: "Гульні",
            apps: "Дадаткі",
            websites: "Сайты"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Прасунутая AI-мадыфікацыя для Valheim. Інтэгруе LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS і аўтаномных NPC-агентаў (фермеры, збіральнікі, рамонтнікі, крумкачы-кур'еры).",
                button: "Агляд відэа",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Стратэгічная вэб-гульня для трэніроўкі мозгу. Цалкам пакрыта 23 E2E-тэстамі на Playwright для забеспячэння стабільнасці, якасці рэгрэсіі і прадукцыйнасці.",
                button: "Гуляць",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Кросплатформавы дадатак для вывучэння слоў і галаваломка ў стылі Wordle з асабістай статыстыкай, уліковымі запісамі карыстальнікаў, конкурсным рэйтынгам і падтрымкай i18n на 7 мовах.",
                button: "Пачаць вучыцца",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Інтэрактыўны марскі партал-вітрына, які аб'ядноўвае ўсе вэб-дадаткі, гульні і інструменты ў адным адаптыўным інтэрфейсе.",
                button: "Адкрыць партал",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Інтэрактыўная 3D-гульня-рэзюмэ, створаная з нуля на Godot 4. Даследуйце свет, узаемадзейнічайце з аб'ектамі і знаходзьце пасхалкі!",
                button: "Запусціць 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D-графіка"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Інтэрактыўны вэб-сайт-партфоліа, створаны на Svelte 5, з toast-апавяшчэннямі, захаваннем стану і поўнай падтрымкай i18n.",
                button: "Паглядзець партфоліа",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Афіцыйны сайт і адмін-партал Адэскай тэатральнай школы з інтэрактыўнымі віджэтамі, цёмнай акіянічнай тэмай і фотагалерэямі.",
                button: "Наведаць сайт",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Мастацкая школа №5",
                description: "Афіцыйны сайт Адэскай мастацкай школы №5 з падтрымкай некалькіх моў, стужкай навін і адаптыўным дызайнам.",
                button: "Наведаць сайт",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Інтэрактыўны гульнявы праект у падтрымку ініцыятыў па выратаванні жывёл і абароне іх правоў.",
                button: "Адкрыць праект",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Выберыце версію PDF",
        ats: "ATS / RMS",
        dark: "Цёмная тэма",
        light: "Светлая тэма"
    },
    common: {
        close: "Закрыць",
        sound: "Гук"
    },
    scrollbar: {
        title: "Паласа прокруткі",
        standard: "Стандартная",
        custom: "Аўтарская",
        minimap: "Мінімапа мінімальная",
        minimapFull: "Мінімапа"
    },
    errorPage: {
        notFoundTitle: "Старонку не знойдзена",
        notFoundText: "Такога адраса тут няма. Магчыма, у спасылцы памылка ў кодзе мовы.",
        genericTitle: "Нешта пайшло не так",
        genericText: "Старонку не ўдалося паказаць. Звычайна дапамагае перазагрузка.",
        backHome: "Вярнуцца да рэзюмэ"
    }
};
