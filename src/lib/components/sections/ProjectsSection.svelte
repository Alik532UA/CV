<script lang="ts">
    import { ExternalLink, Code, Sparkles, Filter } from "lucide-svelte";
    import { base } from "$app/paths";
    import Section from "../ui/Section.svelte";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { track } from "$lib/services/analytics";

    type ProjectCategory = "all" | "games" | "apps" | "websites";
    let activeFilter = $state<ProjectCategory>("all");

    const projectKeys = [
        "and_dvergr",
        "mindstep",
        "slovko",
        "digitalworkshop",
        "cv3d",
        "cv_web",
        "teatralo4ka",
        "as5",
        "vetcrew"
    ];

    const projectsList = $derived(
        projectKeys.map(key => t.projects.items[key]).filter(Boolean)
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
        <div class="filter-icon-label" aria-hidden="true" title="Filter projects">
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

                    <!-- project.url is always an absolute external URL, never an app route.
                         resolve() must not be used here: it strips the leading character
                         and collapses "//", turning https://… into /CV/ttps:/… -->
                    <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                    <a href={project.url}
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
