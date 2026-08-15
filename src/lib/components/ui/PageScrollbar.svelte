<script lang="ts">
    import { browser } from "$app/environment";
    import { afterNavigate } from "$app/navigation";
    import { Spring } from "svelte/motion";
    import { MediaQuery } from "svelte/reactivity";
    import { scrollbar } from "$lib/controllers/ScrollbarState.svelte";
    import { HoldScroll } from "$lib/utils/holdScroll.svelte";

    /** Thickness at rest and when expanded, px. */
    const REST_WIDTH = 10;
    const HOVER_WIDTH = 20;

    /** Smallest thumb height, so there is something to grab on a long page. */
    const MIN_THUMB = 32;

    let scrollY = $state(0);
    let viewportHeight = $state(0);
    let pageHeight = $state(1);
    let windowWidth = $state(0);
    let mouseX = $state(Number.POSITIVE_INFINITY);
    let pointerInside = $state(false);
    let dragging = $state(false);
    /** Offset of the grab point from the thumb's top, so it does not jump under the cursor. */
    let grabOffset = 0;
    /**
     * The track's rectangle, taken ONCE when a drag starts.
     *
     * getBoundingClientRect() on every mouse move forces the browser to compute
     * layout — and the track is position: fixed, so it does not move while
     * scrolling anyway.
     */
    let trackTop = 0;
    /** The element holding pointer capture, and for which pointer. */
    let capturedTrack: HTMLElement | null = null;
    let capturedPointerId = -1;
    /** Last pointer position, not yet applied. */
    let pendingY = 0;
    let frame = 0;
    /**
     * The thumb's position while dragging — straight from the cursor.
     *
     * Otherwise it is a loop: move → scrollTo → scroll event → state update →
     * repaint. The thumb trails the cursor by at least a frame, which reads as lag.
     */
    let dragThumbTop = $state(0);

    const hold = new HoldScroll(() => ({
        markerTop: thumbTop,
        markerHeight: thumbHeight,
        pxPerScroll
    }));

    const reducedMotion = new MediaQuery("(prefers-reduced-motion: reduce)");

    /** Whether it is our turn to draw. One controller decides for all three. */
    const enabled = $derived(scrollbar.active === "custom");

    const scrollable = $derived(pageHeight > viewportHeight + 1);
    /** MOUNTED while the mode is chosen; VISIBLE while there is something to scroll. */
    const visible = $derived(enabled && scrollable);

    const target = $derived.by(() => {
        if (!visible || reducedMotion.current) return 0;
        if (dragging) return 1;
        if (!pointerInside || !windowWidth) return 0;
        const start = 0.18 * windowWidth; // beyond this there is no reaction
        const end = 0.02 * windowWidth; // here it is already at maximum
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
     * Arrival and departure: 0 is fully past the edge, 1 is in place.
     *
     * Stiffer than the approach spring: softness is not wanted here, what is wanted
     * is to take the bar off a page that fits entirely, quickly and without
     * wobbling.
     */
    const presence = new Spring(0, { stiffness: 0.15, damping: 0.8 });

    $effect(() => {
        presence.target = visible ? 1 : 0;
    });

    /** What the thumb should occupy at the current page height. */
    const rawThumbHeight = $derived(
        Math.max((viewportHeight / pageHeight) * viewportHeight, MIN_THUMB)
    );

    /**
     * The height is sprung because it jumped whenever the page height changed —
     * a short page gives a long thumb and the other way round.
     *
     * The POSITION is deliberately not animated: it has to follow the cursor and
     * the scroll immediately, or the lag above comes back on purpose.
     */
    const springHeight = new Spring(MIN_THUMB, { stiffness: 0.2, damping: 0.9 });

    $effect(() => {
        springHeight.target = rawThumbHeight;
    });

    const thumbHeight = $derived(springHeight.current);
    const width = $derived(REST_WIDTH + (HOVER_WIDTH - REST_WIDTH) * progress.current);
    const pxPerScroll = $derived(
        Math.max(viewportHeight - thumbHeight, 0) / Math.max(pageHeight - viewportHeight, 1)
    );

    const thumbTop = $derived.by(() => {
        if (dragging) return dragThumbTop;
        const maxScroll = pageHeight - viewportHeight;
        if (maxScroll <= 0) return 0;
        return (scrollY / maxScroll) * (viewportHeight - thumbHeight);
    });

    function measure() {
        if (!browser) return;
        pageHeight = Math.max(document.documentElement.scrollHeight, 1);
        viewportHeight = window.innerHeight;
        scrollY = window.scrollY;
    }

    /**
     * Measure straight after a navigation instead of waiting for the observer.
     *
     * It fires on its own too, but a frame or two later — and that is exactly the
     * moment the thumb would still be the previous page's height.
     */
    afterNavigate(() => {
        if (enabled) measure();
    });

    $effect(() => {
        // Subscribed to the chosen mode, not to visibility: otherwise nobody would
        // notice a short page becoming a long one.
        if (!enabled) return;
        measure();

        const onScroll = () => (scrollY = window.scrollY);
        window.addEventListener("scroll", onScroll, { passive: true });

        // The page height changes for more reasons than resize: images arrive,
        // the non-IT experience and extra skills blocks open.
        const observer = new ResizeObserver(measure);
        observer.observe(document.documentElement);

        return () => {
            window.removeEventListener("scroll", onScroll);
            observer.disconnect();
        };
    });

    /** The timer and the frame must not outlive the component. */
    $effect(() => () => hold.stop());

    /**
     * Scroll so that the thumb lands under the cursor.
     *
     * behavior: 'instant', not 'auto'. 'auto' means "read CSS scroll-behavior",
     * which is `smooth` in app.css — every mouse move would start an animation and
     * they would chase each other.
     */
    function applyScroll() {
        frame = 0;
        const maxThumbTop = viewportHeight - thumbHeight;
        if (maxThumbTop <= 0) return;
        const wanted = pendingY - trackTop - grabOffset;
        const clamped = Math.min(Math.max(wanted, 0), maxThumbTop);
        dragThumbTop = clamped;
        window.scrollTo({
            top: (clamped / maxThumbTop) * (pageHeight - viewportHeight),
            behavior: "instant"
        });
    }

    /** Mouse moves arrive more often than frames — the extra ones are dropped. */
    function requestScroll(clientY: number) {
        pendingY = clientY;
        if (!frame) frame = requestAnimationFrame(applyScroll);
    }

    function onTrackPointerDown(e: PointerEvent) {
        // Suppresses the compatibility mouse events the browser starts a text
        // selection from. The track hugs the right edge of the window, which is where
        // the browser's own selection autoscroll takes over, and that then fights
        // every scrollTo this drag makes.
        e.preventDefault();

        const track = e.currentTarget as HTMLElement;
        trackTop = track.getBoundingClientRect().top;
        const localY = e.clientY - trackTop;

        // Pressing the thumb itself drags from where it was taken. Pressing past it
        // first brings the thumb's CENTRE under the cursor.
        const onThumb = localY >= thumbTop && localY <= thumbTop + thumbHeight;
        grabOffset = onThumb ? localY - thumbTop : thumbHeight / 2;
        dragThumbTop = thumbTop;

        hold.stop();
        dragging = true;
        // Before the capture, so a throw there cannot swallow the opening jump.
        requestScroll(e.clientY);
        try {
            track.setPointerCapture(e.pointerId);
            capturedTrack = track;
            capturedPointerId = e.pointerId;
        } catch {
            // A 10px track loses the cursor to the slightest sideways drift, so the
            // gesture is really carried by the window listener below.
        }
    }

    function onTrackPointerMove(e: PointerEvent) {
        if (dragging) {
            requestScroll(e.clientY);
            return;
        }
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        hold.aim(e.clientY - rect.top);
    }

    function onTrackPointerEnter(e: PointerEvent) {
        if (dragging) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        hold.aim(e.clientY - rect.top);
    }

    /**
     * Takes no event: it is called from the track and from the window, and capture
     * must come off the element that took it rather than the event's target.
     */
    function endDrag() {
        if (!dragging) return;
        dragging = false;
        hold.stop();
        if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        }
        if (capturedTrack !== null) {
            try {
                capturedTrack.releasePointerCapture(capturedPointerId);
            } catch {
                // Already released — by the browser, or with the element.
            }
            capturedTrack = null;
        }
    }
</script>

<svelte:window
    bind:innerWidth={windowWidth}
    onpointermove={(e) => {
        // While dragging this carries the gesture, and the width is already at
        // maximum so mouseX is left alone — a state update per move would cost a
        // repaint for nothing. The track is 10px wide: without this, a drag survives
        // only as long as pointer capture holds and the cursor stays over it.
        if (dragging) {
            requestScroll(e.clientY);
            return;
        }
        mouseX = e.clientX;
        pointerInside = true;
    }}
    onpointerup={endDrag}
    onpointercancel={endDrag}
    onpointerleave={() => (pointerInside = false)}
/>

<!-- Mounted on `enabled`, not `visible`: a bar that left the DOM on a page with
     nothing to scroll would have nothing to animate away. -->
{#if enabled}
    <!-- Обґрунтування: те саме, що в Minimap.svelte — поверхня перетягування,
         законний виняток для drag handle (ACCESSIBILITY-v8 § 1). Смуга не
         забирає прокрутку в документа, лише дублює її, тож клавіатурний шлях
         (PageUp/PageDown, стрілки, Home/End) лишається нативним і повним. -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="page-scrollbar"
        class:dragging
        class:holding={hold.holding}
        class:page-scrollbar--hidden={presence.current < 0.01}
        style="width: {width}px; opacity: {presence.current};
            transform: translateX({(1 - presence.current) * width}px);"
        data-testid="page-scrollbar-container"
        onpointerenter={onTrackPointerEnter}
        onpointerleave={() => hold.stop()}
        oncontextmenu={(e) => {
            e.preventDefault();
            hold.stop();
            scrollbar.openMenu(e.clientX, e.clientY);
        }}
        onpointerdown={onTrackPointerDown}
        onpointermove={onTrackPointerMove}
        onpointerup={endDrag}
        onpointercancel={endDrag}
    >
        <div
            class="page-scrollbar__thumb"
            style="top: {thumbTop}px; height: {thumbHeight}px;"
            data-testid="page-scrollbar-thumb-status"
        ></div>
    </div>
{/if}

<style>
    .page-scrollbar {
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        /* Above the header and its dropdowns (1000/1001), below the modal backdrop
           (2000). Being under a full-screen overlay is one of the two reasons this
           component exists, so the modal must win. */
        z-index: 1500;
        background: color-mix(in srgb, var(--scrollbar-track), transparent 40%);
        /* The shadow is not decoration: without it the overlay merges into the page,
           because its background is nearly the same. A lighter or darker background
           is only right in one theme; a shadow reads in both. */
        box-shadow: -6px 0 18px rgba(0, 0, 0, 0.22);
        cursor: pointer;
        touch-action: none;
        /* Inherited by the thumb: a press on the track must not begin a text
           selection, because the track hugs the window's right edge and that is where
           the browser's selection autoscroll lives. */
        user-select: none;
        -webkit-user-select: none;
    }

    /* Gone past the edge — takes no presses and is read by nothing. */
    .page-scrollbar--hidden {
        pointer-events: none;
        visibility: hidden;
    }

    .page-scrollbar__thumb {
        position: absolute;
        left: 2px;
        right: 2px;
        background: var(--scrollbar-thumb);
        border-radius: 999px;
        /* An indicator, not a target: the press has to reach the track, which is what
           runs the gesture. Otherwise pressing the thumb and pressing beside it start
           on different elements. */
        pointer-events: none;
        transition: background 0.15s;
    }

    .page-scrollbar:hover .page-scrollbar__thumb,
    .page-scrollbar.holding .page-scrollbar__thumb,
    .page-scrollbar.dragging .page-scrollbar__thumb {
        background: var(--accent-primary);
    }

    @media print {
        .page-scrollbar {
            display: none;
        }
    }
</style>
