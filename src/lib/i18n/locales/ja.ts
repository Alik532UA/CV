import type { Translations } from "../../controllers/I18nState.svelte";

export const ja: Translations = {
    lastUpdate: "最終更新日: 2026年8月8日",
    title: ["AQAエンジニア", "AIエクスプローラー", "ゲームクリエイター"],
    title_mobile: "AQAエンジニア\nAIエクスプローラー\nゲームクリエイター",
    nav: {
        about: "私について",
        experience: "職歴",
        education: "学歴",
        skills: "スキル",
        projects: "プロジェクト",
        additional: "追加情報",
        contact: "連絡先",
        bottom_nav_label: "下部ナビゲーション"
    },
    hero: {
        greeting: "こんにちは！Alikです",
        description: "QA自動化エンジニア兼AIインテグレーター。スケーラブルなテストフレームワークの構築、Webアプリやゲームの開発、AIシステム（LLM、STT、TTS、自律エージェント）の統合を行っています。",
        contactMe: "お問い合わせ",
        downloadCV: "履歴書（CV）をダウンロード",
        emailCopied: "メールアドレスをコピーしました！",
        openMailClient: "メールクライアントを開く"
    },
    about: {
        title: "私について",
        location: "ウクライナ・オデーサ",
        content: "QA歴5年以上（うちAQAは2年以上）のQA自動化エンジニアです。Web、Desktop (C#/WinAppDriver)、Mobile (Java/Appium/Playwright) の自動化を手がけています。開発者としては、MindStep（23件のPlaywright E2Eテストで担保）やValheim向けの大規模AI MODなど、9つの製品からなるエコシステムを構築しました。開発と自動テスト作成を加速させるため、エージェント型AIツール（Claude Code、Gemini CLI、Antigravity IDE）を積極的に活用しています。",
        hobbiesTitle: "趣味",
        philosophyTitle: "エンジニアリングの基本原則",
        philosophyItems: {
            greenfield: "新規立ち上げ＆ソロQAリーダーシップ: 既存のインフラがない状態から、エンドツーエンドのQAプロセスとテスト自動化を確立した実践経験。",
            dynamicTests: "複雑な動的自動テスト: 動的なデータ選択を用いた高度な自動テストの作成。",
            aiWorkflows: "AI主導の生産性向上: テスト作成を加速するためのAIツール（Claude Code、Gemini CLI、Antigravity IDE）の活用。"
        }
    },
    experience: {
        title: "職歴",
        showNonIT: "IT以外の職歴を表示",
        hideNonIT: "IT以外の職歴を非表示",
        present: "現在",
        roles: {
            intellias_role: "QAエンジニア（手動・自動テスト）",
            absoft_role: "QAエンジニア（手動テスト）",
            singree_role: "SEOアナリスト",
            unicorn_role: "動画編集者",
            nutduet_role: "動画編集者 & SDE",
            channel7_role: "動画編集者",
            krug_role: "動画編集者",
            theater_role: "テクニカルサポート"
        },
        descriptions: {
            intellias_desc: "Web、デスクトップ、モバイルアプリケーションのテスト。テスト自動化（C#、Selenium、WinAppDriver、Appium）。メモリリークや競合状態の調査。",
            absoft_desc: "C言語で開発された軍用ビデオレコーダーの実機テストおよびモバイルアプリケーションのテスト。",
            singree_desc: "検索エンジン最適化（SEO）と分析。",
            unicorn_desc: "YouTubeチャンネルの動画編集。",
            nutduet_desc: "イベントや舞台公演の動画編集。",
            channel7_desc: "ニュース番組の編集。",
            krug_desc: "ニュース番組の編集。",
            theater_desc: "100公演以上の舞台作品におけるテクニカルサポート。音響、照明、調光卓・音響卓のプログラミング、映像の撮影・編集。"
        }
    },
    education: {
        title: "学歴",
        institutions: {
            polytech_name: "オデーサ国立工科大学",
            theater_school_name: "児童演劇学校"
        },
        descriptions: {
            polytech_desc: "コンピュータシステム学部 コンピュータシステム・ネットワーク専攻 修士号",
            theater_school_desc: "演劇学科 (2006-2012) // 音楽学科 (2009-2013)"
        }
    },
    skills: {
        title: "スキルとスタック",
        showMore: "専門スキルを表示",
        hideMore: "専門スキルを非表示",
        platforms: {
            desktop: "Desktop app: C#, Selenium, WinAppDriver",
            web: "Web: C#, Selenium, Playwright",
            mobile: "Mobile app: Java, IntelliJ IDEA, Selenium, Appium Inspector, Appium Server"
        },
        categories: {
            ai: "AI & エージェント型ワークフロー",
            it: "IT & 自動化",
            design3d: "3D & デザイン",
            video: "映像 & メディア",
            tools: "ソフトウェア & ツール"
        },
        items: {
            claudeCode: "Claude Code & CLI",
            geminiCli: "Gemini CLI & Studio",
            antigravityIde: "Antigravity IDE & CLI",
            cursor: "Cursor IDE",
            copilot: "GitHub Copilot",
            midjourney: "Midjourney",
            ai: "AI / LLM統合",
            csharp: "C#",
            java: "Java",
            playwright: "Playwright",
            blender: "Blender",
            slicer: "Cura / Creality Slicer",
            printing: "3Dプリンティング",
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
        title: "追加情報",
        iq: "125（平均以上）",
        olympics: "全ウクライナ・コンピュータシステム診断オリンピック 3位（2016年）",
        driver: "運転免許証（2015年取得）",
        languages: {
            title: "言語",
            uk: "ウクライナ語 — ネイティブ",
            en: "英語 — A2（技術英語／AI支援）",
            ru: "ロシア語 — 流暢"
        },
        hobbies: ["AI", "ビデオゲーム", "デザイン", "スクリプト作成", "ボードゲーム", "人狼ゲーム", "3Dプリンティング"]
    },
    projects: {
        title: "プロジェクトとポートフォリオ",
        featuredBadge: "注目のAIショーケース",
        categories: {
            all: "すべてのプロジェクト",
            games: "ゲーム",
            apps: "アプリ",
            websites: "ウェブサイト"
        },
        items: {
            and_dvergr: {
                id: "and_dvergr",
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Valheim向けの高度なAI MOD。LLM（Gemini, Groq, OpenAI, Ollama）、STT（Whisper）、Edge TTS、自律型NPCエージェント（農夫、採集者、修理係、配達カラス）を統合しています。",
                button: "動画で見る",
                url: "https://www.youtube.com/@AndDvergrShallSpeakAI",
                category: "games",
                image: "AndDvergrShallSpeakAI.jpg",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT",
                featured: true
            },
            mindstep: {
                id: "mindstep",
                title: "MindStep",
                description: "戦略的な脳トレWebゲーム。安定性、リグレッション品質、パフォーマンスを担保するため、23件のPlaywright E2E自動テストで完全にカバーしています。",
                button: "ゲームをプレイ",
                url: "https://alik532ua.github.io/MindStep/",
                category: "games",
                image: "mindstep.jpg",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                id: "slovko",
                title: "Slovko",
                description: "クロスプラットフォームの単語学習アプリ＆Wordle風パズル。個人統計、ユーザーアカウント、競争型リーダーボード、7言語のi18n対応を備えています。",
                button: "学習を始める",
                url: "https://alik532ua.github.io/Slovko/",
                category: "apps",
                image: "slovko.jpg",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                id: "digitalworkshop",
                title: "DigitalWorkshop",
                description: "海をテーマにしたインタラクティブなショーケースハブ兼ポートフォリオポータル。すべてのWebアプリ、ゲーム、ツールを単一のレスポンシブインターフェースに統合しています。",
                button: "ポータルを開く",
                url: "https://alik532ua.github.io/DigitalWorkshop/",
                category: "websites",
                image: "DigitalWorkshop.jpg",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                id: "cv3d",
                title: "3D CV Experience",
                description: "Godot 4でゼロから構築したインタラクティブな3D履歴書ゲーム。世界を探索し、オブジェクトを操作して、隠された仕掛けを見つけましょう！",
                button: "3D CVを起動",
                url: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
                category: "games",
                image: "cv_3d.jpg",
                tech: "Godot Engine, GDScript, 3D Graphics"
            },
            cv_web: {
                id: "cv_web",
                title: "Alik CV Web",
                description: "Svelte 5で構築したインタラクティブなWebポートフォリオサイト。トースト通知、状態の永続化、完全なi18n対応を備えています。",
                button: "ポートフォリオを見る",
                url: "https://alik532ua.github.io/CV/",
                category: "websites",
                image: "cv_web.jpg",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                id: "teatralo4ka",
                title: "Teatralo4ka.odesa.ua",
                description: "オデーサ演劇学校の公式ウェブサイトおよび管理ポータル。インタラクティブなウィジェット、ダークオーシャンテーマ、フォトギャラリーを備えています。",
                button: "ウェブサイトを見る",
                url: "https://teatralo4ka.odesa.ua/",
                category: "websites",
                image: "teatralo4ka.jpg",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                id: "as5",
                title: "Art School №5",
                description: "オデーサ第5美術学校の公式ウェブサイト。多言語対応、ニュースフィード、レスポンシブデザインを備えています。",
                button: "ウェブサイトを見る",
                url: "https://as5.odesa.ua/",
                category: "websites",
                image: "as5_odesa_ua.jpg",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                id: "vetcrew",
                title: "VetCrewGames",
                description: "動物保護の取り組みと動物福祉への関心を支援するインタラクティブなゲームプロジェクト。",
                button: "プロジェクトを開く",
                url: "https://alik532ua.github.io/VetCrewGames",
                category: "games",
                image: "VetCrewGames.jpg",
                tech: "Svelte 5, Web Games, CSS"
            }
        }
    },
    pdf_modal: {
        title: "PDFバージョンを選択",
        ats: "ATS / RMS",
        dark: "ダークテーマ",
        light: "ライトテーマ"
    },
    common: {
        close: "閉じる",
        sound: "サウンド"
    },
    scrollbar: {
        title: "スクロールバー",
        standard: "標準",
        custom: "オリジナル",
        minimap: "ミニマップ（最小）",
        minimapFull: "ミニマップ"
    }
};
