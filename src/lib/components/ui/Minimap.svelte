<script lang="ts">
    import { browser } from "$app/environment";
    import { afterNavigate } from "$app/navigation";
    import { Spring } from "svelte/motion";
    import { MediaQuery } from "svelte/reactivity";
    import { t } from "$lib/controllers/I18nState.svelte";
    import { scrollbar } from "$lib/controllers/ScrollbarState.svelte";
    import { HoldScroll } from "$lib/utils/holdScroll.svelte";

    /** Width of the schematic strip. Deliberately NOT proportional: stripes do not
     *  need the width, and 180px holding six grey dashes eats the screen for nothing. */
    const SCHEMATIC_WIDTH = 28;
    /** Width of the visual strip. The scale follows from it — see `scale`. */
    const FULL_WIDTH = 180;
    /** How much stays on screen at rest, as a grab handle. */
    const HANDLE_WIDTH = 8;

    /** Smallest marker height, so it stays visible on a long page. */
    const MIN_MARKER = 8;

    const BLOCK_SELECTOR = "h1, h2, h3, p, img, figure, section > div, li, table, blockquote";
    /** Below this height a block is not drawn: a half-pixel stripe is only noise. */
    const MIN_BLOCK_HEIGHT = 24;

    interface Block {
        top: number;
        height: number;
        weight: number;
    }

    let scrollY = $state(0);
    let viewportHeight = $state(0);
    /** Bottom edge of the fixed header, or 0 where there is none. */
    let headerOffset = $state(0);
    let pageHeight = $state(1);
    let windowWidth = $state(0);
    let mouseX = $state(Number.POSITIVE_INFINITY);
    let pointerInside = $state(false);
    let dragging = $state(false);
    let blocks = $state<Block[]>([]);
    let cloneHost = $state<HTMLElement | undefined>();

    let grabOffset = 0;
    let stripTop = 0;
    let pendingY = 0;
    let frame = 0;
    /** Marker position while dragging — straight from the cursor, never via the
     *  scroll event, or it trails the cursor by a frame. */
    let dragMarkerTop = $state(0);

    const reducedMotion = new MediaQuery("(prefers-reduced-motion: reduce)");

    const isFull = $derived(scrollbar.active === "minimap-full");
    /** Whether it is our turn to draw at all. */
    const chosen = $derived(scrollbar.active === "minimap" || scrollbar.active === "minimap-full");
    const scrollable = $derived(pageHeight > viewportHeight + 1);
    /** MOUNTED while a minimap mode is chosen; VISIBLE while there is something to
     *  scroll — a short page gets no minimap, matching what the native bar does. */
    const visible = $derived(chosen && scrollable);

    const fullWidth = $derived(isFull ? FULL_WIDTH : SCHEMATIC_WIDTH);

    /**
     * Scale is taken from the WIDTH, not the height.
     *
     * The whole page then fits the strip across, with nothing cropped. The clone can
     * come out taller than the screen, and it travels inside the strip along with
     * the scroll — exactly how a code editor's minimap handles a long file.
     *
     * Scaling by height looks simpler (everything at once, nothing moving) but
     * shaves the sides off, leaving the page a narrow column in the middle.
     */
    const scale = $derived(windowWidth > 0 ? fullWidth / windowWidth : 0.1);
    const cloneHeight = $derived(pageHeight * scale);

    /**
     * The strip starts below the header rather than at the top of the window.
     *
     * A scrollbar belongs at the very top — that is where the native one is, and the
     * custom overlay keeps that. A minimap is a panel, and this one is wide enough
     * (180px in the visual mode) to cover the controls in the header's right corner.
     *
     * Measured rather than written as 70px: the height already appears in
     * HeaderSection and in the layout's `main` margin, and a third copy would be one
     * more thing to update. `bottom` covers both the height and any offset above it.
     */
    const availableHeight = $derived(Math.max(viewportHeight - headerOffset, 0));

    /**
     * The strip is only as tall as what it shows. Left at full height, a press below
     * the clone would look like "the end of the page" and lead to the middle.
     */
    const mapHeight = $derived(isFull ? Math.min(cloneHeight, availableHeight) : availableHeight);

    /**
     * NOT sprung, unlike the custom bar's thumb.
     *
     * A drag reads this three times over — grabOffset is half of it, the clamp is
     * mapHeight minus it, and pxPerScroll divides by it. A value that changes every
     * animation frame makes all three disagree with the frame that set grabOffset,
     * and the marker drifts and sticks instead of tracking the cursor. The custom
     * bar can afford the spring because there the height is the only thing sprung
     * and the strip is the full viewport; here the schematic strip is 28px wide and
     * the drift is the whole interaction.
     */
    const markerHeight = $derived(
        isFull
            ? Math.max(viewportHeight * scale, MIN_MARKER)
            : Math.max((viewportHeight / pageHeight) * mapHeight, MIN_MARKER)
    );
    const pxPerScroll = $derived(
        Math.max(mapHeight - markerHeight, 0) / Math.max(pageHeight - viewportHeight, 1)
    );

    const markerTop = $derived.by(() => {
        if (dragging) return dragMarkerTop;
        const maxScroll = pageHeight - viewportHeight;
        if (maxScroll <= 0) return 0;
        return (scrollY / maxScroll) * Math.max(mapHeight - markerHeight, 0);
    });

    /**
     * How far the clone has to ride up to show the current place.
     *
     * Against `mapHeight`, not the viewport height: those were the same thing while
     * the strip ran the full window, and stopped being so once it started below the
     * header. Measured against the viewport, the clone would come up short by the
     * header's height at the bottom of the page.
     */
    const cloneShiftY = $derived.by(() => {
        const overflow = cloneHeight - mapHeight;
        if (overflow <= 0) return 0;
        return -(scrollY / Math.max(pageHeight - viewportHeight, 1)) * overflow;
    });

    const hold = new HoldScroll(() => ({ markerTop, markerHeight, pxPerScroll }));

    const target = $derived.by(() => {
        if (!visible || reducedMotion.current) return 0;
        if (dragging) return 1;
        if (!pointerInside || !windowWidth) return 0;
        const start = 0.18 * windowWidth;
        const end = 0.02 * windowWidth;
        const distance = windowWidth - mouseX;
        if (distance > start) return 0;
        if (distance < end) return 1;
        return (start - distance) / (start - end);
    });

    const progress = new Spring(0, { stiffness: 0.05, damping: 0.4 });

    $effect(() => {
        progress.target = target;
    });

    /**
     * At rest the strip hides past the edge, leaving only the handle.
     *
     * There is deliberately no second spring for arrival and departure here, and so
     * no class that turns the element non-rendered while one settles. Pointer
     * capture is released the moment its element stops being rendered, and the drag
     * dies mid-gesture with no way to tell why. The custom bar needs that spring
     * because it has no other way to leave; this strip already slides out through
     * `progress`, so it only has to mount on `visible`.
     */
    const hiddenPart = $derived((1 - progress.current) * (fullWidth - HANDLE_WIDTH));

    function measure() {
        if (!browser) return;
        pageHeight = Math.max(document.documentElement.scrollHeight, 1);
        viewportHeight = window.innerHeight;
        scrollY = window.scrollY;
        // Re-read on every measure, so the 70px/60px breakpoint in HeaderSection needs
        // no counterpart here. A page without a fixed header simply gets 0.
        const header = document.querySelector("header");
        headerOffset = header ? Math.max(header.getBoundingClientRect().bottom, 0) : 0;
    }

    /**
     * Positions are kept as FRACTIONS of the page height, not pixels: a change of
     * height then needs no recomputation, and the markup is expressed in percent.
     */
    function measureBlocks() {
        if (!browser || isFull) return;
        const main = document.querySelector("main") ?? document.body;
        const seen: Element[] = [];
        const found: Block[] = [];

        for (const el of main.querySelectorAll(BLOCK_SELECTOR)) {
            // Nested matches would stack several stripes in the same place.
            if (seen.some((s) => s.contains(el))) continue;
            const rect = el.getBoundingClientRect();
            if (rect.height < MIN_BLOCK_HEIGHT) continue;
            seen.push(el);

            const tag = el.tagName.toLowerCase();
            // Headings carry more than paragraphs.
            const weight =
                tag === "h1"
                    ? 1
                    : tag === "h2"
                      ? 0.85
                      : tag === "h3"
                        ? 0.7
                        : tag === "img" || tag === "figure"
                          ? 0.55
                          : 0.35;

            found.push({
                top: (rect.top + window.scrollY) / pageHeight,
                height: rect.height / pageHeight,
                weight
            });
        }
        blocks = found;
    }

    /**
     * A marker that the content changed, set by the mutation observer below.
     *
     * Height is a poor signal for this: a section can appear having barely changed
     * it. What matters is the content.
     */
    let contentVersion = $state(0);

    /** Height, host and content version the clone was last built for. */
    let clonedAtHeight = 0;
    let clonedHost: HTMLElement | null = null;
    let clonedVersion = -1;

    /**
     * After a navigation the clone is always stale, even at an unchanged height.
     * Between two pages of similar height the element is never unmounted, so none of
     * the checks below fire and the minimap keeps showing the PREVIOUS page.
     */
    afterNavigate(() => {
        clonedAtHeight = 0;
        clonedHost = null;
        clonedVersion = -1;
        if (chosen) {
            measure();
            measureBlocks();
        }
    });

    function buildClone() {
        if (!browser || !cloneHost || !isFull) return;
        // eslint-disable-next-line svelte/no-dom-manipulating
        cloneHost.replaceChildren();

        // The CONTENTS of the body are copied, not the <body> element: cloneNode on
        // it yields a <body>, which is invalid inside a <div> and makes the browser
        // complain "Blocked aria-hidden on a <body> element".
        //
        // The contents rather than just <main>, because the scale is computed from
        // the height of the whole page — with <main> alone the clone came out short
        // by the header, and the viewport marker pointed at the wrong place.
        const clone = document.createElement("div");
        for (const child of document.body.children) {
            clone.appendChild(child.cloneNode(true));
        }

        // Itself and the custom bar out, or the minimap would draw a minimap.
        // The canvases go too: this project paints its animated background into one,
        // and a cloned canvas is always blank — a wasted full-page element.
        for (const el of clone.querySelectorAll(".minimap, .page-scrollbar, .scrollbar-menu, canvas")) {
            el.remove();
        }

        for (const el of clone.querySelectorAll("*")) {
            el.removeAttribute("id");
            el.removeAttribute("data-testid");
            el.removeAttribute("tabindex");
        }

        // `inert`, not just the tabindex strip above and aria-hidden.
        //
        // Dropping tabindex only unmakes elements that tabindex made focusable —
        // <button> and <a href> are focusable in their own right, and this page's
        // clone holds fifty of them. Without inert, Tab walks the visitor into an
        // invisible copy of the whole site, and they are focusable elements inside
        // aria-hidden, which is a violation on its own. inert takes the subtree out
        // of the tab order, out of the accessibility tree and out of hit testing in
        // one attribute; aria-hidden stays for browsers that predate it.
        clone.setAttribute("inert", "");
        clone.setAttribute("aria-hidden", "true");

        // eslint-disable-next-line svelte/no-dom-manipulating
        cloneHost.appendChild(clone);
    }

    $effect(() => {
        if (!chosen) return;
        measure();
        measureBlocks();

        const onScroll = () => (scrollY = window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });

        const observer = new ResizeObserver(() => {
            // Silent mid-drag: every small height change would otherwise re-measure
            // every block and rebuild the clone in the middle of a mouse move.
            if (dragging) return;
            measure();
            measureBlocks();
        });
        observer.observe(document.documentElement);

        return () => {
            window.removeEventListener("scroll", onScroll);
            observer.disconnect();
        };
    });

    /**
     * Watches <main>, NOT document.body: the minimap lives outside <main>, so its own
     * clone does not wake this. Watching the body would make every rebuild trigger
     * the next one, without end.
     */
    $effect(() => {
        if (!chosen || !isFull) return;
        const main = document.querySelector("main");
        if (!main) return;

        let timer: ReturnType<typeof setTimeout> | null = null;
        const observer = new MutationObserver(() => {
            // The delay is required: rendering a section is dozens of mutations in a
            // row, and without it the clone would be rebuilt on each one.
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                timer = null;
                contentVersion++;
            }, 250);
        });
        observer.observe(main, { childList: true, subtree: true });

        return () => {
            if (timer) clearTimeout(timer);
            observer.disconnect();
        };
    });

    $effect(() => {
        if (!visible || !isFull || !cloneHost || pageHeight <= 1) return;
        if (dragging) return;

        const sameHost = cloneHost === clonedHost;
        // ±40px, so a pixel of scroll that shifted a sticky header does not cost a
        // full DOM clone.
        const sameHeight = Math.abs(pageHeight - clonedAtHeight) < 40;
        const sameContent = contentVersion === clonedVersion;
        if (sameHost && sameHeight && sameContent) return;

        clonedHost = cloneHost;
        clonedAtHeight = pageHeight;
        clonedVersion = contentVersion;
        buildClone();
    });

    $effect(() => () => hold.stop());

    function applyScroll() {
        frame = 0;
        const maxMarkerTop = mapHeight - markerHeight;
        if (maxMarkerTop <= 0) return;
        const wanted = pendingY - stripTop - grabOffset;
        const clamped = Math.min(Math.max(wanted, 0), maxMarkerTop);
        dragMarkerTop = clamped;
        window.scrollTo({
            top: (clamped / maxMarkerTop) * (pageHeight - viewportHeight),
            behavior: "instant"
        });
    }

    function requestScroll(clientY: number) {
        pendingY = clientY;
        if (!frame) frame = requestAnimationFrame(applyScroll);
    }

    function onPointerDown(e: PointerEvent) {
        const strip = e.currentTarget as HTMLElement;
        stripTop = strip.getBoundingClientRect().top;
        const localY = e.clientY - stripTop;

        const onMarker = localY >= markerTop && localY <= markerTop + markerHeight;
        grabOffset = onMarker ? localY - markerTop : markerHeight / 2;
        dragMarkerTop = markerTop;

        hold.stop();
        dragging = true;
        strip.setPointerCapture(e.pointerId);
        requestScroll(e.clientY);
    }

    function onPointerMove(e: PointerEvent) {
        if (dragging) {
            requestScroll(e.clientY);
            return;
        }
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        hold.aim(e.clientY - rect.top);
    }

    function onPointerEnter(e: PointerEvent) {
        if (dragging) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        hold.aim(e.clientY - rect.top);
    }

    function endDrag(e: PointerEvent) {
        if (!dragging) return;
        dragging = false;
        hold.stop();
        if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        }
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    }
</script>

<svelte:window
    bind:innerWidth={windowWidth}
    onpointermove={(e) => {
        if (dragging) return;
        mouseX = e.clientX;
        pointerInside = true;
    }}
    onpointerleave={() => (pointerInside = false)}
/>

<!-- Mounted on `visible`, so the element is simply absent on a page with nothing to
     scroll. Nothing here needs an exit animation — the strip's only movement is the
     slide driven by `progress` — and the alternative, keeping it mounted and turning
     it non-rendered, costs the pointer capture a drag depends on. -->
{#if visible}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="minimap"
        class:minimap--full={isFull}
        class:dragging
        class:holding={hold.holding}
        style="top: {headerOffset}px; width: {fullWidth}px; height: {mapHeight}px;
            transform: translateX({hiddenPart}px);"
        aria-label={t.scrollbar.title}
        data-testid="minimap-container"
        onpointerenter={onPointerEnter}
        onpointerleave={() => hold.stop()}
        oncontextmenu={(e) => {
            e.preventDefault();
            hold.stop();
            scrollbar.openMenu(e.clientX, e.clientY);
        }}
        onpointerdown={onPointerDown}
        onpointermove={onPointerMove}
        onpointerup={endDrag}
        onpointercancel={endDrag}
    >
        {#if isFull}
            <!-- The page's clone: a picture and nothing else. -->
            <div
                class="minimap__clone"
                style="width: {windowWidth}px;
                    transform: translateY({cloneShiftY}px) scale({scale});"
                bind:this={cloneHost}
                aria-hidden="true"
            ></div>
        {:else}
            {#each blocks as block, i (i)}
                <span
                    class="minimap__block"
                    style="top: {block.top * 100}%; height: {Math.max(block.height * 100, 0.3)}%;
                        opacity: {0.25 + block.weight * 0.55};"
                ></span>
            {/each}
        {/if}

        <span
            class="minimap__viewport"
            style="top: {markerTop}px; height: {markerHeight}px;"
            data-testid="minimap-viewport-status"
        ></span>
    </div>
{/if}

<style>
    .minimap {
        position: fixed;
        right: 0;
        /* `top` and height both come from the script: the strip begins below the
           header and fills what is left. */
        /* Same band as the custom bar — over the page, under the modal. */
        z-index: 1500;
        background: var(--panel-bg);
        border-left: 1px solid var(--border-color);
        box-shadow: -8px 0 24px rgba(0, 0, 0, 0.28);
        cursor: pointer;
        overflow: hidden;
        touch-action: none;
        /* The movement is driven by the spring in the script; a CSS transition here
           would only fight it. */
        transition: background 0.2s;
    }

    /* Background only. An accent border here reads as a bright outline drawn down
       the side of the page — the strip is the full height of the viewport, so any
       edge treatment on it is a line across the whole screen rather than the
       highlight it looks like in a small mock-up. The marker inside already carries
       the accent, and that is the part worth pointing at. */
    .minimap:hover,
    .minimap.holding,
    .minimap.dragging {
        background: color-mix(in srgb, var(--panel-bg), var(--text-primary) 6%);
    }

    .minimap__clone {
        position: absolute;
        top: 0;
        left: 0;
        /* Scaled from the top-left corner, so the clone's height is exactly the
           strip's height and the viewport marker lines up with it. */
        transform-origin: top left;
        pointer-events: none;
        user-select: none;
    }

    .minimap__block,
    .minimap__viewport {
        position: absolute;
        left: 0;
        right: 0;
        display: block;
    }

    .minimap__block {
        background: var(--accent-primary);
        border-radius: 1px;
    }

    .minimap__viewport {
        background: color-mix(in srgb, var(--accent-primary), transparent 85%);
        border-top: 1px solid var(--accent-primary);
        border-bottom: 1px solid var(--accent-primary);
        pointer-events: none;
    }

    @media print {
        .minimap {
            display: none;
        }
    }
</style>
