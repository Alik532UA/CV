import type { Translations } from "../../controllers/I18nState.svelte";

export const is: Translations = {
    lastUpdate: "Síðast uppfært: 8. ágúst 2026",
    title: ["AQA Verkfræðingur", "AI Landkönnuður", "Leikjahönnuður"],
    title_mobile: "AQA Verkfræðingur\nAI Landkönnuður\nLeikjahönnuður",
    nav: {
        about: "Um mig",
        experience: "Reynsla",
        education: "Menntun",
        skills: "Hæfni",
        projects: "Verkefni",
        additional: "Viðbótarupplýsingar",
        contact: "Hafa samband",
        bottom_nav_label: "Neðri leiðarstika"
    },
    hero: {
        greeting: "Hæ! Ég er Alik",
        description: "Automation QA verkfræðingur og AI samþættir. Ég byggi stigstærðanleg prófunarkerfi, útbý vefforrit og leiki, og samþætti AI kerfi (LLM, STT, TTS, sjálfstæða umboðsmenn).",
        contactMe: "Hafðu samband",
        downloadCV: "Sækja ferilskrá",
        emailCopied: "Tölvupóstur afritaður!",
        openMailClient: "Opna tölvupóstforrit"
    },
    about: {
        title: "Um mig",
        location: "Ódessa, Úkraína",
        content: "QA Automation verkfræðingur með yfir 5 ára heildarreynslu í gæðaprófunum (þar af yfir 2 ár í AQA). Ég sjálfvirknivæði Web, Desktop (C#/WinAppDriver) og Mobile (Java/Appium/Playwright). Sem forritari hef ég byggt vistkerfi 9 vara, þar á meðal MindStep (með 23 E2E prófunum í Playwright) og umfangsmikla AI-viðbót fyrir Valheim. Ég nota virkan hátt umboðsmiðuð AI verkfæri (Claude Code, Gemini CLI, Antigravity IDE) til að flýta þróun og gerð sjálfvirkra prófa.",
        hobbiesTitle: "Áhugamál",
        philosophyTitle: "Grundvallarreglur verkfræði",
        philosophyItems: {
            greenfield: "Sjálfstætt QA-forystustarf frá grunni: Hagnýt reynsla af að byggja upp heildstæð QA-ferli og prófunarsjálfvirkni frá grunni, án fyrirliggjandi innviða.",
            dynamicTests: "Flókin kvik sjálfvirk próf: Skrifa háþróuð sjálfvirk próf með kviku vali gagna.",
            aiWorkflows: "Framleiðni knúin af AI: Samþætting AI verkfæra (Claude Code, Gemini CLI, Antigravity IDE) til að flýta gerð prófa."
        }
    },
    experience: {
        title: "Reynsla",
        showNonIT: "Sýna reynslu utan upplýsingatækni",
        hideNonIT: "Fela reynslu utan upplýsingatækni",
        present: "Nútíð",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Tæknileg aðstoð"
        },
        descriptions: {
            intellias_desc: "Prófun á Web-, Desktop- og Mobile-forritum. Sjálfvirkni prófana (C#, Selenium, WinAppDriver, Appium). Rannsókn á minnisleka og race conditions.",
            absoft_desc: "Prófun tækja og farsímaforrita fyrir hernaðarlegan myndbandsupptökutæki í C.",
            singree_desc: "Leitarvélabestun og greining.",
            unicorn_desc: "Myndbandsvinnsla fyrir YouTube-rásir.",
            nutduet_desc: "Klipping viðburða og sviðsframkomu.",
            channel7_desc: "Klipping fréttaútsendinga.",
            krug_desc: "Klipping fréttaútsendinga.",
            theater_desc: "Tæknileg aðstoð við yfir 100 leiksýningar. Hljóð, ljós, forritun stjórnborða, myndataka og klipping."
        }
    },
    education: {
        title: "Menntun",
        institutions: {
            polytech_name: "Ríkistækniháskólinn í Ódessu",
            theater_school_name: "Barnaleikhússkólinn"
        },
        descriptions: {
            polytech_desc: "Meistaragráða í tölvukerfum og netkerfum, Tölvukerfastofnun",
            theater_school_desc: "Leiklistardeild (2006-2012) // Tónlistardeild (2009-2013)"
        }
    },
    skills: {
        title: "Hæfni og tækni",
        showMore: "Sýna sérhæfða hæfni",
        hideMore: "Fela sérhæfða hæfni",
        platforms: {
            desktop: "Skjáborðsforrit: C#, Selenium, WinAppDriver",
            web: "Vefur: C#, Selenium, Playwright",
            mobile: "Farsímaforrit: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI og umboðsmiðuð verkflæði",
            it: "Upplýsingatækni og sjálfvirkni",
            design3d: "3D og hönnun",
            video: "Myndbönd og miðlar",
            tools: "Hugbúnaður og verkfæri"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "AI / LLM samþætting",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D prentun",
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
        title: "Viðbótarupplýsingar",
        iq: "125 (yfir meðallagi)",
        olympics: "3. sæti - 2016, Allsherjar-úkraínska ólympíumótið í tölvukerfagreiningu",
        driver: "Ökuskírteini (frá 2015)",
        languages: {
            title: "Tungumál",
            uk: "Úkraínska — Móðurmál",
            en: "Enska — A2 (Tæknileg / Studd af AI)",
            ru: "Rússneska — Reiprennandi"
        },
        hobbies: ["AI", "Tölvuleikir", "Hönnun", "Forskriftagerð", "Borðspil", "Mafíuleikurinn", "3D prentun"]
    },
    projects: {
        title: "Verkefni og eignasafn",
        featuredBadge: "Valin AI-sýning",
        categories: {
            all: "Öll verkefni",
            games: "Leikir",
            apps: "Forrit",
            websites: "Vefsíður"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Háþróuð AI-viðbót fyrir Valheim. Samþættir LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS og sjálfstæða NPC-umboðsmenn (bændur, safnarar, viðgerðarmenn, sendihrafnar).",
                button: "Horfa á myndband",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Stefnumótandi vefleikur fyrir heilaþjálfun. Að fullu prófaður með 23 E2E prófunum í Playwright til að tryggja stöðugleika, afturhvarfsgæði og afköst.",
                button: "Spila",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Margpalla forrit til orðanáms og Wordle-líkrar þrautar með persónulegri tölfræði, notandaaðgangi, keppnistöflu og i18n stuðningi á 7 tungumálum.",
                button: "Byrja að læra",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Gagnvirkur sýningarvefur með sjávarþema sem sameinar öll vefforrit, leiki og verkfæri í eitt svarhæft viðmót.",
                button: "Opna gátt",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Gagnvirkur 3D ferilskrárleikur byggður frá grunni í Godot 4. Kannaðu heiminn, hafðu samskipti við hluti og finndu páskaegg!",
                button: "Ræsa 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D grafík"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Gagnvirk vefsíða með eignasafni, byggð með Svelte 5, með toast-tilkynningum, varðveislu stöðu og fullum i18n stuðningi.",
                button: "Skoða eignasafn",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Opinber vefsíða og stjórnunargátt Leikhússkóla Ódessu með gagnvirkum viðbótum, dökku hafþema og myndasöfnum.",
                button: "Heimsækja vefsíðu",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Listaskóli №5",
                description: "Opinber vefsíða Listaskóla №5 í Ódessu með fjöltyngdum stuðningi, fréttaveitum og svarhæfri hönnun.",
                button: "Heimsækja vefsíðu",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Gagnvirkt leikjaverkefni sem styður björgunarverkefni dýra og vitundarvakningu um dýravernd.",
                button: "Opna verkefni",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Velja PDF útgáfu",
        ats: "ATS / RMS",
        dark: "Dökkt þema",
        light: "Ljóst þema"
    },
    common: {
        close: "Loka",
        sound: "Hljóð"
    }
};
