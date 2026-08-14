import type { Translations } from "../../controllers/I18nState.svelte";
import { en } from "./en";

/**
 * American English, built from `en` (British) instead of copied.
 *
 * Out of a whole CV the two varieties differ in about a dozen words. A
 * standalone 250-line copy would drift the moment the English text changes, and
 * nobody would notice which of the two had gone stale — so everything not
 * listed below is shared verbatim, and this file doubles as the record of what
 * actually differs:
 *
 * - spelling: theatre → theater, optimisation → optimization,
 *   specialised → specialized, licence → license
 * - wording: CV → resume (a US reader expects the word), driving licence →
 *   driver's license
 * - the date reads month-first
 *
 * Words that look like candidates but are the same in both: "theatrical",
 * "programming" (a console, not a broadcast), "analysis", "Odesa".
 */
export const enUS: Translations = {
    ...en,
    lastUpdate: "Last update: August 8, 2026",
    hero: {
        ...en.hero,
        downloadCV: "Download Resume"
    },
    experience: {
        ...en.experience,
        companies: {
            ...en.experience.companies,
            theater_company: "Theater School"
        },
        descriptions: {
            ...en.experience.descriptions,
            singree_desc: "Search engine optimization and analysis."
        }
    },
    education: {
        ...en.education,
        institutions: {
            ...en.education.institutions,
            theater_school_name: "Children's Theater School"
        },
        descriptions: {
            ...en.education.descriptions,
            theater_school_desc: "Theater Department (2006-2012) // Music Department (2009-2013)"
        }
    },
    skills: {
        ...en.skills,
        showMore: "Show Specialized Skills",
        hideMore: "Hide Specialized Skills"
    },
    other: {
        ...en.other,
        driver: "Driver's License (since 2015)"
    },
    projects: {
        ...en.projects,
        items: {
            ...en.projects.items,
            cv3d: {
                ...en.projects.items.cv3d,
                description: "Interactive 3D resume game built from scratch on Godot 4. Explore the world, interact with objects, and discover easter eggs!"
            },
            teatralo4ka: {
                ...en.projects.items.teatralo4ka,
                description: "Official website and admin portal for Odesa Theater School featuring interactive widgets, dark ocean theme, and photo galleries."
            }
        }
    },
    errorPage: {
        notFoundTitle: "Page not found",
        notFoundText: "There is no such address here. The language code in the link may be misspelled.",
        genericTitle: "Something went wrong",
        genericText: "The page could not be displayed. Reloading usually helps.",
        backHome: "Back to the resume"
    },
    ai: {
        subtitle: "Paste a job ad or a link to one — the AI will compare it with Alik's experience.",
        jobPlaceholder: "Job description, or a link to it...",
        analyze: "Analyze the job ad",
        analyzing: "Analyzing...",
        newAnalysis: "New analysis",
        newAnalysisHint: "Analyze another job ad",
        rawTitle: "AI answer",
        rawNote: "The model gave no structured score — showing its text unchanged.",
        summaryTitle: "AI verdict",
        matchLabel: "Match",
        strengths: "Strengths",
        gaps: "Gaps and questions",
        followUpTitle: "Ask a follow-up about Alik's experience:",
        chatPlaceholder: "Your question about Alik's experience...",
        thinking: "The AI is thinking...",
        modelTitle: "AI model",
        modelAuto: "Auto — best available",
        bannerSub: "Check how a job ad matches this candidate",
        open: "Open AI Job Matcher",
        statusNoKey: "no key",
        statusCooldown: "limit ~{minutes} min",
        statusAnswered: "answered",
        statusReady: "ready",
        tooltipAnswered: "{model} ({provider}) answered. Click to choose another.",
        tooltipWillTry: "{model} ({provider}) will be tried first. Click to choose another.",
        pinHint: "The chosen model is tried first. If it runs out of quota, the request moves down the list automatically.",
        emptyAnswer: "The model returned an empty answer. Try again, or pick another model from the badge above."
    }
};
