import type { Translations } from "../../controllers/I18nState.svelte";

export const cs: Translations = {
    lastUpdate: "Poslední aktualizace: 8. srpna 2026",
    title: ["AQA Inženýr", "Průzkumník AI", "Tvůrce Her"],
    title_mobile: "AQA Inženýr\nPrůzkumník AI\nTvůrce Her",
    nav: {
        about: "O mně",
        experience: "Zkušenosti",
        education: "Vzdělání",
        skills: "Dovednosti",
        projects: "Projekty",
        additional: "Doplňkové",
        contact: "Kontakt",
        bottom_nav_label: "Spodní navigace"
    },
    hero: {
        greeting: "Ahoj! Jsem Alik",
        description: "Automation QA Engineer a AI integrátor. Vytvářím škálovatelné testovací frameworky, tvořím webové aplikace a hry a integruji AI systémy (LLM, STT, TTS, autonomní agenty).",
        contactMe: "Kontaktujte mě",
        downloadCV: "Stáhnout CV",
        emailCopied: "E-mail zkopírován!",
        openMailClient: "Otevřít e-mailového klienta"
    },
    about: {
        title: "O mně",
        location: "Oděsa, Ukrajina",
        content: "QA Automation Engineer s více než 5 lety celkových zkušeností v QA (z toho více než 2 roky v AQA). Automatizuji Web, Desktop (C#/WinAppDriver) a Mobile (Java/Appium/Playwright). Jako vývojář jsem vybudoval ekosystém 9 produktů, včetně MindStep (s 23 E2E testy v Playwright) a rozsáhlého AI módu pro Valheim. Aktivně využívám agentní AI nástroje (Claude Code, Gemini CLI, Antigravity IDE) k urychlení vývoje a tvorby autotestů.",
        hobbiesTitle: "Koníčky",
        philosophyTitle: "Klíčové inženýrské principy",
        philosophyItems: {
            greenfield: "Sólo QA vedení od nuly: Praktické zkušenosti s budováním end-to-end QA procesů a automatizace testování od nuly, bez předchozí infrastruktury.",
            dynamicTests: "Komplexní dynamické autotesty: Psaní pokročilých automatizovaných testů s dynamickým výběrem dat.",
            aiWorkflows: "Produktivita řízená AI: Integrace AI nástrojů (Claude Code, Gemini CLI, Antigravity IDE) k urychlení tvorby testů."
        }
    },
    experience: {
        title: "Zkušenosti",
        showNonIT: "Zobrazit zkušenosti mimo IT",
        hideNonIT: "Skrýt zkušenosti mimo IT",
        present: "Současnost",
        companies: {
            theater_company: "Divadelní škola"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Technická podpora"
        },
        descriptions: {
            intellias_desc: "Testování Web, Desktop a Mobile aplikací. Automatizace testování (C#, Selenium, WinAppDriver, Appium). Zkoumání memory leaků a race conditions.",
            absoft_desc: "Testování zařízení a mobilních aplikací pro videorekordér",
            singree_desc: "Optimalizace a analýza pro vyhledávače.",
            unicorn_desc: "Střih videí pro YouTube kanály.",
            nutduet_desc: "Střih akcí a scénických vystoupení.",
            channel7_desc: "Střih zpravodajských relací.",
            krug_desc: "Střih zpravodajských relací.",
            theater_desc: "Technická podpora více než 100 divadelních představení. Zvuk, osvětlení, programování pultů, natáčení a střih videa."
        }
    },
    education: {
        title: "Vzdělání",
        institutions: {
            polytech_name: "Oděská národní polytechnická univerzita",
            theater_school_name: "Dětská divadelní škola"
        },
        descriptions: {
            polytech_desc: "Magisterský titul v oboru počítačové systémy a sítě, Institut počítačových systémů",
            theater_school_desc: "Divadelní obor (2006-2012) // Hudební obor (2009-2013)"
        }
    },
    skills: {
        title: "Dovednosti a technologie",
        showMore: "Zobrazit specializované dovednosti",
        hideMore: "Skrýt specializované dovednosti",
        platforms: {
            desktop: "Desktopová aplikace: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobilní aplikace: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI a agentní workflow",
            it: "IT a automatizace",
            design3d: "3D a design",
            video: "Video a média",
            tools: "Software a nástroje"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Integrace AI / LLM",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D tisk",
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
        title: "Doplňkové informace",
        iq: "125 (nadprůměr)",
        olympics: "3. místo - 2016, celoukrajinská olympiáda v diagnostice počítačových systémů",
        driver: "Řidičský průkaz (od roku 2015)",
        languages: {
            title: "Jazyky",
            uk: "Ukrajinština — Rodný jazyk",
            en: "Angličtina — A2 (Technická / S pomocí AI)",
            ru: "Ruština — Plynně"
        },
        hobbies: ["AI", "Videohry", "Design", "Skriptování", "Deskové hry", "Hra Mafie", "3D tisk"]
    },
    projects: {
        title: "Projekty a portfolio",
        featuredBadge: "Doporučená AI ukázka",
        categories: {
            all: "Všechny projekty",
            games: "Hry",
            apps: "Aplikace",
            websites: "Weby"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Pokročilá AI modifikace pro Valheim. Integruje LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS a autonomní NPC agenty (farmáři, sběrači, opraváři, kurýrní havrani).",
                button: "Zhlédnout video",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Strategická webová hra na trénink mozku. Plně pokryta 23 E2E testy v Playwright pro zajištění stability, kvality regrese a výkonu.",
                button: "Hrát",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Multiplatformní aplikace na učení slovíček a hádanka ve stylu Wordle s osobními statistikami, uživatelskými účty, soutěžním žebříčkem a podporou i18n v 7 jazycích.",
                button: "Začít se učit",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interaktivní vitrínový portál s mořskou tematikou, spojující všechny webové aplikace, hry a nástroje do jednoho responzivního rozhraní.",
                button: "Otevřít portál",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interaktivní 3D CV hra vytvořená od nuly v Godot 4. Prozkoumejte svět, interagujte s objekty a objevte easter eggy!",
                button: "Spustit 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D grafika"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interaktivní webové portfolio vytvořené ve Svelte 5 s toast notifikacemi, uchováním stavu a plnou podporou i18n.",
                button: "Zobrazit portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Oficiální web a administrační portál Oděské divadelní školy s interaktivními widgety, tmavým oceánským motivem a fotogaleriemi.",
                button: "Navštívit web",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Umělecká škola №5",
                description: "Oficiální web Oděské umělecké školy №5 s podporou více jazyků, novinkami a responzivním designem.",
                button: "Navštívit web",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interaktivní herní projekt na podporu iniciativ na záchranu zvířat a zvyšování povědomí o jejich ochraně.",
                button: "Otevřít projekt",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Vybrat verzi PDF",
        ats: "ATS / RMS",
        dark: "Tmavé téma",
        light: "Světlé téma"
    },
    common: {
        close: "Zavřít",
        sound: "Zvuk"
    },
    scrollbar: {
        title: "Posuvník",
        standard: "Standardní",
        custom: "Autorská",
        minimap: "Minimapa minimální",
        minimapFull: "Minimapa"
    },
    errorPage: {
        notFoundTitle: "Stránka nenalezena",
        notFoundText: "Taková adresa neexistuje. Kód jazyka v odkazu může být chybný.",
        genericTitle: "Něco se pokazilo",
        genericText: "Stránku se nepodařilo zobrazit. Obvykle pomůže znovu načíst.",
        backHome: "Zpět na životopis"
    }
};
