import type { Language } from "$lib/controllers/I18nState.svelte";
import FlagUK from "$lib/components/flags/FlagUK.svelte";
import FlagBE from "$lib/components/flags/FlagBE.svelte";
import FlagEN from "$lib/components/flags/FlagEN.svelte";
import FlagES from "$lib/components/flags/FlagES.svelte";
import FlagFR from "$lib/components/flags/FlagFR.svelte";
import FlagPT from "$lib/components/flags/FlagPT.svelte";
import FlagIT from "$lib/components/flags/FlagIT.svelte";
import FlagDE from "$lib/components/flags/FlagDE.svelte";
import FlagNL from "$lib/components/flags/FlagNL.svelte";
import FlagJA from "$lib/components/flags/FlagJA.svelte";

// Fixed display order for language groups. New locales only need to pick one
// of these — the switcher renders whichever groups end up non-empty, in this
// order, so the list stays organized as more languages are added.
export const LANGUAGE_GROUP_ORDER = [
    "slavic",
    "romance",
    "germanic",
    "celtic_nordic",
    "baltic",
    "caucasus_crimea",
    "east_asian",
    "micronesian"
] as const;

export type LanguageGroup = (typeof LANGUAGE_GROUP_ORDER)[number];

export const LANGUAGE_GROUP_LABELS: Record<LanguageGroup, string> = {
    slavic: "Slavic",
    romance: "Romance",
    germanic: "Germanic",
    celtic_nordic: "Celtic & Nordic",
    baltic: "Baltic",
    caucasus_crimea: "Caucasus & Crimea",
    east_asian: "East Asian",
    micronesian: "Micronesian"
};

export const LANGUAGE_META = [
    { code: "uk" as Language, label: "Українська", flag: FlagUK, group: "slavic" as LanguageGroup },
    { code: "be" as Language, label: "Беларуская", flag: FlagBE, group: "slavic" as LanguageGroup },
    { code: "es" as Language, label: "Español", flag: FlagES, group: "romance" as LanguageGroup },
    { code: "fr" as Language, label: "Français", flag: FlagFR, group: "romance" as LanguageGroup },
    { code: "pt" as Language, label: "Português", flag: FlagPT, group: "romance" as LanguageGroup },
    { code: "it" as Language, label: "Italiano", flag: FlagIT, group: "romance" as LanguageGroup },
    { code: "en" as Language, label: "English", flag: FlagEN, group: "germanic" as LanguageGroup },
    { code: "de" as Language, label: "Deutsch", flag: FlagDE, group: "germanic" as LanguageGroup },
    { code: "nl" as Language, label: "Nederlands", flag: FlagNL, group: "germanic" as LanguageGroup },
    { code: "ja" as Language, label: "日本語", flag: FlagJA, group: "east_asian" as LanguageGroup }
];
