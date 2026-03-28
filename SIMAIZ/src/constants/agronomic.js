// ─────────────────────────────────────────────
//  CONSTANTES AGRONÓMICAS
// ─────────────────────────────────────────────

/** Densidad ideal de plantas por hectárea */
export const D_IDEAL = 75000;

/** Desviación estándar para variabilidad espacial */
export const SIGMA = 0.15;

/** Días marcados en la línea de tiempo (cada 15 días) */
export const TICK_DAYS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];

/** Etapas fenológicas del maíz con pesos de nutrientes */
export const STAGES = [
  { label: 'Establecimiento',    range: [0, 30],   wN: 0.30, wP: 0.50, wK: 0.20 },
  { label: 'Crecimiento rápido', range: [31, 65],  wN: 0.50, wP: 0.10, wK: 0.40 },
  { label: 'Llenado de grano',   range: [66, 180], wN: 0.60, wP: 0.15, wK: 0.25 },
];

// ─────────────────────────────────────────────
//  CONFIGURACIÓN DE PLAGAS
// ─────────────────────────────────────────────

/** Tipos de plaguicida disponibles */
export const PESTICIDE_TYPES = {
  contacto:  { label: 'Contacto',  eficacia: 0.85, desc: 'Actúa al contacto directo. Rápido pero local.' },
  sistemico: { label: 'Sistémico', eficacia: 0.95, desc: 'Se absorbe y distribuye en la planta. Mayor cobertura.' },
};

/** Configuración del modelo de plagas */
export const PLAGUE_CONFIG = {
  /** Daño por nutriente que causa la plaga por tick (cada 15 días) */
  damagePer15Days: { N: 30, P: 20, K: 25 },
  /** Tasa de propagación a celdas vecinas por tick */
  spreadRate: 0.15,
};

// ─────────────────────────────────────────────
//  TIPOS DE FERTILIZACIÓN
// ─────────────────────────────────────────────

export const FERT_TYPES = {
  suelo:  { label: 'Al suelo',  eficiencia: 0.8, desc: 'Aplicación directa al suelo. Mayor absorción radicular.' },
  foliar: { label: 'Foliar',    eficiencia: 0.5, desc: 'Aplicación por aspersión. Absorción más rápida, menor duración.' },
};
