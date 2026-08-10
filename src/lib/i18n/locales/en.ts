import type { Translations } from "../../controllers/I18nState.svelte";

export const en: Translations = {
    lastUpdate: "Last update: August 8, 2026",
    title: ["AQA Engineer", "AI Explorer", "Game Maker"],
    title_mobile: "AQA Engineer\nAI Explorer\nGame Maker",
    nav: {
        about: "About Me",
        experience: "Experience",
        education: "Education",
        skills: "Skills",
        projects: "Projects",
        additional: "Additional",
        contact: "Contact",
        bottom_nav_label: "Bottom Navigation"
    },
    hero: {
        greeting: "Hi! I'm Alik",
        description: "Automation QA Engineer and AI Integrator. I build scalable test frameworks, create web apps & games, and integrate AI systems (LLMs, STT, TTS, autonomous agents).",
        contactMe: "Get in Touch",
        downloadCV: "Download CV",
        emailCopied: "Email copied!",
        openMailClient: "Open Mail Client"
    },
    about: {
        title: "About Me",
        location: "Odesa, Ukraine",
        content: "QA Automation Engineer with 5+ years of total QA experience (including 2+ years in AQA). I automate Web, Desktop (C#/WinAppDriver), and Mobile (Java/Appium/Playwright). As a developer, I built an ecosystem of 9 products, including MindStep (with 23 Playwright E2E tests) and a massive AI mod for Valheim. I actively leverage agentic AI tools (Claude Code, Gemini CLI, Antigravity IDE) to accelerate development and autotest creation.",
        hobbiesTitle: "Hobbies",
        philosophyTitle: "Core Engineering Principles",
        philosophyItems: {
            greenfield: "Greenfield & Solo QA Leadership: Hands-on experience establishing end-to-end QA processes and test automation from scratch without prior infrastructure.",
            dynamicTests: "Complex Dynamic Autotests: Writing advanced automated tests with dynamic data selection.",
            aiWorkflows: "AI-Driven Productivity: Integrating AI tools (Claude Code, Gemini CLI, Antigravity IDE) to accelerate test creation."
        }
    },
    experience: {
        title: "Experience",
        showNonIT: "Show Non-IT Experience",
        hideNonIT: "Hide Non-IT Experience",
        present: "Present",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Technical Support"
        },
        descriptions: {
            intellias_desc: "Web, Desktop, and Mobile application testing. Test automation (C#, Selenium, WinAppDriver, Appium). Investigating memory leaks and race conditions.",
            absoft_desc: "Device and mobile application testing for a military video recorder in C.",
            singree_desc: "Search engine optimization and analysis.",
            unicorn_desc: "Video editing for YouTube channels.",
            nutduet_desc: "Editing events and stage performances.",
            channel7_desc: "Editing news broadcasts.",
            krug_desc: "Editing news broadcasts.",
            theater_desc: "Technical support for 100+ theatrical shows. Sound, lighting, console programming, video shooting and editing."
        }
    },
    education: {
        title: "Education",
        institutions: {
            polytech_name: "Odesa National Polytechnic University",
            theater_school_name: "Children's Theatre School"
        },
        descriptions: {
            polytech_desc: "Master's degree in Computer Systems and Networks, Institute of Computer Systems",
            theater_school_desc: "Theatre Department (2006-2012) // Music Department (2009-2013)"
        }
    },
    skills: {
        title: "Skills & Stack",
        showMore: "Show Specialized Skills",
        hideMore: "Hide Specialized Skills",
        platforms: {
            desktop: "Desktop app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobile app: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI & Agentic Workflows",
            it: "IT & Automation",
            design3d: "3D & Design",
            video: "Video & Media",
            tools: "Software & Tools"
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
        title: "Additional Information",
        iq: "125 (Above Average)",
        olympics: "3rd place - 2016, All-Ukrainian Olympiad in Computer System Diagnostics",
        driver: "Driver's License (since 2015)",
        languages: {
            title: "Languages",
            uk: "Ukrainian — Native",
            en: "English — A2 (Technical / AI Assisted)",
            ru: "Russian — Fluent"
        },
        hobbies: ["AI", "Video Games", "Design", "Scripting", "Board Games", "Mafia Game", "3D Printing"]
    },
    projects: {
        title: "Projects & Portfolio",
        featuredBadge: "Featured AI Showcase",
        categories: {
            all: "All Projects",
            games: "Games",
            apps: "Apps",
            websites: "Websites"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Advanced AI modification for Valheim. Integrates LLMs (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS, and autonomous NPC agents (farmers, gatherers, repairers, courier ravens).",
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
                description: "Strategic brain-training web game. Fully covered with 23 E2E Playwright autotests to ensure stability, regression quality, and performance.",
                button: "Play Game",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Cross-platform word-learning app & Wordle-style puzzle with personal statistics, user accounts, competitive leaderboard, and 7-language i18n support.",
                button: "Start Learning",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interactive Sea-themed showcase hub & portfolio portal uniting all web apps, games, and tools in a single responsive interface.",
                button: "Open Portal",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interactive 3D resume game built from scratch on Godot 4. Explore the world, interact with objects, and discover easter eggs!",
                button: "Launch 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D Graphics"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interactive web portfolio website built with Svelte 5 featuring toast notifications, state persistence, and full i18n support.",
                button: "View Portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Official website and admin portal for Odesa Theatre School featuring interactive widgets, dark ocean theme, and photo galleries.",
                button: "Visit Website",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Art School №5",
                description: "Official website for Odesa Art School №5 featuring multi-language support, news feeds, and responsive design.",
                button: "Visit Website",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interactive gaming project supporting animal rescue initiatives and animal protection awareness.",
                button: "Open Project",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Select PDF Version",
        ats: "ATS / RMS",
        dark: "Dark Theme",
        light: "Light Theme"
    },
    common: {
        close: "Close",
        sound: "Sound"
    }
};
