import type { Translations } from "../../controllers/I18nState.svelte";

export const sv: Translations = {
    lastUpdate: "Senast uppdaterad: 8 augusti 2026",
    title: ["AQA-ingenjör", "AI-utforskare", "Spelskapare"],
    title_mobile: "AQA-ingenjör\nAI-utforskare\nSpelskapare",
    nav: {
        about: "Om mig",
        experience: "Erfarenhet",
        education: "Utbildning",
        skills: "Färdigheter",
        projects: "Projekt",
        additional: "Övrigt",
        contact: "Kontakt",
        bottom_nav_label: "Nedre navigering"
    },
    hero: {
        greeting: "Hej! Jag är Alik",
        description: "Automation QA Engineer och AI-integratör. Jag bygger skalbara testramverk, skapar webbappar och spel samt integrerar AI-system (LLM, STT, TTS, autonoma agenter).",
        contactMe: "Kontakta mig",
        downloadCV: "Ladda ner CV",
        emailCopied: "E-post kopierad!",
        openMailClient: "Öppna e-postklient"
    },
    about: {
        title: "Om mig",
        location: "Odesa, Ukraina",
        content: "QA Automation Engineer med över 5 års total QA-erfarenhet (varav över 2 år inom AQA). Jag automatiserar Web, Desktop (C#/WinAppDriver) och Mobile (Java/Appium/Playwright). Som utvecklare har jag byggt ett ekosystem av 9 produkter, inklusive MindStep (med 23 E2E-tester i Playwright) och en omfattande AI-mod för Valheim. Jag använder aktivt agentbaserade AI-verktyg (Claude Code, Gemini CLI, Antigravity IDE) för att påskynda utveckling och skapande av autotester.",
        hobbiesTitle: "Fritidsintressen",
        philosophyTitle: "Grundläggande ingenjörsprinciper",
        philosophyItems: {
            greenfield: "Soloägt QA-ledarskap från grunden: Praktisk erfarenhet av att bygga upp helhetsomfattande QA-processer och testautomatisering från noll, utan tidigare infrastruktur.",
            dynamicTests: "Komplexa dynamiska autotester: Att skriva avancerade automatiserade tester med dynamiskt urval av data.",
            aiWorkflows: "AI-driven produktivitet: Integration av AI-verktyg (Claude Code, Gemini CLI, Antigravity IDE) för att påskynda testskapandet."
        }
    },
    experience: {
        title: "Erfarenhet",
        showNonIT: "Visa erfarenhet utanför IT",
        hideNonIT: "Dölj erfarenhet utanför IT",
        present: "Nutid",
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
            intellias_desc: "Testning av Web-, Desktop- och Mobile-applikationer. Testautomatisering (C#, Selenium, WinAppDriver, Appium). Undersökning av minnesläckor och race conditions.",
            absoft_desc: "Testning av enheter och mobilapplikationer för en militär videoinspelare i C.",
            singree_desc: "Sökmotoroptimering och analys.",
            unicorn_desc: "Videoredigering för YouTube-kanaler.",
            nutduet_desc: "Redigering av evenemang och scenframträdanden.",
            channel7_desc: "Redigering av nyhetssändningar.",
            krug_desc: "Redigering av nyhetssändningar.",
            theater_desc: "Teknisk support för över 100 teaterföreställningar. Ljud, ljus, konsolprogrammering, videoinspelning och redigering."
        }
    },
    education: {
        title: "Utbildning",
        institutions: {
            polytech_name: "Odesa nationella polytekniska universitet",
            theater_school_name: "Barnens teaterskola"
        },
        descriptions: {
            polytech_desc: "Magisterexamen i datorsystem och nätverk, Institutet för datorsystem",
            theater_school_desc: "Teateravdelning (2006-2012) // Musikavdelning (2009-2013)"
        }
    },
    skills: {
        title: "Färdigheter och teknologier",
        showMore: "Visa specialiserade färdigheter",
        hideMore: "Dölj specialiserade färdigheter",
        platforms: {
            desktop: "Desktop-app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobilapp: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI och agentbaserade arbetsflöden",
            it: "IT och automatisering",
            design3d: "3D och design",
            video: "Video och media",
            tools: "Programvara och verktyg"
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
            printing: "3D-utskrift",
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
        title: "Ytterligare information",
        iq: "125 (över genomsnittet)",
        olympics: "3:e plats - 2016, Allukrainska olympiaden i datorsystemdiagnostik",
        driver: "Körkort (sedan 2015)",
        languages: {
            title: "Språk",
            uk: "Ukrainska — Modersmål",
            en: "Engelska — A2 (Teknisk / AI-assisterad)",
            ru: "Ryska — Flytande"
        },
        hobbies: ["AI", "Videospel", "Design", "Scripting", "Brädspel", "Maffialek", "3D-utskrift"]
    },
    projects: {
        title: "Projekt och portfölj",
        featuredBadge: "Utvald AI-showcase",
        categories: {
            all: "Alla projekt",
            games: "Spel",
            apps: "Appar",
            websites: "Webbplatser"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Avancerad AI-modifiering för Valheim. Integrerar LLM:er (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS och autonoma NPC-agenter (bönder, samlare, reparatörer, kurirkorpar).",
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
                description: "Strategiskt webbaserat hjärnträningsspel. Fullt täckt med 23 E2E-tester i Playwright för att säkerställa stabilitet, regressionskvalitet och prestanda.",
                button: "Spela",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Plattformsoberoende app för ordinlärning & Wordle-liknande pussel med personlig statistik, användarkonton, tävlingsranking och stöd för i18n på 7 språk.",
                button: "Börja lära dig",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interaktiv showcase-portal med havstema som samlar alla webbappar, spel och verktyg i ett enda responsivt gränssnitt.",
                button: "Öppna portalen",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interaktivt 3D-CV-spel byggt från grunden i Godot 4. Utforska världen, interagera med objekt och upptäck påskägg!",
                button: "Starta 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D-grafik"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interaktiv webbportfölj byggd med Svelte 5, med toast-notiser, tillståndspersistens och fullt i18n-stöd.",
                button: "Visa portfölj",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Officiell webbplats och adminportal för Odesas teaterskola med interaktiva widgetar, mörkt havstema och fotogallerier.",
                button: "Besök webbplatsen",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Konstskola №5",
                description: "Officiell webbplats för Odesas konstskola №5 med flerspråksstöd, nyhetsflöden och responsiv design.",
                button: "Besök webbplatsen",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interaktivt spelprojekt som stödjer initiativ för djurräddning och medvetenhet om djurskydd.",
                button: "Öppna projektet",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Välj PDF-version",
        ats: "ATS / RMS",
        dark: "Mörkt tema",
        light: "Ljust tema"
    },
    common: {
        close: "Stäng"
    }
};
