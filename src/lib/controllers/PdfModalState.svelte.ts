/**
 * The PDF modal is opened from two places that do not share a parent: the hero
 * section on mobile, and the sidebar on desktop. The state used to live in
 * +page.svelte, which the sidebar cannot reach from +layout.svelte, so it is
 * lifted here rather than threaded through both trees.
 */
class PdfModalState {
	isOpen = $state(false);

	open() {
		this.isOpen = true;
	}

	close() {
		this.isOpen = false;
	}
}

export const pdfModal = new PdfModalState();
