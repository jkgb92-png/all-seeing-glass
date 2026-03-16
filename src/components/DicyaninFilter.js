class DicyaninFilter {
    constructor(intensity = 1) {
        this.intensity = intensity;
    }

    apply(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
            let newR = Math.min(255, r * (0.6 + luminance * 0.4) * this.intensity);
            let newG = Math.min(255, g * (0.7 + luminance * 0.3) * this.intensity);
            let newB = Math.min(255, b * (1.2 + luminance * 0.5) * this.intensity);

            const contrast = 1.3 * this.intensity;
            newR = Math.min(255, (newR - 128) * contrast + 128);
            newG = Math.min(255, (newG - 128) * contrast + 128);
            newB = Math.min(255, (newB - 128) * contrast + 128);

            data[i] = Math.max(0, newR);
            data[i + 1] = Math.max(0, newG);
            data[i + 2] = Math.max(0, newB);
            data[i + 3] = a;
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

export default DicyaninFilter;