<script lang="ts">
    import {
        Monitor,
        Globe,
        Smartphone,
        ChevronDown,
        Bot,
        Zap,
        Coffee,
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
    } from "lucide-svelte";
    import { slide } from "svelte/transition";

    let { t } = $props<{ t: any }>();
    let showMoreSkills = $state(false);

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
                            <span>
                                <skill.icon size={16} />
                                {skill.name}
                            </span>
                        </div>
                        <div class="progress-bar">
                            <div class="fill" style="width: {skill.level}%"></div>
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
                                        <span>
                                            <skill.icon size={16} />
                                            {skill.name}
                                        </span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="fill" style="width: {skill.level}%"></div>
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
                                        <span>
                                            <skill.icon size={16} />
                                            {skill.name}
                                        </span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="fill" style="width: {skill.level}%"></div>
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
                                        <span>
                                            <skill.icon size={16} />
                                            {skill.name}
                                        </span>
                                    </div>
                                    <div class="progress-bar">
                                        <div class="fill" style="width: {skill.level}%"></div>
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
            onclick={() => (showMoreSkills = !showMoreSkills)}
            aria-expanded={showMoreSkills}
            aria-controls="extra-skills-content"
        >
            {showMoreSkills ? t.skills.hideMore : t.skills.showMore}
            <ChevronDown size={18} class={showMoreSkills ? "rotated" : ""} />
        </button>
    </div>
</section>

<style>
    section {
        padding: 60px 0;
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
        flex-shrink: 0;
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

    .skill-info,
    .skill-head {
        margin-bottom: 6px;
    }

    .skill-info span,
    .skill-head span {
        display: flex;
        align-items: center;
        gap: 10px;
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

    :global(.btn-toggle-exp svg) {
        transition: transform 0.3s ease;
    }

    :global(.btn-toggle-exp svg.rotated) {
        transform: rotate(180deg);
    }

    @media (max-width: 1024px) {
        .platforms-grid {
            grid-template-columns: 1fr;
            display: flex;
            flex-direction: column;
        }
    }

    @media (max-width: 768px) {
        .skills-categories-sub {
            grid-template-columns: 1fr;
        }
    }
</style>
