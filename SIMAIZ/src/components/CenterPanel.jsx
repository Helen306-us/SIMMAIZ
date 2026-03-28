import CornIcon from './CornIcon';
import { getCellState } from '../simulation/model';
import Timeline from './Timeline';

/**
 * CenterPanel — Panel central con la grilla de parcelas y timeline.
 */
export default function CenterPanel({
  simData, frame,
  selectedCell, setSelectedCell,
  onCellClick,
  currentDay, setCurrentDay,
  playing, setPlaying, speed, setSpeed,
  fillPct,
}) {
  return (
    <div className="center">
      {/* Header de visualización */}
      <div className="viz-header">
        <div className="viz-title">Vista de Parcela — Maíz Criollo</div>
        <div className="legend">
          <div className="leg-item"><div className="leg-dot" style={{ background: '#1a7a1a' }} />Sano</div>
          <div className="leg-item"><div className="leg-dot" style={{ background: '#7a5c00' }} />Def. N</div>
          <div className="leg-item"><div className="leg-dot" style={{ background: '#4a1070' }} />Def. P</div>
          <div className="leg-item"><div className="leg-dot" style={{ background: '#7a2800' }} />Def. K</div>
          <div className="leg-item"><div className="leg-dot" style={{ background: '#5c1a1a' }} />Plaga</div>
          <div className="leg-item"><div className="leg-dot" style={{ background: '#2a3535' }} />Irrecup.</div>
        </div>
      </div>

      {/* Grilla */}
      <div className="grid-container">
        {!simData ? (
          <div className="empty-state">
            <div className="empty-icon">🌽</div>
            <div className="empty-msg">
              Configura los parámetros y presiona<br />
              <strong>Aplicar Configuración</strong> para iniciar
            </div>
          </div>
        ) : (
          <div
            className="field-grid"
            style={{ gridTemplateColumns: `repeat(${simData.cols}, 64px)` }}
          >
            {frame.cells.map((cell, i) => {
              const state = getCellState(cell);
              return (
                <div
                  key={i}
                  className={`plant-cell ${state} ${selectedCell === i ? 'selected' : ''}`}
                  onClick={() => onCellClick(i)}
                  title={`P${i + 1} · Salud: ${cell.salud.toFixed(0)}%`}
                >
                  <CornIcon health={cell.salud} state={state} size={40} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Timeline */}
      <Timeline
        currentDay={currentDay}
        setCurrentDay={setCurrentDay}
        playing={playing}
        setPlaying={setPlaying}
        speed={speed}
        setSpeed={setSpeed}
        simData={simData}
        fillPct={fillPct}
        stage={frame?.stage}
      />
    </div>
  );
}
