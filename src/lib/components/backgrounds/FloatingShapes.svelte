<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    export let theme: string = "dark";

    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D | null;
    let animationId: number;
    let scrollY = 0;
    let width = 0;
    let height = 0;

    interface FloatingShape {
        x: number;
        y: number;
        size: number;
        rotation: number;
        rotationSpeed: number;
        vx: number;
        vy: number;
        type: "triangle" | "square" | "hexagon" | "circle";
        alpha: number;
    }
    let shapes: FloatingShape[] = [];

    function getColors() {
        if (theme === "light") {
            return { primary: "rgba(0, 113, 227, " };
        }
        return { primary: "rgba(0, 242, 255, " };
    }

    function init() {
        shapes = [];
        const types: ("triangle" | "square" | "hexagon" | "circle")[] = [
            "triangle",
            "square",
            "hexagon",
            "circle",
        ];
        const count = 12;
        for (let i = 0; i < count; i++) {
            shapes.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: 20 + Math.random() * 40,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                type: types[Math.floor(Math.random() * types.length)],
                alpha: 0.05 + Math.random() * 0.08,
            });
        }
    }

    function draw() {
        if (!ctx) return;
        const colors = getColors();
        const time = Date.now() * 0.001;
        const scrollRotation = scrollY * 0.001;

        ctx.clearRect(0, 0, width, height);

        shapes.forEach((shape) => {
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.rotation += shape.rotationSpeed;

            if (shape.x < -shape.size) shape.x = width + shape.size;
            if (shape.x > width + shape.size) shape.x = -shape.size;
            if (shape.y < -shape.size) shape.y = height + shape.size;
            if (shape.y > height + shape.size) shape.y = -shape.size;

            ctx!.save();
            ctx!.translate(shape.x, shape.y);
            ctx!.rotate(shape.rotation + scrollRotation);

            const pulse = Math.sin(time * 0.8 + shape.rotation) * 0.3 + 0.7;
            const currentAlpha = shape.alpha * pulse;

            ctx!.strokeStyle = colors.primary + currentAlpha + ")";
            ctx!.lineWidth = 1.5;
            ctx!.beginPath();

            switch (shape.type) {
                case "triangle":
                    ctx!.moveTo(0, -shape.size);
                    ctx!.lineTo(shape.size * 0.866, shape.size * 0.5);
                    ctx!.lineTo(-shape.size * 0.866, shape.size * 0.5);
                    ctx!.closePath();
                    break;
                case "square":
                    ctx!.rect(
                        -shape.size / 2,
                        -shape.size / 2,
                        shape.size,
                        shape.size,
                    );
                    break;
                case "hexagon":
                    for (let i = 0; i < 6; i++) {
                        const angle = (i * Math.PI) / 3;
                        const x = Math.cos(angle) * shape.size;
                        const y = Math.sin(angle) * shape.size;
                        if (i === 0) ctx!.moveTo(x, y);
                        else ctx!.lineTo(x, y);
                    }
                    ctx!.closePath();
                    break;
                case "circle":
                    ctx!.arc(0, 0, shape.size, 0, Math.PI * 2);
                    break;
            }

            ctx!.stroke();
            ctx!.restore();
        });

        animationId = requestAnimationFrame(draw);
    }

    function handleResize() {
        if (!canvas) return;

        const newWidth = canvas.clientWidth;
        const newHeight = canvas.clientHeight; // Stable 100lvh

        if (canvas.width === newWidth && canvas.height === newHeight) return;

        width = newWidth;
        height = newHeight;
        canvas.width = width;
        canvas.height = height;

        init();
    }

    function handleScroll() {
        scrollY = window.scrollY;
    }

    onMount(() => {
        ctx = canvas.getContext("2d");

        // Initial setup
        if (canvas) {
            width = canvas.clientWidth;
            height = canvas.clientHeight;
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
