<script lang="ts">
    import Particles from "./backgrounds/Particles.svelte";
    import Waves from "./backgrounds/Waves.svelte";
    import FloatingShapes from "./backgrounds/FloatingShapes.svelte";
    import { fade } from "svelte/transition";
    import { onMount } from "svelte";

    export let backgroundType: 0 | 1 | 2 | 3 = 1;
    export let theme: string = "dark";

    let fixedHeight = "100vh";
    let lastWidth = 0;

    onMount(() => {
        // Function to calculate height with buffer for mobile
        const updateHeight = () => {
            const isMobile = window.innerWidth <= 1024; // Covers tablets/mobiles
            const buffer = isMobile ? 300 : 0; // Extra space for hiding URL bars
            fixedHeight = window.innerHeight + buffer + "px";
            lastWidth = window.innerWidth;
        };

        // Initial set
        updateHeight();

        const handleResize = () => {
            // Ignore vertical resize (mobile scroll) if width is stable
            if (window.innerWidth === lastWidth) return;

            updateHeight();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    });
</script>

{#if backgroundType === 1}
    <div
        class="bg-transition"
        style="height: {fixedHeight}"
        transition:fade={{ duration: 800 }}
    >
        <Particles {theme} />
    </div>
{:else if backgroundType === 2}
    <div
        class="bg-transition"
        style="height: {fixedHeight}"
        transition:fade={{ duration: 800 }}
    >
        <Waves {theme} />
    </div>
{:else if backgroundType === 3}
    <div
        class="bg-transition"
        style="height: {fixedHeight}"
        transition:fade={{ duration: 800 }}
    >
        <FloatingShapes {theme} />
    </div>
{/if}

<style>
    .bg-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        /* Height is set via inline style for mobile stability */
        z-index: -1;
        pointer-events: none;
    }
</style>
