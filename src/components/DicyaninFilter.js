// Authentic dicyanin (cyanine dye) spectral filter simulation.
//
// Historical context: Dr. Walter J. Kilner used dicyanin-coated glass screens
// in the early 20th century to supposedly reveal human auras.  Dicyanin is a
// synthetic cyanine dye with a distinctive spectral transmission profile:
//
//   • Strongly ABSORBS green/yellow (≈ 500–620 nm)
//   • PASSES deep blue/violet (≈ 400–470 nm)
//   • PASSES some deep red / near-IR (≈ 650+ nm)
//
// The result is a "split-spectrum" appearance – deep blue-violet tones with
// faint preserved reds, very little green, and heightened edge contrast (the
// steep spectral cut-off enhances luminance gradients).
class DicyaninFilter {
    constructor(intensity = 1) {
        this.intensity = intensity;
    }

    apply(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const safeIntensity = Math.max(0.1, this.intensity); // guard against zero

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const a = data[i + 3];

            // Perceived luminance (used to modulate contrast response)
            const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

            // ── Spectral channel mapping ──────────────────────────────────
            // Green (500–620 nm) is almost entirely blocked by dicyanin.
            const newG = g * 0.04 * safeIntensity;

            // Red (650+ nm passes; shorter red is absorbed):
            // dim the overall red but let bright, saturated reds survive.
            const newR = r * (0.28 + luminance * 0.22) * safeIntensity;

            // Blue/violet (400–470 nm passes strongly):
            // boost the blue channel and add a small violet lift from red.
            const violet = r * 0.15; // reds contribute faint violet fringe
            const newB = Math.min(255, (b * (1.6 + luminance * 0.9) + violet) * safeIntensity);

            // ── High contrast (Kilner screen characteristic) ──────────────
            // A steep spectral cut-off sharpens apparent luminance boundaries.
            const contrast = 1.4 * safeIntensity;
            const outR = (newR - 128) * contrast + 128;
            const outG = (newG - 128) * contrast + 128;
            const outB = (newB - 128) * contrast + 128;

            data[i]     = Math.max(0, Math.min(255, outR));
            data[i + 1] = Math.max(0, Math.min(255, outG));
            data[i + 2] = Math.max(0, Math.min(255, outB));
            data[i + 3] = a;
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

export default DicyaninFilter;