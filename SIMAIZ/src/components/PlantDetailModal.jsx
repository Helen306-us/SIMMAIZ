import { getPlantImage, getQuality, getCellState } from '../simulation/model';
import leafCompImg from '../assets/images/leaf_comparison.png';


export default function PlantDetailModal({ cell, plantIndex, currentDay, cols, onClose, onDirectFertilize }) {
  if (!cell) return null;

  const quality = getQuality(cell.salud);
  const imageSrc = getPlantImage(cell.salud);
  const row = Math.floor(plantIndex / cols);
  const col = plantIndex % cols;
  
  const nutN = 100 - cell.defN;
  const nutP = 100 - cell.defP;
  const nutK = 100 - cell.defK;

  // Determinar la máxima deficiencia para sugerir acción (si es menor a 80)
  let recNut = null;
  if (nutN < Math.min(nutP, nutK) && nutN < 85) recNut = 'N';
  else if (nutP < Math.min(nutN, nutK) && nutP < 85) recNut = 'P';
  else if (nutK < 85) recNut = 'K';

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-modal dashboard-modal">
        {/* Cabecera */}
        <div className="detail-header">
          <h2>Análisis de Planta S{row + 1}C{col + 1} — Día {currentDay}</h2>
          <button className="detail-close" onClick={onClose}>✕</button>
        </div>

        <div className="dash-body">
          {/* COLUMNA IZQUIERDA: Imágenes e Info Educativa */}
          <div className="dash-left">
            
            <div className="plant-preview-box">
              <img src={imageSrc} alt="Imagen de Planta" className="main-plant-img" />
            </div>
            
            <div className="leaf-comparison-box text-center">
              <h4 className="sec-title text-center">Referencias Visuales Reales</h4>
              <img src={leafCompImg} alt="Comparativa Hoja Sana vs Deficiente" className="comp-img" />
            </div>

            {/* TIPS EDUCATIVOS REINCORPORADOS AQUÍ (De la modal anterior) */}
            <div className="educational-tips">
              <div className="edu-grid">
                <div className="edu-card text-center">
                  <div className="edu-nut" style={{ color: '#4ade80' }}>🟢 Nitrógeno (N)</div>
                  <div className="edu-sym">Amarillamiento foliar. Puntas y centro amarillo clorótico.</div>
                </div>
                <div className="edu-card text-center">
                  <div className="edu-nut" style={{ color: '#a855f7' }}>🟣 Fósforo (P)</div>
                  <div className="edu-sym">Bordes de color púrpura oscuro en las hojas más longevas.</div>
                </div>
                <div className="edu-card text-center">
                  <div className="edu-nut" style={{ color: '#fb923c' }}>🟠 Potasio (K)</div>
                  <div className="edu-sym">Necrosis (quemaduras) en los bordes. Tallos muy débiles.</div>
                </div>
              </div>
            </div>

          </div>

          {/* COLUMNA DERECHA: Datos de Estado en Tiempo Real */}
          <div className="dash-right">
            
            {/* Medidor de Calidad */}
            <div className="stat-panel">
              <h4 className="sec-title text-center">Estadística de la planta</h4>
              <div className="gauge-container">
                <CropQualityGauge salud={cell.salud} />
                <div className="gauge-label">{quality.label}</div>
              </div>

              {/* Bar Chart Sencillo de Nutrientes */}
              <div className="simple-bar-chart">
                <Bar col="#4ade80" val={nutN} label="N" />
                <Bar col="#a855f7" val={nutP} label="P" />
                <Bar col="#fb923c" val={nutK} label="K" />
              </div>
            </div>

            {/* Guía Visual SVG */}
            <div className="stat-panel">
              <h4 className="sec-title text-center">Guía de referencias visual</h4>
              <div className="visual-guide-row">
                <LeafTip tag="NORMAL" type="normal" />
                <LeafTip tag="N" type="n" />
                <LeafTip tag="P" type="p" />
                <LeafTip tag="K" type="k" />
                <LeafTip tag="Zn/Mg" type="zn" />
              </div>
            </div>

            {/* Diagnóstico Escrito Inteligente */}
            <div className="stat-panel diagnosis-panel">
              <h4 className="sec-title text-center">Diagnóstico</h4>
              <p className="diag-text text-center">
                {cell.salud >= 85 ? 'El cultivo presenta condiciones nutricionales en nivel óptimo.' :
                 recNut ? `Se detecta estrés por deficiencia. El nutriente más crítico en el suelo actual es ${recNut}.` :
                 'Estado general débil, monitoree estrés ambiental.'}
              </p>

              {/* ACTION TIP : Botón para aplicar el abono directamente */}
              {recNut && (
                <button 
                  className="fertilize-action-btn"
                  onClick={() => {
                    if (onDirectFertilize) onDirectFertilize(recNut);
                    onClose();
                  }}
                >
                  🌱 Aplicar Fertilizante ({recNut}) al campo
                </button>
              )}
              
              <div className="diag-health-bar" style={{ marginTop: '16px' }}>
                <div className="d-nut-label">Salud de la Planta <span className="float-right">{cell.salud.toFixed(0)}%</span></div>
                <div className="d-bar-bg">
                  <div className="d-bar-fill" style={{ width: `${cell.salud}%`, background: cell.salud > 70 ? '#4ade80' : '#f9c846' }}></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Componentes Secundarios UI
// ──────────────────────────────────────────────

function Bar({ col, val, label }) {
  return (
    <div className="s-bar-col">
      <div className="s-bar-wrapper">
        <div className="s-bar-fill" style={{ height: `${val}%`, background: col }} />
      </div>
      <div className="s-bar-label">{label}</div>
    </div>
  );
}

function CropQualityGauge({ salud }) {
  // Rotación de aguja: salud de 0 a 100 afecta ángulo de -90 a 90 grados
  const angle = (salud / 100) * 180 - 90;
  
  return (
    <svg width="200" height="110" viewBox="0 0 200 110" className="gauge-svg">
      {/* Arco de fondo - Segmentado en 4 zonas */}
      <path d="M 20 100 A 80 80 0 0 1 60 30" fill="none" stroke="#ef4444" strokeWidth="25" /> {/* D (0-40) */}
      <path d="M 60 30 A 80 80 0 0 1 100 20" fill="none" stroke="#f9c846" strokeWidth="25" /> {/* C (40-60) */}
      <path d="M 100 20 A 80 80 0 0 1 140 30" fill="none" stroke="#84cc16" strokeWidth="25" /> {/* B (60-80) */}
      <path d="M 140 30 A 80 80 0 0 1 180 100" fill="none" stroke="#22c55e" strokeWidth="25" /> {/* A (80-100) */}
      
      {/* Letras indicadoras */}
      <text x="35" y="70" fill="white" fontWeight="bold" fontSize="14" textAnchor="middle">D</text>
      <text x="75" y="40" fill="white" fontWeight="bold" fontSize="14" textAnchor="middle">C</text>
      <text x="125" y="40" fill="white" fontWeight="bold" fontSize="14" textAnchor="middle">B</text>
      <text x="165" y="70" fill="white" fontWeight="bold" fontSize="14" textAnchor="middle">A</text>

      {/* Aguja Dinámica */}
      <g transform={`translate(100, 100) rotate(${angle})`} style={{ transition: 'transform 1s ease' }}>
        <polygon points="-5,0 0,-70 5,0" fill="#2d8a2d" stroke="#166534" strokeWidth="1" />
        <circle cx="0" cy="0" r="8" fill="#166534" />
      </g>
      <circle cx="100" cy="100" r="4" fill="#111" />
    </svg>
  );
}

function LeafTip({ tag, type }) {
  let d = "M15,50 C10,35 5,15 15,0 C25,15 20,35 15,50Z";
  let stops = [];

  switch (type) {
    case 'normal':
      stops = [<stop key="1" offset="0%" stopColor="#4ade80" />, <stop key="2" offset="100%" stopColor="#166534" />];
      break;
    case 'n':
      stops = [<stop key="1" offset="0%" stopColor="#fef08a" />, <stop key="2" offset="60%" stopColor="#4ade80" />, <stop key="3" offset="100%" stopColor="#166534" />];
      break;
    case 'p':
      stops = [<stop key="1" offset="0%" stopColor="#4ade80" />, <stop key="2" offset="100%" stopColor="#166534" />];
      break;
    case 'k':
      stops = [<stop key="1" offset="0%" stopColor="#d97706" />, <stop key="2" offset="30%" stopColor="#4ade80" />, <stop key="3" offset="70%" stopColor="#4ade80" />, <stop key="4" offset="100%" stopColor="#d97706" />];
      break;
    case 'zn':
      stops = [<stop key="1" offset="0%" stopColor="#bbf7d0" />, <stop key="2" offset="100%" stopColor="#16a34a" />];
      break;
  }

  return (
    <div className="leaf-tip-item text-center">
      <div className="leaf-tag">{tag}</div>
      <svg width="26" height="40" viewBox="0 0 30 50">
        <defs>
          <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="0%" y2="100%">
            {type === 'k' ? null : stops}
          </linearGradient>
          {type === 'k' && (
            <linearGradient id="grad-k" x1="0%" y1="0%" x2="100%" y2="0%">
              {stops}
            </linearGradient>
          )}
        </defs>
        <path 
          d={d} 
          fill={type === 'k' ? "url(#grad-k)" : `url(#grad-${type})`} 
          stroke={type === 'p' ? '#a855f7' : '#111'} 
          strokeWidth={type === 'p' ? '3' : '0.5'} 
        />
        {type === 'zn' && (
          <g stroke="#fff" strokeWidth="1" strokeDasharray="3,3" opacity="0.6">
            <path d="M12,10 L12,40" />
            <path d="M18,10 L18,40" />
          </g>
        )}
      </svg>
    </div>
  );
}
