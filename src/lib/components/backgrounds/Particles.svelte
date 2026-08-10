<script lang="ts">
    import { onMount } from "svelte";
    import { ParticlesEngine } from "./engine/ParticlesEngine";

    let { theme = "dark", count = 80 } = $props<{ theme?: string; count?: number }>();

    let canvas: HTMLCanvasElement;
    let engine = $state<ParticlesEngine>();

    $effect(() => {
        if (engine) {
            engine.setTheme(theme);
            engine.setParticleCount(count);
        }
    });

    onMount(() => {
        const inst = new ParticlesEngine(theme);
        inst.setParticleCount(count);
        if (canvas) {
            inst.mount(canvas);
        }
        engine = inst;

        return () => {
            inst.unmount();
        };
    });
</script>

<canvas bind:this={canvas} class="bg-canvas"></canvas>

<style>
    .bg-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.8s ease-in-out;
    }

    .bg-canvas:global(.mounted) {
        opacity: 1;
    }
</style>
