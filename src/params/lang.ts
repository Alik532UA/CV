import type { ParamMatcher } from "@sveltejs/kit";
import { isLanguage } from "$lib/controllers/I18nState.svelte";

/**
 * Matcher for the `[[lang=lang]]` segment (SVELTEKIT-DATA-v8 § 2.2).
 *
 * Without it, the optional parameter swallows EVERY first path segment: /CV/xyz/
 * matched the route, ran the load function, and depended on that function
 * remembering to reject the value. It did — but that made a routing concern the
 * responsibility of page code, and the next route with an optional parameter
 * would have had to remember the same thing again.
 *
 * With the matcher, an unknown segment simply does not match, and SvelteKit
 * produces the 404 itself before any load runs.
 *
 * `isLanguage` is the same predicate the rest of the app uses, so the matcher
 * and the language list cannot drift apart.
 */
export const match = ((param: string) => isLanguage(param)) satisfies ParamMatcher;
