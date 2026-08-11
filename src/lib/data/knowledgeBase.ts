/**
 * Complete Knowledge Base of Alik Zapolnov
 * Automation QA Engineer & AI Integration Specialist
 * 
 * Source: c:\Users\alik5\Documents\GitHub\CV\temp\
 */

export interface KnowledgeProfile {
    name: string;
    title: string;
    location: string;
    contacts: {
        email: string;
        linkedin: string;
        telegram: string;
    };
    summary: string;
    experienceYearsTotal: number;
    experienceYearsAutomation: number;
    skills: {
        aiTools: string[];
        frameworks: string[];
        languages: string[];
        testingTypes: string[];
        toolsAndCiCd: string[];
        databases: string[];
    };
    commercialExperience: Array<{
        company: string;
        period: string;
        role: string;
        stack: string[];
        highlights: string[];
    }>;
    portfolioProjects: Array<{
        title: string;
        link: string;
        description: string;
    }>;
}

export const KNOWLEDGE_BASE_UA = `# Алік Заполнов
* Automation QA Engineer (Middle / Middle+)
* AI Integration Specialist
* Game & Product Developer

## 🌟 Професійне Резюме
Інженер з автоматизації тестування (AQA) з 5+ роками загального досвіду у QA, з яких 2+ роки спеціалізації в Automation QA (Web, Desktop Windows, Mobile). 
Розробник та AI Integrator, творець AndDvergrShallSpeakAI (масштабної AI-модифікації для Valheim з автономними LLM/STT/TTS NPC).
Активно використовує сучасні AI-інструменти (Claude Code, Gemini CLI, Antigravity IDE/CLI, Cursor IDE) для прискорення розробки автотестів, розслідування race conditions та витоків пам'яті.

## 👤 Основні Дані
- Локація: Одеса, Україна (100% Remote / Віддалено)
- Досвід: 5+ років у QA загалом, 2+ роки в Automation QA
- Мови: Українська (Рідна), Англійська (Технічна B1-B2 / General A2)
- Контакти: alikzapolnov@gmail.com | Telegram: @alik532 | LinkedIn: linkedin.com/in/alik-qa-engineer

## 🛠 Технічний Стек
- AI & Agentic Tools: Claude Code, Gemini CLI, Antigravity IDE, Cursor IDE, GitHub Copilot, Midjourney.
- Automation Frameworks: Selenium, WinAppDriver, Appium (Inspector & Server), Playwright.
- Мови програмування: C#, Java, JavaScript/TypeScript, Svelte, HTML, CSS, C, VBScript, Godot (GDScript).
- Тестування: Web, Desktop (Windows), Mobile (Android/iOS), Embedded, API. Функціональне, нефункціональне, flaky-тести, оцінка ризиків.
- Бази даних & Інструменти: PostgreSQL, Hasura, Firebase, Jira, Confluence, TestRail, Qase, Git, Targetprocess, Postman, Insomnia, SAP Hybris, Codemagic, CI/CD.

## 💼 Комерційний Досвід
1. Intellias (Digitally Inspired Ltd) | 12/2021 — Дотепер | Middle Automation Test Engineer
   - 3D Modifying Software (Стоматологічні 3D-прилади): Єдиний Automation QA у команді з 5 мануальних QA. Стек: C#, WinAppDriver, Selenium. Оптимізував фреймворк (відеозапис прогонів, Slack-сповіщення), розслідував race conditions та витоки пам'яті.
   - Health Application (Харчова промисловість / Сша): Єдиний QA на проєкті (Greenfield з нуля). Автоматизація мобільного додатка (Java, Selenium, Appium), виявив 100+ критичних дефектів, створив повну документацію.
   - Sanitary Ware Store & Back Office (Ритейл): Test Engineer (Web, Mobile, Embedded, API, React, SAP Hybris).
2. AB Soft | 06/2021 — 12/2021 | QA Engineer
   - Video Recorder (Hardware): Embedded, Hardware testing з нуля.

## 🚀 Проєкти та Портфоліо
1. MindStep — Стратегічна вебгра (Svelte) з 23 E2E автотестами на Playwright.
2. Slovko — Кросплатформовий додаток для вивчення слів (7 мов, статистика, лідерборди).
3. AndDvergrShallSpeakAI (Valheim AI Mod) — C# AI-мод (Gemini, Groq, OpenAI, Ollama, Whisper STT, Edge TTS, автономні професії NPC).
4. DigitalWorkshop — Морський веб-портал/шоукейс усіх додатків.
5. Alik CV 3D — 3D-резюме на рушії Godot.
6. Alik CV Web — Веб-портфоліо на Svelte (i18n, Toast notification system).
7. Teatralo4ka — Сайт та адмін-портал Театральної школи (SvelteKit, Firebase).
8. Мистецька школа №5 — Офіційний сайт мистецької школи (SvelteKit).
9. VetCrewGames — Ігровий проєкт на підтримку порятунку тварин.

## 🎓 Освіта
- Магістр "Комп'ютерні системи та мережі" (Одеський національний політехнічний університет, 2017).
- 3 місце у Всеукраїнській олімпіаді з діагностики комп'ютерних систем (2016).
`;

export const KNOWLEDGE_BASE_EN = `# Alik Zapolnov
* Automation QA Engineer (Middle / Middle+)
* AI Integration Specialist
* Game & Product Developer

## 🌟 Professional Summary
Quality Assurance Engineer with over 5 years of comprehensive QA experience, including 2+ years specializing in Automation QA (Web, Desktop Windows, Mobile). 
Developer and AI Integrator, creator of AndDvergrShallSpeakAI (a massive Valheim AI modification featuring autonomous LLM/STT/TTS NPCs).
Actively utilizes AI tools (Claude Code, Gemini CLI, Antigravity IDE/CLI, Cursor IDE) to accelerate test automation, investigate race conditions, and memory leaks.

## 👤 Basic Info
- Location: Odesa, Ukraine (100% Remote)
- Experience: 5+ years in QA total, 2+ years in Automation QA
- Languages: Ukrainian (Native), English (Technical B1-B2 / General A2)
- Contacts: alikzapolnov@gmail.com | Telegram: @alik532 | LinkedIn: linkedin.com/in/alik-qa-engineer

## 🛠 Technical Stack
- AI & Agentic Tools: Claude Code, Gemini CLI, Antigravity IDE, Cursor IDE, GitHub Copilot, Midjourney.
- Automation Frameworks: Selenium, WinAppDriver, Appium (Inspector & Server), Playwright.
- Languages: C#, Java, JavaScript/TypeScript, Svelte, HTML, CSS, C, VBScript, Godot (GDScript).
- Testing Types: Web, Desktop (Windows), Mobile (Android/iOS), Embedded, API. Functional, Non-functional, Flaky tests, Risk Assessment.
- Tools & Databases: PostgreSQL, Hasura, Firebase, Jira, Confluence, TestRail, Qase, Git, Targetprocess, Postman, Insomnia, SAP Hybris, Codemagic, CI/CD.

## 💼 Commercial Experience
1. Intellias | 12/2021 — Present | Middle Automation Test Engineer
   - 3D Modifying Software (Dental 3D Devices): Sole Automation QA in a 5-member QA team. Stack: C#, WinAppDriver, Selenium. Framework optimizations (video recording, Slack notifications), investigated race conditions and memory leaks.
   - Health Application (Healthcare / USA): Sole QA (Greenfield from scratch). Mobile automation (Java, Selenium, Appium), uncovered 100+ critical bugs.
   - Sanitary Ware Store & Back Office (Retail): Test Engineer (Web, Mobile, Embedded, API, React, SAP Hybris).
2. AB Soft | 06/2021 — 12/2021 | QA Engineer
   - Video Recorder (Hardware): Embedded, Hardware testing from scratch.

## 🚀 Projects & Portfolio
1. MindStep — Strategic web game (Svelte) with 23 E2E Playwright autotests.
2. Slovko — Cross-platform word app (7 languages, stats, leaderboards).
3. AndDvergrShallSpeakAI (Valheim AI Mod) — C# AI mod (Gemini, Groq, OpenAI, Ollama, Whisper STT, Edge TTS, autonomous NPC professions).
4. DigitalWorkshop — Sea-themed portfolio showcase hub.
5. Alik CV 3D — Interactive 3D resume game in Godot.
6. Alik CV Web — Svelte web portfolio (i18n, Toast notification system).
7. Teatralo4ka — Odesa Theatre School website & portal (SvelteKit, Firebase).
8. Art School №5 — Official Art School website (SvelteKit).
9. VetCrewGames — Interactive game project supporting animal rescue.

## 🎓 Education
- Master's Degree in "Computer Systems and Networks" (Odesa National Polytechnic University, 2017).
- 3rd Place in All-Ukrainian Olympiad in Computer System Diagnostics (2016).
`;

export const STRUCTURED_PROFILE: KnowledgeProfile = {
    name: "Alik Zapolnov",
    title: "Automation QA Engineer & AI Integration Specialist",
    location: "Odesa, Ukraine (100% Remote)",
    contacts: {
        email: "alikzapolnov@gmail.com",
        linkedin: "https://www.linkedin.com/in/alik-qa-engineer/",
        telegram: "https://t.me/alik532"
    },
    summary: "Automation QA Engineer and AI Integrator with over 5 years of QA experience (2+ years in AQA). Expertise in Web, Desktop (.NET/WinAppDriver), and Mobile (Java/Appium/Selenium) automation.",
    experienceYearsTotal: 5,
    experienceYearsAutomation: 2,
    skills: {
        aiTools: ["Claude Code", "Gemini CLI", "Antigravity IDE", "Cursor IDE", "GitHub Copilot", "Midjourney"],
        frameworks: ["Selenium", "WinAppDriver", "Appium", "Playwright"],
        languages: ["C#", "Java", "JavaScript/TypeScript", "Svelte", "HTML", "CSS", "C", "VBScript", "GDScript"],
        testingTypes: ["Web", "Desktop (Windows)", "Mobile (Android/iOS)", "Embedded", "API", "Regression", "Performance", "Flaky Test Investigation"],
        toolsAndCiCd: ["Jira", "Confluence", "TestRail", "Qase", "Git", "Targetprocess", "Postman", "Insomnia", "Codemagic", "Firebase"],
        databases: ["PostgreSQL", "Hasura", "Firebase"]
    },
    commercialExperience: [
        {
            company: "Intellias (Digitally Inspired Ltd)",
            period: "12/2021 - Present",
            role: "Middle Automation Test Engineer",
            stack: ["C#", "WinAppDriver", "Selenium", "Java", "Appium", "React", "SAP Hybris"],
            highlights: [
                "Sole Automation QA in a 5-member QA team for 3D Dental Modifying Software",
                "Built test automation from scratch (Greenfield approach) on healthcare app",
                "Investigated complex bugs, race conditions, and memory leaks",
                "Added video recording for test runs and Slack notifications"
            ]
        },
        {
            company: "AB Soft",
            period: "06/2021 - 12/2021",
            role: "QA Engineer",
            stack: ["C", "Embedded", "Hardware testing"],
            highlights: [
                "Hardware and mobile app testing for video recorder project",
                "Implemented MQA processes from scratch"
            ]
        }
    ],
    portfolioProjects: [
        {
            title: "MindStep",
            link: "https://alik532ua.github.io/MindStep/",
            description: "Strategic web game in Svelte with 23 Playwright E2E autotests"
        },
        {
            title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
            link: "https://www.youtube.com/@AndDvergrShallSpeakAI",
            description: "Massive C# AI mod for Valheim with autonomous LLM/STT/TTS NPCs"
        },
        {
            title: "Slovko",
            link: "https://alik532ua.github.io/Slovko/",
            description: "Cross-platform word learning puzzle game (7 languages, leaderboards)"
        },
        {
            title: "Alik CV Web",
            link: "https://alik532ua.github.io/CV/",
            description: "Interactive Svelte web portfolio with Toast notifications and i18n"
        }
    ]
};
