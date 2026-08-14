import type { Translations } from "../../controllers/I18nState.svelte";

export const ca: Translations = {
    lastUpdate: "Darrera actualització: 8 d'agost de 2026",
    title: ["Enginyer AQA", "Explorador d'IA", "Creador de Jocs"],
    title_mobile: "Enginyer AQA\nExplorador d'IA\nCreador de Jocs",
    nav: {
        about: "Sobre mi",
        experience: "Experiència",
        education: "Formació",
        skills: "Habilitats",
        projects: "Projectes",
        additional: "Addicional",
        contact: "Contacte",
        bottom_nav_label: "Navegació inferior"
    },
    hero: {
        greeting: "Hola! Sóc l'Alik",
        description: "Enginyer d'Automation QA i integrador d'IA. Construeixo marcs de proves escalables, creo aplicacions web i jocs, i integro sistemes d'IA (LLM, STT, TTS, agents autònoms).",
        contactMe: "Contacta amb mi",
        downloadCV: "Descarrega el CV",
        emailCopied: "Correu copiat!",
        openMailClient: "Obre el client de correu"
    },
    about: {
        title: "Sobre mi",
        location: "Odesa, Ucraïna",
        content: "Enginyer de QA Automation amb més de 5 anys d'experiència en QA (dels quals més de 2 en AQA). Automatitzo Web, Desktop (C#/WinAppDriver) i Mobile (Java/Appium/Playwright). Com a desenvolupador, he construït un ecosistema de 9 productes, incloent-hi MindStep (amb 23 proves E2E en Playwright) i un mod d'IA extens per a Valheim. Faig servir activament eines d'IA agèntiques (Claude Code, Gemini CLI, Antigravity IDE) per accelerar el desenvolupament i l'escriptura d'autotests.",
        hobbiesTitle: "Aficions",
        philosophyTitle: "Principis clau d'enginyeria",
        philosophyItems: {
            greenfield: "Lideratge de QA en solitari des de zero: Experiència pràctica construint processos de QA d'extrem a extrem i automatització de proves des de l'inici, sense infraestructura prèvia.",
            dynamicTests: "Autotests complexos i dinàmics: Escriptura de proves automatitzades avançades amb selecció dinàmica de dades.",
            aiWorkflows: "Productivitat impulsada per IA: Integració d'eines d'IA (Claude Code, Gemini CLI, Antigravity IDE) per accelerar la creació de proves."
        }
    },
    experience: {
        title: "Experiència laboral",
        showNonIT: "Mostrar experiència no IT",
        hideNonIT: "Amagar experiència no IT",
        present: "actualitat",
        companies: {
            theater_company: "Escola de Teatre"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Suport tècnic"
        },
        descriptions: {
            intellias_desc: "Proves d'aplicacions Web, Desktop i Mobile. Automatització de proves (C#, Selenium, WinAppDriver, Appium). Investigació de fuites de memòria i race conditions.",
            absoft_desc: "Proves de dispositius i aplicacions mòbils per a un enregistrador de vídeo",
            singree_desc: "Optimització i anàlisi per a motors de cerca.",
            unicorn_desc: "Edició de vídeo per a canals de YouTube.",
            nutduet_desc: "Edició d'esdeveniments i actuacions escèniques.",
            channel7_desc: "Edició d'informatius.",
            krug_desc: "Edició d'informatius.",
            theater_desc: "Suport tècnic per a més de 100 representacions teatrals. So, il·luminació, programació de consoles, gravació i edició de vídeo."
        }
    },
    education: {
        title: "Formació",
        institutions: {
            polytech_name: "Universitat Nacional Politècnica d'Odesa",
            theater_school_name: "Escola de Teatre Infantil"
        },
        descriptions: {
            polytech_desc: "Màster en Sistemes i Xarxes Informàtiques, Institut de Sistemes Informàtics",
            theater_school_desc: "Departament de Teatre (2006-2012) // Departament de Música (2009-2013)"
        }
    },
    skills: {
        title: "Habilitats i Tecnologies",
        showMore: "Mostra les habilitats especialitzades",
        hideMore: "Amaga les habilitats especialitzades",
        platforms: {
            desktop: "Aplicació d'escriptori: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Aplicació mòbil: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "IA i fluxos de treball agèntics",
            it: "TI i automatització",
            design3d: "3D i disseny",
            video: "Vídeo i mitjans",
            tools: "Programari i eines"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Integració d'IA / LLM",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "Impressió 3D",
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
        title: "Informació addicional",
        iq: "125 (Per sobre de la mitjana)",
        olympics: "3r lloc - 2016, Olimpíada Ucraïnesa de Diagnòstic de Sistemes Informàtics",
        driver: "Permís de conduir (des del 2015)",
        languages: {
            title: "Idiomes",
            uk: "Ucraïnès — Llengua materna",
            en: "Anglès — A2 (Tècnic / Amb assistència d'IA)",
            ru: "Rus — Fluid"
        },
        hobbies: ["IA", "Videojocs", "Disseny", "Scripting", "Jocs de taula", "Joc de la Màfia", "Impressió 3D"]
    },
    projects: {
        title: "Projectes i Portfolio",
        featuredBadge: "Mostra d'IA destacada",
        categories: {
            all: "Tots els projectes",
            games: "Jocs",
            apps: "Aplicacions",
            websites: "Llocs web"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Modificació d'IA avançada per a Valheim. Integra LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS i agents NPC autònoms (grangers, recol·lectors, reparadors, corbs missatgers).",
                button: "Mira el vídeo",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Joc web estratègic d'entrenament mental. Cobert completament amb 23 autotests E2E en Playwright per garantir estabilitat, qualitat de regressió i rendiment.",
                button: "Juga",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Aplicació multiplataforma d'aprenentatge de vocabulari i trencaclosques a l'estil Wordle amb estadístiques personals, comptes d'usuari, classificació competitiva i suport i18n en 7 idiomes.",
                button: "Comença a aprendre",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Portal interactiu d'exhibició amb temàtica marina que uneix totes les aplicacions web, jocs i eines en una única interfície adaptativa.",
                button: "Obre el portal",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Joc de currículum 3D interactiu, creat des de zero amb Godot 4. Explora el món, interactua amb els objectes i descobreix els easter eggs!",
                button: "Inicia el CV 3D",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, Gràfics 3D"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Lloc web de portfolio interactiu construït amb Svelte 5, amb notificacions toast, persistència d'estat i suport i18n complet.",
                button: "Mira el portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Lloc web oficial i portal d'administració de l'Escola de Teatre d'Odesa amb widgets interactius, tema d'oceà fosc i galeries de fotos.",
                button: "Visita el lloc",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Escola d'Art №5",
                description: "Lloc web oficial de l'Escola d'Art №5 d'Odesa amb suport multiidioma, notícies i disseny adaptatiu.",
                button: "Visita el lloc",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Projecte de jocs interactius que dóna suport a iniciatives de rescat animal i a la conscienciació sobre la seva protecció.",
                button: "Obre el projecte",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Tria la versió PDF",
        ats: "ATS / RMS",
        dark: "Tema fosc",
        light: "Tema clar"
    },
    common: {
        close: "Tanca",
        sound: "So"
    },
    scrollbar: {
        title: "Barra de desplaçament",
        standard: "Estàndard",
        custom: "D'autor",
        minimap: "Minimapa mínim",
        minimapFull: "Minimapa"
    },
    errorPage: {
        notFoundTitle: "Pàgina no trobada",
        notFoundText: "Aquesta adreça no existeix. El codi d'idioma de l'enllaç pot ser incorrecte.",
        genericTitle: "Alguna cosa ha anat malament",
        genericText: "No s'ha pogut mostrar la pàgina. Normalment ajuda tornar a carregar.",
        backHome: "Torna al currículum"
    }
};
