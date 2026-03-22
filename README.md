# 🔮 All Seeing Glass — Dicyanin Filter

**🌐 Live:** https://jkgb92-png.github.io/all-seeing-glass/

A web application that applies a **dicyanin filter** to images, simulating the effect of the legendary aura-revealing dicyanin dye.

## Features

- ⏱ **Momentum Dashboard** — real-time clock, daily focus, and to-do list with local persistence
- 📁 **Image Upload** — apply the dicyanin filter to any uploaded image (JPG, PNG, GIF, WebP, etc.)
- 📷 **Live Camera** — real-time dicyanin filter applied to your device camera feed
- ⚗️ Pixel-level canvas filter with adjustable intensity (0.5× to 2.0×)
- 🖼️ Side-by-side before/after preview for uploaded images
- ⬇️ Download the filtered result or take a camera snapshot as PNG

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

Open [http://localhost:3000/all-seeing-glass/](http://localhost:3000/all-seeing-glass/) in your browser.

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
    ├── App.jsx                       # Root component with mode tabs
    ├── App.css                       # App & component styles
    └── components/
        ├── DicyaninFilter.js         # Core filter class (canvas pixel manipulation)
        ├── DicyaninFilter.jsx        # CSS-based filter wrapper (for live previews)
        ├── ImageUploader.jsx         # Upload, canvas render, filter controls
        ├── CameraFilter.jsx          # Live camera feed with real-time dicyanin filter
        └── MomentumDashboard.jsx     # Momentum-style clock, focus, and to-do list
```

## Usage

### Image Upload
1. Click the **🖼 Image Upload** tab
2. Click **Choose Image** and select a photo
3. Drag the **Filter Intensity** slider to your desired strength
4. Click **⚗️ Apply Dicyanin Filter**
5. Compare the before/after canvases
6. Click **⬇️ Download Result** to save the filtered image

### Live Camera
1. Click the **📷 Live Camera** tab
2. Click **📷 Start Camera** and allow camera access
3. Adjust the intensity slider in real-time
4. Click **📸 Snapshot** to save the current frame

### Momentum Dashboard
1. Click the **⏱ Momentum** tab (default on launch)
2. Click the greeting to set your name
3. Click the focus area to set your daily focus
4. Add tasks to the to-do list and mark them complete

## Tech Stack

- [React 18](https://react.dev/)
- [Vite 4](https://vitejs.dev/)
- HTML5 Canvas API (pixel-level image processing)
