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
    }
};
