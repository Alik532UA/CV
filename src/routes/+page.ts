import { experienceData } from "$lib/data/experience";
import { skillsData } from "$lib/data/skills";
import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
	return {
		experience: experienceData,
		skills: skillsData
	};
};
