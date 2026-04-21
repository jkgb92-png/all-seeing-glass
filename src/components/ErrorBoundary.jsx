import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Application error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          background: '#0F0F0F',
          color: '#FF4444',
          fontFamily: "'Courier New', Courier, monospace",
          padding: '40px 24px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: '2rem', letterSpacing: '2px' }}>⚠ Application Error</h1>
          <p style={{ color: '#FF8888', maxWidth: '600px' }}>
            Something went wrong while loading the app. Try refreshing the page.
          </p>
          {this.state.error && (
            <pre style={{
              background: '#1A1A1A',
              border: '1px solid #FF4444',
              borderRadius: '4px',
              padding: '12px 16px',
              fontSize: '0.75rem',
              color: '#FF8888',
              maxWidth: '700px',
              overflowX: 'auto',
              textAlign: 'left',
            }}>
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'transparent',
              border: '1px solid #FF4444',
              color: '#FF4444',
              fontFamily: 'inherit',
              padding: '8px 20px',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            ↺ Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
