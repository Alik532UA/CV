import type { Translations } from "../../controllers/I18nState.svelte";

export const lt: Translations = {
    lastUpdate: "Paskutinį kartą atnaujinta: 2026 m. rugpjūčio 8 d.",
    title: ["AQA Inžinierius", "AI Tyrinėtojas", "Žaidimų Kūrėjas"],
    title_mobile: "AQA Inžinierius\nAI Tyrinėtojas\nŽaidimų Kūrėjas",
    nav: {
        about: "Apie Mane",
        experience: "Patirtis",
        education: "Išsilavinimas",
        skills: "Įgūdžiai",
        projects: "Projektai",
        additional: "Papildoma",
        contact: "Kontaktai",
        bottom_nav_label: "Apatinė navigacija"
    },
    hero: {
        greeting: "Sveiki! Aš esu Alikas",
        description: "Automation QA inžinierius ir AI integratorius. Kuriu keičiamo dydžio testavimo karkasus, kuriu žiniatinklio programas ir žaidimus bei integruoju AI sistemas (LLM, STT, TTS, autonominius agentus).",
        contactMe: "Susisiekite su Manimi",
        downloadCV: "Atsisiųsti CV",
        emailCopied: "El. laiškas nukopijuotas!",
        openMailClient: "Atidaryti El. Pašto Klientą"
    },
    about: {
        title: "Apie Mane",
        location: "Odesa, Ukraina",
        content: "QA Automation inžinierius, turintis daugiau nei 5 metų bendros QA patirties (iš jų daugiau nei 2 metai AQA srityje). Automatizuoju Web, Desktop (C#/WinAppDriver) ir Mobile (Java/Appium/Playwright) sistemas. Kaip kūrėjas, sukūriau 9 produktų ekosistemą, įskaitant MindStep (su 23 E2E testais Playwright) ir platų AI modą Valheim žaidimui. Aktyviai naudoju agentinius AI įrankius (Claude Code, Gemini CLI, Antigravity IDE), kad pagreitinčiau kūrimą ir autotestų kūrimą.",
        hobbiesTitle: "Pomėgiai",
        philosophyTitle: "Pagrindiniai Inžinerijos Principai",
        philosophyItems: {
            greenfield: "Savarankiška QA lyderystė nuo nulio: Praktinė patirtis kuriant išsamius QA procesus ir testavimo automatizavimą nuo nulio, be išankstinės infrastruktūros.",
            dynamicTests: "Sudėtingi dinaminiai autotestai: Pažangių automatizuotų testų rašymas su dinamišku duomenų pasirinkimu.",
            aiWorkflows: "AI valdomas produktyvumas: AI įrankių (Claude Code, Gemini CLI, Antigravity IDE) integravimas, siekiant pagreitinti testų kūrimą."
        }
    },
    experience: {
        title: "Patirtis",
        showNonIT: "Rodyti ne IT patirtį",
        hideNonIT: "Slėpti ne IT patirtį",
        present: "Dabar",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Techninė Pagalba"
        },
        descriptions: {
            intellias_desc: "Web, Desktop ir Mobile programų testavimas. Testavimo automatizavimas (C#, Selenium, WinAppDriver, Appium). Atminties nutekėjimų ir race conditions tyrimas.",
            absoft_desc: "Įrenginių ir mobiliųjų programų testavimas kariniam vaizdo registratoriui C kalba.",
            singree_desc: "Paieškos sistemų optimizavimas ir analizė.",
            unicorn_desc: "Vaizdo montažas YouTube kanalams.",
            nutduet_desc: "Renginių ir scenos pasirodymų montažas.",
            channel7_desc: "Naujienų laidų montažas.",
            krug_desc: "Naujienų laidų montažas.",
            theater_desc: "Techninė pagalba daugiau nei 100 teatro spektaklių. Garsas, apšvietimas, pultų programavimas, vaizdo filmavimas ir montažas."
        }
    },
    education: {
        title: "Išsilavinimas",
        institutions: {
            polytech_name: "Odesos Nacionalinis Politechnikos Universitetas",
            theater_school_name: "Vaikų Teatro Mokykla"
        },
        descriptions: {
            polytech_desc: "Magistro laipsnis kompiuterių sistemų ir tinklų srityje, Kompiuterių Sistemų Institutas",
            theater_school_desc: "Teatro skyrius (2006-2012) // Muzikos skyrius (2009-2013)"
        }
    },
    skills: {
        title: "Įgūdžiai ir Technologijos",
        showMore: "Rodyti Specializuotus Įgūdžius",
        hideMore: "Slėpti Specializuotus Įgūdžius",
        platforms: {
            desktop: "Desktop programa: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobili programa: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI ir Agentiniai Darbo Srautai",
            it: "IT ir Automatizavimas",
            design3d: "3D ir Dizainas",
            video: "Vaizdo ir Medijos",
            tools: "Programinė Įranga ir Įrankiai"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "AI / LLM integracija",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D spausdinimas",
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
        title: "Papildoma Informacija",
        iq: "125 (Virš vidurkio)",
        olympics: "3 vieta - 2016, Visos Ukrainos kompiuterių sistemų diagnostikos olimpiada",
        driver: "Vairuotojo pažymėjimas (nuo 2015 m.)",
        languages: {
            title: "Kalbos",
            uk: "Ukrainiečių — Gimtoji",
            en: "Anglų — A2 (Techninė / Su AI pagalba)",
            ru: "Rusų — Laisvai"
        },
        hobbies: ["AI", "Vaizdo žaidimai", "Dizainas", "Skriptų rašymas", "Stalo žaidimai", "Žaidimas Mafija", "3D spausdinimas"]
    },
    projects: {
        title: "Projektai ir Portfolio",
        featuredBadge: "Išskirtinė AI Vitrina",
        categories: {
            all: "Visi Projektai",
            games: "Žaidimai",
            apps: "Programos",
            websites: "Svetainės"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Pažangi AI modifikacija Valheim žaidimui. Integruoja LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS ir autonominius NPC agentus (ūkininkai, rinkėjai, remontininkai, kurjerinės varnos).",
                button: "Žiūrėti Vaizdo Įrašą",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Strateginis žiniatinklio smegenų treniruotės žaidimas. Visiškai padengtas 23 E2E Playwright autotestais, užtikrinant stabilumą, regresijos kokybę ir našumą.",
                button: "Žaisti",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Kelių platformų žodžių mokymosi programa ir Wordle stiliaus galvosūkis su asmenine statistika, vartotojų paskyromis, konkurencine lentele ir i18n palaikymu 7 kalbomis.",
                button: "Pradėti Mokytis",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interaktyvus jūrinės tematikos pristatymo portalas, jungiantis visas žiniatinklio programas, žaidimus ir įrankius į vieną adaptyvią sąsają.",
                button: "Atidaryti Portalą",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interaktyvus 3D CV žaidimas, sukurtas nuo nulio su Godot 4. Tyrinėk pasaulį, sąveikauk su objektais ir rask velykinius kiaušinius!",
                button: "Paleisti 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D grafika"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interaktyvi žiniatinklio portfolio svetainė, sukurta su Svelte 5, su toast pranešimais, būsenos išsaugojimu ir pilnu i18n palaikymu.",
                button: "Peržiūrėti Portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Odesos Teatro mokyklos oficiali svetainė ir administravimo portalas su interaktyviais valdikliais, tamsia vandenyno tema ir nuotraukų galerijomis.",
                button: "Aplankyti Svetainę",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Meno mokykla №5",
                description: "Odesos Meno mokyklos №5 oficiali svetainė su daugiakalbiu palaikymu, naujienų srautais ir adaptyviu dizainu.",
                button: "Aplankyti Svetainę",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interaktyvus žaidimų projektas, remiantis gyvūnų gelbėjimo iniciatyvas ir gyvūnų apsaugos sąmoningumą.",
                button: "Atidaryti Projektą",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Pasirinkti PDF Versiją",
        ats: "ATS / RMS",
        dark: "Tamsi Tema",
        light: "Šviesi Tema"
    },
    common: {
        close: "Uždaryti"
    }
};
