import { useState, useEffect, useRef, useCallback } from 'react';
import { TICK_DAYS, FERT_TYPES, PESTICIDE_TYPES } from './constants/agronomic';
import { initPlants, buildSimulation, applyFertilizer, applyPesticide } from './simulation/model';
import { getClimateData } from './constants/honduras';
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
  const [appState, setAppState] = useState('landing');

  // ─── Roboflow API Key ───
  const ROBOFLOW_API_KEY = '9Y0JlZ8NmbMLpo4Qcui1';

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

  // ─── DeficiencyScanner → update N, P, K soil values ───
  const handleScannerDetected = useCallback(({ N_soil, P_soil, K_soil }) => {
    setConfig((prev) => ({ ...prev, N: N_soil, P: P_soil, K: K_soil }));
  }, []);

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
    // setAppState('landing'); // Ya no volvemos a la landing automáticamente
  };

  const handleGoToLanding = () => {
    handleReset();
    setAppState('landing');
  };

  // ─── Geo Change with Weather Sync ───
  const handleGeoChange = (type, value) => {
    setConfig((prev) => {
      const newConfig = { ...prev, [type]: value };
      if (type === 'depto') newConfig.municipio = ''; // Reset municipio si cambia depto

      // Sincronización automática de clima
      const climate = getClimateData(newConfig.depto, newConfig.municipio);
      return {
        ...newConfig,
        temp: climate.T,
        precip: climate.P_anual,
      };
    });
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
        onGoToLanding={handleGoToLanding}
      />

      <div className="main-layout">
        <LeftPanel
          config={config}
          setConfig={setConfig}
          onGeoChange={handleGeoChange}
          onApply={applyConfig}
          onFertilize={handleFertilize}
          onPesticide={handlePesticide}
          fertNut={fertNut} setFertNut={setFertNut}
          fertType={fertType} setFertType={setFertType}
          pestType={pestType} setPestType={setPestType}
          fertEffect={fertEffect}
          pestEffect={pestEffect}
          onScannerDetected={handleScannerDetected}
          scannerApiKey={ROBOFLOW_API_KEY}
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
