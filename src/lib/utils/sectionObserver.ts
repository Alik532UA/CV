import { SvelteSet } from "svelte/reactivity";
import { section } from "$lib/controllers/UiState.svelte";
import { track } from "$lib/services/analytics";

/**
 * «Яка секція зараз на екрані» — окрема відповідальність, і тому окремий файл
 * (PROJECT-STRUCTURE-v8 § 7).
 *
 * Жило це в `onMount` кореневого layout, разом з ініціалізацією теми, звуку,
 * мови й аналітики. Приводом до переїзду став розмір: layout переріс межу § 7,
 * коли до нього додався службовий маршрут. Але й без нього ці п'ятдесят рядків
 * відповідали на власне питання, не пов'язане з рештою `onMount`.
 *
 * Два спостерігачі, а не один, і другий не зайвий:
 *
 *   IntersectionObserver  повідомляє, яка секція видима;
 *   MutationObserver      ловить секції, яких на момент монтування ще не було.
 *                         Сторінка одна, але її вміст приїжджає з `{#if}` і
 *                         динамічних імпортів, тож підписатися один раз на
 *                         `querySelectorAll` замало.
 *
 * @returns функцію зняття — обидва спостерігачі треба відключити.
 */
export function observeSections(): () => void {
	const observedElements = new SvelteSet<Element>();
	// Сайт односторінковий, тож без подій на кожну секцію у звіті аналітики
	// було б видно один перегляд і нічого про глибину читання.
	const reportedSections = new SvelteSet<string>();

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (!entry.isIntersecting) continue;
				section.observed(entry.target.id);
				// Раз на завантаження: спостерігач спрацьовує щоразу, коли секція
				// повертається у вьюпорт.
				if (!reportedSections.has(entry.target.id)) {
					reportedSections.add(entry.target.id);
					track("section_view", { section: entry.target.id });
				}
			}
		},
		{ threshold: 0.2, rootMargin: "-70px 0px -30% 0px" }
	);

	const attach = () => {
		for (const el of document.querySelectorAll("section[id]")) {
			if (observedElements.has(el)) continue;
			observedElements.add(el);
			observer.observe(el);
		}
	};

	attach();

	const mutationObserver = new MutationObserver(attach);
	if (document.body) {
		mutationObserver.observe(document.body, { childList: true, subtree: true });
	}

	return () => {
		observer.disconnect();
		mutationObserver.disconnect();
	};
}
