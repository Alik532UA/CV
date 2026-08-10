import type { Translations } from "../../controllers/I18nState.svelte";

export const pt: Translations = {
    lastUpdate: "Última atualização: 8 de agosto de 2026",
    title: ["Engenheiro AQA", "Explorador de IA", "Criador de Jogos"],
    title_mobile: "Engenheiro AQA\nExplorador de IA\nCriador de Jogos",
    nav: {
        about: "Sobre Mim",
        experience: "Experiência",
        education: "Formação",
        skills: "Competências",
        projects: "Projetos",
        additional: "Adicional",
        contact: "Contacto",
        bottom_nav_label: "Navegação inferior"
    },
    hero: {
        greeting: "Olá! Sou o Alik",
        description: "Engenheiro de Automação QA e Integrador de IA. Construo frameworks de testes escaláveis, crio aplicações web e jogos, e integro sistemas de IA (LLMs, STT, TTS, agentes autónomos).",
        contactMe: "Entrar em Contacto",
        downloadCV: "Descarregar CV",
        emailCopied: "E-mail copiado!",
        openMailClient: "Abrir Cliente de E-mail"
    },
    about: {
        title: "Sobre Mim",
        location: "Odesa, Ucrânia",
        content: "Engenheiro de Automação QA com mais de 5 anos de experiência total em QA (incluindo mais de 2 anos em AQA). Automatizo Web, Desktop (C#/WinAppDriver) e Mobile (Java/Appium/Playwright). Como programador, construí um ecossistema de 9 produtos, incluindo o MindStep (com 23 testes E2E em Playwright) e um mod de IA de grande escala para o Valheim. Utilizo ativamente ferramentas de IA agêntica (Claude Code, Gemini CLI, Antigravity IDE) para acelerar o desenvolvimento e a criação de autotestes.",
        hobbiesTitle: "Passatempos",
        philosophyTitle: "Princípios Fundamentais de Engenharia",
        philosophyItems: {
            greenfield: "Liderança QA a Solo e do Zero: Experiência prática a estabelecer processos QA de ponta a ponta e automação de testes do zero, sem infraestrutura prévia.",
            dynamicTests: "Autotestes Dinâmicos Complexos: Criação de testes automatizados avançados com seleção dinâmica de dados.",
            aiWorkflows: "Produtividade Orientada por IA: Integração de ferramentas de IA (Claude Code, Gemini CLI, Antigravity IDE) para acelerar a criação de testes."
        }
    },
    experience: {
        title: "Experiência",
        showNonIT: "Mostrar Experiência Não-IT",
        hideNonIT: "Ocultar Experiência Não-IT",
        present: "Atualmente",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Suporte Técnico"
        },
        descriptions: {
            intellias_desc: "Testes de aplicações Web, Desktop e Mobile. Automação de testes (C#, Selenium, WinAppDriver, Appium). Investigação de fugas de memória e condições de corrida.",
            absoft_desc: "Testes de dispositivos e aplicações móveis para um gravador de vídeo militar em C.",
            singree_desc: "Otimização e análise para motores de busca.",
            unicorn_desc: "Edição de vídeo para canais do YouTube.",
            nutduet_desc: "Edição de eventos e espetáculos ao vivo.",
            channel7_desc: "Edição de noticiários.",
            krug_desc: "Edição de noticiários.",
            theater_desc: "Suporte técnico em mais de 100 espetáculos teatrais. Som, iluminação, programação de consolas, filmagem e edição de vídeo."
        }
    },
    education: {
        title: "Formação",
        institutions: {
            polytech_name: "Universidade Politécnica Nacional de Odesa",
            theater_school_name: "Escola de Teatro Infantil"
        },
        descriptions: {
            polytech_desc: "Mestrado em Sistemas e Redes Informáticas, Instituto de Sistemas Informáticos",
            theater_school_desc: "Departamento de Teatro (2006-2012) // Departamento de Música (2009-2013)"
        }
    },
    skills: {
        title: "Competências e Tecnologias",
        showMore: "Mostrar Competências Especializadas",
        hideMore: "Ocultar Competências Especializadas",
        platforms: {
            desktop: "App de desktop: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "App móvel: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "IA e Fluxos de Trabalho Agênticos",
            it: "IT e Automação",
            design3d: "3D e Design",
            video: "Vídeo e Media",
            tools: "Software e Ferramentas"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Integração de IA / LLM",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "Impressão 3D",
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
        title: "Informação Adicional",
        iq: "125 (Acima da média)",
        olympics: "3º lugar - 2016, Olimpíada Pan-Ucraniana de Diagnóstico de Sistemas Informáticos",
        driver: "Carta de Condução (desde 2015)",
        languages: {
            title: "Idiomas",
            uk: "Ucraniano — Nativo",
            en: "Inglês — A2 (Técnico / Assistido por IA)",
            ru: "Russo — Fluente"
        },
        hobbies: ["IA", "Videojogos", "Design", "Programação de Scripts", "Jogos de Tabuleiro", "Jogo da Máfia", "Impressão 3D"]
    },
    projects: {
        title: "Projetos e Portefólio",
        featuredBadge: "Destaque em IA",
        categories: {
            all: "Todos os Projetos",
            games: "Jogos",
            apps: "Aplicações",
            websites: "Sites Web"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Mod de IA para Valheim)",
                description: "Modificação avançada de IA para o Valheim. Integra LLMs (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS e agentes NPC autónomos (agricultores, recoletores, reparadores, corvos-estafeta).",
                button: "Ver Vídeo",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Jogo web estratégico de treino cerebral. Totalmente coberto com 23 autotestes E2E em Playwright para garantir estabilidade, qualidade de regressão e desempenho.",
                button: "Jogar",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Aplicação multiplataforma de aprendizagem de palavras e puzzle ao estilo Wordle, com estatísticas pessoais, contas de utilizador, tabela de classificação competitiva e suporte i18n em 7 idiomas.",
                button: "Começar a Aprender",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Portal de demonstração interativo com temática marítima que reúne todas as minhas aplicações web, jogos e ferramentas numa única interface responsiva.",
                button: "Abrir Portal",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Jogo de currículo 3D interativo, construído do zero em Godot 4. Explore o mundo, interaja com objetos e descubra easter eggs!",
                button: "Iniciar 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, Gráficos 3D"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Website de portefólio interativo construído com Svelte 5, com notificações toast, persistência de estado e suporte i18n completo.",
                button: "Ver Portefólio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Sistema de Toast, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Website oficial e portal de administração da Escola de Teatro de Odesa, com widgets interativos, tema oceano escuro e galerias de fotos.",
                button: "Visitar Website",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Escola de Arte №5",
                description: "Website oficial da Escola de Arte №5 de Odesa, com suporte multilingue, feed de notícias e design responsivo.",
                button: "Visitar Website",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Projeto de jogos interativos de apoio a iniciativas de resgate animal e sensibilização para a proteção dos animais.",
                button: "Abrir Projeto",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Jogos Web, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Selecionar Versão do PDF",
        ats: "ATS / RMS",
        dark: "Tema Escuro",
        light: "Tema Claro"
    },
    common: {
        close: "Fechar",
        sound: "Som"
    },
    scrollbar: {
        title: "Barra de rolagem",
        standard: "Padrão",
        custom: "De autor",
        minimap: "Minimapa mínimo",
        minimapFull: "Minimapa"
    }
};
