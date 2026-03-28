import { useState } from 'react';
import { STAGES } from '../constants/agronomic';

/**
 * Landing — Pantalla de bienvenida con animaciones y Modelo Matemático.
 */
export default function Landing({ onStart }) {
  const [showMath, setShowMath] = useState(false);

  return (
    <div className="landing" style={{ overflowY: 'auto' }}>
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

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn-start" onClick={onStart}>
            <span>🌽</span> Iniciar Simulación
          </button>
          
          <button 
            className="btn-start" 
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}
            onClick={() => setShowMath(!showMath)}
          >
            <span>📐</span> {showMath ? 'Ocultar Modelo Matemático' : 'Ver Modelo Matemático'}
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

      {showMath && (
        <div className="math-section" style={{ maxWidth: '900px', width: '90%', margin: '0 auto 4rem', textAlign: 'left', background: 'var(--panel)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'var(--sans)', lineHeight: '1.6' }}>
          <h2 style={{ color: 'var(--accent)', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px', fontFamily: 'var(--display)' }}>
            Simulador de Cultivo de Maíz: Modelo Matemático
          </h2>
          
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ color: 'var(--text)', marginBottom: '12px' }}>Resumen Ejecutivo</h3>
            <p style={{ color: 'var(--text2)', fontSize: '14px' }}>Este documento consolida el modelo matemático completo para el simulador espacial de cultivo de maíz criollo, basado en la discusión técnica sostenida con IA. El objetivo del simulador es representar visualmente la salud de cada parcela en un cuadrante de 180 días, considerando nutrientes del suelo, factores climáticos y recuperación tras fertilización.</p>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px', marginBottom: '16px' }}>2.2 Factores Ambientales (F_amb)</h3>
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>Cada factor climático se escala entre 0 (muy desfavorable) y 1 (óptimo). El factor ambiental total penaliza la disponibilidad de nutrientes:</p>
            <div style={{ background: 'var(--bg)', padding: '12px 20px', borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '14px', marginBottom: '24px', border: '1px solid var(--border)' }}>
              F_amb = C_pH × C_temp × C_agua
            </div>

            <h4 style={{ color: 'var(--yellow)', marginBottom: '8px', fontSize: '15px' }}>Factor de pH (C_pH) — Óptimo: 6.0–7.0</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg2)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '8px 12px' }}>Rango de pH</th>
                  <th style={{ padding: '8px 12px' }}>C_pH</th>
                  <th style={{ padding: '8px 12px' }}>Razón agronómica</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text2)' }}>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}><td style={{ padding: '8px 12px' }}>pH {"<"} 5.5</td><td style={{ padding: '8px 12px' }}>0.50</td><td style={{ padding: '8px 12px' }}>Acidez alta, bloquea fósforo</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}><td style={{ padding: '8px 12px' }}>5.5 ≤ pH {"<"} 6.0</td><td style={{ padding: '8px 12px' }}>0.70</td><td style={{ padding: '8px 12px' }}>Acidez moderada</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}><td style={{ padding: '8px 12px' }}>6.0 ≤ pH ≤ 7.0</td><td style={{ padding: '8px 12px' }}>1.00</td><td style={{ padding: '8px 12px' }}>Rango óptimo para maíz</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}><td style={{ padding: '8px 12px' }}>7.0 {"<"} pH ≤ 8.0</td><td style={{ padding: '8px 12px' }}>0.80</td><td style={{ padding: '8px 12px' }}>Alcalinidad leve</td></tr>
                <tr><td style={{ padding: '8px 12px' }}>pH {">"} 8.0</td><td style={{ padding: '8px 12px' }}>0.60</td><td style={{ padding: '8px 12px' }}>Alcalinidad alta, reduce absorción</td></tr>
              </tbody>
            </table>

            <h4 style={{ color: 'var(--orange)', marginBottom: '8px', fontSize: '15px' }}>Factor de Temperatura (C_temp) — Óptimo: 20–30°C</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg2)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '8px 12px' }}>Temperatura (°C)</th>
                  <th style={{ padding: '8px 12px' }}>C_temp</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text2)' }}>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}><td style={{ padding: '8px 12px' }}>T {"<"} 10</td><td style={{ padding: '8px 12px' }}>0.30</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}><td style={{ padding: '8px 12px' }}>10 ≤ T {"<"} 15</td><td style={{ padding: '8px 12px' }}>0.60</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}><td style={{ padding: '8px 12px' }}>15 ≤ T {"<"} 20</td><td style={{ padding: '8px 12px' }}>0.80</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}><td style={{ padding: '8px 12px' }}>20 ≤ T ≤ 30</td><td style={{ padding: '8px 12px' }}>1.00</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}><td style={{ padding: '8px 12px' }}>30 {"<"} T ≤ 35</td><td style={{ padding: '8px 12px' }}>0.90</td></tr>
                <tr><td style={{ padding: '8px 12px' }}>T {">"} 35</td><td style={{ padding: '8px 12px' }}>0.60</td></tr>
              </tbody>
            </table>

            <h4 style={{ color: '#60a5fa', marginBottom: '8px', fontSize: '15px' }}>Factor de Agua (C_agua) — Combina precipitación y humedad</h4>
            <div style={{ background: 'var(--bg)', padding: '12px 20px', borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '14px', marginBottom: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
              C_agua = (C_precip + H_suelo) / 2
            </div>
            <div style={{ background: 'var(--bg)', padding: '12px 20px', borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '14px', border: '1px solid var(--border)', textAlign: 'center' }}>
              C_precip = min(1, P_anual / 600)<br/><span style={{ fontSize: '11px', color: 'var(--text3)' }}>600 mm = requerimiento típico del ciclo</span>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px', marginBottom: '16px' }}>2.3 Disponibilidad de Nutrientes por Planta</h3>
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>Con los factores calculados, se obtiene la disponibilidad base de cada nutriente X ∈ {"{N, P, K}"}:</p>
            <div style={{ background: 'var(--bg)', padding: '12px 20px', borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '14px', marginBottom: '24px', border: '1px solid var(--border)' }}>
              X_disp = X_suelo × F_amb
            </div>
            
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>Para simular la variabilidad micro-local del terreno, se aplica una perturbación pseudoaleatoria con distribución normal:</p>
            <div style={{ background: 'var(--bg)', padding: '12px 20px', borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '14px', marginBottom: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>δ_i ~ N(0, σ) con σ = 0.15 (15% de varianza)</div>
              <div>X_planta,i = X_disp × (1 + δ_i)</div>
              <div>X_planta,i = min(100, max(0, X_disp × (1 + δ_i)))</div>
            </div>

            <div style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px', borderLeft: '3px solid #60a5fa', marginBottom: '16px' }}>
              <h4 style={{ color: '#60a5fa', marginBottom: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💡 Por qué distribución normal (gaussiana)
              </h4>
              <ul style={{ color: 'var(--text2)', fontSize: '13px', marginLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>La distribución normal modela bien la variabilidad real del suelo: la mayoría de las plantas reciben nutrición cercana al promedio, con pocas en los extremos.</li>
                <li>El resultado es visualmente una campana de Gauss en el cuadrante, que es realista.</li>
                <li>σ = 0.15 significa que el 68% de las plantas estará dentro del ±15% del valor promedio.</li>
              </ul>
            </div>
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '8px' }}>La deficiencia porcentual de cada planta individual es:</p>
            <div style={{ background: 'var(--bg)', padding: '12px 20px', borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '14px', border: '1px solid var(--border)' }}>
              Def_x,i = max(0, 100 - X_planta,i)
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px', marginBottom: '16px' }}>2.4 Pesos por Etapa Fenológica</h3>
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>El ciclo de 180 días se divide en tres etapas. Los pesos reflejan la importancia de cada nutriente en esa fase:</p>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg2)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '8px 12px' }}>Días</th>
                  <th style={{ padding: '8px 12px' }}>Etapa</th>
                  <th style={{ padding: '8px 12px' }}>W_N (Nitrógeno)</th>
                  <th style={{ padding: '8px 12px' }}>W_P (Fósforo)</th>
                  <th style={{ padding: '8px 12px' }}>W_K (Potasio)</th>
                  <th style={{ padding: '8px 12px' }}>Nutriente crítico</th>
                </tr>
              </thead>
              <tbody style={{ color: 'var(--text2)' }}>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}>
                  <td style={{ padding: '8px 12px' }}>0–30</td>
                  <td style={{ padding: '8px 12px' }}>Establecimiento y germinación</td>
                  <td style={{ padding: '8px 12px', color: '#4ade80' }}>0.30</td>
                  <td style={{ padding: '8px 12px', color: '#a855f7' }}>0.50</td>
                  <td style={{ padding: '8px 12px', color: '#fb923c' }}>0.20</td>
                  <td style={{ padding: '8px 12px' }}>Fósforo (raíces)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border2)' }}>
                  <td style={{ padding: '8px 12px' }}>31–65</td>
                  <td style={{ padding: '8px 12px' }}>Crecimiento vegetativo rápido</td>
                  <td style={{ padding: '8px 12px', color: '#4ade80' }}>0.50</td>
                  <td style={{ padding: '8px 12px', color: '#a855f7' }}>0.10</td>
                  <td style={{ padding: '8px 12px', color: '#fb923c' }}>0.40</td>
                  <td style={{ padding: '8px 12px' }}>N y K (tallos)</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 12px' }}>66–180</td>
                  <td style={{ padding: '8px 12px' }}>Llenado de grano y maduración</td>
                  <td style={{ padding: '8px 12px', color: '#4ade80' }}>0.60</td>
                  <td style={{ padding: '8px 12px', color: '#a855f7' }}>0.15</td>
                  <td style={{ padding: '8px 12px', color: '#fb923c' }}>0.25</td>
                  <td style={{ padding: '8px 12px' }}>Nitrógeno (grano)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h3 style={{ borderLeft: '3px solid var(--accent)', paddingLeft: '12px', marginBottom: '16px' }}>2.5 Índice de Estrés Nutricional (FEN)</h3>
            <p style={{ color: 'var(--text2)', fontSize: '14px', marginBottom: '16px' }}>Calcula el estrés total ponderado de la planta i en el día t:</p>
            <div style={{ background: 'var(--bg)', padding: '12px 20px', borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '14px', marginBottom: '16px', border: '1px solid var(--border)' }}>
              FEN_i = W_N × Def_N,i + W_P × Def_P,i + W_K × Def_K,i
            </div>
            <p style={{ color: 'var(--text2)', fontSize: '13px', marginBottom: '24px' }}>Este valor oscila entre 0 (planta sin estrés) y 100 (todas las deficiencias al máximo). Se usa para los gráficos de salud, no directamente para el color.</p>
            
            <div style={{ background: 'var(--bg)', padding: '12px 20px', borderRadius: '8px', fontFamily: 'var(--mono)', fontSize: '14px', border: '1px solid var(--border)', borderLeft: '4px solid var(--healthy-light)' }}>
              Salud de la Planta_i = 100 - FEN_i
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
