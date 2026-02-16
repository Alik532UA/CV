<script lang="ts">
    import { ExternalLink } from "lucide-svelte";
    import { base } from "$app/paths";
    import Section from "../ui/Section.svelte";
    import { t } from "$lib/i18n/index.svelte";
</script>

<Section id="projects" title={t.nav.projects}>
    <div class="projects-grid">
        <div class="project-card glass card">
            <div class="project-img">
                <img src="{base}/images/slovko.jpg" alt="Slovko" loading="lazy" decoding="async" />
            </div>
            <div class="project-content">
                <h3>{t.projects.slovko.title}</h3>
                <p>{t.projects.slovko.description}</p>
                <a
                    href="https://alik532ua.github.io/Slovko/"
                    target="_blank"
                    class="btn-primary project-btn"
                >
                    {t.projects.slovko.button}
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>

        <div class="project-card glass card">
            <div class="project-img">
                <img src="{base}/images/mindstep.jpg" alt="MindStep" loading="lazy" decoding="async" />
            </div>
            <div class="project-content">
                <h3>{t.projects.mindstep.title}</h3>
                <p>{t.projects.mindstep.description}</p>
                <a
                    href="https://alik532ua.github.io/MindStep/"
                    target="_blank"
                    class="btn-primary project-btn"
                >
                    {t.projects.mindstep.button}
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>

        <div class="project-card glass card">
            <div class="project-img">
                <img src="{base}/images/cv_3d.jpg" alt="3D CV" loading="lazy" decoding="async" />
            </div>
            <div class="project-content">
                <h3>{t.projects.cv3d.title}</h3>
                <p>{t.projects.cv3d.description}</p>
                <a
                    href="https://alik532ua.itch.io/alik-cv-interactive-3d-experience"
                    target="_blank"
                    class="btn-primary project-btn"
                >
                    {t.projects.cv3d.button}
                    <ExternalLink size={16} />
                </a>
            </div>
        </div>
    </div>
</Section>

<style>
    .projects-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
    }

    .project-img {
        height: 220px;
        overflow: hidden;
    }

    .project-img img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .project-content {
        padding: 25px;
        display: flex;
        flex-direction: column;
        gap: 12px;
    }

    .project-btn {
        margin-top: auto;
        justify-content: center;
        font-size: 0.95rem;
    }
</style>
