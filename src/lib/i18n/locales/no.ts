import type { Translations } from "../../controllers/I18nState.svelte";

export const no: Translations = {
    lastUpdate: "Sist oppdatert: 8. august 2026",
    title: ["AQA-ingeniør", "AI-utforsker", "Spillskaper"],
    title_mobile: "AQA-ingeniør\nAI-utforsker\nSpillskaper",
    nav: {
        about: "Om meg",
        experience: "Erfaring",
        education: "Utdanning",
        skills: "Ferdigheter",
        projects: "Prosjekter",
        additional: "Tilleggsinfo",
        contact: "Kontakt",
        bottom_nav_label: "Nedre navigasjon"
    },
    hero: {
        greeting: "Hei! Jeg er Alik",
        description: "Automation QA Engineer og AI-integrator. Jeg bygger skalerbare testrammeverk, lager webapper og spill, og integrerer AI-systemer (LLM, STT, TTS, autonome agenter).",
        contactMe: "Ta kontakt",
        downloadCV: "Last ned CV",
        emailCopied: "E-post kopiert!",
        openMailClient: "Åpne e-postklient"
    },
    about: {
        title: "Om meg",
        location: "Odesa, Ukraina",
        content: "QA Automation Engineer med over 5 års samlet erfaring innen QA (hvorav over 2 år i AQA). Jeg automatiserer Web, Desktop (C#/WinAppDriver) og Mobile (Java/Appium/Playwright). Som utvikler har jeg bygget et økosystem med 9 produkter, inkludert MindStep (med 23 E2E-tester i Playwright) og en omfattende AI-mod for Valheim. Jeg bruker aktivt agentbaserte AI-verktøy (Claude Code, Gemini CLI, Antigravity IDE) for å akselerere utvikling og testautomatisering.",
        hobbiesTitle: "Hobbyer",
        philosophyTitle: "Sentrale ingeniørprinsipper",
        philosophyItems: {
            greenfield: "Solo QA-ledelse fra bunnen av: Praktisk erfaring med å etablere helhetlige QA-prosesser og testautomatisering fra grunnen, uten tidligere infrastruktur.",
            dynamicTests: "Komplekse dynamiske autotester: Skriving av avanserte automatiserte tester med dynamisk datautvalg.",
            aiWorkflows: "AI-drevet produktivitet: Integrasjon av AI-verktøy (Claude Code, Gemini CLI, Antigravity IDE) for å akselerere testutvikling."
        }
    },
    experience: {
        title: "Erfaring",
        showNonIT: "Vis erfaring utenfor IT",
        hideNonIT: "Skjul erfaring utenfor IT",
        present: "Nåtid",
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
            intellias_desc: "Testing av Web-, Desktop- og Mobile-applikasjoner. Testautomatisering (C#, Selenium, WinAppDriver, Appium). Undersøkelse av minnelekkasjer og race conditions.",
            absoft_desc: "Testing av enheter og mobilapplikasjoner for en militær videoopptaker i C.",
            singree_desc: "Søkemotoroptimalisering og analyse.",
            unicorn_desc: "Videoredigering for YouTube-kanaler.",
            nutduet_desc: "Redigering av arrangementer og sceneopptredener.",
            channel7_desc: "Redigering av nyhetssendinger.",
            krug_desc: "Redigering av nyhetssendinger.",
            theater_desc: "Teknisk support for over 100 teaterforestillinger. Lyd, lys, konsollprogrammering, videoopptak og redigering."
        }
    },
    education: {
        title: "Utdanning",
        institutions: {
            polytech_name: "Odesa nasjonale polytekniske universitet",
            theater_school_name: "Barneteaterskolen"
        },
        descriptions: {
            polytech_desc: "Mastergrad i datasystemer og nettverk, Institutt for datasystemer",
            theater_school_desc: "Teateravdeling (2006-2012) // Musikkavdeling (2009-2013)"
        }
    },
    skills: {
        title: "Ferdigheter og teknologier",
        showMore: "Vis spesialiserte ferdigheter",
        hideMore: "Skjul spesialiserte ferdigheter",
        platforms: {
            desktop: "Desktop-app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobilapp: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI og agentbaserte arbeidsflyter",
            it: "IT og automatisering",
            design3d: "3D og design",
            video: "Video og media",
            tools: "Programvare og verktøy"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "AI / LLM-integrasjon",
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
        title: "Tilleggsinformasjon",
        iq: "125 (over gjennomsnittet)",
        olympics: "3. plass - 2016, Allukrainsk olympiade i datasystemdiagnostikk",
        driver: "Førerkort (siden 2015)",
        languages: {
            title: "Språk",
            uk: "Ukrainsk — Morsmål",
            en: "Engelsk — A2 (Teknisk / AI-assistert)",
            ru: "Russisk — Flytende"
        },
        hobbies: ["AI", "Videospill", "Design", "Skripting", "Brettspill", "Mafia-leken", "3D-utskrift"]
    },
    projects: {
        title: "Prosjekter og portefølje",
        featuredBadge: "Utvalgt AI-showcase",
        categories: {
            all: "Alle prosjekter",
            games: "Spill",
            apps: "Apper",
            websites: "Nettsteder"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Avansert AI-modifikasjon for Valheim. Integrerer LLM-er (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS og autonome NPC-agenter (bønder, sankere, reparatører, kurerravner).",
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
                description: "Strategisk nettbasert hjernetreningsspill. Fullt dekket med 23 E2E-tester i Playwright for å sikre stabilitet, regresjonskvalitet og ytelse.",
                button: "Spill",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Plattformuavhengig app for ordlæring og Wordle-lignende puslespill med personlig statistikk, brukerkontoer, konkurransetoppliste og i18n-støtte på 7 språk.",
                button: "Begynn å lære",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interaktiv showcase-portal med havtema som samler alle webapper, spill og verktøy i ett responsivt grensesnitt.",
                button: "Åpne portalen",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interaktivt 3D-CV-spill bygget fra bunnen av i Godot 4. Utforsk verdenen, samhandle med objekter og finn påskeegg!",
                button: "Start 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D-grafikk"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interaktiv nettbasert portefølje bygget med Svelte 5, med toast-varsler, tilstandspersistens og fullstendig i18n-støtte.",
                button: "Vis portefølje",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Offisiell nettside og administrasjonsportal for Odesas teaterskole med interaktive widgets, mørkt havtema og fotogallerier.",
                button: "Besøk nettstedet",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Kunstskole №5",
                description: "Offisiell nettside for Odesas kunstskole №5 med flerspråksstøtte, nyhetsstrømmer og responsivt design.",
                button: "Besøk nettstedet",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interaktivt spillprosjekt til støtte for initiativer for dyreredning og bevisstgjøring om dyrevern.",
                button: "Åpne prosjektet",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Velg PDF-versjon",
        ats: "ATS / RMS",
        dark: "Mørkt tema",
        light: "Lyst tema"
    },
    common: {
        close: "Lukk",
        sound: "Lyd"
    },
    scrollbar: {
        title: "Rullefelt",
        standard: "Standard",
        custom: "Forfatterens",
        minimap: "Minimal minimap",
        minimapFull: "Minimap"
    }
};
