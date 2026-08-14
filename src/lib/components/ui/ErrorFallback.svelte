<script lang="ts">
    import type { HTMLAttributes } from "svelte/elements";
    import { t } from "$lib/controllers/I18nState.svelte";

    /**
     * What a `<svelte:boundary>` shows when one section of the page throws.
     *
     * The section is named by its nav key rather than by a ready-made string:
     * the five call sites used to pass "Досвід", "Навички", "Проєкти" and so on
     * — Ukrainian literals on a site that renders in 42 languages, so a German
     * visitor whose Experience section failed was told about it in Ukrainian.
     * The keys resolve through `t.nav`, which already holds exactly these five
     * names in every locale; no new dictionary entries were needed.
     */
    type SectionKey = keyof typeof t.nav;

    interface Props extends HTMLAttributes<HTMLDivElement> {
        section: SectionKey;
    }

    let { section, ...restProps }: Props = $props();
</script>

<!-- role="alert": this replaces content that was expected to be there, and a
     screen-reader user gets no other signal that it went missing. -->
<div class="error-fallback" role="alert" {...restProps}>
    <h3>{t.nav[section]} — {t.errorPage.genericTitle}</h3>
    <p>{t.errorPage.genericText}</p>
</div>

<style>
    .error-fallback {
        padding: 20px;
        background-color: var(--error-bg);
        color: var(--error-text);
        border-radius: 8px;
        margin-bottom: 20px;
        text-align: center;
        border: 1px solid var(--error-border);
    }

    .error-fallback h3 {
        color: var(--error-text);
        margin-bottom: 10px;
    }
</style>
