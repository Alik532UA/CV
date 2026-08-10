import type { Translations } from "../../controllers/I18nState.svelte";

export const sl: Translations = {
    lastUpdate: "Zadnja posodobitev: 8. avgust 2026",
    title: ["AQA Inženir", "Raziskovalec AI", "Ustvarjalec Iger"],
    title_mobile: "AQA Inženir\nRaziskovalec AI\nUstvarjalec Iger",
    nav: {
        about: "O meni",
        experience: "Izkušnje",
        education: "Izobrazba",
        skills: "Veščine",
        projects: "Projekti",
        additional: "Dodatno",
        contact: "Kontakt",
        bottom_nav_label: "Spodnja navigacija"
    },
    hero: {
        greeting: "Živjo! Jaz sem Alik",
        description: "Automation QA Engineer in AI integrator. Gradim skalabilne testne okvire, ustvarjam spletne aplikacije in igre ter integriram AI sisteme (LLM, STT, TTS, avtonomni agenti).",
        contactMe: "Stopite v stik",
        downloadCV: "Prenesi CV",
        emailCopied: "E-pošta kopirana!",
        openMailClient: "Odpri e-poštnega odjemalca"
    },
    about: {
        title: "O meni",
        location: "Odesa, Ukrajina",
        content: "QA Automation Engineer z več kot 5 leti skupnih izkušenj na področju QA (od tega več kot 2 leti v AQA). Avtomatiziram Web, Desktop (C#/WinAppDriver) in Mobile (Java/Appium/Playwright). Kot razvijalec sem zgradil ekosistem 9 izdelkov, vključno z MindStep (s 23 E2E testi v Playwrightu) in obsežnim AI modom za Valheim. Aktivno uporabljam agentna AI orodja (Claude Code, Gemini CLI, Antigravity IDE) za pospešitev razvoja in izdelave avtomatskih testov.",
        hobbiesTitle: "Hobiji",
        philosophyTitle: "Ključna inženirska načela",
        philosophyItems: {
            greenfield: "Samostojno QA vodenje od začetka: Praktične izkušnje pri vzpostavitvi celovitih QA procesov in avtomatizacije testiranja iz nič, brez predhodne infrastrukture.",
            dynamicTests: "Kompleksni dinamični avtomatski testi: Pisanje naprednih avtomatiziranih testov z dinamičnim izborom podatkov.",
            aiWorkflows: "Produktivnost, gnana z AI: Integracija AI orodij (Claude Code, Gemini CLI, Antigravity IDE) za pospešitev izdelave testov."
        }
    },
    experience: {
        title: "Izkušnje",
        showNonIT: "Prikaži izkušnje zunaj IT",
        hideNonIT: "Skrij izkušnje zunaj IT",
        present: "Trenutno",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Tehnična podpora"
        },
        descriptions: {
            intellias_desc: "Testiranje Web, Desktop in Mobile aplikacij. Avtomatizacija testiranja (C#, Selenium, WinAppDriver, Appium). Preiskovanje uhajanja pomnilnika in race conditions.",
            absoft_desc: "Testiranje naprav in mobilnih aplikacij za vojaški videorekorder v jeziku C.",
            singree_desc: "Optimizacija in analiza za iskalnike.",
            unicorn_desc: "Video montaža za YouTube kanale.",
            nutduet_desc: "Montaža dogodkov in odrskih nastopov.",
            channel7_desc: "Montaža informativnih oddaj.",
            krug_desc: "Montaža informativnih oddaj.",
            theater_desc: "Tehnična podpora za več kot 100 gledaliških predstav. Zvok, osvetlitev, programiranje pultov, snemanje in montaža videa."
        }
    },
    education: {
        title: "Izobrazba",
        institutions: {
            polytech_name: "Odeška državna politehnična univerza",
            theater_school_name: "Otroška gledališka šola"
        },
        descriptions: {
            polytech_desc: "Magisterij iz računalniških sistemov in omrežij, Inštitut za računalniške sisteme",
            theater_school_desc: "Gledališki oddelek (2006-2012) // Glasbeni oddelek (2009-2013)"
        }
    },
    skills: {
        title: "Veščine in tehnologije",
        showMore: "Prikaži specializirane veščine",
        hideMore: "Skrij specializirane veščine",
        platforms: {
            desktop: "Namizna aplikacija: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobilna aplikacija: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI in agentni delovni tokovi",
            it: "IT in avtomatizacija",
            design3d: "3D in dizajn",
            video: "Video in mediji",
            tools: "Programska oprema in orodja"
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
            printing: "3D tisk",
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
        title: "Dodatne informacije",
        iq: "125 (nadpovprečno)",
        olympics: "3. mesto - 2016, Vseukrajinska olimpijada iz diagnostike računalniških sistemov",
        driver: "Vozniško dovoljenje (od leta 2015)",
        languages: {
            title: "Jeziki",
            uk: "Ukrajinščina — Materni jezik",
            en: "Angleščina — A2 (Tehnično / S pomočjo AI)",
            ru: "Ruščina — Tekoče"
        },
        hobbies: ["AI", "Videoigre", "Dizajn", "Skriptiranje", "Namizne igre", "Igra Mafija", "3D tisk"]
    },
    projects: {
        title: "Projekti in portfolio",
        featuredBadge: "Izpostavljena AI predstavitev",
        categories: {
            all: "Vsi projekti",
            games: "Igre",
            apps: "Aplikacije",
            websites: "Spletne strani"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Napredna AI modifikacija za Valheim. Vključuje LLM-je (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS in avtonomne NPC agente (kmetje, nabiralci, popravljavci, kurirski krokarji).",
                button: "Ogled videa",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Strateška spletna igra za urjenje možganov. V celoti pokrita s 23 E2E testi v Playwrightu za zagotavljanje stabilnosti, kakovosti regresije in zmogljivosti.",
                button: "Igraj",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Večplatformska aplikacija za učenje besed in uganka v slogu Wordle z osebno statistiko, uporabniškimi računi, tekmovalno lestvico in podporo za i18n v 7 jezikih.",
                button: "Začni z učenjem",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interaktivni predstavitveni portal z morsko tematiko, ki združuje vse spletne aplikacije, igre in orodja v enotnem odzivnem vmesniku.",
                button: "Odpri portal",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interaktivna 3D CV igra, zgrajena od ničle v Godotu 4. Raziščite svet, sodelujte z objekti in odkrijte easter egge!",
                button: "Zaženi 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D grafika"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interaktivna spletna stran-portfolio, izdelana s Svelte 5, s toast obvestili, ohranjanjem stanja in polno podporo za i18n.",
                button: "Ogled portfolia",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Uradna spletna stran in administrativni portal Odeške gledališke šole z interaktivnimi pripomočki, temno oceansko temo in fotogalerijami.",
                button: "Obišči stran",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Umetniška šola №5",
                description: "Uradna spletna stran Odeške umetniške šole №5 s podporo za več jezikov, novicami in odzivnim dizajnom.",
                button: "Obišči stran",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interaktivni igralni projekt v podporo pobudam za reševanje živali in ozaveščanju o zaščiti živali.",
                button: "Odpri projekt",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Izberi različico PDF",
        ats: "ATS / RMS",
        dark: "Temna tema",
        light: "Svetla tema"
    },
    common: {
        close: "Zapri",
        sound: "Zvok"
    },
    scrollbar: {
        title: "Drsnik",
        standard: "Standardni",
        custom: "Prilagojeni",
        minimap: "Minimapa",
        minimapFull: "Vizualna minimapa"
    }
};
