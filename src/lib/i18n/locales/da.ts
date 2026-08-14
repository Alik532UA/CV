import type { Translations } from "../../controllers/I18nState.svelte";

export const da: Translations = {
    lastUpdate: "Sidst opdateret: 8. august 2026",
    title: ["AQA-ingeniør", "AI-udforsker", "Spilskaber"],
    title_mobile: "AQA-ingeniør\nAI-udforsker\nSpilskaber",
    nav: {
        about: "Om mig",
        experience: "Erfaring",
        education: "Uddannelse",
        skills: "Færdigheder",
        projects: "Projekter",
        additional: "Yderligere",
        contact: "Kontakt",
        bottom_nav_label: "Nederste navigation"
    },
    hero: {
        greeting: "Hej! Jeg er Alik",
        description: "Automation QA Engineer og AI-integrator. Jeg bygger skalerbare testframeworks, laver webapps & spil og integrerer AI-systemer (LLM, STT, TTS, autonome agenter).",
        contactMe: "Kontakt mig",
        downloadCV: "Download CV",
        emailCopied: "E-mail kopieret!",
        openMailClient: "Åbn e-mailklient"
    },
    about: {
        title: "Om mig",
        location: "Odesa, Ukraine",
        content: "QA Automation Engineer med over 5 års samlet QA-erfaring (heraf over 2 år i AQA). Jeg automatiserer Web, Desktop (C#/WinAppDriver) og Mobile (Java/Appium/Playwright). Som udvikler har jeg bygget et økosystem af 9 produkter, herunder MindStep (med 23 E2E-tests i Playwright) og en omfattende AI-mod til Valheim. Jeg bruger aktivt agentbaserede AI-værktøjer (Claude Code, Gemini CLI, Antigravity IDE) til at accelerere udvikling og oprettelse af autotests.",
        hobbiesTitle: "Hobbyer",
        philosophyTitle: "Centrale ingeniørprincipper",
        philosophyItems: {
            greenfield: "Solo QA-ledelse fra bunden: Praktisk erfaring med at etablere gennemgående QA-processer og testautomatisering fra bunden, uden forudgående infrastruktur.",
            dynamicTests: "Komplekse dynamiske autotests: Skrivning af avancerede automatiserede tests med dynamisk datavalg.",
            aiWorkflows: "AI-drevet produktivitet: Integration af AI-værktøjer (Claude Code, Gemini CLI, Antigravity IDE) til at accelerere testoprettelse."
        }
    },
    experience: {
        title: "Erfaring",
        showNonIT: "Vis erfaring uden for IT",
        hideNonIT: "Skjul erfaring uden for IT",
        present: "Nutid",
        companies: {
            theater_company: "Teaterskole"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Teknisk support"
        },
        descriptions: {
            intellias_desc: "Test af Web-, Desktop- og Mobile-applikationer. Testautomatisering (C#, Selenium, WinAppDriver, Appium). Undersøgelse af memory leaks og race conditions.",
            absoft_desc: "Test af enheder og mobilapplikationer til en videooptager",
            singree_desc: "Søgemaskineoptimering og analyse.",
            unicorn_desc: "Videoredigering til YouTube-kanaler.",
            nutduet_desc: "Redigering af begivenheder og sceneoptrædener.",
            channel7_desc: "Redigering af nyhedsudsendelser.",
            krug_desc: "Redigering af nyhedsudsendelser.",
            theater_desc: "Teknisk support for over 100 teaterforestillinger. Lyd, lys, konsolprogrammering, videooptagelse og redigering."
        }
    },
    education: {
        title: "Uddannelse",
        institutions: {
            polytech_name: "Odesa Nationale Polytekniske Universitet",
            theater_school_name: "Børneteaterskolen"
        },
        descriptions: {
            polytech_desc: "Kandidatgrad i computersystemer og netværk, Institut for Computersystemer",
            theater_school_desc: "Teaterafdeling (2006-2012) // Musikafdeling (2009-2013)"
        }
    },
    skills: {
        title: "Færdigheder og teknologier",
        showMore: "Vis specialiserede færdigheder",
        hideMore: "Skjul specialiserede færdigheder",
        platforms: {
            desktop: "Desktop-app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobilapp: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI og agentbaserede workflows",
            it: "IT og automatisering",
            design3d: "3D og design",
            video: "Video og medier",
            tools: "Software og værktøjer"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "AI / LLM-integration",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D-print",
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
        title: "Yderligere information",
        iq: "125 (over gennemsnittet)",
        olympics: "3. plads - 2016, Alukrainsk olympiade i computersystemdiagnostik",
        driver: "Kørekort (siden 2015)",
        languages: {
            title: "Sprog",
            uk: "Ukrainsk — Modersmål",
            en: "Engelsk — A2 (Teknisk / AI-assisteret)",
            ru: "Russisk — Flydende"
        },
        hobbies: ["AI", "Videospil", "Design", "Scripting", "Brætspil", "Mafia-legen", "3D-print"]
    },
    projects: {
        title: "Projekter og portfolio",
        featuredBadge: "Udvalgt AI-showcase",
        categories: {
            all: "Alle projekter",
            games: "Spil",
            apps: "Apps",
            websites: "Websites"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Avanceret AI-modifikation til Valheim. Integrerer LLM'er (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS og autonome NPC-agenter (bønder, samlere, reparatører, kurerravne).",
                button: "Se video",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Strategisk webbaseret hjernetræningsspil. Fuldt dækket med 23 E2E-tests i Playwright for at sikre stabilitet, regressionskvalitet og ydeevne.",
                button: "Spil",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Platformuafhængig app til ordindlæring og Wordle-lignende puslespil med personlig statistik, brugerkonti, konkurrencerangliste og i18n-understøttelse på 7 sprog.",
                button: "Begynd at lære",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interaktiv showcase-portal med havtema, der samler alle webapps, spil og værktøjer i én responsiv grænseflade.",
                button: "Åbn portalen",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interaktivt 3D-CV-spil bygget fra bunden i Godot 4. Udforsk verdenen, interagér med objekter og find påskeæg!",
                button: "Start 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D-grafik"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interaktivt webportfolio bygget med Svelte 5, med toast-notifikationer, tilstandspersistens og fuld i18n-understøttelse.",
                button: "Se portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Officiel hjemmeside og administrationsportal for Odesas Teaterskole med interaktive widgets, mørkt havtema og fotogallerier.",
                button: "Besøg hjemmesiden",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Kunstskole №5",
                description: "Officiel hjemmeside for Odesas Kunstskole №5 med flersprogsunderstøttelse, nyhedsfeeds og responsivt design.",
                button: "Besøg hjemmesiden",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interaktivt spilprojekt til støtte for initiativer om dyreredning og bevidsthed om dyrebeskyttelse.",
                button: "Åbn projektet",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Vælg PDF-version",
        ats: "ATS / RMS",
        dark: "Mørkt tema",
        light: "Lyst tema"
    },
    common: {
        close: "Luk",
        sound: "Lyd"
    },
    scrollbar: {
        title: "Rullepanel",
        standard: "Standard",
        custom: "Forfatterens",
        minimap: "Minimal minimap",
        minimapFull: "Minimap"
    },
    errorPage: {
        notFoundTitle: "Siden blev ikke fundet",
        notFoundText: "Denne adresse findes ikke. Sprogkoden i linket kan være forkert.",
        genericTitle: "Noget gik galt",
        genericText: "Siden kunne ikke vises. Det hjælper som regel at genindlæse.",
        backHome: "Tilbage til cv'et"
    }
};
