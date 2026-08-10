import type { Translations } from "../../controllers/I18nState.svelte";

export const el: Translations = {
    lastUpdate: "Τελευταία ενημέρωση: 8 Αυγούστου 2026",
    title: ["Μηχανικός AQA", "Εξερευνητής AI", "Δημιουργός Παιχνιδιών"],
    title_mobile: "Μηχανικός AQA\nΕξερευνητής AI\nΔημιουργός Παιχνιδιών",
    nav: {
        about: "Σχετικά με Εμένα",
        experience: "Εμπειρία",
        education: "Εκπαίδευση",
        skills: "Δεξιότητες",
        projects: "Έργα",
        additional: "Επιπλέον",
        contact: "Επικοινωνία",
        bottom_nav_label: "Κάτω πλοήγηση"
    },
    hero: {
        greeting: "Γεια! Είμαι ο Alik",
        description: "Μηχανικός Αυτοματισμού QA και Ολοκληρωτής AI. Δημιουργώ επεκτάσιμα πλαίσια δοκιμών, φτιάχνω web εφαρμογές & παιχνίδια, και ενσωματώνω συστήματα AI (LLM, STT, TTS, αυτόνομους πράκτορες).",
        contactMe: "Επικοινωνήστε Μαζί Μου",
        downloadCV: "Λήψη CV",
        emailCopied: "Το email αντιγράφηκε!",
        openMailClient: "Άνοιγμα Προγράμματος Email"
    },
    about: {
        title: "Σχετικά με Εμένα",
        location: "Οδησσός, Ουκρανία",
        content: "Μηχανικός Αυτοματισμού QA με πάνω από 5 χρόνια συνολικής εμπειρίας σε QA (εκ των οποίων πάνω από 2 χρόνια σε AQA). Αυτοματοποιώ Web, Desktop (C#/WinAppDriver) και Mobile (Java/Appium/Playwright). Ως προγραμματιστής, έχω δημιουργήσει ένα οικοσύστημα 9 προϊόντων, συμπεριλαμβανομένου του MindStep (με 23 δοκιμές E2E σε Playwright) και ενός εκτεταμένου AI mod για το Valheim. Χρησιμοποιώ ενεργά εργαλεία AI με πράκτορες (Claude Code, Gemini CLI, Antigravity IDE) για την επιτάχυνση της ανάπτυξης και της δημιουργίας autotests.",
        hobbiesTitle: "Χόμπι",
        philosophyTitle: "Βασικές Αρχές Μηχανικής",
        philosophyItems: {
            greenfield: "Ηγεσία QA Μόνος από το Μηδέν: Πρακτική εμπειρία στη δημιουργία ολοκληρωμένων διαδικασιών QA και αυτοματισμού δοκιμών από την αρχή, χωρίς προϋπάρχουσα υποδομή.",
            dynamicTests: "Σύνθετα Δυναμικά Autotests: Συγγραφή προηγμένων αυτοματοποιημένων δοκιμών με δυναμική επιλογή δεδομένων.",
            aiWorkflows: "Παραγωγικότητα Καθοδηγούμενη από AI: Ενσωμάτωση εργαλείων AI (Claude Code, Gemini CLI, Antigravity IDE) για την επιτάχυνση της δημιουργίας δοκιμών."
        }
    },
    experience: {
        title: "Εμπειρία",
        showNonIT: "Εμφάνιση Εμπειρίας εκτός IT",
        hideNonIT: "Απόκρυψη Εμπειρίας εκτός IT",
        present: "Σήμερα",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Τεχνική Υποστήριξη"
        },
        descriptions: {
            intellias_desc: "Δοκιμές εφαρμογών Web, Desktop και Mobile. Αυτοματισμός δοκιμών (C#, Selenium, WinAppDriver, Appium). Διερεύνηση διαρροών μνήμης και race conditions.",
            absoft_desc: "Δοκιμές συσκευών και εφαρμογών κινητών για στρατιωτικό βιντεοκαταγραφέα σε C.",
            singree_desc: "Βελτιστοποίηση και ανάλυση μηχανών αναζήτησης.",
            unicorn_desc: "Επεξεργασία βίντεο για κανάλια YouTube.",
            nutduet_desc: "Επεξεργασία εκδηλώσεων και σκηνικών παραστάσεων.",
            channel7_desc: "Επεξεργασία δελτίων ειδήσεων.",
            krug_desc: "Επεξεργασία δελτίων ειδήσεων.",
            theater_desc: "Τεχνική υποστήριξη για πάνω από 100 θεατρικές παραστάσεις. Ήχος, φωτισμός, προγραμματισμός κονσόλας, κινηματογράφηση και επεξεργασία βίντεο."
        }
    },
    education: {
        title: "Εκπαίδευση",
        institutions: {
            polytech_name: "Εθνικό Πολυτεχνείο της Οδησσού",
            theater_school_name: "Παιδικό Θεατρικό Σχολείο"
        },
        descriptions: {
            polytech_desc: "Μεταπτυχιακό στα Συστήματα και Δίκτυα Υπολογιστών, Ινστιτούτο Υπολογιστικών Συστημάτων",
            theater_school_desc: "Τμήμα Θεάτρου (2006-2012) // Τμήμα Μουσικής (2009-2013)"
        }
    },
    skills: {
        title: "Δεξιότητες και Τεχνολογίες",
        showMore: "Εμφάνιση Εξειδικευμένων Δεξιοτήτων",
        hideMore: "Απόκρυψη Εξειδικευμένων Δεξιοτήτων",
        platforms: {
            desktop: "Εφαρμογή desktop: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Εφαρμογή κινητού: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI και Ροές Εργασίας με Πράκτορες",
            it: "IT και Αυτοματισμός",
            design3d: "3D και Σχεδιασμός",
            video: "Βίντεο και Μέσα",
            tools: "Λογισμικό και Εργαλεία"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "Ενσωμάτωση AI / LLM",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "Εκτύπωση 3D",
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
        title: "Πρόσθετες Πληροφορίες",
        iq: "125 (Πάνω από τον μέσο όρο)",
        olympics: "3η θέση - 2016, Πανουκρανική Ολυμπιάδα Διαγνωστικής Υπολογιστικών Συστημάτων",
        driver: "Άδεια Οδήγησης (από το 2015)",
        languages: {
            title: "Γλώσσες",
            uk: "Ουκρανικά — Μητρική",
            en: "Αγγλικά — A2 (Τεχνικά / Με Βοήθεια AI)",
            ru: "Ρωσικά — Άπταιστα"
        },
        hobbies: ["AI", "Βιντεοπαιχνίδια", "Σχεδιασμός", "Scripting", "Επιτραπέζια Παιχνίδια", "Παιχνίδι Μαφία", "Εκτύπωση 3D"]
    },
    projects: {
        title: "Έργα και Portfolio",
        featuredBadge: "Προτεινόμενη Επίδειξη AI",
        categories: {
            all: "Όλα τα Έργα",
            games: "Παιχνίδια",
            apps: "Εφαρμογές",
            websites: "Ιστότοποι"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Προηγμένη τροποποίηση AI για το Valheim. Ενσωματώνει LLM (Gemini, Groq, OpenAI, Ollama), STT (Whisper), Edge TTS και αυτόνομους πράκτορες NPC (αγρότες, συλλέκτες, επισκευαστές, κοράκια-ταχυδρόμους).",
                button: "Δείτε το Βίντεο",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Στρατηγικό web παιχνίδι εκγύμνασης εγκεφάλου. Πλήρως καλυμμένο με 23 autotests E2E σε Playwright για διασφάλιση σταθερότητας, ποιότητας οπισθοδρόμησης και απόδοσης.",
                button: "Παίξτε",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Εφαρμογή εκμάθησης λέξεων πολλαπλών πλατφορμών & παζλ τύπου Wordle με προσωπικά στατιστικά, λογαριασμούς χρηστών, ανταγωνιστική κατάταξη και υποστήριξη i18n σε 7 γλώσσες.",
                button: "Ξεκινήστε να Μαθαίνετε",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Διαδραστική πύλη επίδειξης με θαλάσσιο θέμα που ενώνει όλες τις web εφαρμογές, παιχνίδια και εργαλεία σε μία ενιαία responsive διεπαφή.",
                button: "Άνοιγμα Πύλης",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Διαδραστικό παιχνίδι 3D βιογραφικού, χτισμένο από το μηδέν στο Godot 4. Εξερευνήστε τον κόσμο, αλληλεπιδράστε με αντικείμενα και ανακαλύψτε easter eggs!",
                button: "Εκκίνηση 3D CV",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, Γραφικά 3D"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Διαδραστικός ιστότοπος portfolio, χτισμένος με Svelte 5, με ειδοποιήσεις toast, διατήρηση κατάστασης και πλήρη υποστήριξη i18n.",
                button: "Δείτε το Portfolio",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "Επίσημος ιστότοπος και πύλη διαχείρισης της Θεατρικής Σχολής της Οδησσού με διαδραστικά widgets, σκούρο ωκεάνιο θέμα και φωτογραφικές συλλογές.",
                button: "Επισκεφθείτε τον Ιστότοπο",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Σχολή Τέχνης №5",
                description: "Επίσημος ιστότοπος της Σχολής Τέχνης №5 της Οδησσού με υποστήριξη πολλών γλωσσών, ροές ειδήσεων και responsive design.",
                button: "Επισκεφθείτε τον Ιστότοπο",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Διαδραστικό παιχνιδιακό έργο που υποστηρίζει πρωτοβουλίες διάσωσης ζώων και ευαισθητοποίησης για την προστασία των ζώων.",
                button: "Άνοιγμα Έργου",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "Επιλέξτε Έκδοση PDF",
        ats: "ATS / RMS",
        dark: "Σκούρο Θέμα",
        light: "Ανοιχτό Θέμα"
    },
    common: {
        close: "Κλείσιμο",
        sound: "Ήχος"
    }
};
