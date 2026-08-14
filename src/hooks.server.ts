import type { Handle } from "@sveltejs/kit";
import { base } from "$app/paths";
import { isLanguage, type Language } from "$lib/controllers/I18nState.svelte";
import { bcp47, DEFAULT_LANGUAGE } from "$lib/i18n/routing";

/**
 * Ставить `lang` на `<html>` у ЗІБРАНОМУ HTML кожної сторінки.
 *
 * Виглядає дивно для static-профілю — серверних хуків тут ніби й немає, — але
 * prerender виконує саме серверну збірку, тож `handle` відпрацьовує один раз
 * на сторінку і результат запікається у файл.
 *
 * ЩО ВОНО ЛАГОДИТЬ. `app.html` містив `<html lang="en">`, а справжню мову
 * виставляв `I18nState.init()` — тобто вже в браузері, після гідрації. Кожна
 * згенерована сторінка їхала з `lang="en"`: /uk/, /ja/, усі 42. Кравлер і
 * читалка екрана бачать саме зібраний HTML, тому для них сайт був англійським
 * цілком. У коді цього не видно ніяк — дефект знайшов `scripts/check-build.mjs`
 * першим же запуском.
 *
 * Мова береться зі шляху, а не з `event.params`: цей хук виконується і для
 * запитів, що не потрапили в жоден маршрут, і читати там `params` — покладатися
 * на порядок, який нам ніхто не обіцяв.
 */
function languageFromPath(pathname: string): Language {
	const withoutBase = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
	const segment = withoutBase.split("/").filter(Boolean)[0];
	return isLanguage(segment) ? segment : DEFAULT_LANGUAGE;
}

export const handle: Handle = ({ event, resolve }) => {
	const lang = bcp47(languageFromPath(event.url.pathname));

	return resolve(event, {
		// Плейсхолдер, а не regex по всьому документу: заміна `lang="en"`
		// наосліп зачепила б і `hreflang="en"` у тегах alternate.
		transformPageChunk: ({ html }) => html.replace("%lang%", lang)
	});
};
