import { useState } from 'react';

/**
 * Landing — Pantalla de bienvenida con animaciones y explicación del modelo.
 */
export default function Landing({ onStart }) {
  const [showModelInfo, setShowModelInfo] = useState(false);

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

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '10px auto' }}>
          <button className="btn-start" onClick={onStart}>
            <span>🌽</span> Iniciar Simulación
          </button>
          
          <button className="btn-start btn-info" style={{ background: '#2a4a6a', color: '#8ac4ff' }} onClick={() => setShowModelInfo(true)}>
            <span>ℹ️</span> Explícame el modelo
          </button>
        </div>

        <div className="land-tags">
          <div className="land-tag">Modelo Gaussiano σ=0.15</div>
          <div className="land-tag">FEN Nutricional</div>
          <div className="land-tag">Recuperación R(t)</div>
          <div className="land-tag">180 días</div>
          <div className="land-tag">Honduras</div>
        </div>
      </div>

      {showModelInfo && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setShowModelInfo(false)}>
          <div className="detail-modal" style={{ width: '800px', maxWidth: '95vw', padding: '24px', textAlign: 'left', lineHeight: '1.6', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="detail-header" style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border)', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', flexShrink: 0 }}>
               <h2 className="land-title" style={{ fontSize: '1.8rem', margin: 0 }}>Modelo Matemático — <span style={{ color: '#4ade80' }}>Simulador de Cultivo de Maíz</span></h2>
               <button className="detail-close" onClick={() => setShowModelInfo(false)}>✕</button>
            </div>
            
            <div style={{ overflowY: 'auto', paddingRight: '10px', color: 'var(--text2)', fontSize: '13px' }}>
              <h3 style={{ color: '#fff', marginTop: '10px' }}>2.2 Factores Ambientales (F_amb)</h3>
              <p>El factor ambiental total es el producto de tres subfactores, cada uno escalado entre 0 y 1:<br/>
              <strong style={{ color: '#8ac4ff' }}>F_amb = C_pH × C_temp × C_agua</strong></p>
              
              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                <li><strong>Factor de pH (C_pH)</strong> — Óptimo: 6.0–7.0 (Valor 1.00). Disminuye a 0.50 si pH &lt; 5.5.</li>
                <li><strong>Factor de Temperatura (C_temp)</strong> — Óptimo: 20–30°C (Valor 1.00). Cae drásticamente a 0.30 abajo de 10°C.</li>
                <li><strong>Factor de Agua (C_agua)</strong> — C_precip = min(1, P_anual / 600)  |  C_agua = (C_precip + H_suelo) / 2</li>
              </ul>

              <h3 style={{ color: '#fff', marginTop: '20px' }}>2.3 Disponibilidad de Nutrientes por Planta</h3>
              <p>Disponibilidad base para cada nutriente X ∈ {'{N, P, K}'}: <strong>X_disp = X_suelo × F_amb</strong></p>
              <p>Perturbación pseudoaleatoria por planta con distribución normal: <strong>δᵢ ~ N(0, σ) con σ = 0.15</strong></p>
              <p>X_planta,i = min(100, max(0, X_disp × (1 + δᵢ)))<br/> Deficiencia individual: Def_x,i = max(0, 100 − X_planta,i)</p>

              <h3 style={{ color: '#fff', marginTop: '20px' }}>2.4 Pesos por Etapa Fenológica</h3>
              <table style={{ width: '100%', marginBottom: '16px', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#1a2e1a', color: '#fff' }}>
                    <th style={{ padding: '8px', border: '1px solid var(--border)'}}>Días</th>
                    <th style={{ padding: '8px', border: '1px solid var(--border)'}}>Etapa</th>
                    <th style={{ padding: '8px', border: '1px solid var(--border)'}}>W_N</th>
                    <th style={{ padding: '8px', border: '1px solid var(--border)'}}>W_P</th>
                    <th style={{ padding: '8px', border: '1px solid var(--border)'}}>W_K</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ border: '1px solid var(--border)'}}>0–30</td><td style={{ border: '1px solid var(--border)'}}>Germinación</td><td style={{ border: '1px solid var(--border)'}}>0.30</td><td style={{ border: '1px solid var(--border)'}}>0.50</td><td style={{ border: '1px solid var(--border)'}}>0.20</td></tr>
                  <tr><td style={{ border: '1px solid var(--border)'}}>31–65</td><td style={{ border: '1px solid var(--border)'}}>Crecimiento Rápido</td><td style={{ border: '1px solid var(--border)'}}>0.50</td><td style={{ border: '1px solid var(--border)'}}>0.10</td><td style={{ border: '1px solid var(--border)'}}>0.40</td></tr>
                  <tr><td style={{ border: '1px solid var(--border)'}}>66–180</td><td style={{ border: '1px solid var(--border)'}}>Llenado y Maduración</td><td style={{ border: '1px solid var(--border)'}}>0.60</td><td style={{ border: '1px solid var(--border)'}}>0.15</td><td style={{ border: '1px solid var(--border)'}}>0.25</td></tr>
                </tbody>
              </table>

              <h3 style={{ color: '#fff', marginTop: '20px' }}>2.5 Índice de Estrés Nutricional (FEN)</h3>
              <div style={{ background: '#000', padding: '12px', borderRadius: '8px', color: '#84cc16', fontFamily: 'monospace', marginBottom: '16px' }}>
                FEN_i = W_N × Def_N,i + W_P × Def_P,i + W_K × Def_K,i<br/>
                Salud_i = 100 − FEN_i
              </div>

              <h3 style={{ color: '#fff', marginTop: '20px' }}>2.6 Regla de Color para el Cuadrante</h3>
              <p>El renderizado prioriza el estrés que cruza el umbral del 15%. Ejemplo: Def_P dominante ≥ 15% pinta morado (#6A1B9A).</p>

              <h3 style={{ color: '#fff', marginTop: '20px' }}>2.7 Recuperación tras Fertilización</h3>
              <p>R(t) = max(0, 1 − (t / 120)²)</p>
              <ul style={{ paddingLeft: '20px' }}>
                <li><strong>0–60 días:</strong> Alta capacidad de recuperación fisiológica (0.75-1.00)</li>
                <li><strong>61–110 días:</strong> Parcial (0.15–0.74)</li>
                <li><strong>t &gt; 120 días:</strong> Irrecuperable (0.00)</li>
              </ul>
              <p>Nueva deficiencia tras fertilizar con eficacia E (0.8 edáfica / 0.5 foliar):<br/><strong>Def_X,i_nuevo = Def_X,i × (1 − R(t) × E)</strong></p>
            </div>

            <div style={{ marginTop: '24px', flexShrink: 0 }}>
              <button className="btn-start" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowModelInfo(false)}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
