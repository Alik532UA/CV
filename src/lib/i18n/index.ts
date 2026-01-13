import { writable, type Writable } from 'svelte/store';

export type Language = 'en' | 'uk';

export const language: Writable<Language> = writable('en');

export const translations = {
    en: {
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
            mindstep: {
                title: "MindStep",
                description: "Strategic brain-training game for memory and spatial imagination. Move like a queen, manage blocked cells, or challenge yourself in 'Powerful' blind mode.",
                fact: "Process over result."
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Interactive 3D resume in Godot 4. Explore, interact, and find the turtle!",
                fact: "Physics & GDScript."
            }
        }
    },
    uk: {
        lastUpdate: "Останнє оновлення: 13 січня 2026",
        title: ["AQA Engineer", "AI Explorer", "Game Maker"],
        title_mobile: "AQA Engineer\nAI Explorer\nGame Maker",
        nav: {
            about: "Про мене",
            experience: "Досвід",
            education: "Освіта",
            skills: "Навички",
            projects: "Проєкти",
            additional: "Додатково",
            contact: "Контакти"
        },
        hero: {
            greeting: "Привіт! Я Алік",
            description: "AQA Engineer, який не просто тестує, а створює. Я використовую AI для розробки ігор та інтерактивних рішень, поєднуючи якість та креативність.",
            contactMe: "Зв'язатися",
            downloadCV: "Завантажити CV"
        },
        about: {
            title: "Про мене",
            location: "Одеса, Україна",
            content: "Я інженер з автоматизації тестування (AQA) з досвідом розробки автотестів для Desktop, Web та Mobile платформ. Окрім тестування, я активно займаюся розробкою: створив стратегічний тренажер MindStep та інтерактивне 3D резюме. Активно використовую можливості AI для прискорення розробки та забезпечення високої якості коду в різних технологічних стеках.",
            hobbiesTitle: "Хобі"
        },
        experience: {
            title: "Досвід роботи",
            showNonIT: "Показати досвід не пов'язаний з IT",
            hideNonIT: "Приховати додатковий досвід",
            present: "дотепер",
            it: [
                {
                    date: "12/2021 - дотепер",
                    company: "Intellias (Digitally Inspired Ltd)",
                    role: "Manual & Automation QA Engineer",
                    desc: "Тестування Web, Desktop та Mobile додатків. Автоматизація (C#, Selenium, WinAppDriver)."
                },
                {
                    date: "06/2021 - 12/2021",
                    company: "AB Soft",
                    role: "Manual QA Engineer",
                    desc: "Тестування пристроїв та мобільних додатків."
                },
                {
                    date: "08/2017 – 09/2017",
                    company: "Singree (IT компанія)",
                    role: "SEO Analyst",
                    desc: "Аналіз пошукових систем."
                }
            ],
            nonIT: [
                {
                    date: "07/2019 – 06/2021",
                    company: "UNICORN MEDIA",
                    role: "Video Editor",
                    desc: "Монтаж для YouTube."
                },
                {
                    date: "06/2014 – 03/2020",
                    company: "LEADERS 'NUT DUET'",
                    role: "Video Editor & SDE",
                    desc: "Монтаж заходів та виступів."
                },
                {
                    date: "11/2017 – 07/2019",
                    company: "7 Канал Одеса",
                    role: "Video Editor",
                    desc: "Монтаж новин."
                },
                {
                    date: "09/2017 – 11/2017",
                    company: "Телеканал 'КРУГ' Одеса",
                    role: "Video Editor",
                    desc: "Монтаж новин."
                },
                {
                    date: "02/2012 – 09/2015",
                    company: "ДИТЯЧА ТЕАТРАЛЬНА ШКОЛА",
                    role: "Технічна підтримка",
                    desc: "Технічне забезпечення понад сотні вистав та десятків заходів. Звук, світло, програмування пультів, зйомка та монтаж відео."
                }
            ]
        },
        education: {
            title: "Освіта",
            items: [
                {
                    institution: "ОДЕСЬКИЙ НАЦІОНАЛЬНИЙ ПОЛІТЕХНІЧНИЙ УНІВЕРСИТЕТ",
                    date: "2012 – 2017",
                    desc: "Магістр (Спеціаліст), Комп'ютерні системи та мережі, Інститут комп'ютерних систем"
                },
                {
                    institution: "ДИТЯЧА ТЕАТРАЛЬНА ШКОЛА",
                    date: "2006 – 2013",
                    desc: "Театральне відділення (2006-2012) // Музичне відділення (2009-2013)"
                }
            ]
        },
        skills: {
            title: "Навички",
            showMore: "Показати спеціалізовані навички",
            hideMore: "Приховати спеціалізовані навички",
            platforms: {
                desktop: "Desktop: C#, Selenium, WinAppDriver",
                web: "Web: C#, Selenium",
                mobile: "Mobile: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
            },
            categories: {
                it: "IT та Автоматизація",
                design3d: "3D та Дизайн",
                video: "Відео та Медіа",
                tools: "ПЗ та Інструменти"
            }
        },
        other: {
            title: "Додатково",
            iq: "125 (вище середнього)",
            olympics: "3 місце - 2016, Всеукраїнська олімпіада з діагностики комп'ютерних систем",
            driver: "Посвідчення водія, з 2015 року",
            languages: {
                title: "Мови",
                uk: "Українська — вільна",
                en: "Англійська — A2",
                ru: "російська — вільна"
            },
            hobbies: ["AI", "Відеоігри", "Дизайн", "Скрипти", "Настільні ігри", "Мафія", "3D друк"]
        },
        projects: {
            mindstep: {
                title: "MindStep",
                description: "Стратегічний тренажер для пам'яті та просторової уяви. Ходіть як ферзь, керуйте заблокованими клітинками або киньте виклик собі у режимі гри наосліп.",
                fact: "Процес важливіший за результат."
            },
            cv3d: {
                title: "3D CV Інтерактив",
                description: "Інтерактивне резюме на Godot 4. Досліджуйте, взаємодійте, знайдіть черепаху!",
                fact: "Фізика та GDScript."
            }
        }
    }
};