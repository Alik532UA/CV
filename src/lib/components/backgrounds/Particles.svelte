<script lang="ts">
    import { onMount } from "svelte";
    import { ParticlesEngine } from "./engine/ParticlesEngine";

    let { theme = "dark", count = 80 } = $props<{ theme?: string; count?: number }>();

    let canvas: HTMLCanvasElement;
    let engine: ParticlesEngine;

    // Reactive theme update
    $effect(() => {
        if (engine) {
            engine.setTheme(theme);
        }
    });

    $effect(() => {
        if (engine) {
            engine.setParticleCount(count);
        }
    });

    onMount(() => {
        engine = new ParticlesEngine(theme);
        engine.setParticleCount(count);
        if (canvas) {
            engine.mount(canvas);
        }
        
        return () => {
            engine?.unmount();
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
