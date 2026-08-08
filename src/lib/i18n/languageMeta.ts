import type { Language } from "$lib/controllers/I18nState.svelte";
import FlagUK from "$lib/components/flags/FlagUK.svelte";
import FlagBE from "$lib/components/flags/FlagBE.svelte";
import FlagPL from "$lib/components/flags/FlagPL.svelte";
import FlagCS from "$lib/components/flags/FlagCS.svelte";
import FlagSK from "$lib/components/flags/FlagSK.svelte";
import FlagBG from "$lib/components/flags/FlagBG.svelte";
import FlagHR from "$lib/components/flags/FlagHR.svelte";
import FlagSL from "$lib/components/flags/FlagSL.svelte";
import FlagMK from "$lib/components/flags/FlagMK.svelte";
import FlagES from "$lib/components/flags/FlagES.svelte";
import FlagCA from "$lib/components/flags/FlagCA.svelte";
import FlagFR from "$lib/components/flags/FlagFR.svelte";
import FlagPT from "$lib/components/flags/FlagPT.svelte";
import FlagIT from "$lib/components/flags/FlagIT.svelte";
import FlagRO from "$lib/components/flags/FlagRO.svelte";
import FlagEN from "$lib/components/flags/FlagEN.svelte";
import FlagDE from "$lib/components/flags/FlagDE.svelte";
import FlagNL from "$lib/components/flags/FlagNL.svelte";
import FlagSV from "$lib/components/flags/FlagSV.svelte";
import FlagNO from "$lib/components/flags/FlagNO.svelte";
import FlagDA from "$lib/components/flags/FlagDA.svelte";
import FlagIS from "$lib/components/flags/FlagIS.svelte";
import FlagJA from "$lib/components/flags/FlagJA.svelte";
import FlagKO from "$lib/components/flags/FlagKO.svelte";
import FlagFI from "$lib/components/flags/FlagFI.svelte";
import FlagEL from "$lib/components/flags/FlagEL.svelte";
import FlagSQ from "$lib/components/flags/FlagSQ.svelte";
import FlagGA from "$lib/components/flags/FlagGA.svelte";
import FlagCY from "$lib/components/flags/FlagCY.svelte";
import FlagET from "$lib/components/flags/FlagET.svelte";
import FlagLV from "$lib/components/flags/FlagLV.svelte";
import FlagLT from "$lib/components/flags/FlagLT.svelte";
import FlagCRH from "$lib/components/flags/FlagCRH.svelte";
import FlagTR from "$lib/components/flags/FlagTR.svelte";
import FlagKA from "$lib/components/flags/FlagKA.svelte";
import FlagHE from "$lib/components/flags/FlagHE.svelte";
import FlagMT from "$lib/components/flags/FlagMT.svelte";
import FlagCHK from "$lib/components/flags/FlagCHK.svelte";
import FlagPON from "$lib/components/flags/FlagPON.svelte";
import FlagKOS from "$lib/components/flags/FlagKOS.svelte";
import FlagYAP from "$lib/components/flags/FlagYAP.svelte";

// Fixed display order for language groups. New locales only need to pick one
// of these — the switcher renders whichever groups end up non-empty, in this
// order, so the list stays organized as more languages are added. Grouped by
// language family/branch, not strict geography (e.g. Swedish/Norwegian/
// Danish/Icelandic are North Germanic, so they live in "germanic" alongside
// English, German and Dutch, not in a separate "Nordic" bucket).
export const LANGUAGE_GROUP_ORDER = [
    "slavic",
    "romance",
    "germanic",
    "celtic",
    "baltic",
    "uralic",
    "balkan",
    "turkic",
    "caucasus",
    "east_asian",
    "semitic",
    "micronesian"
] as const;

export type LanguageGroup = (typeof LANGUAGE_GROUP_ORDER)[number];

export const LANGUAGE_GROUP_LABELS: Record<LanguageGroup, string> = {
    slavic: "Slavic",
    romance: "Romance",
    germanic: "Germanic & Nordic",
    celtic: "Celtic",
    baltic: "Baltic",
    uralic: "Uralic",
    balkan: "Balkan",
    turkic: "Turkic",
    caucasus: "Caucasus",
    east_asian: "East Asian",
    semitic: "Semitic",
    micronesian: "Micronesian"
};

export const LANGUAGE_META = [
    // Slavic
    { code: "uk" as Language, label: "Українська", flag: FlagUK, group: "slavic" as LanguageGroup },
    { code: "be" as Language, label: "Беларуская", flag: FlagBE, group: "slavic" as LanguageGroup },
    { code: "pl" as Language, label: "Polski", flag: FlagPL, group: "slavic" as LanguageGroup },
    { code: "cs" as Language, label: "Čeština", flag: FlagCS, group: "slavic" as LanguageGroup },
    { code: "sk" as Language, label: "Slovenčina", flag: FlagSK, group: "slavic" as LanguageGroup },
    { code: "bg" as Language, label: "Български", flag: FlagBG, group: "slavic" as LanguageGroup },
    { code: "hr" as Language, label: "Hrvatski", flag: FlagHR, group: "slavic" as LanguageGroup },
    { code: "sl" as Language, label: "Slovenščina", flag: FlagSL, group: "slavic" as LanguageGroup },
    { code: "mk" as Language, label: "Македонски", flag: FlagMK, group: "slavic" as LanguageGroup },
    // Romance
    { code: "es" as Language, label: "Español", flag: FlagES, group: "romance" as LanguageGroup },
    { code: "ca" as Language, label: "Català", flag: FlagCA, group: "romance" as LanguageGroup },
    { code: "fr" as Language, label: "Français", flag: FlagFR, group: "romance" as LanguageGroup },
    { code: "pt" as Language, label: "Português", flag: FlagPT, group: "romance" as LanguageGroup },
    { code: "it" as Language, label: "Italiano", flag: FlagIT, group: "romance" as LanguageGroup },
    { code: "ro" as Language, label: "Română", flag: FlagRO, group: "romance" as LanguageGroup },
    // Germanic & Nordic
    { code: "en" as Language, label: "English", flag: FlagEN, group: "germanic" as LanguageGroup },
    { code: "de" as Language, label: "Deutsch", flag: FlagDE, group: "germanic" as LanguageGroup },
    { code: "nl" as Language, label: "Nederlands", flag: FlagNL, group: "germanic" as LanguageGroup },
    { code: "sv" as Language, label: "Svenska", flag: FlagSV, group: "germanic" as LanguageGroup },
    { code: "no" as Language, label: "Norsk", flag: FlagNO, group: "germanic" as LanguageGroup },
    { code: "da" as Language, label: "Dansk", flag: FlagDA, group: "germanic" as LanguageGroup },
    { code: "is" as Language, label: "Íslenska", flag: FlagIS, group: "germanic" as LanguageGroup },
    // Celtic
    { code: "ga" as Language, label: "Gaeilge", flag: FlagGA, group: "celtic" as LanguageGroup },
    { code: "cy" as Language, label: "Cymraeg", flag: FlagCY, group: "celtic" as LanguageGroup },
    // Baltic
    { code: "et" as Language, label: "Eesti", flag: FlagET, group: "baltic" as LanguageGroup },
    { code: "lv" as Language, label: "Latviešu", flag: FlagLV, group: "baltic" as LanguageGroup },
    { code: "lt" as Language, label: "Lietuvių", flag: FlagLT, group: "baltic" as LanguageGroup },
    // Uralic
    { code: "fi" as Language, label: "Suomi", flag: FlagFI, group: "uralic" as LanguageGroup },
    // Balkan
    { code: "el" as Language, label: "Ελληνικά", flag: FlagEL, group: "balkan" as LanguageGroup },
    { code: "sq" as Language, label: "Shqip", flag: FlagSQ, group: "balkan" as LanguageGroup },
    // Turkic
    { code: "crh" as Language, label: "Qırımtatarca", flag: FlagCRH, group: "turkic" as LanguageGroup },
    { code: "tr" as Language, label: "Türkçe", flag: FlagTR, group: "turkic" as LanguageGroup },
    // Caucasus
    { code: "ka" as Language, label: "ქართული", flag: FlagKA, group: "caucasus" as LanguageGroup },
    // East Asian
    { code: "ja" as Language, label: "日本語", flag: FlagJA, group: "east_asian" as LanguageGroup },
    { code: "ko" as Language, label: "한국어", flag: FlagKO, group: "east_asian" as LanguageGroup },
    // Semitic
    { code: "he" as Language, label: "עברית", flag: FlagHE, group: "semitic" as LanguageGroup },
    { code: "mt" as Language, label: "Malti", flag: FlagMT, group: "semitic" as LanguageGroup },
    // Micronesian (best-effort machine translation — needs native review)
    { code: "chk" as Language, label: "Chuuk *", flag: FlagCHK, group: "micronesian" as LanguageGroup },
    { code: "pon" as Language, label: "Pohnpei *", flag: FlagPON, group: "micronesian" as LanguageGroup },
    { code: "kos" as Language, label: "Kosrae *", flag: FlagKOS, group: "micronesian" as LanguageGroup },
    { code: "yap" as Language, label: "Yap *", flag: FlagYAP, group: "micronesian" as LanguageGroup }
];
