import type { Translations } from "../schema";

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
        companies: {
            theater_company: "演劇学校"
        },
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
            absoft_desc: "ビデオレコーダーの実機テストおよびモバイルアプリケーションのテスト",
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
        highlights: "実績",
        iqLabel: "IQ",
        olympicsLabel: "オリンピアード",
        driverLabel: "運転免許",
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
                title: "AndDvergrShallSpeakAI (Valheim AI Mod)",
                description: "Valheim向けの高度なAI MOD。LLM（Gemini, Groq, OpenAI, Ollama）、STT（Whisper）、Edge TTS、自律型NPCエージェント（農夫、採集者、修理係、配達カラス）を統合しています。",
                button: "動画で見る",
                tech: "C#, BepInEx, Gemini, Groq, OpenAI, Ollama, Edge TTS, Whisper STT"
            },
            mindstep: {
                title: "MindStep",
                description: "戦略的な脳トレWebゲーム。安定性、リグレッション品質、パフォーマンスを担保するため、23件のPlaywright E2E自動テストで完全にカバーしています。",
                button: "ゲームをプレイ",
                tech: "Svelte 5, TypeScript, Playwright, Tailwind"
            },
            slovko: {
                title: "Slovko",
                description: "クロスプラットフォームの単語学習アプリ＆Wordle風パズル。個人統計、ユーザーアカウント、競争型リーダーボード、7言語のi18n対応を備えています。",
                button: "学習を始める",
                tech: "Svelte 5, TypeScript, Firebase, i18n"
            },
            digitalworkshop: {
                title: "DigitalWorkshop",
                description: "海をテーマにしたインタラクティブなショーケースハブ兼ポートフォリオポータル。すべてのWebアプリ、ゲーム、ツールを単一のレスポンシブインターフェースに統合しています。",
                button: "ポータルを開く",
                tech: "SvelteKit 2, Svelte 5 (Runes), Vanilla CSS"
            },
            cv3d: {
                title: "3D CV Experience",
                description: "Godot 4でゼロから構築したインタラクティブな3D履歴書ゲーム。世界を探索し、オブジェクトを操作して、隠された仕掛けを見つけましょう！",
                button: "3D CVを起動",
                tech: "Godot Engine, GDScript, 3D Graphics"
            },
            cv_web: {
                title: "Alik CV Web",
                description: "Svelte 5で構築したインタラクティブなWebポートフォリオサイト。トースト通知、状態の永続化、完全なi18n対応を備えています。",
                button: "ポートフォリオを見る",
                tech: "Svelte 5, TypeScript, Toast System, i18n"
            },
            teatralo4ka: {
                title: "Teatralo4ka.odesa.ua",
                description: "オデーサ演劇学校の公式ウェブサイトおよび管理ポータル。インタラクティブなウィジェット、ダークオーシャンテーマ、フォトギャラリーを備えています。",
                button: "ウェブサイトを見る",
                tech: "SvelteKit 2, Svelte 5, Firebase, CSS"
            },
            as5: {
                title: "Art School №5",
                description: "オデーサ第5美術学校の公式ウェブサイト。多言語対応、ニュースフィード、レスポンシブデザインを備えています。",
                button: "ウェブサイトを見る",
                tech: "SvelteKit 2, Svelte 5, i18n, Static Adapter"
            },
            vetcrew: {
                title: "VetCrewGames",
                description: "動物保護の取り組みと動物福祉への関心を支援するインタラクティブなゲームプロジェクト。",
                button: "プロジェクトを開く",
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
    ui: {
        skipToContent: "メインコンテンツへスキップ",
        background: "背景エフェクト",
        backgroundOff: "オフ",
        backgroundParticles: "パーティクル",
        backgroundWaves: "波",
        backgroundShapes: "図形",
        particleCount: "パーティクル数",
        waveLayers: "波のレイヤー数",
        lineWidth: "線の太さ",
        theme: "テーマ",
        themeLight: "ライトテーマ",
        themeDark: "ダークテーマ",
        language: "言語を選択",
        languageSearch: "言語を検索…",
        profilePhoto: "プロフィール写真",
        filterProjects: "プロジェクトを絞り込む",
        email: "メール",
        languageEmpty: "言語が見つかりません",
        pdfVersion: "PDF版"
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
    },
    errorPage: {
        notFoundTitle: "ページが見つかりません",
        notFoundText: "このアドレスは存在しません。リンクの言語コードに誤りがある可能性があります。",
        genericTitle: "問題が発生しました",
        genericText: "ページを表示できませんでした。再読み込みで解決することがほとんどです。",
        backHome: "履歴書に戻る"
    },
    ai: {
        subtitle: "求人情報の本文またはそのリンクを貼り付けてください。AI がアリックの経験と照合します。",
        jobPlaceholder: "求人情報の本文、またはそのリンク...",
        analyze: "求人を分析する",
        analyzing: "分析中...",
        newAnalysis: "新しい分析",
        newAnalysisHint: "別の求人を分析する",
        rawTitle: "AI の回答",
        rawNote: "モデルが構造化された評価を返さなかったため、本文をそのまま表示しています。",
        summaryTitle: "AI の判定",
        matchLabel: "適合度",
        strengths: "強み",
        gaps: "不足点と確認事項",
        followUpTitle: "アリックの経験について追加で質問する:",
        chatPlaceholder: "アリックの経験についての質問...",
        thinking: "AI が考えています...",
        modelTitle: "AI モデル",
        modelAuto: "自動 — 利用可能な最良のモデル",
        bannerSub: "求人と候補者の適合度を確認する",
        open: "AI Job Matcher を開く",
        statusNoKey: "キーなし",
        statusCooldown: "制限 約{minutes}分",
        statusAnswered: "回答しました",
        statusReady: "利用可能",
        tooltipAnswered: "{model}（{provider}）が回答しました。クリックして別のモデルを選べます。",
        tooltipWillTry: "最初に {model}（{provider}）を試します。クリックして別のモデルを選べます。",
        pinHint: "選んだモデルが最初に試されます。上限に達した場合は、自動的にリストの次へ進みます。",
        emptyAnswer: "モデルの回答が空でした。もう一度試すか、上のバッジから別のモデルを選んでください。",
        errorNetwork: "AI サービスに接続できませんでした。接続を確認してもう一度お試しください。",
        errorTimeout: "AI サービスから時間内に応答がありませんでした。もう一度お試しください。",
        errorRateLimitMinute: "短時間にリクエストが多すぎます。1 分ほど待ってからお試しください。",
        errorRateLimitDay: "本日のリクエスト上限に達しました。明日またお試しください。",
        errorUnavailable: "現在利用できるモデルがありません。数分後にもう一度試すか、上のバッジから別のモデルを選んでください。",
        errorGeneric: "AI サービスが予期しない応答を返しました（{status}）。もう一度お試しください。"
    }
};
