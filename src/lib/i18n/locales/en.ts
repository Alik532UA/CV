import type { Translations } from "../index.svelte";

export const en: Translations = {
    lastUpdate: "Last update: February 10, 2026",
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
        it: [
            {
                date: "12/2021 - Present",
                company: "Intellias (Digitally Inspired Ltd)",
                role: "Manual & Automation QA Engineer",
                desc: "Testing Web, Desktop, and Mobile apps. Automation testing (C#, Selenium, WinAppDriver)."
            },
            {
                date: "06/2021 - 12/2021",
                company: "AB Soft",
                role: "Manual QA Engineer",
                desc: "Device and mobile app testing."
            },
            {
                date: "08/2017 – 09/2017",
                company: "Singree (IT Company)",
                role: "SEO Analyst",
                desc: "Search engine analysis."
            }
        ],
        nonIT: [
            {
                date: "07/2019 – 06/2021",
                company: "UNICORN MEDIA",
                role: "Video Editor",
                desc: "Editing for YouTube."
            },
            {
                date: "06/2014 – 03/2020",
                company: "LEADERS 'NUT DUET'",
                role: "Video Editor & SDE",
                desc: "Event and performance editing."
            },
            {
                date: "11/2017 – 07/2019",
                company: "Channel 7 Odesa",
                role: "Video Editor",
                desc: "News editing."
            },
            {
                date: "09/2017 – 11/2017",
                company: "Channel 'KRUG' Odesa",
                role: "Video Editor",
                desc: "News editing."
            },
            {
                date: "02/2012 – 09/2015",
                company: "CHILDREN'S THEATER SCHOOL",
                role: "Technical Support",
                desc: "Technically supported over hundreds of performances. Responsible for sound, lighting, set up and programming of digital remote control, filming and editing video."
            }
        ]
    },
    education: {
        title: "Education",
        items: [
            {
                institution: "ODESA NATIONAL POLYTECHNIC UNIVERSITY",
                date: "2012 – 2017",
                desc: "Master's (Specialist) degree in Computer Systems and Networks, Institute of Computer Systems"
            },
            {
                institution: "CHILDREN'S THEATER SCHOOL",
                date: "2006 – 2013",
                desc: "Theater department (2006-2012) // Music department (2009-2013)"
            }
        ]
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
        dark: "Dark Theme",
        light: "Light Theme"
    }
};
