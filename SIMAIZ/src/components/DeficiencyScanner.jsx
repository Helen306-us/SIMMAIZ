import { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';

// ─────────────────────────────────────────────
//  DEFICIENCY CONFIG
// ─────────────────────────────────────────────

const DEFICIENCY_CONFIG = {
  'Healthy': {
    label: 'Saludable',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.35)',
    icon: '🌿',
    nutrient: null,
  },
  'Nitrogen Deficiency': {
    label: 'Deficiencia de Nitrógeno',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.12)',
    border: 'rgba(251, 191, 36, 0.35)',
    icon: '🟡',
    nutrient: 'N',
  },
  'Phosphorus Deficiency': {
    label: 'Deficiencia de Fósforo',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.12)',
    border: 'rgba(168, 85, 247, 0.35)',
    icon: '🟣',
    nutrient: 'P',
  },
  'Potassium Deficiency': {
    label: 'Deficiencia de Potasio',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.12)',
    border: 'rgba(249, 115, 22, 0.35)',
    icon: '🟠',
    nutrient: 'K',
  },
};

// ─────────────────────────────────────────────
//  MAPPING LOGIC
// ─────────────────────────────────────────────

function mapConfidenceToSoilLevel(deficiencyClass, confidence) {
  if (deficiencyClass.toLowerCase() === 'healthy') return 85;
  // confidence 1.0 → soil ~15% (severe)
  // confidence 0.5 → soil ~58% (moderate)
  // confidence 0.3 → soil ~74% (mild)
  return Math.round(100 - (confidence * 85));
}

function mapRoboflowResultsToSoilValues(predictions) {
  let N_soil = 80;
  let P_soil = 80;
  let K_soil = 80;

  if (!predictions || predictions.length === 0) {
    return { N_soil, P_soil, K_soil }; // no detections = assume healthy
  }

  predictions.forEach(pred => {
    const soilLevel = mapConfidenceToSoilLevel(pred.class, pred.confidence);
    const cls = pred.class.toLowerCase();

    if (cls.includes('nitrogen')) N_soil = Math.min(N_soil, soilLevel);
    if (cls.includes('phosphor')) P_soil = Math.min(P_soil, soilLevel);
    if (cls.includes('potassium')) K_soil = Math.min(K_soil, soilLevel);
    if (cls === 'healthy') { N_soil = 85; P_soil = 85; K_soil = 85; }
  });

  return { N_soil, P_soil, K_soil };
}

// ─────────────────────────────────────────────
//  CONFIDENCE BAR
// ─────────────────────────────────────────────

function ConfidenceBar({ value, color }) {
  const pct = Math.round(value * 100);
  return (
    <div className="ds-conf-bar-wrap">
      <div className="ds-conf-track">
        <div
          className="ds-conf-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>
      <span className="ds-conf-pct" style={{ color }}>{pct}%</span>
    </div>
  );
}

// ─────────────────────────────────────────────
//  PREDICTION CARD
// ─────────────────────────────────────────────

function PredictionCard({ pred, soilLevel }) {
  const clsKey = Object.keys(DEFICIENCY_CONFIG).find(k => k.toLowerCase() === pred.class.toLowerCase()) || pred.class;
  const cfg = DEFICIENCY_CONFIG[clsKey] || {
    label: pred.class, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.3)', icon: '❓',
  };

  return (
    <div
      className="ds-pred-card"
      style={{ background: cfg.bg, borderColor: cfg.border }}
    >
      <div className="ds-pred-header">
        <span className="ds-pred-icon">{cfg.icon}</span>
        <div className="ds-pred-meta">
          <span className="ds-pred-label" style={{ color: cfg.color }}>{cfg.label}</span>
          <span className="ds-pred-class">{pred.class}</span>
        </div>
        <div className="ds-pred-soil" style={{ color: cfg.color }}>
          Suelo: <strong>{soilLevel}%</strong>
        </div>
      </div>
      <ConfidenceBar value={pred.confidence} color={cfg.color} />
    </div>
  );
}

// ─────────────────────────────────────────────
//  SOIL VALUES PREVIEW
// ─────────────────────────────────────────────

function SoilPreview({ values }) {
  const items = [
    { key: 'N_soil', label: 'Nitrógeno (N)', color: '#4ade80' },
    { key: 'P_soil', label: 'Fósforo (P)', color: '#a855f7' },
    { key: 'K_soil', label: 'Potasio (K)', color: '#fb923c' },
  ];

  return (
    <div className="ds-soil-preview">
      <div className="ds-soil-title">Valores que se aplicarán al simulador</div>
      <div className="ds-soil-grid">
        {items.map(({ key, label, color }) => {
          const val = values[key];
          return (
            <div key={key} className="ds-soil-item" style={{ borderColor: `${color}40` }}>
              <span className="ds-soil-nut" style={{ color }}>{label}</span>
              <div className="ds-soil-bar-wrap">
                <div className="ds-soil-bar-track">
                  <div
                    className="ds-soil-bar-fill"
                    style={{
                      width: `${val}%`,
                      background: `linear-gradient(90deg, ${color}80, ${color})`,
                    }}
                  />
                </div>
                <span className="ds-soil-val" style={{ color }}>{val}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────────

export default function DeficiencyScanner({ apiKey, onDeficiencyDetected }) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [soilValues, setSoilValues] = useState(null);
  const [error, setError] = useState(null);
  const [applied, setApplied] = useState(false);

  const fileInputRef = useRef(null);

  // ── Reset state ──
  const resetScanner = () => {
    setImageFile(null);
    setImagePreview(null);
    setPredictions(null);
    setSoilValues(null);
    setError(null);
    setApplied(false);
    setLoading(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetScanner();
  };

  // ── Image loading ──
  const loadImage = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setPredictions(null);
    setSoilValues(null);
    setError(null);
    setApplied(false);
  }, []);

  // ── Drag & Drop ──
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadImage(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) loadImage(file);
  };

  // ── Convert file → base64 ──
  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]); // Prefix must be stripped for correct transmission
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ── API Call — direct roboflow endpoint ──
  const handleScan = async () => {
    if (!imageFile) return;
    setLoading(true);
    setError(null);
    setPredictions(null);
    setSoilValues(null);
    setApplied(false);

    try {
      const base64Image = await fileToBase64(imageFile);

      const response = await fetch(
        `https://serverless.roboflow.com/helens-workspaceteoria/workflows/detect-and-classify-2?api_key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: apiKey,
            inputs: {
              "image": { "type": "base64", "value": base64Image }
            }
          })
        }
      );

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Error de red o CORS (${response.status}): ${txt}`);
      }

      const result = await response.json();
      
      // Workflow API might return 200 OK but with an internal schema error
      if (result && result.error_type) {
        throw new Error(`Error Interno de IA: ${result.message || result.error_type}`);
      }

      let preds = [];
      const findPreds = (obj) => {
        if (!obj) return;
        if (Array.isArray(obj)) {
          obj.forEach(item => {
            if (item && item.class && item.confidence !== undefined) {
              item.confidence = Number(item.confidence);
              preds.push(item);
            } else if (item && item.top && item.confidence !== undefined) {
              preds.push({ class: item.top, confidence: Number(item.confidence) });
            } else {
              findPreds(item);
            }
          });
        } else if (typeof obj === 'object') {
          for (const key in obj) {
            if (key !== 'class' && obj[key] && obj[key].confidence !== undefined && !obj[key].class) {
              preds.push({ class: key, confidence: Number(obj[key].confidence) });
            }
            findPreds(obj[key]);
          }
        }
      };

      findPreds(result);

      const dedupMap = {};
      preds.forEach(p => {
        if (!dedupMap[p.class] || p.confidence > dedupMap[p.class].confidence)
          dedupMap[p.class] = p;
      });
      const deduped = Object.values(dedupMap).sort((a, b) => b.confidence - a.confidence);

      if (deduped.length === 0) {
        // Strip visualization from JSON so we can actually see the predictions structure!
        const clone = JSON.parse(JSON.stringify(result));
        if (clone.outputs && clone.outputs[0] && clone.outputs[0].visualization) {
          clone.outputs[0].visualization = "[BASE64_OMITTED]";
        }
        throw new Error("Roboflow JSON: " + JSON.stringify(clone).substring(0, 800));
      }

      setPredictions(deduped);
      setSoilValues(mapRoboflowResultsToSoilValues(deduped));
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al conectar con la API de Roboflow.');
    } finally {
      setLoading(false);
    }
  };

  // ── Apply to Simulator ──
  const handleApply = () => {
    if (!soilValues || !onDeficiencyDetected) return;
    onDeficiencyDetected(soilValues);
    setApplied(true);
  };

  // ── Backdrop click ──
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────

  return (
    <>
      {/* Trigger Button */}
      <button
        id="btn-scan-field"
        className="ds-trigger-btn"
        onClick={() => setIsOpen(true)}
        title="Analizar hoja de maíz con IA para detectar deficiencias nutricionales"
      >
        <span className="ds-trigger-icon">📷</span>
        <span>Escanear Campo</span>
      </button>

      {/* Modal — renderizado via Portal en document.body para escapar overflow:hidden del sidebar */}
      {isOpen && createPortal(
        <div className="ds-backdrop" onClick={handleBackdropClick}>
          <div className="ds-modal" role="dialog" aria-modal="true" aria-label="Scanner de Deficiencias">

            {/* Header */}
            <div className="ds-modal-header">
              <div className="ds-modal-title-wrap">
                <div className="ds-modal-icon">🔬</div>
                <div>
                  <h2 className="ds-modal-title">Scanner de Deficiencias</h2>
                  <p className="ds-modal-subtitle">
                    Powered by <span className="ds-roboflow-badge">Roboflow AI</span> · Maize Deficiency Scanner v1
                  </p>
                </div>
              </div>
              <button className="ds-close-btn" onClick={handleClose} aria-label="Cerrar">✕</button>
            </div>

            {/* Body */}
            <div className="ds-modal-body">

              {/* Left — Upload */}
              <div className="ds-upload-col">
                <div className="ds-col-label">1. Cargar foto de hoja</div>

                {/* Drop Zone */}
                <div
                  className={`ds-drop-zone ${isDragging ? 'dragging' : ''} ${imagePreview ? 'has-image' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !imagePreview && fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="ds-preview-wrap">
                      <img src={imagePreview} alt="Hoja de maíz" className="ds-preview-img" />
                      <button
                        className="ds-remove-btn"
                        onClick={(e) => { e.stopPropagation(); resetScanner(); }}
                        title="Eliminar imagen"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="ds-drop-content">
                      <div className="ds-drop-icon">🌿</div>
                      <p className="ds-drop-text">Arrastra una foto aquí</p>
                      <p className="ds-drop-sub">o haz click para seleccionar</p>
                      <div className="ds-drop-formats">JPG · PNG · WEBP</div>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  id="ds-file-input"
                />

                {imagePreview && (
                  <button
                    className="ds-select-alt-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    🔄 Cambiar imagen
                  </button>
                )}

                {/* Scan Button */}
                <button
                  id="btn-scan-analyze"
                  className={`ds-scan-btn ${loading ? 'scanning' : ''}`}
                  onClick={handleScan}
                  disabled={!imageFile || loading}
                >
                  {loading ? (
                    <>
                      <span className="ds-spinner" />
                      Analizando...
                    </>
                  ) : (
                    <>🧬 Analizar con IA</>
                  )}
                </button>

                {/* Error */}
                {error && (
                  <div className="ds-error">
                    <span>⚠</span> {error}
                  </div>
                )}

                {/* Info box */}
                <div className="ds-info-box">
                  <div className="ds-info-title">¿Qué detecta?</div>
                  {Object.entries(DEFICIENCY_CONFIG).map(([cls, cfg]) => (
                    <div key={cls} className="ds-info-item">
                      <span>{cfg.icon}</span>
                      <span style={{ color: cfg.color }}>{cfg.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Results */}
              <div className="ds-results-col">
                <div className="ds-col-label">2. Resultados del análisis</div>

                {/* Empty state */}
                {!predictions && !loading && (
                  <div className="ds-empty-state">
                    <div className="ds-empty-icon">🔍</div>
                    <p className="ds-empty-text">
                      Carga una foto de una hoja de maíz y presiona "Analizar con IA" para detectar deficiencias nutricionales.
                    </p>
                    <div className="ds-empty-steps">
                      <div className="ds-empty-step">
                        <span className="ds-step-num">1</span>
                        <span>Cargar foto de campo real</span>
                      </div>
                      <div className="ds-empty-step">
                        <span className="ds-step-num">2</span>
                        <span>IA detecta deficiencias</span>
                      </div>
                      <div className="ds-empty-step">
                        <span className="ds-step-num">3</span>
                        <span>Simulador se actualiza automáticamente</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                  <div className="ds-loading-state">
                    <div className="ds-loading-ring">
                      <div className="ds-loading-ring-inner" />
                    </div>
                    <p className="ds-loading-text">Procesando imagen con IA...</p>
                    <p className="ds-loading-sub">Conectando con Roboflow · Maize Deficiency Scanner</p>
                  </div>
                )}

                {/* Predictions */}
                {predictions && !loading && (
                  <div className="ds-predictions">
                    {predictions.length === 0 ? (
                      <div className="ds-no-preds">
                        <span>🌱</span>
                        <p>No se detectaron deficiencias claras. La hoja parece saludable.</p>
                      </div>
                    ) : (
                      <>
                        {predictions.some(p => p.confidence < 0.60) && (
                          <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fecaca' }}>
                            <strong>⚠ Advertencia:</strong> Low confidence result, consider retaking photo. (Resultado de baja confianza, considera tomar otra foto).
                          </div>
                        )}
                        <div className="ds-preds-header">
                          <span className="ds-preds-count">{predictions.length} detección{predictions.length !== 1 ? 'es' : ''}</span>
                          <span className="ds-preds-tag">ordenadas por confianza</span>
                        </div>

                        <div className="ds-preds-list">
                          {predictions.map((pred, i) => (
                            <PredictionCard
                              key={i}
                              pred={pred}
                              soilLevel={mapConfidenceToSoilLevel(pred.class, pred.confidence)}
                            />
                          ))}
                        </div>

                        {/* Soil preview */}
                        {soilValues && <SoilPreview values={soilValues} />}

                        {/* Apply button */}
                        <button
                          id="btn-apply-deficiency"
                          className={`ds-apply-btn ${applied ? 'applied' : ''}`}
                          onClick={handleApply}
                          disabled={applied}
                        >
                          {applied ? (
                            <>✅ Aplicado al Simulador</>
                          ) : (
                            <>⚡ Aplicar al Simulador</>
                          )}
                        </button>

                        {applied && (
                          <div className="ds-applied-note">
                            Los valores de N, P y K han sido actualizados. Presiona "▶ Aplicar Configuración" en el panel izquierdo para recalcular el campo.
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        , document.body)}
    </>
  );
}
