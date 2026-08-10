import type { Translations } from "../../controllers/I18nState.svelte";

export const pl: Translations = {
    lastUpdate: "Ostatnia aktualizacja: 8 sierpnia 2026",
    title: ["Inżynier AQA", "Odkrywca AI", "Twórca Gier"],
    title_mobile: "Inżynier AQA\nOdkrywca AI\nTwórca Gier",
    nav: {
        about: "O mnie",
        experience: "Doświadczenie",
        education: "Edukacja",
        skills: "Umiejętności",
        projects: "Projekty",
        additional: "Dodatkowe",
        contact: "Kontakt",
        bottom_nav_label: "Nawigacja dolna"
    },
    hero: {
        greeting: "Cześć! Jestem Alik",
        description: "Inżynier QA Automation i Integrator AI. Buduję skalowalne frameworki testowe, tworzę aplikacje webowe i gry oraz integruję systemy AI (LLM, STT, TTS, autonomiczne agenty).",
        contactMe: "Skontaktuj się",
        downloadCV: "Pobierz CV",
        emailCopied: "Email skopiowany!",
        openMailClient: "Otwórz klienta poczty"
    },
    about: {
        title: "O mnie",
        location: "Odesa, Ukraina",
        content: "Inżynier QA Automation z ponad 5-letnim łącznym doświadczeniem w QA (w tym ponad 2 lata w AQA). Automatyzuję Web, Desktop (C#/WinAppDriver) i Mobile (Java/Appium/Playwright). Jako developer zbudowałem ekosystem 9 produktów, w tym MindStep (z 23 testami E2E w Playwright) oraz rozbudowany mod AI do Valheim. Aktywnie wykorzystuję agentowe narzędzia AI (Claude Code, Gemini CLI, Antigravity IDE), aby przyspieszyć rozwój i tworzenie autotestów.",
        hobbiesTitle: "Hobby",
        philosophyTitle: "Kluczowe zasady inżynierskie",
        philosophyItems: {
            greenfield: "Przywództwo QA solo od zera: Praktyczne doświadczenie w budowaniu kompleksowych procesów QA i automatyzacji testów od podstaw, bez wcześniejszej infrastruktury.",
            dynamicTests: "Złożone dynamiczne autotesty: Pisanie zaawansowanych testów automatycznych z dynamicznym doborem danych.",
            aiWorkflows: "Produktywność napędzana AI: Integracja narzędzi AI (Claude Code, Gemini CLI, Antigravity IDE) w celu przyspieszenia tworzenia testów."
        }
    },
    experience: {
        title: "Doświadczenie",
        showNonIT: "Pokaż doświadczenie spoza IT",
        hideNonIT: "Ukryj doświadczenie spoza IT",
        present: "Obecnie",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Wsparcie techniczne"
        },
        descriptions: {
            intellias_desc: "Testowanie aplikacji Web, Desktop i Mobile. Automatyzacja testów (C#, Selenium, WinAppDriver, Appium). Badanie wycieków pamięci i race conditions.",
            absoft_desc: "Testowanie urządzeń i aplikacji mobilnych dla wojskowego rejestratora wideo w C.",
            singree_desc: "Optymalizacja i analiza wyszukiwarek.",
            unicorn_desc: "Montaż wideo dla kanałów YouTube.",
            nutduet_desc: "Montaż wydarzeń i występów scenicznych.",
            channel7_desc: "Montaż wiadomości telewizyjnych.",
            krug_desc: "Montaż wiadomości telewizyjnych.",
            theater_desc: "Wsparcie techniczne ponad 100 spektakli teatralnych. Dźwięk, oświetlenie, programowanie konsol, nagrywanie i montaż wideo."
        }
    },
    education: {
        title: "Edukacja",
        institutions: {
            polytech_name: "Odeski Narodowy Uniwersytet Politechniczny",
            theater_school_name: "Dziecięca Szkoła Teatralna"
        },
        descriptions: {
            polytech_desc: "Magister systemów i sieci komputerowych, Instytut Systemów Komputerowych",
            theater_school_desc: "Wydział Teatralny (2006-2012) // Wydział Muzyczny (2009-2013)"
        }
    },
    skills: {
        title: "Umiejętności i technologie",
        showMore: "Pokaż umiejętności specjalistyczne",
        hideMore: "Ukryj umiejętności specjalistyczne",
        platforms: {
            desktop: "Aplikacja desktopowa: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Aplikacja mobilna: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI i przepływy agentowe",
            it: "IT i automatyzacja",
            design3d: "3D i design",
            video: "Wideo i media",
            tools: "Oprogramowanie i narzędzia"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Integracja AI / LLM",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "Druk 3D",
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
        title: "Dodatkowe informacje",
        iq: "125 (Powyżej średniej)",
        olympics: "3. miejsce - 2016, Ogólnoukraińska Olimpiada Diagnostyki Systemów Komputerowych",
        driver: "Prawo jazdy (od 2015 roku)",
        languages: {
            title: "Języki",
            uk: "Ukraiński — Ojczysty",
            en: "Angielski — A2 (Techniczny / Wspomagany AI)",
            ru: "Rosyjski — Płynnie"
        },
        hobbies: ["AI", "Gry wideo", "Design", "Skrypty", "Gry planszowe", "Gra w Mafię", "Druk 3D"]
    },
    projects: {
        title: "Projekty i portfolio",
        featuredBadge: "Wyróżniona prezentacja AI",
        categories: {
            all: "Wszystkie projekty",
            games: "Gry",
            apps: "Aplikacje",
            websites: "Strony"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Zaawansowana modyfikacja AI do Valheim. Integruje LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS oraz autonomicznych agentów NPC (rolnicy, zbieracze, naprawiacze, kruki-kurierzy).",
                button: "Zobacz wideo",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Strategiczna gra webowa do treningu mózgu. W pełni pokryta 23 testami E2E w Playwright, zapewniającymi stabilność, jakość regresji i wydajność.",
                button: "Zagraj",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Wieloplatformowa aplikacja do nauki słówek i łamigłówka w stylu Wordle z osobistymi statystykami, kontami użytkowników, rankingiem konkurencyjnym i obsługą i18n w 7 językach.",
                button: "Zacznij się uczyć",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interaktywny portal-wizytówka w morskim klimacie, łączący wszystkie aplikacje webowe, gry i narzędzia w jednym responsywnym interfejsie.",
                button: "Otwórz portal",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interaktywna gra-CV 3D zbudowana od podstaw w Godot 4. Odkrywaj świat, wchodź w interakcje z obiektami i znajdź easter eggi!",
                button: "Uruchom 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, Grafika 3D"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interaktywna strona-portfolio zbudowana w Svelte 5 z powiadomieniami toast, zachowaniem stanu i pełną obsługą i18n.",
                button: "Zobacz portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Oficjalna strona i panel administracyjny Odeskiej Szkoły Teatralnej z interaktywnymi widżetami, ciemnym motywem oceanicznym i galeriami zdjęć.",
                button: "Odwiedź stronę",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Szkoła Artystyczna №5",
                description: "Oficjalna strona Odeskiej Szkoły Artystycznej №5 z obsługą wielu języków, aktualnościami i responsywnym designem.",
                button: "Odwiedź stronę",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interaktywny projekt gier wspierający inicjatywy ratowania zwierząt i podnoszenia świadomości na temat ochrony zwierząt.",
                button: "Otwórz projekt",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Wybierz wersję PDF",
        ats: "ATS / RMS",
        dark: "Ciemny motyw",
        light: "Jasny motyw"
    },
    common: {
        close: "Zamknij",
        sound: "Dźwięk"
    },
    scrollbar: {
        title: "Pasek przewijania",
        standard: "Standardowy",
        custom: "Własny",
        minimap: "Minimapa",
        minimapFull: "Minimapa wizualna"
    }
};
