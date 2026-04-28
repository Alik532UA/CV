import type { Translations } from "../../controllers/I18nState.svelte";

export const en: Translations = {
    lastUpdate: "Last update: April 28, 2026",
    title: ["AQA Engineer", "AI Explorer", "Game Maker"],
    title_mobile: "AQA Engineer\nAI Explorer\nGame Maker",
    nav: {
        about: "About Me",
        experience: "Experience",
        education: "Education",
        skills: "Skills",
        projects: "Projects",
        additional: "Additional",
        contact: "Contact"
    },
    hero: {
        greeting: "Hi! I'm Alik",
        description: "An AQA Engineer who is not just about testing, but about creating. I leverage AI to build games and interactive experiences, bridging the gap between quality and creativity.",
        contactMe: "Get in touch",
        downloadCV: "Download CV"
    },
    about: {
        title: "About Me",
        location: "Odesa, UA",
        content: "I'm a Quality Assurance Engineer with solid experience in building automated tests for Desktop, Web, and Mobile platforms. Beyond QA, I'm an active developer who has successfully brought concepts to life, including my MindStep strategic brain-training game and a fully interactive 3D CV. I leverage AI tools to accelerate development and deliver high-quality code across different tech stacks.",
        hobbiesTitle: "Hobbies"
    },
    experience: {
        title: "Experience",
        showNonIT: "Show non-IT experience",
        hideNonIT: "Hide non-IT experience",
        present: "for now",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Technical Support"
        },
        descriptions: {
            intellias_desc: "Testing Web, Desktop, and Mobile apps. Automation testing (C#, Selenium, WinAppDriver).",
            absoft_desc: "Device and mobile app testing.",
            singree_desc: "Search engine analysis.",
            unicorn_desc: "Editing for YouTube.",
            nutduet_desc: "Event and performance editing.",
            channel7_desc: "News editing.",
            krug_desc: "News editing.",
            theater_desc: "Technically supported over hundreds of performances. Responsible for sound, lighting, set up and programming of digital remote control, filming and editing video."
        }
    },
    education: {
        title: "Education",
        institutions: {
            polytech_name: "ODESA NATIONAL POLYTECHNIC UNIVERSITY",
            theater_school_name: "CHILDREN'S THEATER SCHOOL"
        },
        descriptions: {
            polytech_desc: "Master's (Specialist) degree in Computer Systems and Networks, Institute of Computer Systems",
            theater_school_desc: "Theater department (2006-2012) // Music department (2009-2013)"
        }
    },
    skills: {
        title: "Skills",
        showMore: "Show specialized skills",
        hideMore: "Hide specialized skills",
        platforms: {
            desktop: "Desktop app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium",
            mobile: "Mobile app: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            it: "IT & Automation",
            design3d: "3D & Design",
            video: "Video & Media",
            tools: "Software & Tools"
        },
        items: {
            ai: "AI",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D Printing",
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
        title: "Additional",
        iq: "125 (above average)",
        olympics: "3rd place - 2016, All-Ukrainian Olympics in Computer Systems Diagnostics",
        driver: "Driver's license, since 2015",
        languages: {
            title: "Languages",
            uk: "Ukrainian — fluent",
            en: "English — A2",
            ru: "russian — fluent"
        },
        hobbies: ["AI", "Video games", "Design", "Scripts", "Board games", "Mafia game", "3D printing"]
    },
    projects: {
        slovko: {
            title: "Slovko",
            description: "A comprehensive language learning platform with personal statistics, accounts, and friend competitions. Create custom word lists and master new languages on any device without hurdles.",
            button: "Start learning"
        },
        mindstep: {
            title: "MindStep",
            description: "Strategic brain-training game for memory and spatial imagination. Move like a queen, avoid blocked cells, or dive into blind mode!",
            button: "Try Game"
        },
        cv3d: {
            title: "3D CV Experience",
            description: "Interactive 3D resume in Godot 4. Explore, interact, and find the turtle!",
            button: "Explore 3D"
        }
    },
    pdf_modal: {
        title: "Select PDF Version",
        ats: "ATS / RMS",
        dark: "Dark Theme",
        light: "Light Theme"
    }
};
