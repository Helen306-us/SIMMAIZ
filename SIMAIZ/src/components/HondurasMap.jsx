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
