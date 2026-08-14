import type { Translations } from "../../controllers/I18nState.svelte";

export const ro: Translations = {
    lastUpdate: "Ultima actualizare: 8 august 2026",
    title: ["Inginer AQA", "Explorator AI", "Creator de Jocuri"],
    title_mobile: "Inginer AQA\nExplorator AI\nCreator de Jocuri",
    nav: {
        about: "Despre mine",
        experience: "Experiență",
        education: "Educație",
        skills: "Abilități",
        projects: "Proiecte",
        additional: "Suplimentar",
        contact: "Contact",
        bottom_nav_label: "Navigare inferioară"
    },
    hero: {
        greeting: "Salut! Sunt Alik",
        description: "Automation QA Engineer și Integrator AI. Construiesc framework-uri de testare scalabile, creez aplicații web și jocuri și integrez sisteme AI (LLM, STT, TTS, agenți autonomi).",
        contactMe: "Ia legătura",
        downloadCV: "Descarcă CV",
        emailCopied: "E-mail copiat!",
        openMailClient: "Deschide clientul de e-mail"
    },
    about: {
        title: "Despre mine",
        location: "Odesa, Ucraina",
        content: "Inginer QA Automation cu peste 5 ani de experiență totală în QA (dintre care peste 2 ani în AQA). Automatizez Web, Desktop (C#/WinAppDriver) și Mobile (Java/Appium/Playwright). Ca dezvoltator, am construit un ecosistem de 9 produse, inclusiv MindStep (cu 23 de teste E2E în Playwright) și un mod AI amplu pentru Valheim. Folosesc activ instrumente AI agentice (Claude Code, Gemini CLI, Antigravity IDE) pentru a accelera dezvoltarea și crearea de autoteste.",
        hobbiesTitle: "Hobby-uri",
        philosophyTitle: "Principii inginerești fundamentale",
        philosophyItems: {
            greenfield: "Leadership QA solo de la zero: Experiență practică în stabilirea proceselor QA end-to-end și automatizarea testelor de la zero, fără infrastructură prealabilă.",
            dynamicTests: "Autoteste dinamice complexe: Scrierea de teste automatizate avansate cu selecție dinamică a datelor.",
            aiWorkflows: "Productivitate bazată pe AI: Integrarea instrumentelor AI (Claude Code, Gemini CLI, Antigravity IDE) pentru a accelera crearea testelor."
        }
    },
    experience: {
        title: "Experiență",
        showNonIT: "Afișează experiența non-IT",
        hideNonIT: "Ascunde experiența non-IT",
        present: "Prezent",
        companies: {
            theater_company: "Școala de Teatru"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Suport tehnic"
        },
        descriptions: {
            intellias_desc: "Testarea aplicațiilor Web, Desktop și Mobile. Automatizarea testării (C#, Selenium, WinAppDriver, Appium). Investigarea scurgerilor de memorie și a race conditions.",
            absoft_desc: "Testarea dispozitivelor și aplicațiilor mobile pentru un reportofon video",
            singree_desc: "Optimizare și analiză pentru motoare de căutare.",
            unicorn_desc: "Montaj video pentru canale YouTube.",
            nutduet_desc: "Montaj de evenimente și spectacole live.",
            channel7_desc: "Montaj de buletine de știri.",
            krug_desc: "Montaj de buletine de știri.",
            theater_desc: "Suport tehnic pentru peste 100 de spectacole de teatru. Sunet, lumini, programarea consolelor, filmare și montaj video."
        }
    },
    education: {
        title: "Educație",
        institutions: {
            polytech_name: "Universitatea Națională Politehnică din Odesa",
            theater_school_name: "Școala de Teatru pentru Copii"
        },
        descriptions: {
            polytech_desc: "Master în Sisteme și Rețele de Calculatoare, Institutul de Sisteme Informatice",
            theater_school_desc: "Secția Teatru (2006-2012) // Secția Muzică (2009-2013)"
        }
    },
    skills: {
        title: "Abilități și tehnologii",
        showMore: "Afișează abilitățile specializate",
        hideMore: "Ascunde abilitățile specializate",
        platforms: {
            desktop: "Aplicație desktop: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Aplicație mobilă: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI și fluxuri de lucru agentice",
            it: "IT și automatizare",
            design3d: "3D și design",
            video: "Video și media",
            tools: "Software și instrumente"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Integrare AI / LLM",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "Imprimare 3D",
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
        title: "Informații suplimentare",
        iq: "125 (peste medie)",
        olympics: "Locul 3 - 2016, Olimpiada Pan-Ucraineană de Diagnostic al Sistemelor Informatice",
        driver: "Permis de conducere (din 2015)",
        languages: {
            title: "Limbi",
            uk: "Ucraineană — Maternă",
            en: "Engleză — A2 (Tehnică / Asistată de AI)",
            ru: "Rusă — Fluent"
        },
        hobbies: ["AI", "Jocuri video", "Design", "Scripting", "Jocuri de societate", "Jocul Mafia", "Imprimare 3D"]
    },
    projects: {
        title: "Proiecte și portofoliu",
        featuredBadge: "Prezentare AI recomandată",
        categories: {
            all: "Toate proiectele",
            games: "Jocuri",
            apps: "Aplicații",
            websites: "Site-uri web"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Modificare AI avansată pentru Valheim. Integrează LLM-uri (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS și agenți NPC autonomi (fermieri, culegători, reparatori, corbi curieri).",
                button: "Vezi videoclipul",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Joc web strategic de antrenament cerebral. Acoperit integral cu 23 de teste E2E în Playwright pentru a asigura stabilitate, calitate de regresie și performanță.",
                button: "Joacă",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Aplicație multiplatformă pentru învățarea cuvintelor și puzzle în stil Wordle, cu statistici personale, conturi de utilizator, clasament competitiv și suport i18n în 7 limbi.",
                button: "Începe să înveți",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Portal vitrină interactiv cu temă marină, care reunește toate aplicațiile web, jocurile și instrumentele într-o singură interfață responsivă.",
                button: "Deschide portalul",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Joc-CV 3D interactiv construit de la zero în Godot 4. Explorează lumea, interacționează cu obiecte și descoperă easter eggs!",
                button: "Lansează 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, Grafică 3D"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Site web de portofoliu interactiv construit cu Svelte 5, cu notificări toast, persistența stării și suport i18n complet.",
                button: "Vezi portofoliul",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Site web oficial și portal de administrare pentru Școala de Teatru din Odesa, cu widget-uri interactive, temă oceanică întunecată și galerii foto.",
                button: "Vizitează site-ul",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Școala de Artă №5",
                description: "Site web oficial al Școlii de Artă №5 din Odesa, cu suport multilingv, fluxuri de știri și design responsiv.",
                button: "Vizitează site-ul",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Proiect de jocuri interactive care susține inițiativele de salvare a animalelor și conștientizarea protecției animalelor.",
                button: "Deschide proiectul",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Selectează versiunea PDF",
        ats: "ATS / RMS",
        dark: "Temă întunecată",
        light: "Temă deschisă"
    },
    common: {
        close: "Închide",
        sound: "Sunet"
    },
    scrollbar: {
        title: "Bară de derulare",
        standard: "Standard",
        custom: "De autor",
        minimap: "Minimapă minimă",
        minimapFull: "Minimapă"
    },
    errorPage: {
        notFoundTitle: "Pagina nu a fost găsită",
        notFoundText: "Această adresă nu există. Codul de limbă din link poate fi greșit.",
        genericTitle: "Ceva nu a mers bine",
        genericText: "Pagina nu a putut fi afișată. De obicei ajută reîncărcarea.",
        backHome: "Înapoi la CV"
    },
    ai: {
        subtitle: "Lipiți textul unui anunț sau un link către el — IA îl va compara cu experiența lui Alik.",
        jobPlaceholder: "Descrierea postului sau un link către anunț...",
        analyze: "Analizează anunțul",
        analyzing: "Se analizează...",
        newAnalysis: "Analiză nouă",
        newAnalysisHint: "Analizează alt anunț",
        rawTitle: "Răspunsul IA",
        rawNote: "Modelul nu a returnat o evaluare structurată — afișăm textul nemodificat.",
        summaryTitle: "Concluzia IA",
        matchLabel: "Potrivire",
        strengths: "Puncte forte",
        gaps: "Lipsuri și întrebări",
        followUpTitle: "Puneți o întrebare suplimentară despre experiența lui Alik:",
        chatPlaceholder: "Întrebarea dumneavoastră despre experiența lui Alik...",
        thinking: "IA se gândește...",
        modelTitle: "Model IA",
        modelAuto: "Automat — cel mai bun disponibil",
        bannerSub: "Verificați cât de bine se potrivește anunțul cu candidatul",
        open: "Deschide AI Job Matcher",
        statusNoKey: "fără cheie",
        statusCooldown: "limită ~{minutes} min",
        statusAnswered: "a răspuns",
        statusReady: "pregătit",
        tooltipAnswered: "A răspuns {model} ({provider}). Faceți clic pentru a alege altul.",
        tooltipWillTry: "Se va încerca mai întâi {model} ({provider}). Faceți clic pentru a alege altul.",
        pinHint: "Modelul ales este încercat primul. Dacă își epuizează cota, cererea trece automat la următorul."
    }
};
