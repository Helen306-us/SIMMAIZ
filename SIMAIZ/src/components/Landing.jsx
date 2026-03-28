import { STAGES } from '../constants/agronomic';

/**
 * Landing — Pantalla de bienvenida con animaciones.
 */
export default function Landing({ onStart }) {
  return (
    <div className="landing">
      <div className="land-inner">
        <div className="land-badge">IS910 · SIMULACIÓN · UNAH · GRUPO #1</div>
        <div className="land-title">
          Sim<span>Maíz</span>
        </div>
        <p className="land-sub">
          Simulador espacial de cultivo de maíz criollo. Visualizá la evolución del campo
          en 180 días basado en nutrientes del suelo, clima y condiciones ambientales.
        </p>

        <div className="land-factors">
          <div className="factor-chip"><div className="dot" style={{ background: '#4ade80' }} />Nitrógeno (N)</div>
          <div className="factor-chip"><div className="dot" style={{ background: '#a855f7' }} />Fósforo (P)</div>
          <div className="factor-chip"><div className="dot" style={{ background: '#fb923c' }} />Potasio (K)</div>
          <div className="factor-chip"><div className="dot" style={{ background: '#60a5fa' }} />Clima y Agua</div>
          <div className="factor-chip"><div className="dot" style={{ background: '#f9c846' }} />pH del Suelo</div>
        </div>

        <button className="btn-start" onClick={onStart}>
          <span>🌽</span> Iniciar Simulación
        </button>

        <div className="land-tags">
          <div className="land-tag">Modelo Gaussiano σ=0.15</div>
          <div className="land-tag">FEN Nutricional</div>
          <div className="land-tag">Recuperación R(t)</div>
          <div className="land-tag">180 días</div>
          <div className="land-tag">Honduras</div>
        </div>
      </div>
    </div>
  );
}
