<script lang="ts">
    import { Trophy, Lightbulb, Award, Car, Languages, Puzzle, Star } from "lucide-svelte";
    import FlagUK from "$lib/components/flags/FlagUK.svelte";
    import FlagEN from "$lib/components/flags/FlagEN.svelte";
    import FlagRVC from "$lib/components/flags/FlagRVC.svelte";
    import Section from "../ui/Section.svelte";
    import { t } from "$lib/controllers/I18nState.svelte";
</script>

<Section id="other" title={t.other.title}>
    {#snippet icon()}
        <Star size={22} />
    {/snippet}

    <div class="other-grid">
        <div class="success-card glass card">
            <h3><Trophy size={20} class="inline-icon" /> Highlights</h3>
            <ul>
                <li>
                    <strong><Lightbulb size={16} class="inline-icon" /> IQ:</strong>
                    {t.other.iq}
                </li>
                <li>
                    <strong><Award size={16} class="inline-icon" /> Olympics:</strong>
                    {t.other.olympics}
                </li>
                <li>
                    <strong><Car size={16} class="inline-icon" /> Drive:</strong>
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
                    <FlagUK width="16" height="12" class="inline-icon flag-icon" />
                    {t.other.languages.uk}
                </li>
                <li>
                    <FlagEN width="16" height="12" class="inline-icon flag-icon" />
                    {t.other.languages.en}
                </li>
                <li>
                    <FlagRVC width="16" height="12" class="inline-icon flag-icon" />
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
                {#each t.other.hobbies as hobby (hobby)}
                    <span class="hobby-tag glass">{hobby}</span>
                {/each}
            </div>
        </div>
    </div>
</Section>

<style>
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
        background: var(--surface-subtle);
        border: 1px solid var(--border-color);
    }

    ul {
        list-style: none;
        margin-top: 15px;
    }

    ul li {
        margin-bottom: 10px;
    }

    :global(.flag-icon) {
        border-radius: 2px;
        overflow: hidden;
        display: inline-block;
        vertical-align: middle;
    }
</style>
