# 🔮 All Seeing Glass — Dicyanin Filter

A web application that applies a **dicyanin filter** to images, simulating the effect of the legendary aura-revealing dicyanin dye.

## Features

- 📁 Upload any image (JPG, PNG, GIF, WebP, etc.)
- ⚗️ Apply the dicyanin pixel-level filter to the canvas
- 🎚️ Adjustable intensity slider (0.5× to 2.0×)
- 🖼️ Side-by-side before/after preview
- ⬇️ Download the filtered result as PNG

## How the Filter Works

The dicyanin filter processes every pixel by:

1. **Calculating luminance** from RGB: `L = (R×0.299 + G×0.587 + B×0.114) / 255`
2. **Adjusting channels** based on luminance:
   - Red: `R × (0.6 + L×0.4) × intensity`
   - Green: `G × (0.7 + L×0.3) × intensity`
   - Blue: `B × (1.2 + L×0.5) × intensity` ← boosted to create the cyan/blue shift
3. **Applying contrast enhancement**: `(value − 128) × (1.3 × intensity) + 128`

## Getting Started

### Prerequisites

- Node.js 16+
- npm 7+

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run serve
```

## Project Structure

```
all-seeing-glass/
├── index.html                        # HTML entry point
├── vite.config.js                    # Vite build config
├── package.json
└── src/
    ├── main.jsx                      # React app bootstrap
    ├── index.css                     # Global styles
    ├── App.jsx                       # Root component
    ├── App.css                       # App & component styles
    └── components/
        ├── DicyaninFilter.js         # Core filter class (canvas pixel manipulation)
        ├── DicyaninFilter.jsx        # CSS-based filter wrapper (for live previews)
        └── ImageUploader.jsx         # Upload, canvas render, filter controls
```

## Usage

1. Click **Choose Image** and select a photo
2. Drag the **Filter Intensity** slider to your desired strength
3. Click **⚗️ Apply Dicyanin Filter**
4. Compare the before/after canvases
5. Click **⬇️ Download Result** to save the filtered image

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 4](https://vitejs.dev/)
- HTML5 Canvas API (pixel-level image processing)
