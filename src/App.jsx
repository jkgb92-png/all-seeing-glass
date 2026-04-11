import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import CameraFilter from './components/CameraFilter';
import MomentumDashboard from './components/MomentumDashboard';
import './App.css';

const App = () => {
  const [mode, setMode] = useState('momentum'); // 'momentum' | 'upload' | 'camera'

  return (
    <div className="app-container">
      <header className="header">
        <h1>🔮 All Seeing Glass</h1>
        <p className="subtitle">Dicyanin Filter — Reveal the unseen spectrum</p>
      </header>

      <div className="mode-toggle">
        <button
          className={`mode-btn${mode === 'momentum' ? ' mode-btn--active' : ''}`}
          onClick={() => setMode('momentum')}
        >
          ⏱ Momentum
        </button>
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
        {mode === 'momentum' && <MomentumDashboard />}
        {mode === 'upload' && <ImageUploader />}
        {mode === 'camera' && <CameraFilter />}
      </main>

      <footer className="footer">
        <p>Dicyanin (Kilner screen) filter: blocks green/yellow light (≈500–620 nm), passes deep blue/violet (≈400–470 nm) and faint deep red (≈650+ nm), with heightened edge contrast</p>
      </footer>
    </div>
  );
};

export default App;