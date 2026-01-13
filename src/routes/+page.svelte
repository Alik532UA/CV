<script lang="ts">
    import { language, translations } from "$lib/i18n";
    import { base } from "$app/paths";
    import { slide } from "svelte/transition";
    import {
        MapPin,
        Linkedin,
        Send,
        Mail,
        FileText,
        ChevronDown,
        Shield,
        Search,
        Zap,
        Globe,
        Coffee,
        Monitor,
        Smartphone,
        Drama,
        Palette,
        Printer,
        Box,
        Gamepad2,
        Film,
        Brush,
        Mic,
        Sparkles,
        BarChart,
        Folder,
        Flame,
        Lightbulb,
        Award,
        Trophy,
        Car,
        Languages,
        Puzzle,
        Bot,
        Skull,
        ExternalLink,
    } from "lucide-svelte";
    import FlagUK from "$lib/components/flags/FlagUK.svelte";
    import FlagEN from "$lib/components/flags/FlagEN.svelte";
    $: t = translations[$language];

    let showNonIT = false;
    let showMoreSkills = false;

    const skillsData = {
        it: [
            { name: "AI", level: 95, icon: Bot },
            { name: "C#", level: 85, icon: Zap },
            { name: "Java", level: 75, icon: Coffee },
            { name: "Playwright", level: 80, icon: Drama },
        ],
        design3d: [
            { name: "Blender", level: 60, icon: Palette },
            { name: "Cura / Creality Slicer", level: 85, icon: Printer },
            { name: "3D Printing", level: 90, icon: Box },
            { name: "Godot (GDScript)", level: 75, icon: Gamepad2 },
        ],
        video: [
            { name: "Premiere Pro", level: 95, icon: Film },
            { name: "Photoshop", level: 85, icon: Brush },
            { name: "Topaz AI", level: 80, icon: Sparkles },
            { name: "vMix", level: 85, icon: Mic },
        ],
        tools: [
            { name: "Jira / Confluence", level: 95, icon: BarChart },
            { name: "Git", level: 85, icon: Folder },
            { name: "Figma", level: 80, icon: Palette },
            { name: "Firebase", level: 65, icon: Flame },
        ],
    };
</script>

<div class="container">
    <!-- ABOUT SECTION -->
    <section id="about" class="about-section">
        <div class="intro-header">
            <h1 class="glow-text">{t.hero.greeting}</h1>
            <p class="tagline">{t.title}</p>
        </div>

        <div class="about-grid">
            <div class="about-main">
                <div class="bio glass card">
                    <p class="location">
                        <MapPin size={18} class="inline-icon" />
                        {t.about.location}
                    </p>
                    <p class="bio-text">{t.about.content}</p>

                    <div class="contacts-grid">
                        <a
                            href="https://linkedin.com/in/alik-qa-engineer"
                            target="_blank"
                            class="btn-secondary"
                        >
                            <span><Linkedin size={18} /></span> LinkedIn
                        </a>
                        <a
                            href="https://t.me/alik532"
                            target="_blank"
                            class="btn-secondary"
                        >
                            <span><Send size={18} /></span> Telegram
                        </a>
                        <a
                            href="mailto:alikzapolnov@gmail.com"
                            class="btn-secondary"
                        >
                            <span><Mail size={18} /></span> Email
                        </a>
                        <a
                            href="https://drive.google.com/file/d/1MWV2jhOfzBvdU2Pv0pK2uYVd3FlZ2bDP/view?usp=sharing"
                            target="_blank"
                            class="btn-secondary nowrap-btn"
                        >
                            <span><FileText size={18} /></span> PDF version
                        </a>
                    </div>
                </div>
            </div>

            <div class="about-side">
                <div class="profile-card glass card">
                    <img
                        src="{base}/images/profile.jpg"
                        alt="Profile"
                        class="profile-img"
                    />
                </div>
            </div>
        </div>
    </section>

    <!-- EXPERIENCE SECTION -->
    <section id="experience">
        <h2 class="section-title">{t.experience.title}</h2>
        <div class="timeline">
            {#each t.experience.it as exp}
                <div class="exp-card glass card">
                    <span class="date">{exp.date}</span>
                    <h3>{exp.company}</h3>
                    <p class="role">{exp.role}</p>
                    <p class="desc">{exp.desc}</p>
                </div>
            {/each}

            <button
                class="btn-toggle-exp"
                on:click={() => (showNonIT = !showNonIT)}
            >
                {showNonIT ? t.experience.hideNonIT : t.experience.showNonIT}
                <ChevronDown size={18} class={showNonIT ? "rotated" : ""} />
            </button>

            {#if showNonIT}
                <div class="non-it-list" transition:slide>
                    {#each t.experience.nonIT as exp}
                        <div class="exp-card glass card non-it">
                            <span class="date">{exp.date}</span>
                            <h3>{exp.company}</h3>
                            <p class="role">{exp.role}</p>
                            <p class="desc">{exp.desc}</p>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>
    </section>

    <!-- SKILLS SECTION -->
    <section id="skills">
        <h2 class="section-title">{t.skills.title}</h2>

        <div class="platforms-grid">
            <div class="platform-item glass card">
                <div class="platform-icon"><Monitor size={24} /></div>
                <div class="platform-text">
                    <strong>Desktop app</strong>
                    <span>{t.skills.platforms.desktop.split(": ")[1]}</span>
                </div>
            </div>
            <div class="platform-item glass card">
                <div class="platform-icon"><Globe size={24} /></div>
                <div class="platform-text">
                    <strong>Web</strong>
                    <span>{t.skills.platforms.web.split(": ")[1]}</span>
                </div>
            </div>
            <div class="platform-item glass card">
                <div class="platform-icon"><Smartphone size={24} /></div>
                <div class="platform-text">
                    <strong>Mobile app</strong>
                    <span>{t.skills.platforms.mobile.split(": ")[1]}</span>
                </div>
            </div>
        </div>

        <div class="skills-categories">
            <div class="skill-group glass card">
                <h3>{t.skills.categories.it}</h3>
                <div class="skills-grid">
                    {#each skillsData.it as skill}
                        <div class="skill-item">
                            <div class="skill-info">
                                <span
                                    ><svelte:component
                                        this={skill.icon}
                                        size={16}
                                    />
                                    {skill.name}</span
                                >
                            </div>
                            <div class="progress-bar">
                                <div
                                    class="fill"
                                    style="width: {skill.level}%"
                                ></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            {#if showMoreSkills}
                <div class="extra-skills" transition:slide>
                    <div class="skills-categories-sub">
                        <div class="skill-group glass card">
                            <h3>{t.skills.categories.design3d}</h3>
                            <div class="skills-grid">
                                {#each skillsData.design3d as skill}
                                    <div class="skill-item">
                                        <div class="skill-head">
                                            <span
                                                ><svelte:component
                                                    this={skill.icon}
                                                    size={16}
                                                />
                                                {skill.name}</span
                                            >
                                        </div>
                                        <div class="progress-bar">
                                            <div
                                                class="fill"
                                                style="width: {skill.level}%"
                                            ></div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <div class="skill-group glass card">
                            <h3>{t.skills.categories.video}</h3>
                            <div class="skills-grid">
                                {#each skillsData.video as skill}
                                    <div class="skill-item">
                                        <div class="skill-head">
                                            <span
                                                ><svelte:component
                                                    this={skill.icon}
                                                    size={16}
                                                />
                                                {skill.name}</span
                                            >
                                        </div>
                                        <div class="progress-bar">
                                            <div
                                                class="fill"
                                                style="width: {skill.level}%"
                                            ></div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>

                        <div class="skill-group glass card">
                            <h3>{t.skills.categories.tools}</h3>
                            <div class="skills-grid">
                                {#each skillsData.tools as skill}
                                    <div class="skill-item">
                                        <div class="skill-head">
                                            <span
                                                ><svelte:component
                                                    this={skill.icon}
                                                    size={16}
                                                />
                                                {skill.name}</span
                                            >
                                        </div>
                                        <div class="progress-bar">
                                            <div
                                                class="fill"
                                                style="width: {skill.level}%"
                                            ></div>
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            <button
                class="btn-toggle-exp"
                on:click={() => (showMoreSkills = !showMoreSkills)}
            >
                {showMoreSkills ? t.skills.hideMore : t.skills.showMore}
                <ChevronDown
                    size={18}
                    class={showMoreSkills ? "rotated" : ""}
                />
            </button>
        </div>
    </section>

    <!-- PROJECTS SECTION -->
    <section id="projects">
        <h2 class="section-title">{t.nav.projects}</h2>
        <div class="projects-grid">
            <div class="project-card glass card">
                <div class="project-img">
                    <img src="{base}/images/mindstep.jpg" alt="MindStep" />
                </div>
                <div class="project-content">
                    <h3>{t.projects.mindstep.title}</h3>
                    <p>{t.projects.mindstep.description}</p>
                    <a
                        href="https://alik532ua.github.io/MindStep/"
                        target="_blank"
                        class="btn-primary project-btn"
                    >
                        Try Game <ExternalLink size={16} />
                    </a>
                </div>
            </div>

            <div class="project-card glass card">
                <div class="project-img">
                    <img src="{base}/images/cv_3d.jpg" alt="3D CV" />
                </div>
                <div class="project-content">
                    <h3>{t.projects.cv3d.title}</h3>
                    <p>{t.projects.cv3d.description}</p>
                    <a
                        href="https://alik532ua.itch.io/alik-cv-interactive-3d-experience"
                        target="_blank"
                        class="btn-primary project-btn"
                    >
                        Explore 3D <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- EDUCATION SECTION -->
    <section id="education">
        <h2 class="section-title">{t.education.title}</h2>
        <div class="education-grid">
            {#each t.education.items as edu}
                <div class="edu-card glass card">
                    <h3>{edu.institution}</h3>
                    <span class="date">{edu.date}</span>
                    <p>{edu.desc}</p>
                </div>
            {/each}
        </div>
    </section>

    <!-- ADDITIONAL SECTION -->
    <section id="other">
        <h2 class="section-title">{t.other.title}</h2>
        <div class="other-grid">
            <div class="success-card glass card">
                <h3><Trophy size={20} class="inline-icon" /> Highlights</h3>
                <ul>
                    <li>
                        <strong
                            ><Lightbulb size={16} class="inline-icon" /> IQ:</strong
                        >
                        {t.other.iq}
                    </li>
                    <li>
                        <strong
                            ><Award size={16} class="inline-icon" /> Olympics:</strong
                        >
                        {t.other.olympics}
                    </li>
                    <li>
                        <strong
                            ><Car size={16} class="inline-icon" /> Drive:</strong
                        >
                        {t.other.driver}
                    </li>
                </ul>
            </div>

            <div class="success-card glass card">
                <h3>
                    <Languages size={20} class="inline-icon" />
                    {t.other.languages.title}
                </h3>
                <ul>
                    <li>
                        <FlagUK width="16" height="12" class="inline-icon" />
                        {t.other.languages.uk}
                    </li>
                    <li>
                        <FlagEN width="16" height="12" class="inline-icon" />
                        {t.other.languages.en}
                    </li>
                    <li>
                        <Skull size={16} class="inline-icon" />
                        {t.other.languages.ru}
                    </li>
                </ul>
            </div>

            <div class="hobbies-card glass card">
                <h3>
                    <Puzzle size={20} class="inline-icon" />
                    {t.about.hobbiesTitle}
                </h3>
                <div class="hobbies-tags">
                    {#each t.other.hobbies as hobby}
                        <span class="hobby-tag glass">{hobby}</span>
                    {/each}
                </div>
            </div>
        </div>
    </section>
</div>

<style>
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }

    section {
        padding: 60px 0;
    }

    /* About Section Styles */
    .intro-header {
        text-align: center;
        margin-bottom: 50px;
        padding: 40px 0;
    }

    h1 {
        font-size: 5rem;
        margin-bottom: 10px;
        line-height: 1.1;
    }

    .about-grid {
        display: grid;
        grid-template-columns: 1fr 300px;
        gap: 30px;
        align-items: start;
    }

    .tagline {
        font-size: 1.1rem;
        color: var(--text-secondary);
        margin-bottom: 25px;
        letter-spacing: 2px;
        text-transform: uppercase;
    }

    .location {
        color: var(--accent-primary);
        font-weight: 600;
        margin-bottom: 15px;
    }

    .bio-text {
        font-size: 1.1rem;
        line-height: 1.7;
        margin-bottom: 30px;
    }

    .contacts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 12px;
    }

    .nowrap-btn {
        white-space: nowrap;
        font-size: 0.95rem;
    }

    .profile-card {
        padding: 10px;
        border-radius: 30px;
    }

    .profile-img {
        width: 100%;
        border-radius: 20px;
        display: block;
    }

    /* Platforms Grid */
    .platforms-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 20px;
        margin-bottom: 40px;
    }

    .platform-item {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        transition: transform 0.3s ease;
    }

    .platform-item:hover {
        transform: translateY(-5px);
        border-color: var(--accent-primary);
    }

    .platform-icon {
        color: var(--accent-primary);
        background: rgba(var(--accent-primary-rgb), 0.1);
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
    }

    .platform-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .platform-text strong {
        color: var(--accent-primary);
        font-size: 1.1rem;
    }

    .platform-text span {
        color: var(--text-secondary);
        font-size: 0.9rem;
    }

    /* Experience & Education */
    .timeline,
    .education-grid {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .exp-card,
    .edu-card {
        padding: 25px;
    }

    .date {
        color: var(--accent-primary);
        font-weight: 700;
        font-size: 0.9rem;
        display: block;
        margin-bottom: 5px;
    }

    .role {
        color: var(--text-secondary);
        font-weight: 600;
        margin-bottom: 10px;
    }

    .btn-toggle-exp {
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        color: var(--text-primary);
        padding: 14px;
        border-radius: 12px;
        cursor: pointer;
        font-family: inherit;
        font-weight: 600;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        transition: var(--transition);
        width: 100%;
        margin-top: 20px;
    }

    .btn-toggle-exp:hover {
        border-color: var(--accent-primary);
    }

    .btn-toggle-exp :global(svg) {
        transition: transform 0.3s ease;
    }

    .btn-toggle-exp :global(svg.rotated) {
        transform: rotate(180deg);
    }

    /* Skills */
    .skills-categories {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .skills-categories-sub {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
    }

    .skill-group h3 {
        margin-bottom: 20px;
        color: var(--accent-primary);
        border-bottom: 1px solid var(--border-color);
        padding-bottom: 10px;
    }

    .skills-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .progress-bar {
        height: 8px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        overflow: hidden;
    }

    .fill {
        height: 100%;
        background: var(--gradient);
        border-radius: 4px;
        box-shadow: 0 0 10px rgba(0, 242, 255, 0.3);
    }

    /* Projects */
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

    /* Additional Section */
    .other-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 20px;
    }

    .hobbies-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 15px;
    }

    .hobby-tag {
        padding: 6px 14px;
        border-radius: 15px;
        font-size: 0.85rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--border-color);
    }

    ul {
        list-style: none;
        margin-top: 15px;
    }

    ul li {
        margin-bottom: 10px;
    }

    @media (max-width: 1024px) {
        .container {
            width: 99%;
            margin: 0 auto;
        }

        .intro-header {
            padding: 20px 0;
        }

        h1 {
            font-size: 3.5rem;
            text-align: center;
        }

        .about-grid,
        .platforms-grid {
            grid-template-columns: 1fr;
            display: flex;
            flex-direction: column;
        }

        .about-side {
            display: block;
            order: -1;
            width: 200px;
            margin: 0 auto 20px;
        }

        .tagline {
            text-align: center;
        }
    }

    @media (max-width: 768px) {
        h1 {
            font-size: 2.8rem;
        }

        .skills-categories-sub {
            grid-template-columns: 1fr;
        }
    }
</style>
