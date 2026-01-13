<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    export let theme: string = "dark";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let animationId: number;
    let scrollY = 0;
    let width = 0;
    let height = 0;
    let waveTime = 0;

    // Configurable parameters
    export let waveBaseHeight = 0.9; // 0.25 = 25% from top (Higher start)
    export let waveScrollSpeed = 0.25; // Influence of scroll (Higher value = Moves more)

    function getColors() {
        if (theme === "light") {
            return {
                primary: "rgba(0, 113, 227, ",
                secondary: "rgba(94, 92, 230, ",
            };
        }
        return {
            primary: "rgba(0, 242, 255, ",
            secondary: "rgba(112, 0, 255, ",
        };
    }

    function draw() {
        if (!ctx) return;
        const colors = getColors();
        waveTime += 0.005;
        const scrollInfluence = scrollY * 0.002;

        ctx.clearRect(0, 0, width, height);

        for (let layer = 0; layer < 3; layer++) {
            ctx.beginPath();
            ctx.moveTo(0, height);

            for (let x = 0; x <= width; x += 5) {
                const wave1 =
                    Math.sin(x * 0.003 + waveTime + layer + scrollInfluence) *
                    50;
                const wave2 =
                    Math.sin(x * 0.005 - waveTime * 0.7 + layer * 2) * 30;
                const wave3 =
                    Math.cos(x * 0.002 + waveTime * 0.5 + scrollInfluence) * 40;

                // Use variables for height and scroll speed
                const y =
                    height * waveBaseHeight +
                    wave1 +
                    wave2 +
                    wave3 +
                    layer * 60 -
                    scrollY * waveScrollSpeed;
                ctx.lineTo(x, y);
            }

            ctx.lineTo(width, height);
            ctx.closePath();

            const gradient = ctx.createLinearGradient(0, 0, width, height);
            const alpha = 0.08 - layer * 0.02;
            gradient.addColorStop(0, colors.primary + alpha + ")");
            gradient.addColorStop(0.5, colors.secondary + alpha + ")");
            gradient.addColorStop(1, colors.primary + alpha + ")");
            ctx.fillStyle = gradient;
            ctx.fill();
        }

        animationId = requestAnimationFrame(draw);
    }

    function handleResize() {
        if (!canvas) return;

        const newWidth = canvas.clientWidth;
        const newHeight = canvas.clientHeight;

        // Ignore resize if dimensions haven't changed (fixes mobile scroll jump)
        if (canvas.width === newWidth && canvas.height === newHeight) return;

        width = newWidth;
        height = newHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function handleScroll() {
        scrollY = window.scrollY;
    }

    onMount(() => {
        ctx = canvas.getContext("2d");
        // Initial setup
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;

        draw();
        window.addEventListener("resize", handleResize);
        window.addEventListener("scroll", handleScroll);
    });

    onDestroy(() => {
        if (animationId) cancelAnimationFrame(animationId);
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("scroll", handleScroll);
        }
    });
</script>

<canvas bind:this={canvas} class="bg-canvas"></canvas>

<style>
    .bg-canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    }
</style>
