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
     * The strip is only as tall as what it shows. Left at full height, a press below
     * the clone would look like "the end of the page" and lead to the middle.
     */
    const mapHeight = $derived(isFull ? Math.min(cloneHeight, viewportHeight) : viewportHeight);

    const rawMarkerHeight = $derived(
        isFull
            ? Math.max(viewportHeight * scale, MIN_MARKER)
            : Math.max((viewportHeight / pageHeight) * mapHeight, MIN_MARKER)
    );

    /** Sprung for the same reason as the custom bar's thumb: the height jumps when
     *  the page height changes. The position is never sprung. */
    const springHeight = new Spring(MIN_MARKER, { stiffness: 0.2, damping: 0.9 });

    $effect(() => {
        springHeight.target = rawMarkerHeight;
    });

    const markerHeight = $derived(springHeight.current);
    const pxPerScroll = $derived(
        Math.max(mapHeight - markerHeight, 0) / Math.max(pageHeight - viewportHeight, 1)
    );

    const markerTop = $derived.by(() => {
        if (dragging) return dragMarkerTop;
        const maxScroll = pageHeight - viewportHeight;
        if (maxScroll <= 0) return 0;
        return (scrollY / maxScroll) * Math.max(mapHeight - markerHeight, 0);
    });

    /** How far the clone has to ride up to show the current place. */
    const cloneShiftY = $derived.by(() => {
        const overflow = cloneHeight - viewportHeight;
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

    const presence = new Spring(0, { stiffness: 0.15, damping: 0.8 });

    $effect(() => {
        presence.target = visible ? 1 : 0;
    });

    /** At rest the strip hides past the edge, leaving only the handle. */
    const hiddenPart = $derived(
        (1 - progress.current) * (fullWidth - HANDLE_WIDTH) + (1 - presence.current) * fullWidth
    );

    function measure() {
        if (!browser) return;
        pageHeight = Math.max(document.documentElement.scrollHeight, 1);
        viewportHeight = window.innerHeight;
        scrollY = window.scrollY;
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
            // The clone controls nothing — strip what makes it reachable by keyboard
            // and by screen readers.
            el.removeAttribute("tabindex");
        }
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

<!-- Mounted on the chosen mode, hidden by sliding away: leaving the DOM on a short
     page would give the departure nothing to animate. -->
{#if chosen}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="minimap"
        class:minimap--full={isFull}
        class:minimap--hidden={presence.current < 0.01}
        class:dragging
        class:holding={hold.holding}
        style="width: {fullWidth}px; height: {mapHeight}px;
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
        top: 0;
        /* Height comes from the script: it equals the height of what is shown. */
        /* Same band as the custom bar — over the header, under the modal. */
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

    .minimap--hidden {
        pointer-events: none;
        visibility: hidden;
    }

    .minimap:hover,
    .minimap.holding,
    .minimap.dragging {
        background: var(--panel-bg);
        border-left-color: var(--accent-primary);
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
