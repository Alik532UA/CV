import type { Translations } from "../../controllers/I18nState.svelte";

export const de: Translations = {
    lastUpdate: "Letzte Aktualisierung: 8. August 2026",
    title: ["AQA-Ingenieur", "KI-Entdecker", "Spieleentwickler"],
    title_mobile: "AQA-Ingenieur\nKI-Entdecker\nSpieleentwickler",
    nav: {
        about: "Über Mich",
        experience: "Erfahrung",
        education: "Ausbildung",
        skills: "Fähigkeiten",
        projects: "Projekte",
        additional: "Zusätzliches",
        contact: "Kontakt",
        bottom_nav_label: "Untere Navigation"
    },
    hero: {
        greeting: "Hallo! Ich bin Alik",
        description: "Automation QA Engineer und KI-Integrator. Ich entwickle skalierbare Testframeworks, erstelle Webanwendungen & Spiele und integriere KI-Systeme (LLMs, STT, TTS, autonome Agenten).",
        contactMe: "Kontakt Aufnehmen",
        downloadCV: "Lebenslauf Herunterladen",
        emailCopied: "E-Mail kopiert!",
        openMailClient: "E-Mail-Programm öffnen"
    },
    about: {
        title: "Über Mich",
        location: "Odesa, Ukraine",
        content: "QA Automation Engineer mit über 5 Jahren Gesamterfahrung im QA-Bereich (davon über 2 Jahre in AQA). Ich automatisiere Web-, Desktop- (C#/WinAppDriver) und Mobile-Anwendungen (Java/Appium/Playwright). Als Entwickler habe ich ein Ökosystem aus 9 Produkten aufgebaut, darunter MindStep (mit 23 Playwright-E2E-Tests) und eine umfangreiche KI-Mod für Valheim. Ich nutze aktiv agentenbasierte KI-Tools (Claude Code, Gemini CLI, Antigravity IDE), um Entwicklung und Autotest-Erstellung zu beschleunigen.",
        hobbiesTitle: "Hobbys",
        philosophyTitle: "Grundlegende Ingenieurprinzipien",
        philosophyItems: {
            greenfield: "Greenfield- & Solo-QA-Führung: Praktische Erfahrung im Aufbau durchgängiger QA-Prozesse und Testautomatisierung von Grund auf, ohne vorhandene Infrastruktur.",
            dynamicTests: "Komplexe Dynamische Autotests: Erstellung fortgeschrittener automatisierter Tests mit dynamischer Datenauswahl.",
            aiWorkflows: "KI-gesteuerte Produktivität: Integration von KI-Tools (Claude Code, Gemini CLI, Antigravity IDE) zur Beschleunigung der Testerstellung."
        }
    },
    experience: {
        title: "Erfahrung",
        showNonIT: "Nicht-IT-Erfahrung anzeigen",
        hideNonIT: "Nicht-IT-Erfahrung ausblenden",
        present: "Heute",
        companies: {
            theater_company: "Theaterschule"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Technischer Support"
        },
        descriptions: {
            intellias_desc: "Testen von Web-, Desktop- und Mobile-Anwendungen. Testautomatisierung (C#, Selenium, WinAppDriver, Appium). Untersuchung von Memory Leaks und Race Conditions.",
            absoft_desc: "Test von Geräten und mobilen Anwendungen für einen Videorecorder",
            singree_desc: "Suchmaschinenoptimierung und -analyse.",
            unicorn_desc: "Videobearbeitung für YouTube-Kanäle.",
            nutduet_desc: "Schnitt von Veranstaltungen und Bühnenauftritten.",
            channel7_desc: "Schnitt von Nachrichtensendungen.",
            krug_desc: "Schnitt von Nachrichtensendungen.",
            theater_desc: "Technischer Support für über 100 Theateraufführungen. Ton, Licht, Konsolenprogrammierung, Videoaufnahme und -schnitt."
        }
    },
    education: {
        title: "Ausbildung",
        institutions: {
            polytech_name: "Nationale Polytechnische Universität Odesa",
            theater_school_name: "Kindertheaterschule"
        },
        descriptions: {
            polytech_desc: "Master in Computersystemen und Netzwerken, Institut für Computersysteme",
            theater_school_desc: "Theaterabteilung (2006-2012) // Musikabteilung (2009-2013)"
        }
    },
    skills: {
        title: "Fähigkeiten und Technologien",
        showMore: "Spezialisierte Fähigkeiten anzeigen",
        hideMore: "Spezialisierte Fähigkeiten ausblenden",
        platforms: {
            desktop: "Desktop-App: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobile App: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "KI & Agentenbasierte Workflows",
            it: "IT & Automatisierung",
            design3d: "3D & Design",
            video: "Video & Medien",
            tools: "Software & Tools"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "KI / LLM-Integration",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D-Druck",
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
        title: "Zusätzliche Informationen",
        iq: "125 (Überdurchschnittlich)",
        olympics: "3. Platz - 2016, Gesamtukrainische Olympiade für Computersystemdiagnostik",
        driver: "Führerschein (seit 2015)",
        languages: {
            title: "Sprachen",
            uk: "Ukrainisch — Muttersprache",
            en: "Englisch — A2 (Technisch / KI-unterstützt)",
            ru: "Russisch — Fließend"
        },
        hobbies: ["KI", "Videospiele", "Design", "Scripting", "Brettspiele", "Mafia-Spiel", "3D-Druck"]
    },
    projects: {
        title: "Projekte und Portfolio",
        featuredBadge: "Empfohlene KI-Vorzeigeprojekt",
        categories: {
            all: "Alle Projekte",
            games: "Spiele",
            apps: "Apps",
            websites: "Websites"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim-KI-Mod)",
                description: "Fortschrittliche KI-Modifikation für Valheim. Integriert LLMs (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS und autonome NPC-Agenten (Bauern, Sammler, Reparateure, Kurierraben).",
                button: "Video Ansehen",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Strategisches Web-Gehirntraining-Spiel. Vollständig abgedeckt mit 23 E2E-Playwright-Autotests zur Sicherstellung von Stabilität, Regressionsqualität und Leistung.",
                button: "Spielen",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Plattformübergreifende App zum Wörterlernen & Wordle-ähnliches Puzzle mit persönlichen Statistiken, Benutzerkonten, Wettkampf-Rangliste und i18n-Unterstützung in 7 Sprachen.",
                button: "Lernen Beginnen",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interaktives Showcase-Portal im Meeres-Design, das alle Webanwendungen, Spiele und Tools in einer einzigen responsiven Oberfläche vereint.",
                button: "Portal Öffnen",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interaktives 3D-Lebenslauf-Spiel, von Grund auf in Godot 4 entwickelt. Erkunde die Welt, interagiere mit Objekten und entdecke Easter Eggs!",
                button: "3D-Lebenslauf Starten",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D-Grafik"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interaktive Web-Portfolio-Website, entwickelt mit Svelte 5, mit Toast-Benachrichtigungen, Zustandspersistenz und vollständiger i18n-Unterstützung.",
                button: "Portfolio Ansehen",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast-System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Offizielle Website und Admin-Portal der Theaterschule Odesa mit interaktiven Widgets, dunklem Ozean-Design und Fotogalerien.",
                button: "Website Besuchen",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Kunstschule Nr. 5",
                description: "Offizielle Website der Kunstschule Nr. 5 Odesa mit Mehrsprachigkeit, Newsfeed und responsivem Design.",
                button: "Website Besuchen",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interaktives Spieleprojekt zur Unterstützung von Tierrettungsinitiativen und Sensibilisierung für Tierschutz.",
                button: "Projekt Öffnen",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web-Spiele, CSS"
            }
        }
    },
    pdf_modal: {
        title: "PDF-Version Auswählen",
        ats: "ATS / RMS",
        dark: "Dunkles Design",
        light: "Helles Design"
    },
    common: {
        close: "Schließen",
        sound: "Ton"
    },
    scrollbar: {
        title: "Scrollleiste",
        standard: "Standard",
        custom: "Autoren",
        minimap: "Minimap minimal",
        minimapFull: "Minimap"
    },
    errorPage: {
        notFoundTitle: "Seite nicht gefunden",
        notFoundText: "Diese Adresse gibt es nicht. Möglicherweise ist der Sprachcode im Link falsch.",
        genericTitle: "Etwas ist schiefgelaufen",
        genericText: "Die Seite konnte nicht angezeigt werden. Neu laden hilft meistens.",
        backHome: "Zurück zum Lebenslauf"
    }
};
