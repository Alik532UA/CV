import { CanvasEngine } from "./CanvasEngine";

export class WavesEngine extends CanvasEngine {
    private waveTime = 0;
    
    // Configurable parameters
    private waveBaseHeight = 0.9;
    private waveScrollSpeed = 0.25;
    private waveLayers = 3;

    public setWaveLayers(layers: number) {
        this.waveLayers = layers;
    }

    protected init() {
        // No specific init needed for waves, they are purely math-based
    }

    protected draw() {
        if (!this.ctx) return;
        const colors = this.getColors();
        this.waveTime += 0.005;
        const scrollInfluence = this.currentScrollY * 0.002;
        this.ctx.clearRect(0, 0, this.width, this.height);

        const layers = Math.max(1, Math.min(10, this.waveLayers));
        const heightSpan = this.height * 0.38;
        const startBaseY = this.height - heightSpan;
        const layerStep = layers > 1 ? heightSpan / (layers - 1) : 0;

        for (let layer = 0; layer < layers; layer++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.height);

            const baseY = layers > 1 ? startBaseY + layer * layerStep : startBaseY + heightSpan * 0.5;
            const freq1 = 0.002 + layer * 0.0006;
            const freq2 = 0.004 + layer * 0.0008;
            const amp1 = 35 + (layers - layer) * 3;
            const amp2 = 20 + Math.sin(layer) * 8;
            const speedFactor = 0.6 + layer * 0.15;

            for (let x = 0; x <= this.width; x += 6) {
                const wave1 = Math.sin(x * freq1 + this.waveTime * speedFactor + layer + scrollInfluence) * amp1;
                const wave2 = Math.cos(x * freq2 - this.waveTime * (speedFactor * 0.8) + layer * 1.5) * amp2;
                const y = baseY + wave1 + wave2 - this.currentScrollY * (0.1 + layer * 0.02);
                this.ctx.lineTo(x, y);
            }

            this.ctx.lineTo(this.width, this.height);
            this.ctx.closePath();

            const gradient = this.ctx.createLinearGradient(0, baseY - 40, this.width, this.height);
            const alpha = Math.max(0.015, 0.11 * Math.pow(0.82, layer));
            gradient.addColorStop(0, colors.primary + alpha + ")");
            gradient.addColorStop(0.5, colors.secondary + alpha * 0.85 + ")");
            gradient.addColorStop(1, colors.primary + alpha + ")");
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    }
}
