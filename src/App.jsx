import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import CameraFilter from './components/CameraFilter';
import './App.css';

const App = () => {
  const [mode, setMode] = useState('upload'); // 'upload' | 'camera'

  return (
    <div className="app-container">
      <header className="header">
        <h1>🔮 All Seeing Glass</h1>
        <p className="subtitle">Dicyanin Filter — Reveal the unseen spectrum</p>
      </header>

      <div className="mode-toggle">
        <button
          className={`mode-btn${mode === 'upload' ? ' mode-btn--active' : ''}`}
          onClick={() => setMode('upload')}
        >
          🖼 Image Upload
        </button>
        <button
          className={`mode-btn${mode === 'camera' ? ' mode-btn--active' : ''}`}
          onClick={() => setMode('camera')}
        >
          📷 Live Camera
        </button>
      </div>

      <main>
        {mode === 'upload' ? <ImageUploader /> : <CameraFilter />}
      </main>

      <footer className="footer">
        <p>Dicyanin filter modifies pixel luminance and contrast to simulate the aura-revealing effect</p>
      </footer>
    </div>
  );
};

export default App;