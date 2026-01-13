<script lang="ts">
    import Particles from "./backgrounds/Particles.svelte";
    import Waves from "./backgrounds/Waves.svelte";
    import FloatingShapes from "./backgrounds/FloatingShapes.svelte";

    export let backgroundType: 0 | 1 | 2 | 3 = 1;
    export let theme: string = "dark";
</script>

{#if backgroundType === 1}
    <Particles {theme} />
{:else if backgroundType === 2}
    <Waves {theme} />
{:else if backgroundType === 3}
    <FloatingShapes {theme} />
{/if}
