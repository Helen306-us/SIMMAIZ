import SliderInput from './SliderInput';
import HondurasMap from './HondurasMap';
import { FERT_TYPES, PESTICIDE_TYPES } from '../constants/agronomic';
import DeficiencyScanner from './DeficiencyScanner';

/**
 * LeftPanel — Sidebar de configuración con terreno, nutrientes, clima,
 * plagas, fertilización y plaguicida.
 */
export default function LeftPanel({
  config, setConfig,
  onGeoChange,
  onApply,
  onFertilize, onPesticide,
  fertNut, setFertNut,
  fertType, setFertType,
  pestType, setPestType,
  fertEffect, pestEffect,
  onScannerDetected,
  scannerApiKey,
}) {
  const set = (key, val) => setConfig((c) => ({ ...c, [key]: val }));

  return (
    <div className="sidebar">
      {/* Terreno */}
      <div className="s-section">
        <div className="s-label">Tamaño del Terreno</div>
        <SliderInput label="Largo (m)" value={config.largo} min={20} max={200}
          onChange={(v) => set('largo', v)} tooltip="Largo total del terreno en metros" />
        <SliderInput label="Ancho (m)" value={config.ancho} min={20} max={200}
          onChange={(v) => set('ancho', v)} tooltip="Ancho total del terreno en metros" />
        <SliderInput label="Parcela (m²)" value={config.parcela} min={16} max={200}
          onChange={(v) => set('parcela', v)} tooltip="Tamaño de cada parcela individual" />
        <SliderInput label="Densidad (k/ha)" value={config.densidad} min={40} max={100}
          onChange={(v) => set('densidad', v)} tooltip="Densidad ideal: plantas/ha. Maíz criollo: 60,000–85,000" unit="" />
      </div>

      {/* Suelo */}
      <div className="s-section">
        <div className="s-label">Parámetros del Suelo</div>
        <SliderInput label="Nitrógeno N" value={config.N} color="#4ade80"
          onChange={(v) => set('N', v)} tooltip="Crítico en crecimiento y grano. Afecta síntesis de clorofila." />
        <SliderInput label="Fósforo P" value={config.P} color="#a855f7"
          onChange={(v) => set('P', v)} tooltip="Crítico en germinación. Fortalece raíces." />
        <SliderInput label="Potasio K" value={config.K} color="#fb923c"
          onChange={(v) => set('K', v)} tooltip="Importante para tallos y resistencia estructural." />
        <SliderInput label="pH del suelo" value={config.pH} min={4} max={10} step={0.1} unit=""
          onChange={(v) => set('pH', v)} tooltip="Óptimo para maíz: 6.0–7.0" />
      </div>

      {/* Clima */}
      <div className="s-section">
        <div className="s-label">Clima</div>
        <SliderInput label="Temperatura (°C)" value={config.temp} min={5} max={45} unit="°C"
          onChange={(v) => set('temp', v)} tooltip="Óptimo: 20–30°C" />
        <SliderInput label="Humedad suelo" value={config.hum} min={0} max={1} step={0.05} unit=""
          onChange={(v) => set('hum', v)} tooltip="Fracción de capacidad de campo (0–1)" />
        <SliderInput label="Precipitación (mm)" value={config.precip} min={100} max={1500} unit="mm"
          onChange={(v) => set('precip', v)} tooltip="Requerimiento mínimo: ~600mm" />
      </div>

      {/* Geográfico */}
      <div className="s-section">
        <HondurasMap
          depto={config.depto}
          municipio={config.municipio}
          onDeptoChange={(d) => onGeoChange('depto', d)}
          onMunicipioChange={(m) => onGeoChange('municipio', m)}
        />
      </div>

      {/* Plagas */}
      <div className="s-section">
        <div className="s-label">Plaga (riesgo)</div>
        <SliderInput label="Probabilidad" value={config.plagaProb} min={0} max={30}
          onChange={(v) => set('plagaProb', v)} tooltip="Probabilidad de infestación por parcela" />
      </div>

      {/* Fertilización */}
      <div className="s-section">
        <div className="s-label">Fertilización</div>
        <div className="fert-nut">
          {['N', 'P', 'K'].map((n) => (
            <div
              key={n}
              className={`fert-nut-btn ${fertNut === n ? `sel-${n}` : ''}`}
              onClick={() => setFertNut(n)}
            >{n}</div>
          ))}
        </div>
        <div className="fert-type">
          {Object.entries(FERT_TYPES).map(([key, val]) => (
            <div
              key={key}
              className={`fert-btn ${fertType === key ? 'active' : ''}`}
              onClick={() => setFertType(key)}
              title={val.desc}
            >{val.label} ({val.eficiencia})</div>
          ))}
        </div>
        <button className="apply-btn" onClick={onFertilize}>⚗ Aplicar Fertilizante</button>
        {fertEffect && (
          <div className="fert-effect">{fertEffect}</div>
        )}
      </div>

      {/* Plaguicida */}
      <div className="s-section">
        <div className="s-label">Plaguicida</div>
        <div className="fert-type">
          {Object.entries(PESTICIDE_TYPES).map(([key, val]) => (
            <div
              key={key}
              className={`fert-btn ${pestType === key ? 'active' : ''}`}
              onClick={() => setPestType(key)}
              title={val.desc}
            >{val.label} ({val.eficacia})</div>
          ))}
        </div>
        <button className="apply-btn pesticide-btn" onClick={onPesticide}>🛡 Aplicar Plaguicida</button>
        {pestEffect && (
          <div className="fert-effect">{pestEffect}</div>
        )}
      </div>

      {/* Análisis IA */}
      <div className="s-section">
        <div className="s-label">Análisis con IA 🤖</div>
        <DeficiencyScanner
          apiKey={scannerApiKey}
          onDeficiencyDetected={onScannerDetected}
        />
      </div>

      {/* Botón principal */}
      <div className="s-section">
        <button className="apply-btn primary-apply" onClick={onApply}>
          ▶ Aplicar Configuración
        </button>
      </div>
    </div>
  );
}
