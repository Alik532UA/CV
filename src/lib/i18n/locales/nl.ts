import type { Translations } from "../schema";

export const nl: Translations = {
    lastUpdate: "Laatste update: 8 augustus 2026",
    title: ["AQA Engineer", "AI-Ontdekker", "Gamemaker"],
    title_mobile: "AQA Engineer\nAI-Ontdekker\nGamemaker",
    nav: {
        about: "Over Mij",
        experience: "Ervaring",
        education: "Opleiding",
        skills: "Vaardigheden",
        projects: "Projecten",
        additional: "Extra",
        contact: "Contact",
        bottom_nav_label: "Onderste navigatie"
    },
    hero: {
        greeting: "Hoi! Ik ben Alik",
        description: "Automation QA Engineer en AI-integrator. Ik bouw schaalbare testframeworks, maak webapps & games, en integreer AI-systemen (LLM's, STT, TTS, autonome agenten).",
        contactMe: "Neem Contact Op",
        downloadCV: "Download CV",
        emailCopied: "E-mail gekopieerd!",
        openMailClient: "Mailclient Openen"
    },
    about: {
        title: "Over Mij",
        location: "Odesa, Oekraïne",
        content: "QA Automation Engineer met meer dan 5 jaar totale QA-ervaring (waarvan meer dan 2 jaar in AQA). Ik automatiseer Web, Desktop (C#/WinAppDriver) en Mobile (Java/Appium/Playwright). Als developer heb ik een ecosysteem van 9 producten gebouwd, waaronder MindStep (met 23 Playwright E2E-tests) en een grote AI-mod voor Valheim. Ik gebruik actief agentische AI-tools (Claude Code, Gemini CLI, Antigravity IDE) om ontwikkeling en het maken van autotests te versnellen.",
        hobbiesTitle: "Hobby's",
        philosophyTitle: "Kernprincipes van Engineering",
        philosophyItems: {
            greenfield: "Greenfield & Solo QA-Leiderschap: Praktijkervaring met het vanaf nul opzetten van end-to-end QA-processen en testautomatisering, zonder bestaande infrastructuur.",
            dynamicTests: "Complexe Dynamische Autotests: Schrijven van geavanceerde geautomatiseerde tests met dynamische dataselectie.",
            aiWorkflows: "AI-Gedreven Productiviteit: Integratie van AI-tools (Claude Code, Gemini CLI, Antigravity IDE) om het maken van tests te versnellen."
        }
    },
    experience: {
        title: "Ervaring",
        showNonIT: "Toon Non-IT Ervaring",
        hideNonIT: "Verberg Non-IT Ervaring",
        present: "Heden",
        companies: {
            theater_company: "Theaterschool"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Technische Ondersteuning"
        },
        descriptions: {
            intellias_desc: "Testen van Web-, Desktop- en Mobile-applicaties. Testautomatisering (C#, Selenium, WinAppDriver, Appium). Onderzoek naar memory leaks en race conditions.",
            absoft_desc: "Testen van apparaten en mobiele applicaties voor een videorecorder",
            singree_desc: "Zoekmachineoptimalisatie en -analyse.",
            unicorn_desc: "Videomontage voor YouTube-kanalen.",
            nutduet_desc: "Montage van evenementen en live-optredens.",
            channel7_desc: "Montage van nieuwsuitzendingen.",
            krug_desc: "Montage van nieuwsuitzendingen.",
            theater_desc: "Technische ondersteuning voor meer dan 100 theatervoorstellingen. Geluid, licht, consoleprogrammering, video-opname en -montage."
        }
    },
    education: {
        title: "Opleiding",
        institutions: {
            polytech_name: "Nationale Polytechnische Universiteit van Odesa",
            theater_school_name: "Kindertheaterschool"
        },
        descriptions: {
            polytech_desc: "Master in Computersystemen en Netwerken, Instituut voor Computersystemen",
            theater_school_desc: "Theaterafdeling (2006-2012) // Muziekafdeling (2009-2013)"
        }
    },
    skills: {
        title: "Vaardigheden en Technologieën",
        showMore: "Toon Gespecialiseerde Vaardigheden",
        hideMore: "Verberg Gespecialiseerde Vaardigheden",
        platforms: {
            desktop: "Desktop-app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobiele app: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI & Agentische Workflows",
            it: "IT & Automatisering",
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
            ai: "AI / LLM-Integratie",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D-Printen",
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
        title: "Aanvullende Informatie",
        iq: "125 (Bovengemiddeld)",
        olympics: "3e plaats - 2016, Al-Oekraïense Olympiade Computersysteemdiagnostiek",
        driver: "Rijbewijs (sinds 2015)",
        languages: {
            title: "Talen",
            uk: "Oekraïens — Moedertaal",
            en: "Engels — A2 (Technisch / AI-ondersteund)",
            ru: "Russisch — Vloeiend"
        },
        hobbies: ["AI", "Videogames", "Design", "Scripting", "Bordspellen", "Maffiaspel", "3D-Printen"]
    },
    projects: {
        title: "Projecten en Portfolio",
        featuredBadge: "Uitgelichte AI-Showcase",
        categories: {
            all: "Alle Projecten",
            games: "Games",
            apps: "Apps",
            websites: "Websites"
        },
        items: {
            and_dvergr: {
                title: "AndDvergrShallSpeakAI (Valheim AI-mod)",
                description: "Geavanceerde AI-modificatie voor Valheim. Integreert LLM's (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS en autonome NPC-agenten (boeren, verzamelaars, reparateurs, koeriersraven).",
                button: "Bekijk Video",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT"
            },
            mindstep: {
                title: "MindStep",
                description: "Strategische webgame voor breintraining. Volledig gedekt met 23 E2E Playwright-autotests om stabiliteit, regressiekwaliteit en prestaties te garanderen.",
                button: "Speel het Spel",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                title: "Slovko",
                description: "Cross-platform app voor het leren van woorden & Wordle-achtige puzzel met persoonlijke statistieken, gebruikersaccounts, competitief scorebord en i18n-ondersteuning in 7 talen.",
                button: "Begin met Leren",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                title: "DigitalWorkshop",
                description: "Interactief showcase-portaal met zeethema dat alle webapps, games en tools samenbrengt in één responsieve interface.",
                button: "Open Portaal",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interactief 3D-cv-spel, volledig van de grond af gebouwd in Godot 4. Verken de wereld, interageer met objecten en ontdek easter eggs!",
                button: "Start 3D CV",
                tech: "Godot Engine, GDScript, 3D-graphics"
            },
            cv_web: {
                title: "Alik CV Web",
                description: "Interactieve web-portfoliosite gebouwd met Svelte 5, met toast-meldingen, statuspersistentie en volledige i18n-ondersteuning.",
                button: "Bekijk Portfolio",
                tech: "Svelte 5, TypeScript, Toast-systeem, i18n"
            },
            teatralo4ka: {
                title: "Teatralo4ka.odesa.ua",
                description: "Officiële website en beheerportaal voor de Theaterschool van Odesa, met interactieve widgets, donker oceaanthema en fotogalerijen.",
                button: "Bezoek Website",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                title: "Kunstschool №5",
                description: "Officiële website voor Kunstschool №5 van Odesa, met meertalige ondersteuning, nieuwsfeeds en responsief design.",
                button: "Bezoek Website",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                title: "VetCrewGames",
                description: "Interactief gameproject ter ondersteuning van dierenreddingsinitiatieven en bewustwording rond dierenbescherming.",
                button: "Open Project",
                tech: "Svelte 5, Webgames, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Selecteer PDF-versie",
        ats: "ATS / RMS",
        dark: "Donker Thema",
        light: "Licht Thema"
    },
    common: {
        close: "Sluiten",
        sound: "Geluid"
    },
    scrollbar: {
        title: "Schuifbalk",
        standard: "Standaard",
        custom: "Van auteur",
        minimap: "Minimale minimap",
        minimapFull: "Minimap"
    },
    errorPage: {
        notFoundTitle: "Pagina niet gevonden",
        notFoundText: "Dit adres bestaat niet. Mogelijk klopt de taalcode in de link niet.",
        genericTitle: "Er is iets misgegaan",
        genericText: "De pagina kon niet worden weergegeven. Opnieuw laden helpt meestal.",
        backHome: "Terug naar het cv"
    },
    ai: {
        subtitle: "Plak een vacaturetekst of een link ernaartoe — de AI vergelijkt die met Aliks ervaring.",
        jobPlaceholder: "Vacaturebeschrijving, of een link...",
        analyze: "Vacature analyseren",
        analyzing: "Bezig met analyseren...",
        newAnalysis: "Nieuwe analyse",
        newAnalysisHint: "Andere vacature analyseren",
        rawTitle: "Antwoord van de AI",
        rawNote: "Het model gaf geen gestructureerde beoordeling — dit is de tekst ongewijzigd.",
        summaryTitle: "Conclusie van de AI",
        matchLabel: "Match",
        strengths: "Sterke punten",
        gaps: "Hiaten en vragen",
        followUpTitle: "Stel een vervolgvraag over Aliks ervaring:",
        chatPlaceholder: "Uw vraag over Aliks ervaring...",
        thinking: "De AI denkt na...",
        modelTitle: "AI-model",
        modelAuto: "Automatisch — beste beschikbare",
        bannerSub: "Controleer hoe goed de vacature bij de kandidaat past",
        open: "AI Job Matcher openen",
        statusNoKey: "geen sleutel",
        statusCooldown: "limiet ~{minutes} min",
        statusAnswered: "antwoordde",
        statusReady: "gereed",
        tooltipAnswered: "{model} ({provider}) antwoordde. Klik om een ander te kiezen.",
        tooltipWillTry: "{model} ({provider}) wordt eerst geprobeerd. Klik om een ander te kiezen.",
        pinHint: "Het gekozen model wordt eerst geprobeerd. Raakt het quotum op, dan gaat het verzoek automatisch naar het volgende.",
        emptyAnswer: "Het model gaf een leeg antwoord. Probeer opnieuw of kies hierboven een ander model.",
        errorNetwork: "Kon de AI-dienst niet bereiken. Controleer je verbinding en probeer het opnieuw.",
        errorTimeout: "De AI-dienst antwoordde niet op tijd. Probeer het opnieuw.",
        errorRateLimitMinute: "Te veel verzoeken achter elkaar. Probeer het over een minuut opnieuw.",
        errorRateLimitDay: "De daglimiet voor verzoeken is bereikt. Probeer het morgen opnieuw.",
        errorUnavailable: "Er is nu geen model beschikbaar. Probeer het over een paar minuten of kies hierboven een ander model.",
        errorGeneric: "De AI-dienst gaf een onverwacht antwoord ({status}). Probeer het opnieuw."
    }
};
