import { writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

/**
 * Генератор карти сайту sitemap.xml для CV (SEO-v8 § 5).
 *
 * У sitemap потрапляють лише рецензовані носіями мови (INDEXED_LANGUAGES).
 * Машинні переклади мають noindex і в sitemap не включаються (SEO-v8 § 2.4).
 * Типова англійська версія веде на голий шлях /CV/.
 */
const SITE_ORIGIN = 'https://alik532ua.github.io';
const SITE_BASE = '/CV';

const INDEXED_LANGUAGES = ['en', 'en-us', 'uk', 'ja'];

const entries = INDEXED_LANGUAGES.map((lang) => {
	const loc = lang === 'en' ? `${SITE_ORIGIN}${SITE_BASE}/` : `${SITE_ORIGIN}${SITE_BASE}/${lang}/`;
	const priority = lang === 'en' ? '1.0' : '0.8';
	return { loc, priority };
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) => `  <url>
    <loc>${e.loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${e.priority}</priority>
  </url>`
	)
	.join('\n')}
</urlset>
`;

const staticPath = resolve('static/sitemap.xml');
writeFileSync(staticPath, sitemap.trim() + '\n', 'utf8');

const buildDir = resolve('build');
if (existsSync(buildDir)) {
	writeFileSync(join(buildDir, 'sitemap.xml'), sitemap.trim() + '\n', 'utf8');
}

console.log('CV: sitemap.xml generated successfully for indexed languages.');
