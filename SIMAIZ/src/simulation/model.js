import { D_IDEAL, SIGMA, TICK_DAYS, STAGES, PLAGUE_CONFIG } from '../constants/agronomic';
import { getClimateData } from '../constants/honduras';
import healthyImg from '../assets/images/corn_healthy.png';
import stressLightImg from '../assets/images/corn_stress_light.png';
import stressModImg from '../assets/images/corn_stress_moderate.png';
import criticalImg from '../assets/images/corn_critical.png';
import deadImg from '../assets/images/corn_dead.png';

// ─────────────────────────────────────────────
//  PRNG con seed (reproducible)
// ─────────────────────────────────────────────

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Normal distribution via Box-Muller */
function randnFrom(rng) {
  const u1 = rng();
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// ─────────────────────────────────────────────
//  FUNCIONES DEL MODELO MATEMÁTICO
// ─────────────────────────────────────────────

export function getStage(t) {
  return STAGES.find((s) => t >= s.range[0] && t <= s.range[1]) || STAGES[2];
}

export function calcCpH(pH) {
  if (pH < 5.5) return 0.50;
  if (pH < 6.0) return 0.70;
  if (pH <= 7.0) return 1.00;
  if (pH <= 8.0) return 0.80;
  return 0.60;
}

export function calcCtemp(T) {
  if (T < 10) return 0.30;
  if (T < 15) return 0.60;
  if (T < 20) return 0.80;
  if (T <= 30) return 1.00;
  if (T <= 35) return 0.90;
  return 0.60;
}

export function calcCagua(P_anual, H_suelo) {
  const Cprecip = Math.min(1, P_anual / 600);
  return (Cprecip + H_suelo) / 2;
}

export function calcFamb(pH, T, P_anual, H_suelo) {
  return calcCpH(pH) * calcCtemp(T) * calcCagua(P_anual, H_suelo);
}

export function calcFcomp(S_ini, A_sem) {
  if (A_sem <= 0) return 1;
  const D_real = S_ini / A_sem;
  return Math.min(1, D_IDEAL / D_real);
}

export function recoveryRate(t) {
  return Math.max(0, 1 - Math.pow(t / 120, 2));
}

// ─────────────────────────────────────────────
//  ESTADO VISUAL DE UNA CELDA
// ─────────────────────────────────────────────

export function getCellState(cell) {
  if (cell.dead) return 'dead';
  if (cell.hasPest) return 'pest';

  const { defN, defP, defK } = cell;
  const maxDef = Math.max(defN, defP, defK);
  if (maxDef < 15) return cell.salud > 90 ? 'healthy-bright' : 'healthy';

  // Dominant deficiency
  const vals = { N: defN, P: defP, K: defK };
  const sorted = Object.entries(vals).sort((a, b) => b[1] - a[1]);
  const [first, second] = sorted;

  // Check multi-deficiency
  if (second[1] > 20 && second[1] > first[1] * 0.5) {
    const combo = [first[0], second[0]].sort().join('');
    if (combo === 'NK') return 'multi-NK';
    if (combo === 'NP') return 'multi-NP';
    if (combo === 'PK') return 'multi-PK';
  }

  if (first[0] === 'N') return 'nitrogen';
  if (first[0] === 'P') return 'phosphorus';
  return 'potassium';
}

/** Get health quality label and tier */
export function getQuality(health) {
  if (health >= 80) return { label: 'A — Excelente', tier: 'excellent', bg: '#0a2e0a', color: '#4ade80' };
  if (health >= 65) return { label: 'B — Buena',     tier: 'good',      bg: '#1a2e0a', color: '#a3e635' };
  if (health >= 50) return { label: 'C — Regular',    tier: 'regular',   bg: '#2e2a00', color: '#f9c846' };
  if (health >= 30) return { label: 'D — Deficiente', tier: 'poor',      bg: '#2e1400', color: '#fb923c' };
  return               { label: 'F — Crítica',    tier: 'critical',  bg: '#2e0a0a', color: '#ef4444' };
}

/** Get corn plant image path based on health */
export function getPlantImage(health) {
  if (health >= 80) return healthyImg;
  if (health >= 60) return stressLightImg;
  if (health >= 40) return stressModImg;
  if (health >= 20) return criticalImg;
  return deadImg;
}

// ─────────────────────────────────────────────
//  INICIALIZACIÓN DE PLANTAS
// ─────────────────────────────────────────────

export function initPlants(config) {
  const { largo, ancho, parcela, plagaProb } = config;
  const area = largo * ancho;
  const count = Math.round(area / parcela);
  const aspecto = largo / Math.max(1, ancho);
  const cols = Math.min(Math.max(1, Math.round(Math.sqrt(count * aspecto))), 20);
  const rows = Math.min(Math.ceil(count / cols), 15);
  const total = rows * cols;

  const rng = mulberry32(42 + largo + ancho + count);

  const plants = [];
  for (let i = 0; i < total; i++) {
    // Individual per-nutrient deltas (variabilidad espacial)
    const dN = randnFrom(rng) * SIGMA;
    const dP = randnFrom(rng) * SIGMA;
    const dK = randnFrom(rng) * SIGMA;

    // Determine if/when pest strikes this cell
    const pestChance = rng();
    const pestDay = pestChance < (plagaProb / 100)
      ? Math.floor(rng() * 150) + 10
      : null;

    plants.push({
      id: i,
      dN, dP, dK,
      pestDay,
      pestCured: false,
      fertilizations: [],
    });
  }

  return { plants, cols, rows, total };
}

// ─────────────────────────────────────────────
//  CÁLCULO DE ESTADO POR PLANTA POR DÍA
// ─────────────────────────────────────────────

export function computePlantState(plant, day, config, Famb) {
  const { N, P, K } = config;

  // Base availability with individual deltas
  const Ndisp = Math.min(100, Math.max(0, N * Famb * (1 + plant.dN)));
  const Pdisp = Math.min(100, Math.max(0, P * Famb * (1 + plant.dP)));
  const Kdisp = Math.min(100, Math.max(0, K * Famb * (1 + plant.dK)));

  // Base deficiencies
  let defN = Math.max(0, 100 - Ndisp);
  let defP = Math.max(0, 100 - Pdisp);
  let defK = Math.max(0, 100 - Kdisp);

  // Apply fertilization corrections
  for (const f of plant.fertilizations) {
    if (f.day <= day) {
      const Rt = recoveryRate(f.day);
      const E = f.eficiencia;
      if (f.nutrient === 'N') defN = defN * (1 - Rt * E);
      if (f.nutrient === 'P') defP = defP * (1 - Rt * E);
      if (f.nutrient === 'K') defK = defK * (1 - Rt * E);
    }
  }

  // Pest effect
  let hasPest = false;
  if (plant.pestDay !== null && day >= plant.pestDay && !plant.pestCured) {
    hasPest = true;
    defN = Math.min(100, defN + PLAGUE_CONFIG.damagePer15Days.N);
    defP = Math.min(100, defP + PLAGUE_CONFIG.damagePer15Days.P);
    defK = Math.min(100, defK + PLAGUE_CONFIG.damagePer15Days.K);
  }

  // FEN and health
  const stage = getStage(day);
  const fen = stage.wN * defN + stage.wP * defP + stage.wK * defK;
  const salud = Math.max(0, 100 - fen);

  // Irrecoverable?
  const dead = day > 120 && fen > 70;

  return { defN, defP, defK, fen, salud, hasPest, dead, stage, Famb };
}

// ─────────────────────────────────────────────
//  CONSTRUCTOR DE SIMULACIÓN COMPLETA
// ─────────────────────────────────────────────

export function buildSimulation(config, plantData) {
  const { pH, hum, depto, municipio, densidad, parcela } = config;
  const climate = getClimateData(depto, municipio);
  const T = climate.T;
  const P_anual = climate.P_anual;
  const suelo = climate.suelo;

  const Famb = calcFamb(pH, T, P_anual, hum);

  const { plants, cols, rows, total } = plantData;
  const A_total = (config.largo * config.ancho) / 10000;

  // Pre-calculate all tick days
  const timeline = {};
  for (const t of TICK_DAYS) {
    const cells = plants.map(plant => computePlantState(plant, t, config, Famb));
    const stage = getStage(t);

    // Stats
    const sown = cells;
    const healthy = sown.filter(c => getCellState(c) === 'healthy' || getCellState(c) === 'healthy-bright').length;
    const stressed = sown.filter(c => {
      const s = getCellState(c);
      return ['nitrogen', 'phosphorus', 'potassium', 'multi-NK', 'multi-NP', 'multi-PK'].includes(s);
    }).length;
    const pests = sown.filter(c => getCellState(c) === 'pest').length;
    const dead = sown.filter(c => getCellState(c) === 'dead').length;
    const avgSalud = sown.reduce((a, c) => a + c.salud, 0) / sown.length;
    const avgFen = sown.reduce((a, c) => a + c.fen, 0) / sown.length;

    // Average nutrient levels
    const avgN = sown.reduce((a, c) => a + (100 - c.defN), 0) / sown.length;
    const avgP = sown.reduce((a, c) => a + (100 - c.defP), 0) / sown.length;
    const avgK = sown.reduce((a, c) => a + (100 - c.defK), 0) / sown.length;

    timeline[t] = {
      cells, stage, Famb,
      stats: { healthy, stressed, pests, dead, avgSalud, avgFen, avgN, avgP, avgK, total: sown.length },
    };
  }

  return {
    timeline, cols, rows, total, A_total, T, P_anual, suelo, Famb,
    plants, // reference for fertilizer/pesticide mutations
  };
}

// ─────────────────────────────────────────────
//  ACCIONES: FERTILIZACIÓN Y PLAGUICIDA
// ─────────────────────────────────────────────

/**
 * Aplica fertilizante a todas las plantas.
 * @returns {{ reduccion: number, Rt: number }} efecto calculado
 */
export function applyFertilizer(plants, day, nutrient, eficiencia) {
  const Rt = recoveryRate(day);
  plants.forEach(p => {
    p.fertilizations.push({ day, nutrient, eficiencia });
  });
  return { reduccion: Rt * eficiencia, Rt };
}

/**
 * Aplica plaguicida a las plantas infectadas.
 * Modelo:
 *   Eficacia = E_base × F_timing
 *   F_timing = max(0.3, 1 - (días_desde_plaga / 30))
 *   Curación con probabilidad = Eficacia
 *
 * @returns {{ curadas: number, eficaciaReal: number }}
 */
export function applyPesticide(plants, day, pesticideEficacia) {
  const rng = mulberry32(day * 7919);
  let curadas = 0;

  plants.forEach(p => {
    if (p.pestDay !== null && day >= p.pestDay && !p.pestCured) {
      const diasDesde = day - p.pestDay;
      const Ftiming = Math.max(0.3, 1 - diasDesde / 30);
      const eficaciaReal = pesticideEficacia * Ftiming;

      if (rng() < eficaciaReal) {
        p.pestCured = true;
        curadas++;
      }
    }
  });

  return { curadas, totalInfected: plants.filter(p => p.pestDay !== null && day >= p.pestDay && !p.pestCured).length };
}

// ─────────────────────────────────────────────
//  DIAGNÓSTICO DEL CULTIVO
// ─────────────────────────────────────────────

export function getDiagnosis(stats, config, Famb) {
  const { healthy, stressed, pests, dead, total, avgN, avgP, avgK } = stats;
  const hPct = healthy / total;
  const dPct = dead / total;
  const pPct = pests / total;

  let alert = null;
  let recommendation = '';

  if (dPct > 0.1) {
    alert = `⚠ ${(dPct * 100).toFixed(0)}% de plantas irrecuperables`;
  }

  const minNut = Math.min(avgN, avgP, avgK);
  if (minNut === avgN && avgN < 50) {
    recommendation = 'Aplicar fertilizante nitrogenado (urea). El N es crítico para la síntesis de clorofila y el crecimiento vegetativo.';
  } else if (minNut === avgP && avgP < 50) {
    recommendation = 'Aplicar fertilizante fosfatado (DAP). El P fortalece el sistema radicular y es esencial en la germinación.';
  } else if (minNut === avgK && avgK < 50) {
    recommendation = 'Aplicar fertilizante potásico (KCl). El K mejora la resistencia estructural y el llenado de grano.';
  } else if (pPct > 0.1) {
    recommendation = 'Se detectó infestación significativa. Considerar aplicación de plaguicida sistémico para mayor cobertura.';
  } else if (hPct > 0.8) {
    recommendation = 'El cultivo está en buen estado. Mantener condiciones actuales y monitorear periódicamente.';
  } else {
    recommendation = 'Monitorear de cerca. Condiciones nutricionales aceptables pero podrían optimizarse.';
  }

  return { alert, recommendation };
}
