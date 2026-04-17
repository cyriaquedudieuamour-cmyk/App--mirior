import { useState, useRef, useEffect, useCallback } from "react";
import Head from "next/head";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #0a0a0a; height: 100%; }

  .mirror-app {
    font-family: 'DM Sans', sans-serif;
    background: #080808;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #e8e0d0;
    position: relative;
    overflow: hidden;
  }
  .mirror-app::before {
    content: '';
    position: fixed;
    top: -40%; left: -20%;
    width: 70%; height: 70%;
    background: radial-gradient(ellipse, rgba(180,150,100,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .header {
    width: 100%;
    max-width: 480px;
    padding: 24px 28px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 10;
  }
  .logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 28px;
    font-weight: 300;
    letter-spacing: 0.12em;
    color: #c8b888;
    font-style: italic;
  }
  .status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 11px;
    letter-spacing: 0.08em;
    color: #666;
  }
  .status-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #4caf50;
    box-shadow: 0 0 8px #4caf5088;
    transition: all 0.3s;
  }
  .status-dot.offline { background: #ff5252; box-shadow: 0 0 8px #ff525288; }

  .camera-container {
    width: 100%;
    max-width: 480px;
    padding: 0 20px;
    position: relative;
    z-index: 5;
  }
  .camera-frame {
    width: 100%;
    aspect-ratio: 3/4;
    border-radius: 24px;
    overflow: hidden;
    position: relative;
    background: #111;
    box-shadow:
      0 0 0 1px rgba(200,184,136,0.15),
      0 24px 80px rgba(0,0,0,0.8),
      inset 0 0 80px rgba(0,0,0,0.4);
  }
  .camera-frame::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%, rgba(0,0,0,0.2) 100%);
    z-index: 10;
    pointer-events: none;
    border-radius: 24px;
  }
  .camera-frame::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 60px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.4), transparent);
    z-index: 11;
    pointer-events: none;
  }
  .video-element {
    width: 100%; height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
    display: block;
  }
  .captured-img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  .camera-error-screen {
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 32px;
    text-align: center;
    background: linear-gradient(160deg, #111 0%, #0d0d0d 100%);
  }
  .error-icon { font-size: 52px; opacity: 0.4; }
  .error-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    color: #c8b888;
    font-weight: 300;
    letter-spacing: 0.05em;
  }
  .error-text {
    font-size: 13px;
    color: #666;
    line-height: 1.6;
    max-width: 260px;
  }
  .retry-btn {
    margin-top: 8px;
    background: rgba(200,184,136,0.12);
    border: 1px solid rgba(200,184,136,0.3);
    color: #c8b888;
    padding: 10px 24px;
    border-radius: 30px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    letter-spacing: 0.08em;
    transition: all 0.2s;
  }
  .retry-btn:hover { background: rgba(200,184,136,0.2); }

  .corner-tl, .corner-tr, .corner-bl, .corner-br {
    position: absolute;
    width: 22px; height: 22px;
    z-index: 12; pointer-events: none;
  }
  .corner-tl { top: 14px; left: 14px; border-top: 1.5px solid rgba(200,184,136,0.5); border-left: 1.5px solid rgba(200,184,136,0.5); border-radius: 4px 0 0 0; }
  .corner-tr { top: 14px; right: 14px; border-top: 1.5px solid rgba(200,184,136,0.5); border-right: 1.5px solid rgba(200,184,136,0.5); border-radius: 0 4px 0 0; }
  .corner-bl { bottom: 14px; left: 14px; border-bottom: 1.5px solid rgba(200,184,136,0.5); border-left: 1.5px solid rgba(200,184,136,0.5); border-radius: 0 0 0 4px; }
  .corner-br { bottom: 14px; right: 14px; border-bottom: 1.5px solid rgba(200,184,136,0.5); border-right: 1.5px solid rgba(200,184,136,0.5); border-radius: 0 0 4px 0; }

  .controls {
    width: 100%;
    max-width: 480px;
    padding: 24px 20px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    position: relative;
    z-index: 10;
  }
  .ctrl-btn {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: #aaa;
    width: 50px; height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 20px;
    transition: all 0.2s;
  }
  .ctrl-btn:hover:not(:disabled) {
    background: rgba(255,255,255,0.08);
    color: #c8b888;
    border-color: rgba(200,184,136,0.3);
    transform: scale(1.05);
  }
  .ctrl-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .capture-btn {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: transparent;
    border: 2.5px solid rgba(200,184,136,0.7);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    transition: all 0.2s;
    box-shadow: 0 0 20px rgba(200,184,136,0.1);
  }
  .capture-btn::before {
    content: '';
    width: 54px; height: 54px;
    border-radius: 50%;
    background: rgba(200,184,136,0.15);
    transition: all 0.2s;
  }
  .capture-btn:hover::before { background: rgba(200,184,136,0.3); transform: scale(0.95); }
  .capture-btn:active::before { transform: scale(0.88); background: rgba(200,184,136,0.5); }
  .capture-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .ai-btn {
    background: rgba(200,184,136,0.1);
    border: 1px solid rgba(200,184,136,0.35);
    color: #c8b888;
    padding: 0 22px;
    height: 50px;
    border-radius: 30px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.06em;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .ai-btn:hover:not(:disabled) {
    background: rgba(200,184,136,0.2);
    box-shadow: 0 0 20px rgba(200,184,136,0.15);
  }
  .ai-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(200,184,136,0.3);
    border-top-color: #c8b888;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .retake-btn {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: #888;
    padding: 0 18px;
    height: 50px;
    border-radius: 30px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .retake-btn:hover { border-color: rgba(255,255,255,0.2); color: #aaa; }

  .analysis-panel {
    width: calc(100% - 40px);
    max-width: 440px;
    margin: 0 0 32px;
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(200,184,136,0.12);
    border-radius: 20px;
    overflow: hidden;
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    z-index: 10;
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .panel-header {
    padding: 18px 22px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .panel-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 300;
    color: #c8b888;
    letter-spacing: 0.06em;
  }
  .panel-body {
    padding: 18px 22px 22px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .analysis-row {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .analysis-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #555;
    min-width: 70px;
    padding-top: 2px;
  }
  .analysis-value {
    font-size: 14px;
    color: #d0c8b8;
    line-height: 1.5;
    font-weight: 300;
  }
  .message-card {
    background: rgba(200,184,136,0.06);
    border: 1px solid rgba(200,184,136,0.12);
    border-radius: 12px;
    padding: 14px 16px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-style: italic;
    color: #c8b888;
    line-height: 1.6;
    letter-spacing: 0.02em;
  }
  .smile-bar {
    width: 100%;
    height: 4px;
    background: rgba(255,255,255,0.06);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 6px;
  }
  .smile-fill {
    height: 100%;
    background: linear-gradient(90deg, #c8b888, #f0d89a);
    border-radius: 2px;
    transition: width 1s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .divider {
    width: 100%;
    height: 1px;
    background: rgba(255,255,255,0.05);
  }
  .error-msg {
    padding: 20px 22px;
    color: #ff8a80;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .watermark {
    position: relative;
    z-index: 10;
    margin-top: auto;
    padding: 20px;
    font-size: 10px;
    color: #2a2a2a;
    letter-spacing: 0.2em;
    text-align: center;
    text-transform: uppercase;
  }
  canvas { display: none; }
`;

export default function MiroirApp() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState("user");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  const startCamera = useCallback(async (mode) => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setCameraError(false);
    } catch {
      setCameraError(true);
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    startCamera("user");
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, [startCamera]);

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.88));
    setAnalysis(null);
  };

  const flipCamera = async () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    setCapturedImage(null);
    setAnalysis(null);
    await startCamera(newMode);
  };

  const retake = () => {
    setCapturedImage(null);
    setAnalysis(null);
  };

  const analyzeWithAI = async () => {
    if (!capturedImage) return;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const base64 = capturedImage.split(',')[1];
      const resp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64 }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      setAnalysis({ type: 'success', ...data });
    } catch (err) {
      setAnalysis({ type: 'error', message: err.message || "Analyse impossible." });
    }
    setAnalyzing(false);
  };

  return (
    <>
      <Head>
        <title>Miroir — Application Miroir IA</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="description" content="Application miroir avec analyse IA du visage" />
        <meta name="theme-color" content="#080808" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </Head>
      <style>{styles}</style>

      <div className="mirror-app">
        <div className="header">
          <div className="logo">Miroir</div>
          <div className="status-pill">
            <div className={`status-dot ${isOnline ? '' : 'offline'}`} />
            {isOnline ? 'En ligne' : 'Hors ligne'}
          </div>
        </div>

        <div className="camera-container">
          <div className="camera-frame">
            <div className="corner-tl" /><div className="corner-tr" />
            <div className="corner-bl" /><div className="corner-br" />

            {capturedImage ? (
              <img src={capturedImage} className="captured-img" alt="Capture" />
            ) : cameraError ? (
              <div className="camera-error-screen">
                <div className="error-icon">🪞</div>
                <div className="error-title">Caméra non disponible</div>
                <div className="error-text">
                  Autorisez l'accès à la caméra dans les paramètres de votre navigateur.
                </div>
                <button className="retry-btn" onClick={() => startCamera(facingMode)}>
                  Réessayer
                </button>
              </div>
            ) : (
              <video ref={videoRef} className="video-element" autoPlay playsInline muted />
            )}
          </div>
        </div>

        <canvas ref={canvasRef} />

        <div className="controls">
          {capturedImage ? (
            <>
              <button className="retake-btn" onClick={retake}>← Reprendre</button>
              <button
                className="ai-btn"
                onClick={analyzeWithAI}
                disabled={analyzing || !isOnline}
                title={!isOnline ? "Connexion requise" : ""}
              >
                {analyzing ? <><div className="spinner" /> Analyse…</> : <>✦ Analyser</>}
              </button>
            </>
          ) : (
            <>
              <button className="ctrl-btn" onClick={flipCamera} disabled={!cameraActive} title="Retourner caméra">🔄</button>
              <button className="capture-btn" onClick={capturePhoto} disabled={!cameraActive} />
              <button className="ctrl-btn" disabled title="Galerie (bientôt)">🖼</button>
            </>
          )}
        </div>

        {analysis && (
          <div className="analysis-panel">
            {analysis.type === 'error' ? (
              <div className="error-msg">⚠ {analysis.message}</div>
            ) : (
              <>
                <div className="panel-header">
                  <span style={{color:'#c8b888'}}>✦</span>
                  <div className="panel-title">Analyse du visage</div>
                </div>
                <div className="panel-body">
                  <div className="message-card">"{analysis.message}"</div>
                  <div className="divider" />
                  <div className="analysis-row">
                    <div className="analysis-label">Expression</div>
                    <div className="analysis-value">{analysis.expression}</div>
                  </div>
                  <div className="analysis-row">
                    <div className="analysis-label">Humeur</div>
                    <div className="analysis-value">{analysis.humeur}</div>
                  </div>
                  <div className="analysis-row">
                    <div className="analysis-label">Conseil</div>
                    <div className="analysis-value">{analysis.conseil}</div>
                  </div>
                  <div>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                      <span style={{fontSize:10,letterSpacing:'0.15em',textTransform:'uppercase',color:'#555'}}>Sourire</span>
                      <span style={{fontSize:12,color:'#c8b888'}}>{analysis.sourire}%</span>
                    </div>
                    <div className="smile-bar">
                      <div className="smile-fill" style={{width:`${analysis.sourire}%`}} />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="watermark">Miroir · Powered by AI</div>
      </div>
    </>
  );
}
