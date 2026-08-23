<script lang="ts">
    import { onMount } from "svelte";
    import { ParticlesEngine } from "./engine/ParticlesEngine";

    let { theme = "dark", count = 128 } = $props<{ theme?: string; count?: number }>();

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
        /*
         * Поява — через `@starting-style`, а не клас у `requestAnimationFrame`
         * (UI-ELEMENTS-v8 `UIE-STARTING-STYLE`).
         *
         * Доти було так: `opacity: 0` у базовому правилі, а `CanvasEngine.mount()`
         * додавав клас `.mounted` усередині `requestAnimationFrame`, щоб браузер
         * побачив зміну і запустив перехід.
         *
         * ГОЛОВНЕ — не стислість, а те, куди дивиться НАПРЯМОК ВІДМОВИ.
         *
         * Спокійним станом було `opacity: 0`, а видимість давав JS. Отже кожен
         * шлях, на якому клас не додався, робив тло НЕВИДИМИМ НАЗАВЖДИ, хоча
         * двигун малював кадри як слід. Такі шляхи в цьому коді справді є, обидва
         * вище за рядок із класом:
         *
         *   - `getContext("2d")` вернув `null` — `mount()` виходить одразу
         *     (розширення, які блокують canvas проти відбитка браузера, роблять
         *     саме це). У журналі лишався рядок «Failed to get 2D context», а на
         *     екрані — порожнє тло без жодної підказки, що це те саме.
         *   - `if (canvas)` у компоненті: без елемента `mount()` не кличеться
         *     зовсім.
         *
         * Тепер спокійний стан — `opacity: 1`, а `@starting-style` описує «звідки»
         * поруч із «куди». Найгірше, що тепер може статися, — поява без плавності;
         * «не з'явилося ніколи» більше не є станом цього коду. Побічно зникає
         * `:global()`, який був потрібен лише тому, що клас ставив не Svelte, і
         * зникає роздвоєння: значення жило в CSS, момент — у TS.
         */
        opacity: 1;
        transition: opacity 0.8s ease-in-out;

        @starting-style {
            opacity: 0;
        }
    }
</style>
