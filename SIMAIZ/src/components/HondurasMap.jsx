import { DEPARTAMENTOS_HN } from '../constants/honduras';

/**
 * HondurasMap — SVG simplificado de Honduras con selector de departamento y municipio.
 */
export default function HondurasMap({ depto, municipio, onDeptoChange, onMunicipioChange }) {
  const deptData = DEPARTAMENTOS_HN[depto];
  const deptos = Object.keys(DEPARTAMENTOS_HN);

  return (
    <div className="geo-section">
      <div className="r-title">Disposición Geográfica</div>

      {/* SVG Map */}
      <div className="geo-map">
        <svg width="100%" height="100%" viewBox="0 0 240 90" style={{ display: 'block' }}>
          {/* Honduras simplified shape */}
          <polygon
            points="20,45 40,25 80,20 120,30 160,28 200,35 220,50 210,65 180,70 140,65 100,60 60,65 30,60"
            fill="#1a3010"
            stroke="#2a4a20"
            strokeWidth="1"
          />
          <polygon
            points="40,25 80,20 120,30 160,28 200,35 220,50 210,65 180,70 140,65 100,60 60,65 30,60 20,45"
            fill="none"
            stroke="#3a6030"
            strokeWidth="0.5"
          />
          {/* Location dot */}
          {deptData && (
            <>
              <circle
                cx={deptData.coords.x}
                cy={deptData.coords.y}
                r="4"
                fill="#5dde3f"
                opacity="0.9"
              />
              <circle
                cx={deptData.coords.x}
                cy={deptData.coords.y}
                r="7"
                fill="none"
                stroke="#5dde3f"
                strokeWidth="1.5"
                opacity="0.5"
                className="geo-pulse"
              />
            </>
          )}
        </svg>
      </div>

      {/* Selectors */}
      <div className="geo-selectors">
        <div className="s-row">
          <label>
            Departamento
          </label>
          <select
            className="geo-select"
            value={depto}
            onChange={(e) => {
              onDeptoChange(e.target.value);
              onMunicipioChange('');
            }}
          >
            {deptos.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {deptData && (
          <div className="s-row">
            <label>
              Municipio
            </label>
            <select
              className="geo-select"
              value={municipio}
              onChange={(e) => onMunicipioChange(e.target.value)}
            >
              <option value="">— Todo el departamento —</option>
              {deptData.municipios.map((m) => (
                <option key={m.nombre} value={m.nombre}>{m.nombre}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Climate info */}
      {deptData && (
        <div className="geo-info">
          <div>
            <span className="geo-label">Temperatura:</span>
            <strong>{municipio ? deptData.municipios.find(m => m.nombre === municipio)?.T || deptData.T : deptData.T}°C</strong>
          </div>
          <div>
            <span className="geo-label">Precipitación:</span>
            <strong>{municipio ? deptData.municipios.find(m => m.nombre === municipio)?.P_anual || deptData.P_anual : deptData.P_anual} mm</strong>
          </div>
          <div>
            <span className="geo-label">Suelo:</span>
            <strong>{municipio ? deptData.municipios.find(m => m.nombre === municipio)?.suelo || deptData.suelo : deptData.suelo}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
