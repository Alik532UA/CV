import type { Translations } from "../../controllers/I18nState.svelte";

export const it: Translations = {
    lastUpdate: "Ultimo aggiornamento: 8 agosto 2026",
    title: ["Ingegnere AQA", "Esploratore IA", "Creatore di Giochi"],
    title_mobile: "Ingegnere AQA\nEsploratore IA\nCreatore di Giochi",
    nav: {
        about: "Su di Me",
        experience: "Esperienza",
        education: "Formazione",
        skills: "Competenze",
        projects: "Progetti",
        additional: "Extra",
        contact: "Contatti",
        bottom_nav_label: "Navigazione inferiore"
    },
    hero: {
        greeting: "Ciao! Sono Alik",
        description: "Ingegnere QA Automation e Integratore IA. Costruisco framework di test scalabili, creo applicazioni web e giochi, e integro sistemi di IA (LLM, STT, TTS, agenti autonomi).",
        contactMe: "Contattami",
        downloadCV: "Scarica il CV",
        emailCopied: "E-mail copiata!",
        openMailClient: "Apri Client di Posta"
    },
    about: {
        title: "Su di Me",
        location: "Odesa, Ucraina",
        content: "Ingegnere QA Automation con oltre 5 anni di esperienza QA complessiva (di cui più di 2 anni in AQA). Automatizzo Web, Desktop (C#/WinAppDriver) e Mobile (Java/Appium/Playwright). Come sviluppatore, ho costruito un ecosistema di 9 prodotti, tra cui MindStep (con 23 test E2E in Playwright) e una mod IA su vasta scala per Valheim. Utilizzo attivamente strumenti di IA agentica (Claude Code, Gemini CLI, Antigravity IDE) per accelerare lo sviluppo e la creazione di autotest.",
        hobbiesTitle: "Hobby",
        philosophyTitle: "Principi Fondamentali di Ingegneria",
        philosophyItems: {
            greenfield: "Leadership QA in Solitaria e da Zero: Esperienza pratica nella creazione di processi QA end-to-end e automazione dei test da zero, senza infrastruttura preesistente.",
            dynamicTests: "Autotest Dinamici Complessi: Scrittura di test automatizzati avanzati con selezione dinamica dei dati.",
            aiWorkflows: "Produttività Guidata dall'IA: Integrazione di strumenti IA (Claude Code, Gemini CLI, Antigravity IDE) per accelerare la creazione dei test."
        }
    },
    experience: {
        title: "Esperienza",
        showNonIT: "Mostra Esperienza Non-IT",
        hideNonIT: "Nascondi Esperienza Non-IT",
        present: "Presente",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Supporto Tecnico"
        },
        descriptions: {
            intellias_desc: "Test di applicazioni Web, Desktop e Mobile. Automazione dei test (C#, Selenium, WinAppDriver, Appium). Indagine su memory leak e race condition.",
            absoft_desc: "Test di dispositivi e applicazioni mobile per un videoregistratore",
            singree_desc: "Ottimizzazione e analisi per motori di ricerca.",
            unicorn_desc: "Montaggio video per canali YouTube.",
            nutduet_desc: "Montaggio di eventi e spettacoli dal vivo.",
            channel7_desc: "Montaggio di telegiornali.",
            krug_desc: "Montaggio di telegiornali.",
            theater_desc: "Supporto tecnico per oltre 100 spettacoli teatrali. Audio, luci, programmazione di console, ripresa e montaggio video."
        }
    },
    education: {
        title: "Formazione",
        institutions: {
            polytech_name: "Università Politecnica Nazionale di Odesa",
            theater_school_name: "Scuola di Teatro per Bambini"
        },
        descriptions: {
            polytech_desc: "Laurea Magistrale in Sistemi e Reti Informatiche, Istituto di Sistemi Informatici",
            theater_school_desc: "Dipartimento di Teatro (2006-2012) // Dipartimento di Musica (2009-2013)"
        }
    },
    skills: {
        title: "Competenze e Tecnologie",
        showMore: "Mostra Competenze Specialistiche",
        hideMore: "Nascondi Competenze Specialistiche",
        platforms: {
            desktop: "App desktop: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "App mobile: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "IA e Flussi di Lavoro Agentici",
            it: "IT e Automazione",
            design3d: "3D e Design",
            video: "Video e Media",
            tools: "Software e Strumenti"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Integrazione IA / LLM",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "Stampa 3D",
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
        title: "Informazioni Aggiuntive",
        iq: "125 (Sopra la media)",
        olympics: "3° posto - 2016, Olimpiade Panucraina di Diagnostica dei Sistemi Informatici",
        driver: "Patente di Guida (dal 2015)",
        languages: {
            title: "Lingue",
            uk: "Ucraino — Madrelingua",
            en: "Inglese — A2 (Tecnico / Assistito da IA)",
            ru: "Russo — Fluente"
        },
        hobbies: ["IA", "Videogiochi", "Design", "Scripting", "Giochi da Tavolo", "Gioco del Lupo Mannaro", "Stampa 3D"]
    },
    projects: {
        title: "Progetti e Portfolio",
        featuredBadge: "Vetrina IA in Evidenza",
        categories: {
            all: "Tutti i Progetti",
            games: "Giochi",
            apps: "App",
            websites: "Siti Web"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Mod IA per Valheim)",
                description: "Modifica IA avanzata per Valheim. Integra LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS e agenti NPC autonomi (contadini, raccoglitori, riparatori, corvi corrieri).",
                button: "Guarda il Video",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Gioco web strategico di allenamento cerebrale. Interamente coperto da 23 autotest E2E in Playwright per garantire stabilità, qualità di regressione e prestazioni.",
                button: "Gioca",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "App multipiattaforma per l'apprendimento di parole e puzzle in stile Wordle, con statistiche personali, account utente, classifica competitiva e supporto i18n in 7 lingue.",
                button: "Inizia a Imparare",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Portale vetrina interattivo a tema marino che riunisce tutte le mie app web, giochi e strumenti in un'unica interfaccia responsive.",
                button: "Apri il Portale",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Gioco-curriculum 3D interattivo costruito da zero su Godot 4. Esplora il mondo, interagisci con gli oggetti e scopri gli easter egg!",
                button: "Avvia il 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, Grafica 3D"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Sito portfolio web interattivo costruito con Svelte 5, con notifiche toast, persistenza dello stato e supporto i18n completo.",
                button: "Visualizza il Portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Sistema Toast, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Sito ufficiale e portale di amministrazione della Scuola di Teatro di Odesa, con widget interattivi, tema oceano scuro e gallerie fotografiche.",
                button: "Visita il Sito",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Scuola d'Arte №5",
                description: "Sito ufficiale della Scuola d'Arte №5 di Odesa, con supporto multilingue, feed di notizie e design responsive.",
                button: "Visita il Sito",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Progetto di giochi interattivi a sostegno di iniziative di salvataggio animale e sensibilizzazione sulla protezione degli animali.",
                button: "Apri il Progetto",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Giochi Web, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Seleziona Versione PDF",
        ats: "ATS / RMS",
        dark: "Tema Scuro",
        light: "Tema Chiaro"
    },
    common: {
        close: "Chiudi",
        sound: "Suono"
    },
    scrollbar: {
        title: "Barra di scorrimento",
        standard: "Standard",
        custom: "D'autore",
        minimap: "Minimappa minima",
        minimapFull: "Minimappa"
    }
};
