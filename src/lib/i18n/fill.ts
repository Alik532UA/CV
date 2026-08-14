/**
 * Substitutes `{name}` placeholders in a dictionary string.
 *
 * Exists because the alternative is building sentences by concatenation —
 * `"Відповіла модель " + model + " (" + provider + ")"` — which I18N-v8 § 4.1
 * forbids for a reason that only shows up in translation: word order is not
 * universal. German puts the verb last, Japanese puts the subject marker after
 * the noun, and a translator handed three fragments cannot reorder them. Given
 * the whole sentence with holes in it, they can.
 *
 * Deliberately tiny and deliberately not a library: it is nine lines, and
 * DEPENDENCIES-v8 § 1.2 says a dependency for that is a liability, not a saving.
 */
export function fill(template: string, params: Record<string, string | number>): string {
	return template.replace(/\{(\w+)\}/g, (whole, key: string) =>
		// An unknown placeholder is left standing rather than replaced with
		// "undefined": `{minutes}` in the interface is a visible bug report,
		// "undefined min" reads like a real, if strange, state.
		key in params ? String(params[key]) : whole
	);
}
