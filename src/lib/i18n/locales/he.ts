import type { Translations } from "../../controllers/I18nState.svelte";

// הערה: זהו תרגום טקסט בלבד. האתר אינו תומך עדיין בפריסת RTL
// (כיוון הממשק, יישור, מיקום סמלים) — הטקסט העברי יוצג נכון,
// אך הרכיבים סביבו יישארו מיושרים ל-LTR.
export const he: Translations = {
    lastUpdate: "עדכון אחרון: 8 באוגוסט 2026",
    title: ["מהנדס AQA", "חוקר AI", "יוצר משחקים"],
    title_mobile: "מהנדס AQA\nחוקר AI\nיוצר משחקים",
    nav: {
        about: "עליי",
        experience: "ניסיון",
        education: "השכלה",
        skills: "כישורים",
        projects: "פרויקטים",
        additional: "נוסף",
        contact: "יצירת קשר",
        bottom_nav_label: "ניווט תחתון"
    },
    hero: {
        greeting: "היי! אני אליק",
        description: "מהנדס Automation QA ומשלב AI. אני בונה מסגרות בדיקה ניתנות להרחבה, יוצר אפליקציות web ומשחקים, ומשלב מערכות AI (LLM, STT, TTS, סוכנים אוטונומיים).",
        contactMe: "צור קשר",
        downloadCV: "הורד קורות חיים",
        emailCopied: "האימייל הועתק!",
        openMailClient: "פתח לקוח דוא\"ל"
    },
    about: {
        title: "עליי",
        location: "אודסה, אוקראינה",
        content: "מהנדס QA Automation עם למעלה מ-5 שנות ניסיון כולל ב-QA (מתוכן למעלה משנתיים ב-AQA). אני מבצע אוטומציה ל-Web, Desktop (C#/WinAppDriver) ו-Mobile (Java/Appium/Playwright). כמפתח, בניתי מערכת אקולוגית של 9 מוצרים, כולל MindStep (עם 23 בדיקות E2E ב-Playwright) ו-mod AI נרחב ל-Valheim. אני משתמש באופן פעיל בכלי AI מבוססי סוכנים (Claude Code, Gemini CLI, Antigravity IDE) כדי להאיץ פיתוח ויצירת בדיקות אוטומטיות.",
        hobbiesTitle: "תחביבים",
        philosophyTitle: "עקרונות הנדסה מרכזיים",
        philosophyItems: {
            greenfield: "הובלת QA עצמאית מאפס: ניסיון מעשי בהקמת תהליכי QA מקצה לקצה ואוטומציית בדיקות מאפס, ללא תשתית קודמת.",
            dynamicTests: "בדיקות אוטומטיות דינמיות מורכבות: כתיבת בדיקות אוטומטיות מתקדמות עם בחירת נתונים דינמית.",
            aiWorkflows: "פרודוקטיביות מונעת AI: שילוב כלי AI (Claude Code, Gemini CLI, Antigravity IDE) כדי להאיץ יצירת בדיקות."
        }
    },
    experience: {
        title: "ניסיון",
        showNonIT: "הצג ניסיון שאינו IT",
        hideNonIT: "הסתר ניסיון שאינו IT",
        present: "הווה",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "תמיכה טכנית"
        },
        descriptions: {
            intellias_desc: "בדיקת אפליקציות Web, Desktop ו-Mobile. אוטומציית בדיקות (C#, Selenium, WinAppDriver, Appium). חקירת דליפות זיכרון ו-race conditions.",
            absoft_desc: "בדיקת מכשירים ואפליקציות מובייל עבור מקליט וידאו",
            singree_desc: "אופטימיזציה וניתוח מנועי חיפוש.",
            unicorn_desc: "עריכת וידאו לערוצי YouTube.",
            nutduet_desc: "עריכת אירועים והופעות במה.",
            channel7_desc: "עריכת מהדורות חדשות.",
            krug_desc: "עריכת מהדורות חדשות.",
            theater_desc: "תמיכה טכנית ביותר מ-100 הצגות תיאטרון. סאונד, תאורה, תכנות קונסולות, צילום ועריכת וידאו."
        }
    },
    education: {
        title: "השכלה",
        institutions: {
            polytech_name: "האוניברסיטה הפוליטכנית הלאומית של אודסה",
            theater_school_name: "בית ספר לתיאטרון לילדים"
        },
        descriptions: {
            polytech_desc: "תואר שני במערכות ורשתות מחשבים, המכון למערכות מחשבים",
            theater_school_desc: "מחלקת תיאטרון (2006-2012) // מחלקת מוזיקה (2009-2013)"
        }
    },
    skills: {
        title: "כישורים וטכנולוגיות",
        showMore: "הצג כישורים מיוחדים",
        hideMore: "הסתר כישורים מיוחדים",
        platforms: {
            desktop: "אפליקציית Desktop: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "אפליקציית Mobile: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI וזרימות עבודה מבוססות סוכנים",
            it: "IT ואוטומציה",
            design3d: "3D ועיצוב",
            video: "וידאו ומדיה",
            tools: "תוכנה וכלים"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "שילוב AI / LLM",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "הדפסת 3D",
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
        title: "מידע נוסף",
        iq: "125 (מעל הממוצע)",
        olympics: "מקום 3 - 2016, אולימפיאדת אוקראינה לאבחון מערכות מחשבים",
        driver: "רישיון נהיגה (משנת 2015)",
        languages: {
            title: "שפות",
            uk: "אוקראינית — שפת אם",
            en: "אנגלית — A2 (טכנית / בסיוע AI)",
            ru: "רוסית — שוטפת"
        },
        hobbies: ["AI", "משחקי וידאו", "עיצוב", "כתיבת סקריפטים", "משחקי קופסה", "משחק מאפיה", "הדפסת 3D"]
    },
    projects: {
        title: "פרויקטים ותיק עבודות",
        featuredBadge: "תצוגת AI נבחרת",
        categories: {
            all: "כל הפרויקטים",
            games: "משחקים",
            apps: "אפליקציות",
            websites: "אתרים"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "מודיפיקציית AI מתקדמת עבור Valheim. משלבת LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS וסוכני NPC אוטונומיים (חקלאים, אספנים, מתקנים, עורבי שליחויות).",
                button: "צפה בסרטון",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "משחק web אסטרטגי לאימון המוח. מכוסה במלואו ב-23 בדיקות E2E אוטומטיות ב-Playwright להבטחת יציבות, איכות רגרסיה וביצועים.",
                button: "שחק",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "אפליקציית לימוד מילים רב-פלטפורמית וחידת סגנון Wordle עם סטטיסטיקה אישית, חשבונות משתמשים, טבלת מובילים תחרותית ותמיכת i18n ב-7 שפות.",
                button: "התחל ללמוד",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "פורטל תצוגה אינטראקטיבי בנושא ימי המאחד את כל אפליקציות ה-web, המשחקים והכלים בממשק רספונסיבי אחד.",
                button: "פתח פורטל",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "משחק קורות חיים תלת-ממדי אינטראקטיבי שנבנה מאפס ב-Godot 4. חקור את העולם, קיים אינטראקציה עם אובייקטים וגלה ביצי פסחא!",
                button: "הפעל 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, גרפיקת 3D"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "אתר תיק עבודות אינטראקטיבי שנבנה עם Svelte 5, עם התראות toast, שמירת מצב ותמיכת i18n מלאה.",
                button: "צפה בתיק העבודות",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "האתר הרשמי ופורטל הניהול של בית הספר לתיאטרון של אודסה, עם ווידג'טים אינטראקטיביים, נושא אוקיינוס כהה וגלריות תמונות.",
                button: "בקר באתר",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "בית ספר לאמנות №5",
                description: "האתר הרשמי של בית הספר לאמנות №5 של אודסה, עם תמיכה רב-לשונית, פיד חדשות ועיצוב רספונסיבי.",
                button: "בקר באתר",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "פרויקט משחקים אינטראקטיבי התומך ביוזמות הצלת בעלי חיים ובמודעות להגנה על בעלי חיים.",
                button: "פתח פרויקט",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "בחר גרסת PDF",
        ats: "ATS / RMS",
        dark: "ערכת נושא כהה",
        light: "ערכת נושא בהירה"
    },
    common: {
        close: "סגור",
        sound: "צליל"
    },
    scrollbar: {
        title: "פס גלילה",
        standard: "רגיל",
        custom: "של המחבר",
        minimap: "מינימפה מינימלית",
        minimapFull: "מינימפה"
    }
};
