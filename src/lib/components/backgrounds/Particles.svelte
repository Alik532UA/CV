<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    export let theme: string = "dark";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let animationId: number;
    let scrollY = 0;
    let targetScrollOffset = 0;
    let currentScrollOffset = 0;
    let width = 0;
    let height = 0;
    let lastWidth = 0;

    interface Particle {
        x: number;
        y: number;
        baseY: number;
        vx: number;
        vy: number;
        size: number;
        pulseOffset: number;
    }
    let particles: Particle[] = [];

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

    function init() {
        particles = [];
        const count = Math.min(80, Math.floor((width * height) / 15000));
        for (let i = 0; i < count; i++) {
            const y = Math.random() * height;
            particles.push({
                x: Math.random() * width,
                y: y,
                baseY: y,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                size: Math.random() * 2 + 1.5,
                pulseOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    function draw() {
        if (!ctx) return;
        const colors = getColors();
        const time = Date.now() * 0.001;

        // Smooth scroll offset interpolation
        currentScrollOffset +=
            (targetScrollOffset - currentScrollOffset) * 0.08;

        ctx.clearRect(0, 0, width, height);

        particles.forEach((p) => {
            // Base movement
            p.x += p.vx;
            p.baseY += p.vy;

            // Wrap around horizontally
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.baseY < 0) p.baseY = height;
            if (p.baseY > height) p.baseY = 0;

            // Apply smooth scroll offset - particles move opposite to scroll direction
            p.y = p.baseY - currentScrollOffset * 0.15;

            // Wrap vertically with scroll offset
            if (p.y < -50) p.y += height + 100;
            if (p.y > height + 50) p.y -= height + 100;

            // Gentle pulsing
            const pulse = Math.sin(time * 1.2 + p.pulseOffset) * 0.3;
            const alpha = (0.4 + pulse * 0.2) * 0.5; // Reduced 50%
            const dynamicSize = p.size * (1 + pulse * 0.15);

            // Draw glow
            const gradient = ctx!.createRadialGradient(
                p.x,
                p.y,
                0,
                p.x,
                p.y,
                dynamicSize * 4,
            );
            gradient.addColorStop(
                0,
                colors.primary + Math.min(0.6, alpha) + ")",
            );
            gradient.addColorStop(0.4, colors.primary + alpha * 0.3 + ")");
            gradient.addColorStop(1, colors.primary + "0)");

            ctx!.beginPath();
            ctx!.arc(p.x, p.y, dynamicSize * 4, 0, Math.PI * 2);
            ctx!.fillStyle = gradient;
            ctx!.fill();

            // Core
            ctx!.beginPath();
            ctx!.arc(p.x, p.y, dynamicSize, 0, Math.PI * 2);
            ctx!.fillStyle = colors.primary + Math.min(0.8, alpha + 0.3) + ")";
            ctx!.fill();
        });

        animationId = requestAnimationFrame(draw);
    }

    function handleResize() {
        if (!canvas) return;

        const newWidth = canvas.clientWidth;

        if (newWidth === lastWidth) return;

        lastWidth = newWidth;
        width = newWidth;
        height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;

        init();
    }

    function handleScroll() {
        targetScrollOffset = window.scrollY;
    }

    onMount(() => {
        ctx = canvas.getContext("2d");

        // Initial init
        if (canvas) {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
            lastWidth = width;
            canvas.width = width;
            canvas.height = height;
        }
        init();

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
