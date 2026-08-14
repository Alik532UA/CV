import type { Translations } from "../../controllers/I18nState.svelte";

// DRAFT — UNVERIFIED MACHINE TRANSLATION. Pohnpeian is an extremely
// low-resource language for automated translation; this file was produced
// with very low confidence and needs review by a native speaker before it
// should be treated as production-quality. Kept deliberately short and
// simple sentence-by-sentence to minimize the chance of grammatical
// nonsense, with English retained for technical terms (as in every other
// locale in this set).
export const pon: Translations = {
    lastUpdate: "Kawewe ehu: Aukus 8, 2026",
    title: ["AQA Engineer", "AI Explorer", "Sounwia Game"],
    title_mobile: "AQA Engineer\nAI Explorer\nSounwia Game",
    nav: {
        about: "Duwen Ngehi",
        experience: "Doadoahk",
        education: "Sukuhl",
        skills: "Koahiek",
        projects: "Projects",
        additional: "Pil Ekei",
        contact: "Kolokol",
        bottom_nav_label: "Kahre Pahnalap"
    },
    hero: {
        greeting: "Kaselehlie! Ngehi Alik",
        description: "Automation QA Engineer oh AI Integrator. I kin wia test framework kan me kak keklapala, wia web app oh game kan, oh kapatapene AI system kan (LLM, STT, TTS, agent kan me sohte tekiedi).",
        contactMe: "Kolokol Ie",
        downloadCV: "Download CV",
        emailCopied: "Email pekederdier!",
        openMailClient: "Ritingada Mail Client"
    },
    about: {
        title: "Duwen Ngehi",
        location: "Odesa, Ukraine",
        content: "QA Automation Engineer me mie sounpar 5+ ah doadoahk nan QA (2+ sounpar nan AQA). I kin automate Web, Desktop (C#/WinAppDriver), oh Mobile (Java/Appium/Playwright). Nin duwen sounwia, i wiadahr ehu ekosystem me 9 product, iangahki MindStep (me mie 23 Playwright E2E test) oh AI mod kalaimwahu ehu ong Valheim. I kin doadoahngki AI tool agentic kan (Claude Code, Gemini CLI, Antigravity IDE) pwehn kakekekehla wiepen test.",
        hobbiesTitle: "Kapehlpehl kan",
        philosophyTitle: "Kaweid en Engineering",
        philosophyItems: {
            greenfield: "Kaweid en QA Kelehpw sang Tapiada: Doadoahk ni mehlel en kauwada QA process oh test automation sang tapiada, sohte infrastructure me mie mahs.",
            dynamicTests: "Autotest me Kalaimwahu oh Dynamic: Ntingihedi test kan me automated oh mie dynamic data selection.",
            aiWorkflows: "Doadoahk Keieu Kehlail sang AI: Doadoahngki AI tool kan (Claude Code, Gemini CLI, Antigravity IDE) pwehn kakekekehla wiepen test."
        }
    },
    experience: {
        title: "Doadoahk",
        showNonIT: "Kasalehda Doadoahk me Kaidehn IT",
        hideNonIT: "Ekihsang Doadoahk me Kaidehn IT",
        present: "Ansou Wet",
        companies: {
            theater_company: "Sukuhlen Theatre"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Sawas Technical"
        },
        descriptions: {
            intellias_desc: "Kasongsong Web, Desktop, oh Mobile app kan. Test automation (C#, Selenium, WinAppDriver, Appium). Rapahki memory leak oh race condition kan.",
            absoft_desc: "Kasongsong device oh mobile app kan ong video recorder ehu",
            singree_desc: "Search engine optimization oh koasoi.",
            unicorn_desc: "Wia video editing ong YouTube channel kan.",
            nutduet_desc: "Editing ong event oh stage performance kan.",
            channel7_desc: "Editing rohng kapwung kan.",
            krug_desc: "Editing rohng kapwung kan.",
            theater_desc: "Sawas technical ong 100+ theater show. Sound, marain, console programming, video shooting oh editing."
        }
    },
    education: {
        title: "Sukuhl",
        institutions: {
            polytech_name: "Odesa National Polytechnic University",
            theater_school_name: "Sukuhlen Theatre en Seri kan"
        },
        descriptions: {
            polytech_desc: "Master's degree nan Computer Systems oh Networks, Institute of Computer Systems",
            theater_school_desc: "Theatre Department (2006-2012) // Music Department (2009-2013)"
        }
    },
    skills: {
        title: "Koahiek oh Technology kan",
        showMore: "Kasalehda Koahiek me Keieu",
        hideMore: "Ekihsang Koahiek me Keieu",
        platforms: {
            desktop: "Desktop app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobile app: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI oh Agentic Workflow",
            it: "IT oh Automation",
            design3d: "3D oh Design",
            video: "Video oh Media",
            tools: "Software oh Tool kan"
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
        title: "Pil Ekei Mahsen",
        iq: "125 (Laudsang Ansou Kan)",
        olympics: "Keriau 3 - 2016, All-Ukrainian Olympiad nan Computer System Diagnostics",
        driver: "Driver's License (sang 2015)",
        languages: {
            title: "Lokaia kan",
            uk: "Ukrainian — Uduk en Lokaia",
            en: "English — A2 (Technical / AI Sawaspene)",
            ru: "Russian — Koahiek Mwahu"
        },
        hobbies: ["AI", "Video Game kan", "Design", "Scripting", "Board Game kan", "Mafia Game", "3D Printing"]
    },
    projects: {
        title: "Projects oh Portfolio",
        featuredBadge: "AI Showcase Kesempwal",
        categories: {
            all: "Projects Koaros",
            games: "Game kan",
            apps: "App kan",
            websites: "Website kan"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "AI modification kalaimwahu ehu ong Valheim. Kapatapene LLM kan (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS, oh autonomous NPC agent kan (sounmwahng, sounkihsang, sounonop, courier raven kan).",
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
                description: "Web game strategic ong brain-training. Direkpene kaualap sang 23 E2E Playwright autotest pwehn kadehdehla stability, regression quality, oh performance.",
                button: "Wia Game",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Cross-platform word-learning app oh Wordle-style puzzle me mie personal statistics, user accounts, competitive leaderboard, oh 7-language i18n support.",
                button: "Tapihada Sukuhl",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Sea-themed showcase hub oh portfolio portal me kapatapene web app, game, oh tool koaros nan interface ehuete me kak keklapala.",
                button: "Ritingada Portal",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "3D resume game me interactive, wiawihda sang tapiada nan Godot 4. Rapahki sampah, kapatapene dipwisou kan, oh diarada easter egg kan!",
                button: "Tapihada 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D Graphics"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interactive web portfolio website me wiawihda ni Svelte 5, mie toast notification kan, state persistence, oh full i18n support.",
                button: "Kilang Portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Official website oh admin portal ong Odesa Theatre School me mie interactive widget kan, dark ocean theme, oh photo gallery kan.",
                button: "Kilang Website",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Art School №5",
                description: "Official website ong Odesa Art School №5 me mie multi-language support, news feed kan, oh responsive design.",
                button: "Kilang Website",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interactive gaming project me sawas ong animal rescue initiative kan oh animal protection awareness.",
                button: "Ritingada Project",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Pilada PDF Version",
        ats: "ATS / RMS",
        dark: "Dark Theme",
        light: "Light Theme"
    },
    common: {
        close: "Ritidi",
        sound: "Sound"
    },
    scrollbar: {
        title: "Scrollbar",
        standard: "Standard",
        custom: "Author's",
        minimap: "Minimal Minimap",
        minimapFull: "Minimap"
    },
    errorPage: {
        notFoundTitle: "Sohte diarada page-o",
        notFoundText: "Sohte mie address wet. Ele mie sapwung nan language code en link-o.",
        genericTitle: "Mie mehkot sapwung",
        genericText: "Sohte kak kasalehda page-o. Reload kin sewese.",
        backHome: "Pwurala ni CV"
    },
    ai: {
        subtitle: "Kihdi oaralap en doadoahk de link ong — AI pahn karasapene ong sapwellimen Alik experience.",
        jobPlaceholder: "Job description de link...",
        analyze: "Kasawih oaralap",
        analyzing: "Kasawih...",
        newAnalysis: "Analysis kapw",
        newAnalysisHint: "Kasawih ehu oaralap tohrohr",
        rawTitle: "Sapeng en AI",
        rawNote: "Model-o sohte kihda score ni format — se kasalehda text-o duwehte.",
        summaryTitle: "Kaimwiseklahn AI",
        matchLabel: "Match",
        strengths: "Kehl kan",
        gaps: "Me sohte mie oh peidek kan",
        followUpTitle: "Idek pil ehu duwen sapwellimen Alik experience:",
        chatPlaceholder: "Noumw peidek duwen sapwellimen Alik experience...",
        thinking: "AI kin medemedewe...",
        modelTitle: "Model AI",
        modelAuto: "Auto — me keieu mwahu me mie",
        bannerSub: "Kilang ia uwen oaralap-o eh konehng candidate-o",
        open: "Ritingada AI Job Matcher",
        statusNoKey: "sohte key",
        statusCooldown: "limit ~{minutes} min",
        statusAnswered: "sapengki",
        statusReady: "onopadahr",
        tooltipAnswered: "{model} ({provider}) sapengki. Klik pwehn pilada emen tohrohr.",
        tooltipWillTry: "E pahn tepin song {model} ({provider}). Klik pwehn pilada emen tohrohr.",
        pinHint: "Model me ke pilada pahn tepin song. Ma eh limit imwisekla, peidek pahn kohla ni me kohdo.",
        emptyAnswer: "Model-o kihda sapeng me sohte audepe. Song sapahl, de pilada model tohrohr ni badge powe."
    }
};
