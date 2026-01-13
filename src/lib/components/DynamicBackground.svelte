<script lang="ts">
    import Particles from "./backgrounds/Particles.svelte";
    import Waves from "./backgrounds/Waves.svelte";
    import FloatingShapes from "./backgrounds/FloatingShapes.svelte";
    import { fade } from "svelte/transition";

    export let backgroundType: 0 | 1 | 2 | 3 = 1;
    export let theme: string = "dark";
</script>

{#if backgroundType === 1}
    <div class="bg-transition" transition:fade={{ duration: 800 }}>
        <Particles {theme} />
    </div>
{:else if backgroundType === 2}
    <div class="bg-transition" transition:fade={{ duration: 800 }}>
        <Waves {theme} />
    </div>
{:else if backgroundType === 3}
    <div class="bg-transition" transition:fade={{ duration: 800 }}>
        <FloatingShapes {theme} />
    </div>
{/if}

<style>
    .bg-transition {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        height: 100lvh; /* Stable height on mobile ignoring URL bar */
        z-index: -1;
        pointer-events: none;
    }
</style>
