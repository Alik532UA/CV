import type { Translations } from "../../controllers/I18nState.svelte";

export const tr: Translations = {
    lastUpdate: "Son güncelleme: 8 Ağustos 2026",
    title: ["AQA Mühendisi", "AI Kâşifi", "Oyun Yapımcısı"],
    title_mobile: "AQA Mühendisi\nAI Kâşifi\nOyun Yapımcısı",
    nav: {
        about: "Hakkımda",
        experience: "Deneyim",
        education: "Eğitim",
        skills: "Beceriler",
        projects: "Projeler",
        additional: "Ek Bilgiler",
        contact: "İletişim",
        bottom_nav_label: "Alt gezinme"
    },
    hero: {
        greeting: "Merhaba! Ben Alik",
        description: "Automation QA Mühendisi ve AI Entegratörü. Ölçeklenebilir test çerçeveleri kuruyorum, web uygulamaları ve oyunlar geliştiriyorum, AI sistemlerini (LLM, STT, TTS, otonom ajanlar) entegre ediyorum.",
        contactMe: "Benimle İletişime Geçin",
        downloadCV: "CV'yi İndir",
        emailCopied: "E-posta kopyalandı!",
        openMailClient: "E-posta İstemcisini Aç"
    },
    about: {
        title: "Hakkımda",
        location: "Odesa, Ukrayna",
        content: "5 yıldan fazla toplam QA deneyimine sahip (bunun 2 yıldan fazlası AQA'da) QA Automation Mühendisi. Web, Desktop (C#/WinAppDriver) ve Mobile (Java/Appium/Playwright) otomasyonu yapıyorum. Bir geliştirici olarak, MindStep (23 Playwright E2E testiyle) ve Valheim için kapsamlı bir AI modu dahil olmak üzere 9 ürünlük bir ekosistem kurdum. Geliştirmeyi ve otomatik test oluşturmayı hızlandırmak için agent tabanlı AI araçlarını (Claude Code, Gemini CLI, Antigravity IDE) aktif olarak kullanıyorum.",
        hobbiesTitle: "Hobiler",
        philosophyTitle: "Temel Mühendislik İlkeleri",
        philosophyItems: {
            greenfield: "Sıfırdan Tek Başına QA Liderliği: Önceden bir altyapı olmadan sıfırdan uçtan uca QA süreçleri ve test otomasyonu kurma konusunda pratik deneyim.",
            dynamicTests: "Karmaşık Dinamik Otomatik Testler: Dinamik veri seçimiyle gelişmiş otomatik testler yazma.",
            aiWorkflows: "AI Odaklı Verimlilik: Test oluşturmayı hızlandırmak için AI araçlarının (Claude Code, Gemini CLI, Antigravity IDE) entegrasyonu."
        }
    },
    experience: {
        title: "Deneyim",
        showNonIT: "IT Dışı Deneyimi Göster",
        hideNonIT: "IT Dışı Deneyimi Gizle",
        present: "Şimdi",
        roles: {
            intellias_role: "Manual & Automation QA Engineer",
            absoft_role: "Manual QA Engineer",
            singree_role: "SEO Analyst",
            unicorn_role: "Video Editor",
            nutduet_role: "Video Editor & SDE",
            channel7_role: "Video Editor",
            krug_role: "Video Editor",
            theater_role: "Teknik Destek"
        },
        descriptions: {
            intellias_desc: "Web, Desktop ve Mobile uygulama testleri. Test otomasyonu (C#, Selenium, WinAppDriver, Appium). Bellek sızıntıları ve race condition araştırması.",
            absoft_desc: "C dilinde askeri bir video kaydedici için cihaz ve mobil uygulama testleri.",
            singree_desc: "Arama motoru optimizasyonu ve analizi.",
            unicorn_desc: "YouTube kanalları için video montajı.",
            nutduet_desc: "Etkinlik ve sahne performanslarının montajı.",
            channel7_desc: "Haber yayınlarının montajı.",
            krug_desc: "Haber yayınlarının montajı.",
            theater_desc: "100'den fazla tiyatro gösterisi için teknik destek. Ses, ışık, konsol programlama, video çekimi ve montajı."
        }
    },
    education: {
        title: "Eğitim",
        institutions: {
            polytech_name: "Odesa Ulusal Politeknik Üniversitesi",
            theater_school_name: "Çocuk Tiyatro Okulu"
        },
        descriptions: {
            polytech_desc: "Bilgisayar Sistemleri ve Ağları alanında Yüksek Lisans, Bilgisayar Sistemleri Enstitüsü",
            theater_school_desc: "Tiyatro Bölümü (2006-2012) // Müzik Bölümü (2009-2013)"
        }
    },
    skills: {
        title: "Beceriler ve Teknolojiler",
        showMore: "Uzmanlaşmış Becerileri Göster",
        hideMore: "Uzmanlaşmış Becerileri Gizle",
        platforms: {
            desktop: "Masaüstü uygulaması: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobil uygulama: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI ve Agent Tabanlı İş Akışları",
            it: "IT ve Otomasyon",
            design3d: "3D ve Tasarım",
            video: "Video ve Medya",
            tools: "Yazılım ve Araçlar"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "AI / LLM Entegrasyonu",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3D Baskı",
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
        title: "Ek Bilgiler",
        iq: "125 (Ortalamanın Üzerinde)",
        olympics: "3. sıra - 2016, Bilgisayar Sistemleri Tanılama Ukrayna Geneli Olimpiyatı",
        driver: "Sürücü Belgesi (2015'ten beri)",
        languages: {
            title: "Diller",
            uk: "Ukraynaca — Ana Dil",
            en: "İngilizce — A2 (Teknik / AI Destekli)",
            ru: "Rusça — Akıcı"
        },
        hobbies: ["AI", "Video Oyunları", "Tasarım", "Script Yazma", "Masa Oyunları", "Mafya Oyunu", "3D Baskı"]
    },
    projects: {
        title: "Projeler ve Portfolyo",
        featuredBadge: "Öne Çıkan AI Vitrini",
        categories: {
            all: "Tüm Projeler",
            games: "Oyunlar",
            apps: "Uygulamalar",
            websites: "Web Siteleri"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Valheim için gelişmiş AI modifikasyonu. LLM'leri (Gemini, Groq, OpenAI, Ollama), STT'yi (Whisper), Edge TTS'i ve otonom NPC ajanlarını (çiftçiler, toplayıcılar, tamirciler, kurye kargaları) entegre eder.",
                button: "Videoyu İzle",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "Beyin antrenmanı için stratejik web oyunu. Kararlılık, regresyon kalitesi ve performansı garanti etmek için 23 E2E Playwright otomatik testiyle tamamen kapsanmıştır.",
                button: "Oyna",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "Kişisel istatistikler, kullanıcı hesapları, rekabetçi lider tablosu ve 7 dilde i18n desteğine sahip çapraz platform kelime öğrenme uygulaması ve Wordle tarzı bulmaca.",
                button: "Öğrenmeye Başla",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "Tüm web uygulamalarını, oyunları ve araçları tek bir duyarlı arayüzde birleştiren, deniz temalı interaktif vitrin portalı.",
                button: "Portalı Aç",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Godot 4'te sıfırdan oluşturulmuş interaktif 3D özgeçmiş oyunu. Dünyayı keşfedin, nesnelerle etkileşime girin ve paskalya yumurtaları bulun!",
                button: "3D CV'yi Başlat",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D Grafik"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Toast bildirimleri, durum kalıcılığı ve tam i18n desteğine sahip, Svelte 5 ile oluşturulmuş interaktif web portfolyo sitesi.",
                button: "Portfolyoyu Görüntüle",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "İnteraktif widget'lar, koyu okyanus teması ve fotoğraf galerileri ile Odesa Tiyatro Okulu'nun resmi web sitesi ve yönetim portalı.",
                button: "Siteyi Ziyaret Et",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "5 Nolu Sanat Okulu",
                description: "Çoklu dil desteği, haber akışları ve duyarlı tasarıma sahip Odesa 5 Nolu Sanat Okulu'nun resmi web sitesi.",
                button: "Siteyi Ziyaret Et",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "Hayvan kurtarma girişimlerini ve hayvan koruma bilincini destekleyen interaktif oyun projesi.",
                button: "Projeyi Aç",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "PDF Sürümünü Seç",
        ats: "ATS / RMS",
        dark: "Koyu Tema",
        light: "Açık Tema"
    },
    common: {
        close: "Kapat",
        sound: "Ses"
    }
};
