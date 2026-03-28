import { useState, useEffect, useRef, useCallback } from 'react';
import { TICK_DAYS, FERT_TYPES, PESTICIDE_TYPES } from './constants/agronomic';
import { initPlants, buildSimulation, applyFertilizer, applyPesticide } from './simulation/model';
import Landing from './components/Landing';
import LoadingScreen from './components/LoadingScreen';
import Header from './components/Header';
import LeftPanel from './components/LeftPanel';
import CenterPanel from './components/CenterPanel';
import RightPanel from './components/RightPanel';
import PlantDetailModal from './components/PlantDetailModal';
import './App.css';

/**
 * App — Componente principal del simulador SimMaíz.
 * Maneja el flow: Landing → Loading → Simulator
 */
export default function App() {
  // ─── App State ───
  const [appState, setAppState] = useState('landing'); // 'landing' | 'loading' | 'simulator'

  // ─── Config ───
  const [config, setConfig] = useState({
    largo: 80, ancho: 80, parcela: 64, densidad: 75,
    N: 80, P: 90, K: 70, pH: 6.5,
    temp: 28, hum: 0.7, precip: 550,
    depto: 'El Paraíso', municipio: 'Danlí',
    plagaProb: 5,
  });

  // ─── Simulation ───
  const [simData, setSimData] = useState(null);
  const [plantData, setPlantData] = useState(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [selectedCell, setSelectedCell] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const intervalRef = useRef(null);

  // ─── Fertilizer/Pesticide controls ───
  const [fertNut, setFertNut] = useState('N');
  const [fertType, setFertType] = useState('suelo');
  const [pestType, setPestType] = useState('contacto');
  const [fertEffect, setFertEffect] = useState('');
  const [pestEffect, setPestEffect] = useState('');

  // ─── Detail Modal ───
  const [detailCell, setDetailCell] = useState(null);

  // ─── Landing → Loading → Simulator ───
  const handleStart = () => {
    setAppState('loading');
    setTimeout(() => {
      setAppState('simulator');
    }, 800);
  };

  // ─── Apply Config ───
  const applyConfig = useCallback(() => {
    const pd = initPlants(config);
    setPlantData(pd);
    const data = buildSimulation(config, pd);
    setSimData(data);
    setCurrentDay(0);
    setSelectedCell(null);
    setPlaying(false);
    setFertEffect('');
    setPestEffect('');
  }, [config]);

  // ─── Rebuild sim when plants are mutated ───
  const rebuildSim = useCallback(() => {
    if (!plantData) return;
    const data = buildSimulation(config, plantData);
    setSimData(data);
  }, [config, plantData]);

  // ─── Fertilize ───
  const handleFertilize = () => {
    if (!plantData) return;
    const eff = FERT_TYPES[fertType].eficiencia;
    const result = applyFertilizer(plantData.plants, currentDay, fertNut, eff);
    setFertEffect(
      `R(${currentDay})=${result.Rt.toFixed(2)} × E=${eff} → Reducción: ${(result.reduccion * 100).toFixed(0)}% def. ${fertNut}`
    );
    rebuildSim();
  };

  const handleDirectFertilize = (nut) => {
    if (!plantData) return;
    const eff = 0.8; // Suelo
    const result = applyFertilizer(plantData.plants, currentDay, nut, eff);
    setFertEffect(
      `Aplicación de emergencia R(${currentDay})=${result.Rt.toFixed(2)} → Reducción div. ${(result.reduccion * 100).toFixed(0)}% de ${nut}`
    );
    rebuildSim();
  };

  // ─── Pesticide ───
  const handlePesticide = () => {
    if (!plantData) return;
    const eficacia = PESTICIDE_TYPES[pestType].eficacia;
    const result = applyPesticide(plantData.plants, currentDay, eficacia);
    setPestEffect(
      `Curadas: ${result.curadas} | Aún infectadas: ${result.totalInfected}`
    );
    rebuildSim();
  };

  // ─── Reset ───
  const handleReset = () => {
    clearInterval(intervalRef.current);
    setPlaying(false);
    setSimData(null);
    setPlantData(null);
    setCurrentDay(0);
    setSelectedCell(null);
    setFertEffect('');
    setPestEffect('');
    setAppState('landing'); // Volver a la pantalla de inicio
  };

  // ─── Auto-play ───
  useEffect(() => {
    if (playing && simData) {
      intervalRef.current = setInterval(() => {
        setCurrentDay((prev) => {
          const idx = TICK_DAYS.indexOf(prev);
          if (idx >= TICK_DAYS.length - 1) {
            setPlaying(false);
            return prev;
          }
          return TICK_DAYS[idx + 1];
        });
      }, 600 / speed);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [playing, simData, speed]);

  // ─── Derived data ───
  const frame = simData ? simData.timeline[currentDay] : null;
  const dayIdx = TICK_DAYS.indexOf(currentDay);
  const fillPct = dayIdx >= 0 ? (dayIdx / (TICK_DAYS.length - 1)) * 100 : 0;
  const stats = frame?.stats || null;

  const healthHistory = simData
    ? TICK_DAYS.map((t) => simData.timeline[t]?.stats.avgSalud ?? 0)
    : [];

  // ─── Cell click → open detail ───
  const handleCellClick = (i) => {
    setSelectedCell(selectedCell === i ? null : i);
    if (frame && i !== selectedCell) {
      setDetailCell({ cell: frame.cells[i], index: i });
    } else {
      setDetailCell(null);
    }
  };

  // ─── Escape to close detail ───
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && detailCell) {
        setDetailCell(null);
        setSelectedCell(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [detailCell]);

  // ─── Render ───
  if (appState === 'landing') {
    return <Landing onStart={handleStart} />;
  }

  if (appState === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <div className="app-shell">
      <Header
        currentDay={currentDay}
        simData={simData}
        onReset={handleReset}
      />

      <div className="main-layout">
        <LeftPanel
          config={config}
          setConfig={setConfig}
          onApply={applyConfig}
          onFertilize={handleFertilize}
          onPesticide={handlePesticide}
          fertNut={fertNut} setFertNut={setFertNut}
          fertType={fertType} setFertType={setFertType}
          pestType={pestType} setPestType={setPestType}
          fertEffect={fertEffect}
          pestEffect={pestEffect}
        />

        <CenterPanel
          simData={simData}
          frame={frame}
          selectedCell={selectedCell}
          setSelectedCell={setSelectedCell}
          onCellClick={handleCellClick}
          currentDay={currentDay}
          setCurrentDay={setCurrentDay}
          playing={playing}
          setPlaying={setPlaying}
          speed={speed}
          setSpeed={setSpeed}
          fillPct={fillPct}
        />

        <RightPanel
          healthHistory={healthHistory}
          stats={stats}
          frame={frame}
          config={config}
          simData={simData}
        />
      </div>

      {/* Plant Detail Modal */}
      {detailCell && (
        <PlantDetailModal
          cell={detailCell.cell}
          plantIndex={detailCell.index}
          currentDay={currentDay}
          cols={simData?.cols || 1}
          onClose={() => { setDetailCell(null); setSelectedCell(null); }}
          onDirectFertilize={handleDirectFertilize}
        />
      )}
    </div>
  );
}
