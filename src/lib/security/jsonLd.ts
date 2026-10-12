const ESCAPES: Record<string, string> = {
	'<': '\\u003c',
	'>': '\\u003e',
	'&': '\\u0026',
	'\u{2028}': '\\u2028',
	'\u{2029}': '\\u2029'
};

/** Єдиний дозволений спосіб вставити JSON-LD через {@html}: рядок не може закрити <script> (SECURITY-v10 § 5.3). */
export function jsonLdScript(data: object): string {
	const json = JSON.stringify(data).replace(/[<>&\u{2028}\u{2029}]/gu, (ch) => ESCAPES[ch] ?? ch);
	return `<script type="application/ld+json">${json}</script>`;
}
