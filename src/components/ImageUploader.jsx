import React, { useState, useRef, useCallback } from 'react';
import DicyaninFilter from './DicyaninFilter.js';

const ImageUploader = () => {
  const [image, setImage] = useState(null);
  const [intensity, setIntensity] = useState(1.0);
  const [filtered, setFiltered] = useState(false);

  const originalCanvasRef = useRef(null);
  const filteredCanvasRef = useRef(null);

  const drawImageToCanvas = useCallback((img) => {
    const origCanvas = originalCanvasRef.current;
    origCanvas.width = img.width;
    origCanvas.height = img.height;
    origCanvas.getContext('2d').drawImage(img, 0, 0);

    const filtCanvas = filteredCanvasRef.current;
    filtCanvas.width = img.width;
    filtCanvas.height = img.height;
    filtCanvas.getContext('2d').drawImage(img, 0, 0);
  }, []);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        setFiltered(false);
        drawImageToCanvas(img);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }, [drawImageToCanvas]);

  const applyFilter = useCallback(() => {
    if (!image) return;

    const filtCanvas = filteredCanvasRef.current;
    const filtCtx = filtCanvas.getContext('2d');
    filtCtx.drawImage(image, 0, 0);

    const filter = new DicyaninFilter(intensity);
    filter.apply(filtCtx, filtCanvas.width, filtCanvas.height);
    setFiltered(true);
  }, [image, intensity]);

  const downloadImage = useCallback(() => {
    const canvas = filteredCanvasRef.current;
    const link = document.createElement('a');
    link.download = 'dicyanin-filtered.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div className="image-uploader">
      <div className="upload-section">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
          id="file-input"
        />
        <label htmlFor="file-input" className="upload-btn">
          📁 Choose Image
        </label>
        {image && <span className="image-loaded">Image loaded ✓</span>}
      </div>

      {image && (
        <>
          <div className="controls">
            <div className="slider-container">
              <label htmlFor="intensity" className="slider-label">
                Filter Intensity: <span className="intensity-value">{intensity.toFixed(1)}x</span>
              </label>
              <input
                id="intensity"
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={intensity}
                onChange={(e) => setIntensity(parseFloat(e.target.value))}
                className="filter-slider"
              />
              <div className="slider-range">
                <span>0.5x</span>
                <span>2.0x</span>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={applyFilter} className="apply-btn">
                ⚗️ Apply Dicyanin Filter
              </button>
              {filtered && (
                <button onClick={downloadImage} className="download-btn">
                  ⬇ Download Result
                </button>
              )}
            </div>
          </div>

          <div className="canvas-container">
            <div className="canvas-wrapper">
              <h3 className="canvas-label">Original</h3>
              <canvas ref={originalCanvasRef} className="canvas" />
            </div>
            <div className="canvas-wrapper">
              <h3 className="canvas-label">
                {filtered ? 'Dicyanin Filtered' : 'Preview (apply filter to see result)'}
              </h3>
              <canvas ref={filteredCanvasRef} className="canvas" />
            </div>
          </div>
        </>
      )}

      {!image && (
        <div className="empty-state">
          <p>Upload an image to apply the dicyanin filter</p>
          <p className="empty-hint">Supports JPG, PNG, GIF, WebP and more</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
