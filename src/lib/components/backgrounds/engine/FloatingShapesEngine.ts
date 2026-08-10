import { CanvasEngine } from "./CanvasEngine";

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
    pulseOffset: number;
}

export class FloatingShapesEngine extends CanvasEngine {
    private shapes: FloatingShape[] = [];
    private lineWidth = 300;

    public setLineWidth(width: number) {
        this.lineWidth = width;
    }

    protected init() {
        this.shapes = [];
        const types: ("triangle" | "square" | "hexagon" | "circle")[] = [
            "triangle",
            "square",
            "hexagon",
            "circle",
        ];
        const count = 12;
        for (let i = 0; i < count; i++) {
            this.shapes.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 45 + Math.random() * 75,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.01,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                type: types[Math.floor(Math.random() * types.length)],
                alpha: 0.08 + Math.random() * 0.12,
                pulseOffset: Math.random() * Math.PI * 2,
            });
        }
    }

    protected draw() {
        if (!this.ctx) return;
        const colors = this.getColors();
        const time = Date.now() * 0.001;
        const scrollRotation = this.currentScrollY * 0.001;

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.shapes.forEach((shape) => {
            shape.x += shape.vx;
            shape.y += shape.vy;
            shape.rotation += shape.rotationSpeed;

            const maxOffset = shape.size * 2;
            if (shape.x < -maxOffset) shape.x = this.width + maxOffset;
            if (shape.x > this.width + maxOffset) shape.x = -maxOffset;
            if (shape.y < -maxOffset) shape.y = this.height + maxOffset;
            if (shape.y > this.height + maxOffset) shape.y = -maxOffset;

            // Calculate smooth edge fade factor: shapes strictly fade out to 0% opacity near edges
            const edgeMargin = Math.max(160, shape.size * 1.5);
            const distX = Math.min(shape.x, this.width - shape.x);
            const distY = Math.min(shape.y, this.height - shape.y);
            const edgeDist = Math.min(distX, distY);
            const edgeAlpha = Math.max(0, Math.min(1, edgeDist / edgeMargin));

            const pulse = Math.sin(time * 1.2 + shape.pulseOffset) * 0.3 + 0.7;
            const currentAlpha = Math.max(0, Math.min(1, shape.alpha * pulse * edgeAlpha));

            if (currentAlpha <= 0.001) return;

            this.ctx!.save();
            this.ctx!.translate(shape.x, shape.y);
            this.ctx!.rotate(shape.rotation + scrollRotation);

            this.ctx!.globalAlpha = currentAlpha;
            this.ctx!.strokeStyle = colors.rgbPrimary;
            this.ctx!.lineWidth = this.lineWidth;
            this.ctx!.beginPath();

            switch (shape.type) {
                case "triangle":
                    this.ctx!.moveTo(0, -shape.size);
                    this.ctx!.lineTo(shape.size * 0.866, shape.size * 0.5);
                    this.ctx!.lineTo(-shape.size * 0.866, shape.size * 0.5);
                    this.ctx!.closePath();
                    break;
                case "square":
                    this.ctx!.rect(
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
                        if (i === 0) this.ctx!.moveTo(x, y);
                        else this.ctx!.lineTo(x, y);
                    }
                    this.ctx!.closePath();
                    break;
                case "circle":
                    this.ctx!.arc(0, 0, shape.size, 0, Math.PI * 2);
                    break;
            }

            this.ctx!.stroke();
            this.ctx!.restore();
        });
    }
}
