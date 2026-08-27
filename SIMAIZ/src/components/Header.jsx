import { STAGES } from '../constants/agronomic';

/**
 * Header — Topbar con logo, stage pills y controles.
 */
export default function Header({ currentDay, simData, onReset, onGoToLanding }) {
  const activeStage = STAGES.findIndex(
    (s) => currentDay >= s.range[0] && currentDay <= s.range[1]
  );

  return (
    <div className="topbar">
      <div className="topbar-logo">
        Sim<span>Maíz</span>
      </div>

      <div className="topbar-center">
        {STAGES.map((s, i) => (
          <div
            key={i}
            className={`stage-pill ${activeStage === i ? 'active' : ''}`}
          >
            {s.label} (D{s.range[0]}–{s.range[1]})
          </div>
        ))}
      </div>

      <div className="topbar-right">
        <div className="day-display">
          Día: <strong>{currentDay}</strong> / 180
        </div>
        <button
          className="btn-sm"
          style={{ borderColor: 'var(--red)', color: 'var(--red)' }}
          onClick={onGoToLanding}
        >
          Volver al Inicio
        </button>
        <button className="btn-sm" onClick={onReset}>
          ↺ Reiniciar
        </button>
      </div>
    </div>
  );
}
