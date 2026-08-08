import { EMAIL } from "$lib/config/contacts";
import { toast } from "$lib/controllers/toast.svelte";
import { t } from "$lib/controllers/I18nState.svelte";

/**
 * Copy the address and offer a mail client, rather than firing mailto: straight
 * away — most visitors are on a machine with no mail client configured, where a
 * bare mailto does nothing visible.
 *
 * Shared because the email link renders twice: in the sidebar on desktop and in
 * the hero section on mobile. It used to live in HeroSection alone, so moving
 * the desktop link to the sidebar would otherwise have quietly downgraded it to
 * a plain mailto.
 */
export function handleEmailCopy(e: MouseEvent) {
	e.preventDefault();
	// Captured synchronously: e.currentTarget is null by the time the async
	// clipboard promise resolves, and the toast anchors to this element.
	const anchor = e.currentTarget as HTMLElement;
	const openMail = () => {
		window.location.href = `mailto:${EMAIL}`;
	};

	// Guard: clipboard is absent outside a secure context / in old browsers.
	if (!navigator.clipboard?.writeText) {
		openMail();
		return;
	}

	navigator.clipboard.writeText(EMAIL).then(
		() =>
			toast.success(
				t.hero.emailCopied,
				6000,
				{
					label: t.hero.openMailClient,
					onAction: openMail
				},
				anchor // anchored: the toast appears next to the button, not in a corner
			),
		openMail // clipboard rejected → fall back to mailto
	);
}
