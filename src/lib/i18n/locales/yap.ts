import type { Translations } from "../../controllers/I18nState.svelte";

// DRAFT — UNVERIFIED MACHINE TRANSLATION. Yapese is an extremely
// low-resource language for automated translation; this file was produced
// with very low confidence and needs review by a native speaker before it
// should be treated as production-quality. Kept deliberately short and
// simple sentence-by-sentence to minimize the chance of grammatical
// nonsense, with English retained for technical terms (as in every other
// locale in this set).
export const yap: Translations = {
    lastUpdate: "N'en nib bee ni beech: Aug 8, 2026",
    title: ["AQA Engineer", "AI Explorer", "Chon Rin'e Game"],
    title_mobile: "AQA Engineer\nAI Explorer\nChon Rin'e Game",
    nav: {
        about: "Murung'agen Gag",
        experience: "Maruwel",
        education: "Skul",
        skills: "Gonop",
        projects: "Projects",
        additional: "Boch",
        contact: "Non Ngog",
        bottom_nav_label: "Kanawo' u Tan"
    },
    hero: {
        greeting: "Mogethin! Gag Alik",
        description: "Automation QA Engineer nge AI Integrator. Gu be maruwel u test framework nib ma'ay ni ngan gel, ngan rin'e web app nge game, nge ngan integrate AI system (LLM, STT, TTS, agent kan ni yad rayog e maruwel u yad).",
        contactMe: "Non Ngog",
        downloadCV: "Download CV",
        emailCopied: "Email e ni copy!",
        openMailClient: "Ligeg e Mail Client"
    },
    about: {
        title: "Murung'agen Gag",
        location: "Odesa, Ukraine",
        content: "QA Automation Engineer ni bay 5+ e duw rok u QA (2+ duw u AQA). Gu be automate Web, Desktop (C#/WinAppDriver), nge Mobile (Java/Appium/Playwright). Bod be'ni developer, ku rin'ag reb e ecosystem nib 9 product, ni including MindStep (nib 23 Playwright E2E test) nge reb e AI mod nib ga'ay ngak Valheim. Gu be fanay AI tool kan ni agentic (Claude Code, Gemini CLI, Antigravity IDE) ni fan ko ngan gel e maruwel nge rin'e test.",
        hobbiesTitle: "N'en Nib Fel' Ngog",
        philosophyTitle: "Yalen ni Ga'ay u Engineering",
        philosophyItems: {
            greenfield: "Sag ko QA ni Reb ma Bay Tabinaw Rok: Duw nib mudugil u rin'e QA process nge test automation nu tabolngin, dab ki bay infrastructure kakrom.",
            dynamicTests: "Autotest ni Mo'maw' nge Dynamic: Yoloy test kan ni automated ma bay dynamic data selection.",
            aiWorkflows: "Maruwel nib Ga'ay Bochan AI: Fanay AI tool kan (Claude Code, Gemini CLI, Antigravity IDE) ni fan ko ngan gel e rin'e test."
        }
    },
    experience: {
        title: "Maruwel",
        showNonIT: "Dag e Maruwel ni Gathi IT",
        hideNonIT: "Mith e Maruwel ni Gathi IT",
        present: "Chiney",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Ayuw Technical"
        },
        descriptions: {
            intellias_desc: "Test Web, Desktop, nge Mobile app kan. Test automation (C#, Selenium, WinAppDriver, Appium). Gay memory leak nge race condition kan.",
            absoft_desc: "Test device nge mobile app kan ko reb e video recorder ko military ni ba yoloy u C.",
            singree_desc: "Search engine optimization nge analysis.",
            unicorn_desc: "Video editing ko YouTube channel kan.",
            nutduet_desc: "Editing ko event nge stage performance kan.",
            channel7_desc: "Editing news kan.",
            krug_desc: "Editing news kan.",
            theater_desc: "Ayuw technical ko 100+ theater show kan. Sound, tamilang, console programming, video shooting nge editing."
        }
    },
    education: {
        title: "Skul",
        institutions: {
            polytech_name: "Odesa National Polytechnic University",
            theater_school_name: "Skul e Theatre ko Bitir"
        },
        descriptions: {
            polytech_desc: "Master's degree u Computer Systems nge Networks, Institute of Computer Systems",
            theater_school_desc: "Theatre Department (2006-2012) // Music Department (2009-2013)"
        }
    },
    skills: {
        title: "Gonop nge Technology",
        showMore: "Dag e Gonop nib Falfalan'",
        hideMore: "Mith e Gonop nib Falfalan'",
        platforms: {
            desktop: "Desktop app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobile app: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI nge Agentic Workflow",
            it: "IT nge Automation",
            design3d: "3D nge Design",
            video: "Video nge Media",
            tools: "Software nge Tool kan"
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
            printing: "3D Printing",
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
        title: "Boch e Thin",
        iq: "125 (Ga'ay ko Averej)",
        olympics: "Bin dalip - 2016, All-Ukrainian Olympiad u Computer System Diagnostics",
        driver: "Driver's License (nap'an 2015)",
        languages: {
            title: "Thin",
            uk: "Ukrainian — Thin Tafen",
            en: "English — A2 (Technical / Ayuw rok AI)",
            ru: "Russian — Gonop Nib Fel'"
        },
        hobbies: ["AI", "Video Game kan", "Design", "Scripting", "Board Game kan", "Mafia Game", "3D Printing"]
    },
    projects: {
        title: "Projects nge Portfolio",
        featuredBadge: "AI Showcase nib Tolang",
        categories: {
            all: "Urngin e Projects",
            games: "Game kan",
            apps: "App kan",
            websites: "Website kan"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "AI modification nib ga'ay ngak Valheim. Be integrate LLM kan (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS, nge autonomous NPC agent kan (chon maruwel u binaw, chon fek, chon toy, courier raven kan).",
                button: "Video Overview",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Web game nib strategic ko brain-training. Ke mus'ay nag ni 23 E2E Playwright autotest kan ni fan ko stability, regression quality, nge performance.",
                button: "Rin'e Game",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Cross-platform word-learning app nge Wordle-style puzzle nib bay personal statistics, user accounts, competitive leaderboard, nge 7-language i18n support.",
                button: "Tabolngin e Skul",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Sea-themed showcase hub nge portfolio portal ni be integrate web app, game, nge tool urngin u reb e interface nib ma'ay ngan gel.",
                button: "Ligeg e Portal",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "3D resume game nib interactive, ni yoloy nu tabolngin u Godot 4. Gay e fayleng, integrate object kan, nge fil easter egg kan!",
                button: "Tabolngin e 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D Graphics"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interactive web portfolio website ni yoloy u Svelte 5, bay toast notification kan, state persistence, nge full i18n support.",
                button: "Guy e Portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Official website nge admin portal ko Odesa Theatre School nib bay interactive widget kan, dark ocean theme, nge photo gallery kan.",
                button: "Guy e Website",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Art School №5",
                description: "Official website ko Odesa Art School №5 nib bay multi-language support, news feed kan, nge responsive design.",
                button: "Guy e Website",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interactive gaming project ni be ayuw ko animal rescue initiative kan nge animal protection awareness.",
                button: "Ligeg e Project",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Mel'eg e PDF Version",
        ats: "ATS / RMS",
        dark: "Dark Theme",
        light: "Light Theme"
    },
    common: {
        close: "Mith",
        sound: "Sound"
    },
    scrollbar: {
        title: "Scrollbar",
        standard: "Standard",
        custom: "Custom",
        minimap: "Minimap",
        minimapFull: "Visual minimap"
    }
};
