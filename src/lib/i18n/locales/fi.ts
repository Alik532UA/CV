import type { Translations } from "../../controllers/I18nState.svelte";

export const fi: Translations = {
    lastUpdate: "Viimeisin päivitys: 8. elokuuta 2026",
    title: ["AQA-insinööri", "Tekoälyn Tutkija", "Pelinkehittäjä"],
    title_mobile: "AQA-insinööri\nTekoälyn Tutkija\nPelinkehittäjä",
    nav: {
        about: "Minusta",
        experience: "Kokemus",
        education: "Koulutus",
        skills: "Taidot",
        projects: "Projektit",
        additional: "Lisätiedot",
        contact: "Yhteystiedot",
        bottom_nav_label: "Alanavigointi"
    },
    hero: {
        greeting: "Hei! Olen Alik",
        description: "Automation QA Engineer ja tekoälyintegraattori. Rakennan skaalautuvia testauskehyksiä, luon web-sovelluksia ja pelejä sekä integroin tekoälyjärjestelmiä (LLM, STT, TTS, autonomiset agentit).",
        contactMe: "Ota Yhteyttä",
        downloadCV: "Lataa CV",
        emailCopied: "Sähköposti kopioitu!",
        openMailClient: "Avaa sähköpostiohjelma"
    },
    about: {
        title: "Minusta",
        location: "Odesa, Ukraina",
        content: "QA Automation Engineer, jolla on yli 5 vuoden kokonaiskokemus laadunvarmistuksesta (yli 2 vuotta AQA:ssa). Automatisoin Web-, Desktop- (C#/WinAppDriver) ja Mobile-sovelluksia (Java/Appium/Playwright). Kehittäjänä olen rakentanut 9 tuotteen ekosysteemin, mukaan lukien MindStep (23 Playwright E2E -testillä) ja laajan tekoälymodin Valheimille. Käytän aktiivisesti agenttipohjaisia tekoälytyökaluja (Claude Code, Gemini CLI, Antigravity IDE) kehityksen ja autotestien luomisen nopeuttamiseksi.",
        hobbiesTitle: "Harrastukset",
        philosophyTitle: "Keskeiset Insinööriperiaatteet",
        philosophyItems: {
            greenfield: "Itsenäinen QA-johtajuus tyhjästä: Käytännön kokemusta kattavien QA-prosessien ja testausautomaation rakentamisesta alusta alkaen ilman aiempaa infrastruktuuria.",
            dynamicTests: "Monimutkaiset dynaamiset autotestit: Kehittyneiden automaattisten testien kirjoittaminen dynaamisella tiedonvalinnalla.",
            aiWorkflows: "Tekoälyn ohjaama tuottavuus: Tekoälytyökalujen (Claude Code, Gemini CLI, Antigravity IDE) integrointi testien luomisen nopeuttamiseksi."
        }
    },
    experience: {
        title: "Kokemus",
        showNonIT: "Näytä muu kuin IT-kokemus",
        hideNonIT: "Piilota muu kuin IT-kokemus",
        present: "Nykyhetki",
        companies: {
            theater_company: "Teatterikoulu"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Tekninen Tuki"
        },
        descriptions: {
            intellias_desc: "Web-, Desktop- ja Mobile-sovellusten testaus. Testauksen automatisointi (C#, Selenium, WinAppDriver, Appium). Muistivuotojen ja race conditioneiden tutkiminen.",
            absoft_desc: "Laitteiden ja mobiilisovellusten testaus videotallentimelle",
            singree_desc: "Hakukoneoptimointi ja -analyysi.",
            unicorn_desc: "Videoeditointi YouTube-kanaville.",
            nutduet_desc: "Tapahtumien ja lavaesitysten editointi.",
            channel7_desc: "Uutislähetysten editointi.",
            krug_desc: "Uutislähetysten editointi.",
            theater_desc: "Tekninen tuki yli 100 teatteriesitykselle. Ääni, valaistus, konsoliohjelmointi, videokuvaus ja editointi."
        }
    },
    education: {
        title: "Koulutus",
        institutions: {
            polytech_name: "Odesan Kansallinen Teknillinen Yliopisto",
            theater_school_name: "Lasten Teatterikoulu"
        },
        descriptions: {
            polytech_desc: "Maisterin tutkinto tietokonejärjestelmissä ja -verkoissa, Tietokonejärjestelmien Instituutti",
            theater_school_desc: "Teatteriosasto (2006-2012) // Musiikkiosasto (2009-2013)"
        }
    },
    skills: {
        title: "Taidot ja Teknologiat",
        showMore: "Näytä Erikoistaidot",
        hideMore: "Piilota Erikoistaidot",
        platforms: {
            desktop: "Desktop-sovellus: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobiilisovellus: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "Tekoäly ja Agenttipohjaiset Työnkulut",
            it: "IT ja Automaatio",
            design3d: "3D ja Design",
            video: "Video ja Media",
            tools: "Ohjelmistot ja Työkalut"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Tekoäly / LLM-integraatio",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D-tulostus",
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
        title: "Lisätiedot",
        iq: "125 (Keskiarvon yläpuolella)",
        olympics: "3. sija - 2016, Koko Ukrainan tietokonejärjestelmien diagnostiikkaolympialaiset",
        driver: "Ajokortti (vuodesta 2015)",
        languages: {
            title: "Kielet",
            uk: "Ukraina — Äidinkieli",
            en: "Englanti — A2 (Tekninen / Tekoälyavusteinen)",
            ru: "Venäjä — Sujuva"
        },
        hobbies: ["Tekoäly", "Videopelit", "Design", "Skriptaus", "Lautapelit", "Mafia-peli", "3D-tulostus"]
    },
    projects: {
        title: "Projektit ja Portfolio",
        featuredBadge: "Esitelty Tekoälynäyte",
        categories: {
            all: "Kaikki Projektit",
            games: "Pelit",
            apps: "Sovellukset",
            websites: "Verkkosivustot"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Edistynyt tekoälymuunnos Valheimille. Integroi LLM:iä (Gemini, Groq, OpenAI, Ollama), STT:tä (Whisper), Edge TTS:ää ja autonomisia NPC-agentteja (viljelijät, kerääjät, korjaajat, kuriirivarikset).",
                button: "Katso Video",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Strateginen aivoharjoituspeli verkossa. Täysin katettu 23 E2E Playwright-autotestillä vakauden, regressiolaadun ja suorituskyvyn varmistamiseksi.",
                button: "Pelaa",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Monialustainen sanojen oppimissovellus & Wordle-tyylinen pulmapeli, jossa on henkilökohtaiset tilastot, käyttäjätilit, kilpailullinen tulostaulu ja i18n-tuki 7 kielelle.",
                button: "Aloita Oppiminen",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Interaktiivinen merenteemainen esittelyportaali, joka yhdistää kaikki web-sovellukset, pelit ja työkalut yhteen responsiiviseen käyttöliittymään.",
                button: "Avaa Portaali",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Interaktiivinen 3D-ansioluettelopeli, rakennettu tyhjästä Godot 4:llä. Tutki maailmaa, ole vuorovaikutuksessa esineiden kanssa ja löydä pääsiäismunia!",
                button: "Käynnistä 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D-grafiikka"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Interaktiivinen web-portfoliosivusto, rakennettu Svelte 5:llä, jossa on toast-ilmoitukset, tilan säilyvyys ja täysi i18n-tuki.",
                button: "Näytä Portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Odesan Teatterikoulun virallinen verkkosivusto ja hallintaportaali, jossa on interaktiivisia widgettejä, tumma valtamerteema ja valokuvagalleriat.",
                button: "Vieraile Sivustolla",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Taidekoulu №5",
                description: "Odesan Taidekoulu №5:n virallinen verkkosivusto, jossa on monikielinen tuki, uutissyötteet ja responsiivinen design.",
                button: "Vieraile Sivustolla",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Interaktiivinen pelihanke, joka tukee eläinten pelastusaloitteita ja eläinsuojelutietoisuutta.",
                button: "Avaa Projekti",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Valitse PDF-versio",
        ats: "ATS / RMS",
        dark: "Tumma Teema",
        light: "Vaalea Teema"
    },
    common: {
        close: "Sulje",
        sound: "Ääni"
    },
    scrollbar: {
        title: "Vierityspalkki",
        standard: "Vakio",
        custom: "Tekijän",
        minimap: "Minimaalinen minimap",
        minimapFull: "Minimap"
    },
    errorPage: {
        notFoundTitle: "Sivua ei löytynyt",
        notFoundText: "Tätä osoitetta ei ole. Linkin kielikoodi voi olla virheellinen.",
        genericTitle: "Jokin meni pieleen",
        genericText: "Sivua ei voitu näyttää. Uudelleenlataus auttaa yleensä.",
        backHome: "Takaisin ansioluetteloon"
    }
};
