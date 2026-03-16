import React, { useEffect, useRef, useState, useCallback } from 'react';
import DicyaninFilter from './DicyaninFilter.js';

const CameraFilter = ({ intensity = 1.0 }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!cameraActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setError(null);
      } catch (err) {
        setError('Camera permission denied or not available');
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraActive]);

  useEffect(() => {
    if (!cameraActive || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);
        
        const filter = new DicyaninFilter(intensity);
        filter.apply(ctx, canvas.width, canvas.height);
      }
      animationRef.current = requestAnimationFrame(processFrame);
    };

    animationRef.current = requestAnimationFrame(processFrame);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [cameraActive, intensity]);

  const captureSnapshot = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `dicyanin-camera-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div className="camera-filter">
      <div className="camera-controls">
        <button
          onClick={() => setCameraActive(!cameraActive)}
          className={`camera-toggle ${cameraActive ? 'active' : ''}`}
        >
          {cameraActive ? '📹 Stop Camera' : '📹 Start Camera'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        style={{ display: 'none' }}
      />

      {cameraActive && (
        <div className="camera-view">
          <canvas ref={canvasRef} className="filtered-canvas" />
          <button onClick={captureSnapshot} className="capture-btn">
            📸 Capture & Download
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraFilter;