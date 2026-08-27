import { useState } from 'react';
import { STAGES } from '../constants/agronomic';
import ModelDetailsModal from './ModelDetailsModal';

/**
 * Landing — Pantalla de bienvenida con animaciones.
 */
export default function Landing({ onStart }) {
  const [showTech, setShowTech] = useState(false);
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

        {/* --- EXPLICACIÓN DEL MODELO --- */}
        <div className="land-model">
          <div className="model-card">
            <div className="model-icon">🌡️</div>
            <h4>Famb (Ambiente)</h4>
            <p>El pH y el agua limitan la absorción. Un suelo ácido (pH &lt; 5.5) bloquea hasta el 50% de los nutrientes aplicados.</p>
          </div>
          <div className="model-card">
            <div className="model-icon">🧬</div>
            <h4>Etapas FEN</h4>
            <p>El maíz prioriza P en establecimiento, N en crecimiento rápido y K en el llenado del grano.</p>
          </div>
          <div className="model-card">
            <div className="model-icon">📉</div>
            <h4>Recuperación R(t)</h4>
            <p>La eficiencia de la fertilización decae cuadráticamente. Invertir temprano es 3x más efectivo que tarde.</p>
          </div>
        </div>

        <button className="btn-tech" onClick={() => setShowTech(true)}>
          Ver Especificaciones Técnicas
        </button>

        {showTech && <ModelDetailsModal onClose={() => setShowTech(false)} />}
      </div>
    </div>
  );
}
