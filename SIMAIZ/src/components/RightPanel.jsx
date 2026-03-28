import HealthChartCanvas from './HealthChartCanvas';
import NutChartCanvas from './NutChartCanvas';
import { getDiagnosis } from '../simulation/model';

/**
 * RightPanel — Panel derecho con gráficas, estadísticas, y diagnóstico.
 */
export default function RightPanel({
  healthHistory, stats, frame, config, simData,
}) {
  const diagnosis = stats ? getDiagnosis(stats, config, frame?.Famb || 0) : null;

  return (
    <div className="right-panel">
      {/* Gráfica de salud */}
      <div className="r-section">
        <div className="r-title">Índice de Salud de la Planta</div>
        <HealthChartCanvas healthHistory={healthHistory} />
      </div>

      {/* Gráfica de nutrientes */}
      <div className="r-section">
        <div className="r-title">Nutrientes: Uso vs Disponibilidad</div>
        <NutChartCanvas
          N={config.N}
          P={config.P}
          K={config.K}
          Famb={frame?.Famb || 0}
        />
      </div>

      {/* Distribución del campo */}
      {stats && (
        <div className="r-section">
          <div className="r-title">Distribución del Campo</div>
          <div className="pct-cards">
            <div className="pct-card">
              <div className="pct-val" style={{ color: '#4ade80' }}>
                {((stats.healthy / stats.total) * 100).toFixed(0)}%
              </div>
              <div className="pct-lbl">Sanas</div>
            </div>
            <div className="pct-card">
              <div className="pct-val" style={{ color: '#f9c846' }}>
                {((stats.stressed / stats.total) * 100).toFixed(0)}%
              </div>
              <div className="pct-lbl">Estrés</div>
            </div>
            <div className="pct-card">
              <div className="pct-val" style={{ color: '#ef4444' }}>
                {((stats.pests / stats.total) * 100).toFixed(0)}%
              </div>
              <div className="pct-lbl">Plaga</div>
            </div>
            <div className="pct-card">
              <div className="pct-val" style={{ color: '#607D8B' }}>
                {((stats.dead / stats.total) * 100).toFixed(0)}%
              </div>
              <div className="pct-lbl">Irrecup.</div>
            </div>
          </div>
        </div>
      )}

      {/* Salud promedio */}
      {stats && (
        <div className="r-section">
          <div className="r-title">Salud Promedio del Lote</div>
          <div className="stat-row">
            <span className="stat-label">Salud promedio</span>
            <span className="stat-val" style={{ color: 'var(--accent)' }}>
              {stats.avgSalud.toFixed(1)}%
            </span>
          </div>
          <div className="health-bar-wrap">
            <div
              className="health-bar-fill"
              style={{
                width: `${stats.avgSalud}%`,
                background: stats.avgSalud > 70 ? '#4ade80' : stats.avgSalud > 40 ? '#f9c846' : '#ef4444',
              }}
            />
          </div>
          <div className="stat-row" style={{ marginTop: 10 }}>
            <span className="stat-label">FEN promedio</span>
            <span className="stat-val" style={{ color: 'var(--yellow)' }}>
              {stats.avgFen.toFixed(1)}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-label">F. Ambiental</span>
            <span className="stat-val" style={{ color: '#60a5fa' }}>
              {((frame?.Famb || 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Diagnóstico */}
      <div className="r-section">
        <div className="r-title">Diagnóstico Global</div>
        {diagnosis?.alert && (
          <div className="diag-alert show">{diagnosis.alert}</div>
        )}
        <div className="diag-rec">
          <strong>💡 Recomendación</strong>
          <span>{diagnosis?.recommendation || 'Configura los parámetros e inicia la simulación.'}</span>
        </div>
      </div>
    </div>
  );
}
