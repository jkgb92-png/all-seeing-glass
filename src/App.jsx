import React from 'react';
import ImageUploader from './components/ImageUploader';
import './App.css';

const App = () => {
  return (
    <div className="app-container">
      <header className="header">
        <h1>🔮 All Seeing Glass</h1>
        <p className="subtitle">Dicyanin Filter — Reveal the unseen spectrum</p>
      </header>
      <main>
        <ImageUploader />
      </main>
      <footer className="footer">
        <p>Dicyanin filter modifies pixel luminance and contrast to simulate the aura-revealing effect</p>
      </footer>
    </div>
  );
};

export default App;