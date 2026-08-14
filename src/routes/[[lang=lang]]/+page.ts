import { error } from "@sveltejs/kit";
import { experienceData } from "$lib/data/experience";
import { skillsData } from "$lib/data/skills";
import { SUPPORTED_LANGUAGES, isLanguage } from "$lib/controllers/I18nState.svelte";
import { DEFAULT_LANGUAGE } from "$lib/i18n/routing";
import type { PageLoad } from "./$types";

/**
 * One prerendered page per language, plus the bare path for the default.
 * Without this the crawler would only ever find the bare path, and every other
 * language would fall back to the SPA shell — which is what ?lang= used to do,
 * and why a shared link showed the wrong language until JavaScript caught up.
 */
export function entries() {
	return [
		{ lang: undefined },
		...SUPPORTED_LANGUAGES.map((lang) => ({ lang }))
	];
}

export const load: PageLoad = ({ params }) => {
	// Belt and braces. `src/params/lang.ts` already rejects an unknown segment
	// before this runs, so under normal circumstances this branch is dead — but
	// deleting the matcher is a one-file mistake that would otherwise turn
	// /CV/xyz/ back into a silent fall back to English under a real-looking URL,
	// and nothing would say so.
	if (params.lang !== undefined && !isLanguage(params.lang)) {
		error(404, `Unknown language: ${params.lang}`);
	}

	return {
		// undefined at the bare path: that means "no explicit choice", which lets
		// a returning visitor's saved language apply. An explicit /en/ does not.
		routeLanguage: isLanguage(params.lang) ? params.lang : undefined,
		language: isLanguage(params.lang) ? params.lang : DEFAULT_LANGUAGE,
		experience: experienceData,
		skills: skillsData
	};
};
