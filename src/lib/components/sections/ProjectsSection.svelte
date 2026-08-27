<script lang="ts">
    import { ExternalLink, Code, Sparkles, Filter } from "lucide-svelte";
    import { base } from "$app/paths";
    import Section from "../ui/Section.svelte";
    import { language, t } from "$lib/controllers/I18nState.svelte";
    import { siblingUrl, type SiblingId } from "$lib/siblings";
    import { track } from "$lib/services/analytics";

    type ProjectCategory = "all" | "games" | "apps" | "websites";
    let activeFilter = $state<ProjectCategory>("all");

    /**
     * УСЕ, ЩО ЗНАЄ ПРО КАРТКУ САЙТ, А НЕ СЛОВНИК, — одним рядком на проєкт.
     *
     * Спершу сюди переїхала лише адреса: кожен із сорока одного файлу локалі
     * ніс власну копію дев'яти адрес — 369 літералів того самого факту. Це був
     * не лише борг супроводу: жодна з тих адрес не несла мови, тож читач
     * японської сторінки натискав японський підпис і потрапляв на англійський
     * сайт.
     *
     * Тепер тим самим шляхом пішли `id`, `category`, `image` і `featured`.
     * Заміряно перед правкою: 369 рядків `id` на дев'ять різних значень, 369
     * рядків `category` на три, 369 рядків `image` на дев'ять — і РОЗБІЖНОСТЕЙ
     * МІЖ МОВАМИ НУЛЬ у жодному з полів. Вони не перекладалися ніколи, лише
     * копіювалися: ім'я файлу картинки не має мови, а `id` дослівно дорівнював
     * ключу свого ж запису.
     *
     * `id` окремого поля тут не має саме тому — ним є ключ. Два імені однієї
     * речі розходяться мовчки, і ловити таке нема чим.
     *
     * Ціна була не лише в супроводі: словники вантажаться ВСІ 42 одразу, тож
     * кожен відвідувач качав ці 1148 рядків у складі початкового JS.
     *
     * ОДНА ТАБЛИЦЯ, А НЕ ДВІ. Розкласти адресу й решту полів по сусідніх мапах
     * із однаковими ключами означало б рівно те дублювання, яке цей коміт
     * прибирає: ключ, доданий в одну й забутий в іншій, дав би картку без
     * картинки і без категорії — мовчки, бо `undefined` у spread не помітний.
     *
     * `site` — коли ціль є одним із сайтів автора: тоді `siblingUrl` відкриває
     * її мовою, якою читають тут (таблиця — `$lib/siblings`). `link` — коли ні:
     * YouTube і itch.io нашої мови не мають.
     *
     * Словники лишають те, що й мусять, — ТЕКСТ: назву, опис, підпис, стек.
     */
    type ProjectMeta = {
        category: Exclude<ProjectCategory, "all">;
        image: string;
        featured?: boolean;
    } & ({ site: SiblingId } | { link: string });

    const PROJECTS: Record<string, ProjectMeta> = {
        and_dvergr: {
            link: "https://www.youtube.com/@AndDvergrShallSpeakAI",
            category: "games",
            image: "AndDvergrShallSpeakAI.jpg",
            featured: true
        },
        mindstep: { site: "mindstep", category: "games", image: "mindstep.jpg" },
        slovko: { site: "slovko", category: "apps", image: "slovko.jpg" },
        digitalworkshop: { site: "digitalworkshop", category: "websites", image: "DigitalWorkshop.jpg" },
        cv3d: {
            link: "https://alik532ua.itch.io/alik-cv-interactive-3d-experience",
            category: "games",
            image: "cv_3d.jpg"
        },
        cv_web: { site: "cv", category: "websites", image: "cv_web.jpg" },
        teatralo4ka: { site: "teatralo4ka", category: "websites", image: "teatralo4ka.jpg" },
        as5: { site: "as5", category: "websites", image: "as5_odesa_ua.jpg" },
        vetcrew: { site: "vetcrewgames", category: "games", image: "VetCrewGames.jpg" }
    };

    const projectKeys = Object.keys(PROJECTS);

    const projectsList = $derived(
        projectKeys
            .map(key => {
                const data = t.projects.items[key];
                if (!data) return null;
                const meta = PROJECTS[key];
                return {
                    ...data,
                    ...meta,
                    id: key,
                    href: "site" in meta ? siblingUrl(meta.site, language.current) : meta.link
                };
            })
            // Предикат, а не `Boolean`: той відсіює `null` у рантаймі, але тип
            // лишає `| null`, і кожне звернення до картки в розмітці стає
            // «possibly null» — сімнадцять помилок на один пропущений ключ.
            .filter((project) => project !== null)
    );

    const filteredProjects = $derived(
        activeFilter === "all"
            ? projectsList
            : projectsList.filter(p => p.category === activeFilter)
    );
</script>

<Section id="projects" title={t.nav.projects}>
    {#snippet icon()}
        <Code size={22} />
    {/snippet}

    <!-- Filter Buttons -->
    <div class="filter-bar" data-testid="project-filter-toolbar">
        <div class="filter-icon-label" aria-hidden="true" title={t.ui.filterProjects}>
            <Filter size={18} />
        </div>
        <button
            class="filter-btn {activeFilter === 'all' ? 'active' : ''}"
            onclick={() => (activeFilter = "all")}
        >
            {t.projects.categories.all}
        </button>
        <button
            class="filter-btn {activeFilter === 'games' ? 'active' : ''}"
            onclick={() => (activeFilter = "games")}
        >
            {t.projects.categories.games}
        </button>
        <button
            class="filter-btn {activeFilter === 'apps' ? 'active' : ''}"
            onclick={() => (activeFilter = "apps")}
        >
            {t.projects.categories.apps}
        </button>
        <button
            class="filter-btn {activeFilter === 'websites' ? 'active' : ''}"
            onclick={() => (activeFilter = "websites")}
        >
            {t.projects.categories.websites}
        </button>
    </div>

    <div class="projects-grid">
        {#each filteredProjects as project (project.id)}
            <div
                class="project-card glass card {project.featured ? 'featured-card' : ''}"
                data-testid="project-card-{project.id}"
            >
                {#if project.featured}
                    <div class="featured-badge">
                        <Sparkles size={14} />
                        <span>{t.projects.featuredBadge}</span>
                    </div>
                {/if}

                <div class="project-img">
                    <img
                        src="{base}/images/{project.image}"
                        alt={project.title}
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="220"
                    />
                </div>

                <div class="project-content">
                    <h3 class="project-title">{project.title}</h3>
                    <p class="project-desc">{project.description}</p>
                    
                    {#if project.tech}
                        <div class="tech-stack">
                            <span class="tech-tag">{project.tech}</span>
                        </div>
                    {/if}

                    <!-- project.href is always an absolute external URL, never an app route.
                         resolve() must not be used here: it strips the leading character
                         and collapses "//", turning https://… into /CV/ttps:/… -->
                    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                    <a href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn-primary project-btn {project.featured ? 'featured-btn' : ''}"
                        data-testid="project-btn-{project.id}"
                        onclick={() => track("project_click", { project: project.id })}
                    >
                        {project.button}
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        {/each}
    </div>
</Section>

<style>
    .filter-bar {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
        margin-bottom: 24px;
    }

    .filter-icon-label {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: var(--accent-primary, #00f2ff);
        padding: 4px 4px 4px 0;
        opacity: 0.85;
    }

    .filter-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 20px;
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        font-size: 0.88rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .filter-btn:hover {
        background: var(--surface-hover);
        color: var(--text-primary);
    }

    .filter-btn.active {
        background: rgba(var(--accent-primary-rgb), 0.2);
        /* Not white: over a 20% accent tint that only works on a dark page. The
           toggle groups in the header already colour their active option this
           way.

           `--accent-on-tint`, а не сам акцент: у світлій темі 20%-й акцент дає
           фон #c4d8ee, і акцент на ньому — 3.82:1, тобто нижче AA. У темній
           темі змінна дорівнює акценту, тож там нічого не змінилося. */
        color: var(--accent-on-tint);
        border-color: var(--accent-primary);
        box-shadow: 0 4px 14px rgba(var(--accent-primary-rgb, 0, 242, 255), 0.25);
    }

    .projects-grid {
        display: grid;
        /* `minmax(320px, 1fr)` is a hard floor: the column stays 320px wide even
           when the container is narrower, and the card sticks out of the page.
           `min(320px, 100%)` keeps the 320px wrap threshold on wide screens and
           lets the single column follow the container below it. */
        grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
        gap: 24px;
    }

    .project-card {
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: 16px;
        overflow: hidden;
        transition: transform 0.25s ease, box-shadow 0.25s ease;
    }

    .featured-card {
        border: 1px solid rgba(168, 85, 247, 0.5);
        box-shadow: 0 0 25px rgba(112, 0, 255, 0.2);
    }

    .featured-badge {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 2;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 12px;
        background: linear-gradient(135deg, #a855f7 0%, #7000ff 100%);
        color: #ffffff;
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 4px 14px rgba(112, 0, 255, 0.4);
    }

    /* Shows only in the moment before an image paints, so it follows the theme
       rather than flashing a dark band on a light page. */
    .project-img {
        height: 200px;
        overflow: hidden;
        background: var(--surface-subtle);
    }

    /* The card body is not clickable — only the button inside it is — so the
       zoom that used to run on .project-card:hover went too: it read as "this
       whole tile is a link" and clicking the tile did nothing. */
    .project-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .project-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        gap: 12px;
    }

    .project-title {
        font-size: 1.15rem;
        font-weight: 600;
        color: var(--text-primary, #ffffff);
        line-height: 1.3;
    }

    .project-desc {
        font-size: 0.88rem;
        color: var(--text-secondary, rgba(255, 255, 255, 0.75));
        line-height: 1.5;
        flex-grow: 1;
    }

    .tech-stack {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .tech-tag {
        font-size: 0.76rem;
        padding: 3px 8px;
        border-radius: 6px;
        background: var(--surface-subtle);
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
    }

    .project-btn {
        margin-top: auto;
        justify-content: center;
        font-size: 0.9rem;
        gap: 8px;
        text-decoration: none;
    }

    .featured-btn {
        background: linear-gradient(135deg, #a855f7 0%, #7000ff 100%);
        color: #ffffff;
        font-weight: 600;
        border: 1px solid rgba(168, 85, 247, 0.4);
    }

    .featured-btn:hover {
        box-shadow: 0 4px 18px rgba(168, 85, 247, 0.5);
    }
</style>
