import type { Translations } from "../../controllers/I18nState.svelte";

export const fr: Translations = {
    lastUpdate: "Dernière mise à jour : 8 août 2026",
    title: ["Ingénieur AQA", "Explorateur d'IA", "Créateur de Jeux"],
    title_mobile: "Ingénieur AQA\nExplorateur d'IA\nCréateur de Jeux",
    nav: {
        about: "À propos",
        experience: "Expérience",
        education: "Formation",
        skills: "Compétences",
        projects: "Projets",
        additional: "Complément",
        contact: "Contact",
        bottom_nav_label: "Navigation inférieure"
    },
    hero: {
        greeting: "Salut ! Je suis Alik",
        description: "Ingénieur QA Automatisation et Intégrateur IA. Je conçois des frameworks de test évolutifs, crée des applications web et des jeux, et intègre des systèmes d'IA (LLM, STT, TTS, agents autonomes).",
        contactMe: "Me contacter",
        downloadCV: "Télécharger le CV",
        emailCopied: "E-mail copié !",
        openMailClient: "Ouvrir le client mail"
    },
    about: {
        title: "À propos",
        location: "Odesa, Ukraine",
        content: "Ingénieur QA Automatisation avec plus de 5 ans d'expérience QA au total (dont plus de 2 ans en AQA). J'automatise le Web, le Desktop (C#/WinAppDriver) et le Mobile (Java/Appium/Playwright). En tant que développeur, j'ai construit un écosystème de 9 produits, dont MindStep (avec 23 tests E2E Playwright) et un mod d'IA de grande envergure pour Valheim. J'utilise activement des outils d'IA agentique (Claude Code, Gemini CLI, Antigravity IDE) pour accélérer le développement et la création d'autotests.",
        hobbiesTitle: "Loisirs",
        philosophyTitle: "Principes Fondamentaux d'Ingénierie",
        philosophyItems: {
            greenfield: "Leadership QA en Solo et à partir de Zéro : Expérience concrète dans la mise en place de processus QA de bout en bout et de l'automatisation des tests sans infrastructure préexistante.",
            dynamicTests: "Autotests Dynamiques Complexes : Rédaction de tests automatisés avancés avec sélection dynamique des données.",
            aiWorkflows: "Productivité Pilotée par l'IA : Intégration d'outils d'IA (Claude Code, Gemini CLI, Antigravity IDE) pour accélérer la création de tests."
        }
    },
    experience: {
        title: "Expérience",
        showNonIT: "Afficher l'expérience hors IT",
        hideNonIT: "Masquer l'expérience hors IT",
        present: "Aujourd'hui",
        companies: {
            theater_company: "École de Théâtre"
        },
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Support Technique"
        },
        descriptions: {
            intellias_desc: "Tests d'applications Web, Desktop et Mobile. Automatisation des tests (C#, Selenium, WinAppDriver, Appium). Investigation des fuites mémoire et des conditions de concurrence.",
            absoft_desc: "Tests d'appareils et d'applications mobiles pour un enregistreur vidéo",
            singree_desc: "Optimisation et analyse pour moteurs de recherche.",
            unicorn_desc: "Montage vidéo pour des chaînes YouTube.",
            nutduet_desc: "Montage d'événements et de spectacles.",
            channel7_desc: "Montage de journaux télévisés.",
            krug_desc: "Montage de journaux télévisés.",
            theater_desc: "Support technique pour plus de 100 spectacles théâtraux. Son, éclairage, programmation de consoles, tournage et montage vidéo."
        }
    },
    education: {
        title: "Formation",
        institutions: {
            polytech_name: "Université Polytechnique Nationale d'Odesa",
            theater_school_name: "École de Théâtre pour Enfants"
        },
        descriptions: {
            polytech_desc: "Master en Systèmes et Réseaux Informatiques, Institut des Systèmes Informatiques",
            theater_school_desc: "Département Théâtre (2006-2012) // Département Musique (2009-2013)"
        }
    },
    skills: {
        title: "Compétences et Technologies",
        showMore: "Afficher les Compétences Spécialisées",
        hideMore: "Masquer les Compétences Spécialisées",
        platforms: {
            desktop: "App de bureau : C#, Selenium, WinAppDriver",
            web: "Web : C#, Selenium, Playwright",
            mobile: "App mobile : Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "IA et Workflows Agentiques",
            it: "IT et Automatisation",
            design3d: "3D et Design",
            video: "Vidéo et Médias",
            tools: "Logiciels et Outils"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Intégration IA / LLM",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "Impression 3D",
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
        title: "Informations Complémentaires",
        iq: "125 (Supérieur à la moyenne)",
        olympics: "3e place - 2016, Olympiade panukrainienne de diagnostic des systèmes informatiques",
        driver: "Permis de conduire (depuis 2015)",
        languages: {
            title: "Langues",
            uk: "Ukrainien — Langue maternelle",
            en: "Anglais — A2 (Technique / Assisté par IA)",
            ru: "Russe — Courant"
        },
        hobbies: ["IA", "Jeux Vidéo", "Design", "Programmation de Scripts", "Jeux de Société", "Jeu du Loup-Garou", "Impression 3D"]
    },
    projects: {
        title: "Projets et Portfolio",
        featuredBadge: "Vitrine IA en Vedette",
        categories: {
            all: "Tous les Projets",
            games: "Jeux",
            apps: "Applications",
            websites: "Sites Web"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Mod IA pour Valheim)",
                description: "Modification IA avancée pour Valheim. Intègre des LLM (Gemini, Groq, OpenAI, Ollama), la STT (Whisper), Edge TTS et des agents PNJ autonomes (fermiers, cueilleurs, réparateurs, corbeaux coursiers).",
                button: "Voir la Vidéo",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Jeu web stratégique d'entraînement cérébral. Entièrement couvert par 23 autotests E2E Playwright pour garantir stabilité, qualité de non-régression et performance.",
                button: "Jouer",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Application multiplateforme d'apprentissage de mots et puzzle façon Wordle, avec statistiques personnelles, comptes utilisateurs, classement compétitif et prise en charge i18n en 7 langues.",
                button: "Commencer à Apprendre",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Portail vitrine interactif sur le thème marin qui réunit toutes mes applications web, jeux et outils dans une interface unique et réactive.",
                button: "Ouvrir le Portail",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Jeu de CV 3D interactif construit de zéro sur Godot 4. Explorez le monde, interagissez avec les objets et découvrez des easter eggs !",
                button: "Lancer le CV 3D",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, Graphismes 3D"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Site portfolio web interactif construit avec Svelte 5, avec notifications toast, persistance d'état et prise en charge i18n complète.",
                button: "Voir le Portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Système de Toast, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Site officiel et portail d'administration de l'École de Théâtre d'Odesa, avec widgets interactifs, thème océan sombre et galeries photo.",
                button: "Visiter le Site",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "École d'Art №5",
                description: "Site officiel de l'École d'Art №5 d'Odesa, avec support multilingue, fil d'actualités et design réactif.",
                button: "Visiter le Site",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Projet de jeux interactifs soutenant les initiatives de sauvetage animalier et la sensibilisation à la protection des animaux.",
                button: "Ouvrir le Projet",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Jeux Web, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Choisir la Version du PDF",
        ats: "ATS / RMS",
        dark: "Thème Sombre",
        light: "Thème Clair"
    },
    common: {
        close: "Fermer",
        sound: "Son"
    },
    scrollbar: {
        title: "Barre de défilement",
        standard: "Standard",
        custom: "D'auteur",
        minimap: "Minicarte minimale",
        minimapFull: "Minicarte"
    },
    errorPage: {
        notFoundTitle: "Page introuvable",
        notFoundText: "Cette adresse n'existe pas. Le code de langue du lien est peut-être erroné.",
        genericTitle: "Une erreur est survenue",
        genericText: "La page n'a pas pu s'afficher. Recharger règle généralement le problème.",
        backHome: "Retour au CV"
    },
    ai: {
        subtitle: "Collez le texte d'une offre ou son lien : l'IA la comparera à l'expérience d'Alik.",
        jobPlaceholder: "Description du poste, ou un lien...",
        analyze: "Analyser l'offre",
        analyzing: "Analyse en cours...",
        newAnalysis: "Nouvelle analyse",
        newAnalysisHint: "Analyser une autre offre",
        rawTitle: "Réponse de l'IA",
        rawNote: "Le modèle n'a pas renvoyé d'évaluation structurée : voici son texte tel quel.",
        summaryTitle: "Conclusion de l'IA",
        matchLabel: "Correspondance",
        strengths: "Points forts",
        gaps: "Lacunes et questions",
        followUpTitle: "Poser une question sur l'expérience d'Alik :",
        chatPlaceholder: "Votre question sur l'expérience d'Alik...",
        thinking: "L'IA réfléchit...",
        modelTitle: "Modèle d'IA",
        modelAuto: "Auto — le meilleur disponible",
        bannerSub: "Vérifier si l'offre correspond au candidat",
        open: "Ouvrir AI Job Matcher",
        statusNoKey: "pas de clé",
        statusCooldown: "limite ~{minutes} min",
        statusAnswered: "a répondu",
        statusReady: "prêt",
        tooltipAnswered: "{model} ({provider}) a répondu. Cliquez pour en choisir un autre.",
        tooltipWillTry: "{model} ({provider}) sera essayé en premier. Cliquez pour en choisir un autre.",
        pinHint: "Le modèle choisi est essayé en premier. S'il atteint sa limite, la requête passe automatiquement au suivant.",
        emptyAnswer: "Le modèle a renvoyé une réponse vide. Réessayez ou choisissez un autre modèle sur le badge ci-dessus."
    }
};
