<script lang="ts">
    import { onMount } from "svelte";
    import { WavesEngine } from "./engine/WavesEngine";

    let { theme = "dark", layers = 4 } = $props<{ theme?: string; layers?: number }>();

    let canvas: HTMLCanvasElement;
    let engine = $state<WavesEngine>();

    $effect(() => {
        if (engine) {
            engine.setTheme(theme);
            engine.setWaveLayers(layers);
        }
    });

    onMount(() => {
        const inst = new WavesEngine(theme);
        inst.setWaveLayers(layers);
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
