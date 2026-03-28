import { getPlantImage, getQuality, getCellState, recoveryRate } from '../simulation/model';

/**
 * PlantDetailModal — Modal con detalle completo de una planta.
 * Muestra imagen realista, barras de nutrientes, y guía educativa.
 */
export default function PlantDetailModal({ cell, plantIndex, currentDay, cols, onClose }) {
  if (!cell) return null;

  const state = getCellState(cell);
  const quality = getQuality(cell.salud);
  const imageSrc = getPlantImage(cell.salud);
  const row = Math.floor(plantIndex / cols);
  const col = plantIndex % cols;
  const Rt = recoveryRate(currentDay);

  const healthLabel =
    cell.salud >= 80 ? 'Sana ✓' :
    cell.salud >= 60 ? 'Estrés leve' :
    cell.salud >= 40 ? 'Estrés moderado' : 'Crítica';

  const healthColor =
    cell.salud > 70 ? '#4ade80' :
    cell.salud > 40 ? '#f9c846' : '#ef4444';

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-modal">
        <div className="detail-header">
          <h2>Planta S{row + 1}C{col + 1} — {healthLabel}</h2>
          <button className="detail-close" onClick={onClose}>✕</button>
        </div>

        <div className="detail-body">
          {/* Visualización de la planta */}
          <div className="detail-plant-vis">
            <div className="plant-img-container">
              <h4>ESTADO DE LA PLANTA</h4>
              <img src={imageSrc} alt={`Maíz - ${healthLabel}`} className="plant-img" />
              <div className="quality-badge" style={{ background: quality.bg, color: quality.color }}>
                {quality.label}
              </div>
            </div>

            <div className="detail-stats">
              <div className="detail-stats-title">NIVELES DE NUTRIENTES</div>

              <NutrientBar
                label="Nitrógeno (N)"
                value={100 - cell.defN}
                color="#4ade80"
              />
              <NutrientBar
                label="Fósforo (P)"
                value={100 - cell.defP}
                color="#a855f7"
              />
              <NutrientBar
                label="Potasio (K)"
                value={100 - cell.defK}
                color="#fb923c"
              />

              <div className="detail-nut-bar" style={{ marginTop: 8, background: 'var(--bg2)' }}>
                <div className="d-nut-label">
                  Salud (Health_i) <span style={{ color: healthColor }}>{cell.salud.toFixed(1)}%</span>
                </div>
                <div className="d-bar-bg">
                  <div className="d-bar-fill" style={{ width: `${cell.salud}%`, background: healthColor }} />
                </div>
              </div>

              <div className="detail-nut-bar">
                <div className="d-nut-label">
                  FEN (Estrés) <span style={{ color: 'var(--yellow)' }}>{cell.fen.toFixed(1)}</span>
                </div>
                <div className="d-bar-bg">
                  <div className="d-bar-fill" style={{
                    width: `${Math.min(100, cell.fen)}%`,
                    background: 'var(--yellow)'
                  }} />
                </div>
              </div>

              <div className="detail-info-box">
                <strong>Factor Ambiental (F_amb)</strong>
                <span style={{ fontFamily: 'var(--mono)', color: '#60a5fa' }}>
                  {(cell.Famb * 100).toFixed(1)}%
                </span>
              </div>

              <div className="detail-info-box">
                <strong>Recuperabilidad R(t) — Día {currentDay}</strong>
                <span style={{ fontFamily: 'var(--mono)', color: Rt > 0.7 ? '#4ade80' : Rt > 0.3 ? '#f9c846' : '#ef4444' }}>
                  {(Rt * 100).toFixed(0)}% — {Rt > 0.7 ? 'Recuperable' : Rt > 0.1 ? 'Parcial' : 'Permanente'}
                </span>
              </div>
            </div>
          </div>

          {/* Guía educativa */}
          <div className="detail-edu">
            <h4>📚 Guía de Síntomas de Deficiencia Nutricional</h4>
            <div className="edu-grid">
              <div className="edu-card">
                <div className="edu-nut" style={{ color: '#4ade80' }}>🟢 Nitrógeno (N)</div>
                <div className="edu-sym">
                  • Amarillamiento foliar (clorosis) desde hojas viejas<br />
                  • Hojas color verde pálido uniforme<br />
                  • Crecimiento lento<br />
                  • Espigas pequeñas
                </div>
              </div>
              <div className="edu-card">
                <div className="edu-nut" style={{ color: '#a855f7' }}>🟣 Fósforo (P)</div>
                <div className="edu-sym">
                  • Bordes y puntas púrpura/rojizos<br />
                  • Raíces débiles<br />
                  • Retraso en maduración<br />
                  • Hojas enrolladas
                </div>
              </div>
              <div className="edu-card">
                <div className="edu-nut" style={{ color: '#fb923c' }}>🟠 Potasio (K)</div>
                <div className="edu-sym">
                  • Necrosis marginal (borde quemado)<br />
                  • Amarillamiento en hojas viejas<br />
                  • Tallo débil y encamado<br />
                  • Mal llenado de grano
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NutrientBar({ label, value, color }) {
  return (
    <div className="detail-nut-bar">
      <div className="d-nut-label">
        {label} <span style={{ color }}>{value.toFixed(1)}%</span>
      </div>
      <div className="d-bar-bg">
        <div className="d-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
