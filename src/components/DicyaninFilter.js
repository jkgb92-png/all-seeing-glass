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
// Authenticity features added beyond basic channel mapping:
//   • Vignette  – real hand-dipped glass screens have thicker dye near the
//     edges, darkening the periphery of the field of view.
//   • UV-fluorescence halo  – objects that fluoresce in the near-UV (skin,
//     white clothing, some minerals) develop a faint indigo–violet glow at
//     high-contrast luminance boundaries, the signature "aura" effect Kilner
//     described.
//   • Optical grain  – the thick dye layer introduces fine, luminance-dependent
//     noise that mimics looking through a refractive medium.
//   • Edge contrast boost  – the steep spectral cut-off of cyanine dye creates
//     an unsharp-mask effect at brightness boundaries.
class DicyaninFilter {
    constructor(intensity = 1) {
        this.intensity = intensity;
        // Pre-compute a small Gaussian kernel for the UV-halo convolution.
        // Using a 3×3 kernel is fast enough for real-time use.
        this._kernel = [
            1 / 16, 2 / 16, 1 / 16,
            2 / 16, 4 / 16, 2 / 16,
            1 / 16, 2 / 16, 1 / 16,
        ];
    }

    // Simple pseudo-random noise seeded by pixel position (deterministic per
    // frame so it does not flicker, yet different for every pixel).
    _grain(i) {
        // LCG constants – cheap but good enough for visual grain.
        const x = ((i * 1664525 + 1013904223) & 0xffffffff) >>> 0;
        return (x / 0xffffffff) - 0.5; // range [-0.5, +0.5]
    }

    apply(ctx, width, height) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        const safeIntensity = Math.max(0.1, this.intensity);

        // We need a copy of the original data for the halo edge-detection pass.
        const orig = new Uint8ClampedArray(data);

        const cx = width / 2;
        const cy = height / 2;
        const maxDist = Math.sqrt(cx * cx + cy * cy);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;

                const r = orig[i];
                const g = orig[i + 1];
                const b = orig[i + 2];
                const a = orig[i + 3];

                // ── Perceived luminance ───────────────────────────────────
                const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

                // ── Spectral channel mapping ──────────────────────────────
                // Green (500–620 nm) almost entirely blocked.
                const newG = g * 0.04 * safeIntensity;

                // Red (650+ nm passes; shorter red absorbed):
                const newR = r * (0.28 + luminance * 0.22) * safeIntensity;

                // Blue/violet (400–470 nm passes strongly) + violet lift from red:
                const violet = r * 0.15;
                const newB = Math.min(255, (b * (1.6 + luminance * 0.9) + violet) * safeIntensity);

                // ── High contrast (Kilner screen characteristic) ──────────
                const contrast = 1.4 * safeIntensity;
                let outR = (newR - 128) * contrast + 128;
                let outG = (newG - 128) * contrast + 128;
                let outB = (newB - 128) * contrast + 128;

                // ── UV-fluorescence halo ──────────────────────────────────
                // Compute local luminance gradient using a 3×3 neighbourhood
                // on the *original* data to detect high-contrast edges.
                // Near such edges inject a faint indigo/violet glow.
                let neighbourLum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const nx = Math.min(width - 1, Math.max(0, x + kx));
                        const ny = Math.min(height - 1, Math.max(0, y + ky));
                        const ni = (ny * width + nx) * 4;
                        neighbourLum +=
                            (orig[ni] * 0.299 + orig[ni + 1] * 0.587 + orig[ni + 2] * 0.114) / 255 *
                            this._kernel[(ky + 1) * 3 + (kx + 1)];
                    }
                }
                const edgeStrength = Math.abs(luminance - neighbourLum) * 8;
                // Indigo halo: boost blue-violet at high-UV-reflective edges.
                const halo = edgeStrength * 60 * safeIntensity;
                outR += halo * 0.35;   // faint magenta fringe
                outB += halo * 0.90;   // dominant indigo/violet

                // ── Optical grain ─────────────────────────────────────────
                // Grain is proportional to local brightness (brighter areas
                // of the dye transmit more, so imperfections are more visible).
                const grainAmt = 12 * safeIntensity * (0.3 + luminance * 0.7);
                const grainVal = this._grain(i) * grainAmt;
                outR += grainVal;
                outG += grainVal * 0.5; // green stays mostly suppressed
                outB += grainVal;

                // ── Vignette ─────────────────────────────────────────────
                // Thicker dye near the edges of the glass → more absorption.
                const dx = x - cx;
                const dy = y - cy;
                const dist = Math.sqrt(dx * dx + dy * dy) / maxDist;
                // Gentle vignette: full brightness in the centre, ~55% at edge.
                const vignette = 1 - dist * dist * 0.55 * safeIntensity;

                data[i]     = Math.max(0, Math.min(255, outR * vignette));
                data[i + 1] = Math.max(0, Math.min(255, outG * vignette));
                data[i + 2] = Math.max(0, Math.min(255, outB * vignette));
                data[i + 3] = a;
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

export default DicyaninFilter;