import React, { useState, useRef, useEffect, useCallback } from 'react';
import DicyaninFilter from './DicyaninFilter.js';

const CameraFilter = () => {
  const [intensity, setIntensity] = useState(1.0);
  const [cameraState, setCameraState] = useState('idle'); // idle | requesting | active | error
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const filterRef = useRef(new DicyaninFilter(intensity));

  // Update filter intensity in place to avoid unnecessary re-creation
  useEffect(() => {
    filterRef.current.intensity = intensity;
  }, [intensity]);

  const drawFrame = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < video.HAVE_ENOUGH_DATA) {
      animFrameRef.current = requestAnimationFrame(drawFrame);
      return;
    }

    // Only update canvas dimensions when the video dimensions change (avoids clearing canvas every frame)
    if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    filterRef.current.apply(ctx, canvas.width, canvas.height);

    animFrameRef.current = requestAnimationFrame(drawFrame);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraState('requesting');
    setErrorMessage('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState('active');
      animFrameRef.current = requestAnimationFrame(drawFrame);
    } catch (err) {
      let msg = 'Unable to access camera.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        msg = 'Camera permission denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        msg = 'No camera found on this device.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        msg = 'Camera is already in use by another application.';
      }
      setErrorMessage(msg);
      setCameraState('error');
    }
  }, [drawFrame]);

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraState('idle');
  }, []);

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const takeSnapshot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'dicyanin-snapshot.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div className="camera-filter">
      {/* Controls */}
      <div className="controls">
        <div className="slider-container">
          <label htmlFor="camera-intensity" className="slider-label">
            Filter Intensity: <span className="intensity-value">{intensity.toFixed(1)}x</span>
          </label>
          <input
            id="camera-intensity"
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
          {cameraState !== 'active' ? (
            <button
              onClick={startCamera}
              className="apply-btn"
              disabled={cameraState === 'requesting'}
            >
              {cameraState === 'requesting' ? '⏳ Starting…' : '📷 Start Camera'}
            </button>
          ) : (
            <>
              <button onClick={stopCamera} className="stop-btn">
                ⏹ Stop Camera
              </button>
              <button onClick={takeSnapshot} className="download-btn">
                📸 Snapshot
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error message */}
      {cameraState === 'error' && (
        <div className="camera-error">
          <p>⚠ {errorMessage}</p>
          <button onClick={startCamera} className="upload-btn">
            Retry
          </button>
        </div>
      )}

      {/* Hidden video element used as the source */}
      <video ref={videoRef} className="camera-video-hidden" playsInline muted />

      {/* Filtered canvas output */}
      {cameraState === 'active' && (
        <div className="camera-canvas-wrapper">
          <h3 className="canvas-label">Live — Dicyanin Filter</h3>
          <canvas ref={canvasRef} className="canvas camera-canvas" />
        </div>
      )}

      {/* Idle / requesting placeholder */}
      {(cameraState === 'idle' || cameraState === 'requesting') && (
        <div className="empty-state">
          {cameraState === 'idle' ? (
            <>
              <p>📷 Press <strong>Start Camera</strong> to begin live filtering</p>
              <p className="empty-hint">The dicyanin filter will be applied in real-time</p>
            </>
          ) : (
            <p>Requesting camera access…</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraFilter;
