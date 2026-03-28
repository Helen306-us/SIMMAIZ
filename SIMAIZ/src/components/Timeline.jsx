import { useEffect } from 'react';
import { TICK_DAYS } from '../constants/agronomic';

/**
 * Timeline — Barra de tiempo con controles de reproducción, velocidad y atajos de teclado.
 */
export default function Timeline({
  currentDay, setCurrentDay,
  playing, setPlaying,
  speed, setSpeed,
  simData, fillPct, stage,
}) {
  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
      if (e.key === ' ') { e.preventDefault(); if (simData) setPlaying((p) => !p); }
      if (e.key === 'ArrowRight') stepForward();
      if (e.key === 'ArrowLeft') stepBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentDay, simData]);

  const stepForward = () => {
    const idx = TICK_DAYS.indexOf(currentDay);
    if (idx < TICK_DAYS.length - 1) setCurrentDay(TICK_DAYS[idx + 1]);
  };

  const stepBack = () => {
    const idx = TICK_DAYS.indexOf(currentDay);
    if (idx > 0) setCurrentDay(TICK_DAYS[idx - 1]);
  };

  const handleTrackClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    const idx = Math.round(pct * (TICK_DAYS.length - 1));
    setCurrentDay(TICK_DAYS[Math.max(0, Math.min(TICK_DAYS.length - 1, idx))]);
  };

  return (
    <div className="timeline-bar">
      <div className="tl-controls">
        <div
          className={`tl-btn ${playing ? 'active' : ''}`}
          onClick={() => { if (simData) setPlaying((p) => !p); }}
          title={playing ? 'Pausar (Espacio)' : 'Reproducir (Espacio)'}
        >
          {playing ? '⏸' : '▶'}
        </div>
        <div className="tl-btn" onClick={stepBack} title="Anterior (←)">◀</div>
        <div className="tl-btn" onClick={stepForward} title="Siguiente (→)">▶</div>

        {/* Track */}
        <div className="tl-slider-wrap" onClick={handleTrackClick}>
          <div className="tl-track">
            <div className="tl-track-bg" />
            <div className="tl-track-fill" style={{ width: `${fillPct}%` }} />
            <div className="tl-track-thumb" style={{ left: `${fillPct}%` }} />
          </div>
          <div className="tl-marks">
            {TICK_DAYS.filter((_, i) => i % 2 === 0).map((t) => (
              <span key={t} className={`tl-mark ${t === currentDay ? 'active' : ''}`}>
                D{t}
              </span>
            ))}
          </div>
        </div>

        {/* Speed */}
        <div className="speed-btns">
          {[1, 2, 5].map((s) => (
            <div
              key={s}
              className={`speed-btn ${speed === s ? 'active' : ''}`}
              onClick={() => setSpeed(s)}
            >{s}×</div>
          ))}
        </div>
      </div>

      <div className="tl-status">
        Etapa: {stage?.label || 'Sin iniciar'} — Día {currentDay}
        {playing && <span className="tl-playing"> ● Reproduciendo {speed}×</span>}
      </div>
    </div>
  );
}
