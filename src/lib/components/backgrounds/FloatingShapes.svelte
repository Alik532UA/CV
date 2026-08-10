<script lang="ts">
    import { onMount } from "svelte";
    import { FloatingShapesEngine } from "./engine/FloatingShapesEngine";

    let { theme = "dark", lineWidth = 300 } = $props<{ theme?: string; lineWidth?: number }>();

    let canvas: HTMLCanvasElement;
    let engine: FloatingShapesEngine;

    $effect(() => {
        if (engine) {
            engine.setTheme(theme);
        }
    });

    $effect(() => {
        if (engine) {
            engine.setLineWidth(lineWidth);
        }
    });

    onMount(() => {
        engine = new FloatingShapesEngine(theme);
        engine.setLineWidth(lineWidth);
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
