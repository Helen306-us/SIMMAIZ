/**
 * Datos geográficos y climáticos de Honduras.
 * 18 departamentos con municipios principales productores de maíz.
 * Datos climáticos basados en promedios generales de cada zona.
 */

export const DEPARTAMENTOS_HN = {
  'Atlántida': {
    capital: 'La Ceiba',
    T: 27, P_anual: 1800, suelo: 'Aluvial',
    coords: { x: 140, y: 20 },
    municipios: [
      { nombre: 'La Ceiba',      T: 27, P_anual: 1800, suelo: 'Aluvial' },
      { nombre: 'Tela',          T: 27, P_anual: 1700, suelo: 'Franco arenoso' },
      { nombre: 'El Porvenir',   T: 26, P_anual: 1600, suelo: 'Franco arcilloso' },
      { nombre: 'Esparta',       T: 27, P_anual: 1750, suelo: 'Aluvial' },
      { nombre: 'San Francisco', T: 26, P_anual: 1650, suelo: 'Franco' },
    ]
  },
  'Choluteca': {
    capital: 'Choluteca',
    T: 30, P_anual: 650, suelo: 'Vertisol',
    coords: { x: 130, y: 78 },
    municipios: [
      { nombre: 'Choluteca',     T: 30, P_anual: 650,  suelo: 'Vertisol' },
      { nombre: 'Marcovia',      T: 30, P_anual: 600,  suelo: 'Franco arcilloso' },
      { nombre: 'Pespire',       T: 29, P_anual: 700,  suelo: 'Franco' },
      { nombre: 'Namasigüe',     T: 30, P_anual: 620,  suelo: 'Vertisol' },
      { nombre: 'El Triunfo',    T: 28, P_anual: 750,  suelo: 'Franco arcilloso' },
      { nombre: 'Apacilagua',    T: 29, P_anual: 680,  suelo: 'Franco' },
    ]
  },
  'Colón': {
    capital: 'Trujillo',
    T: 26, P_anual: 2200, suelo: 'Franco arcilloso',
    coords: { x: 170, y: 22 },
    municipios: [
      { nombre: 'Trujillo',      T: 26, P_anual: 2200, suelo: 'Franco arcilloso' },
      { nombre: 'Tocoa',         T: 27, P_anual: 2000, suelo: 'Aluvial' },
      { nombre: 'Sabá',          T: 27, P_anual: 1900, suelo: 'Franco' },
      { nombre: 'Sonaguera',     T: 27, P_anual: 1950, suelo: 'Franco arenoso' },
      { nombre: 'Bonito Oriental', T: 27, P_anual: 2100, suelo: 'Aluvial' },
    ]
  },
  'Comayagua': {
    capital: 'Comayagua',
    T: 25, P_anual: 750, suelo: 'Franco arcilloso',
    coords: { x: 105, y: 48 },
    municipios: [
      { nombre: 'Comayagua',     T: 25, P_anual: 750,  suelo: 'Franco arcilloso' },
      { nombre: 'Siguatepeque',  T: 22, P_anual: 900,  suelo: 'Franco' },
      { nombre: 'Ajuterique',    T: 26, P_anual: 700,  suelo: 'Franco arcilloso' },
      { nombre: 'Lejamaní',      T: 26, P_anual: 680,  suelo: 'Franco' },
      { nombre: 'Villa de San Antonio', T: 26, P_anual: 720, suelo: 'Aluvial' },
      { nombre: 'La Libertad',   T: 24, P_anual: 800,  suelo: 'Franco arcilloso' },
    ]
  },
  'Copán': {
    capital: 'Santa Rosa de Copán',
    T: 22, P_anual: 1200, suelo: 'Franco',
    coords: { x: 40, y: 38 },
    municipios: [
      { nombre: 'Santa Rosa de Copán', T: 22, P_anual: 1200, suelo: 'Franco' },
      { nombre: 'La Entrada',    T: 24, P_anual: 1100, suelo: 'Franco arcilloso' },
      { nombre: 'Nueva Arcadia', T: 25, P_anual: 1050, suelo: 'Franco arenoso' },
      { nombre: 'San José',      T: 23, P_anual: 1150, suelo: 'Franco' },
      { nombre: 'Dulce Nombre',  T: 22, P_anual: 1250, suelo: 'Franco' },
      { nombre: 'Cabañas',       T: 24, P_anual: 1000, suelo: 'Franco arcilloso' },
    ]
  },
  'Cortés': {
    capital: 'San Pedro Sula',
    T: 25, P_anual: 1300, suelo: 'Aluvial',
    coords: { x: 75, y: 28 },
    municipios: [
      { nombre: 'San Pedro Sula', T: 28, P_anual: 1300, suelo: 'Aluvial' },
      { nombre: 'Villanueva',    T: 27, P_anual: 1200, suelo: 'Franco arcilloso' },
      { nombre: 'Choloma',       T: 28, P_anual: 1250, suelo: 'Franco' },
      { nombre: 'La Lima',       T: 28, P_anual: 1350, suelo: 'Aluvial' },
      { nombre: 'Potrerillos',   T: 26, P_anual: 1150, suelo: 'Franco arcilloso' },
      { nombre: 'Santa Cruz de Yojoa', T: 24, P_anual: 1400, suelo: 'Franco' },
    ]
  },
  'El Paraíso': {
    capital: 'Yuscarán',
    T: 28, P_anual: 550, suelo: 'Franco arcilloso',
    coords: { x: 155, y: 55 },
    municipios: [
      { nombre: 'Danlí',         T: 28, P_anual: 550,  suelo: 'Franco arcilloso' },
      { nombre: 'El Paraíso',    T: 26, P_anual: 600,  suelo: 'Franco' },
      { nombre: 'Yuscarán',      T: 24, P_anual: 700,  suelo: 'Franco' },
      { nombre: 'Jacaleapa',     T: 27, P_anual: 580,  suelo: 'Franco arcilloso' },
      { nombre: 'Alauca',        T: 27, P_anual: 520,  suelo: 'Franco arenoso' },
      { nombre: 'Trojes',        T: 28, P_anual: 500,  suelo: 'Franco arcilloso' },
    ]
  },
  'Francisco Morazán': {
    capital: 'Tegucigalpa',
    T: 24, P_anual: 900, suelo: 'Franco arcilloso',
    coords: { x: 120, y: 55 },
    municipios: [
      { nombre: 'Tegucigalpa',   T: 24, P_anual: 900,  suelo: 'Franco arcilloso' },
      { nombre: 'Talanga',       T: 26, P_anual: 800,  suelo: 'Franco' },
      { nombre: 'Guaimaca',      T: 25, P_anual: 850,  suelo: 'Franco arcilloso' },
      { nombre: 'San Juan de Flores', T: 25, P_anual: 820, suelo: 'Franco' },
      { nombre: 'Cedros',        T: 24, P_anual: 870,  suelo: 'Franco arcilloso' },
      { nombre: 'Ojojona',       T: 23, P_anual: 950,  suelo: 'Franco' },
    ]
  },
  'Gracias a Dios': {
    capital: 'Puerto Lempira',
    T: 27, P_anual: 2800, suelo: 'Arenoso húmedo',
    coords: { x: 210, y: 35 },
    municipios: [
      { nombre: 'Puerto Lempira', T: 27, P_anual: 2800, suelo: 'Arenoso húmedo' },
      { nombre: 'Brus Laguna',   T: 27, P_anual: 2600, suelo: 'Aluvial' },
      { nombre: 'Ahuas',         T: 27, P_anual: 2500, suelo: 'Franco arenoso' },
      { nombre: 'Wampusirpi',    T: 26, P_anual: 2400, suelo: 'Aluvial' },
    ]
  },
  'Intibucá': {
    capital: 'La Esperanza',
    T: 18, P_anual: 1100, suelo: 'Franco',
    coords: { x: 68, y: 52 },
    municipios: [
      { nombre: 'La Esperanza',  T: 18, P_anual: 1100, suelo: 'Franco' },
      { nombre: 'Intibucá',      T: 19, P_anual: 1050, suelo: 'Franco arcilloso' },
      { nombre: 'Jesús de Otoro', T: 22, P_anual: 950, suelo: 'Franco' },
      { nombre: 'Yamaranguila',  T: 18, P_anual: 1150, suelo: 'Franco' },
      { nombre: 'San Juan',      T: 20, P_anual: 1000, suelo: 'Franco arcilloso' },
    ]
  },
  'Islas de la Bahía': {
    capital: 'Roatán',
    T: 28, P_anual: 2000, suelo: 'Arenoso calcáreo',
    coords: { x: 120, y: 12 },
    municipios: [
      { nombre: 'Roatán',        T: 28, P_anual: 2000, suelo: 'Arenoso calcáreo' },
      { nombre: 'Guanaja',       T: 28, P_anual: 1900, suelo: 'Arenoso' },
      { nombre: 'Utila',         T: 28, P_anual: 1800, suelo: 'Arenoso calcáreo' },
    ]
  },
  'La Paz': {
    capital: 'La Paz',
    T: 22, P_anual: 950, suelo: 'Franco arcilloso',
    coords: { x: 95, y: 58 },
    municipios: [
      { nombre: 'La Paz',        T: 22, P_anual: 950,  suelo: 'Franco arcilloso' },
      { nombre: 'Marcala',       T: 20, P_anual: 1050, suelo: 'Franco' },
      { nombre: 'Cane',          T: 23, P_anual: 900,  suelo: 'Franco arcilloso' },
      { nombre: 'Santa Ana',     T: 22, P_anual: 920,  suelo: 'Franco' },
      { nombre: 'Chinacla',      T: 21, P_anual: 980,  suelo: 'Franco' },
    ]
  },
  'Lempira': {
    capital: 'Gracias',
    T: 22, P_anual: 1100, suelo: 'Franco',
    coords: { x: 52, y: 48 },
    municipios: [
      { nombre: 'Gracias',       T: 22, P_anual: 1100, suelo: 'Franco' },
      { nombre: 'Erandique',     T: 21, P_anual: 1050, suelo: 'Franco arcilloso' },
      { nombre: 'La Iguala',     T: 23, P_anual: 1000, suelo: 'Franco' },
      { nombre: 'Las Flores',    T: 22, P_anual: 1150, suelo: 'Franco' },
      { nombre: 'San Manuel Colohete', T: 20, P_anual: 1200, suelo: 'Franco arcilloso' },
    ]
  },
  'Ocotepeque': {
    capital: 'Nueva Ocotepeque',
    T: 21, P_anual: 1250, suelo: 'Franco',
    coords: { x: 30, y: 45 },
    municipios: [
      { nombre: 'Nueva Ocotepeque', T: 21, P_anual: 1250, suelo: 'Franco' },
      { nombre: 'Sinuapa',       T: 22, P_anual: 1200, suelo: 'Franco arcilloso' },
      { nombre: 'San Marcos',    T: 20, P_anual: 1300, suelo: 'Franco' },
      { nombre: 'La Labor',      T: 19, P_anual: 1350, suelo: 'Franco' },
      { nombre: 'Sensenti',      T: 22, P_anual: 1180, suelo: 'Franco arcilloso' },
    ]
  },
  'Olancho': {
    capital: 'Juticalpa',
    T: 26, P_anual: 1100, suelo: 'Franco arcilloso',
    coords: { x: 168, y: 42 },
    municipios: [
      { nombre: 'Juticalpa',     T: 26, P_anual: 1100, suelo: 'Franco arcilloso' },
      { nombre: 'Catacamas',     T: 26, P_anual: 1200, suelo: 'Franco' },
      { nombre: 'San Francisco de La Paz', T: 25, P_anual: 1050, suelo: 'Franco arcilloso' },
      { nombre: 'Gualaco',       T: 25, P_anual: 1150, suelo: 'Franco' },
      { nombre: 'Dulce Nombre de Culmí', T: 26, P_anual: 1300, suelo: 'Aluvial' },
      { nombre: 'Campamento',    T: 25, P_anual: 1000, suelo: 'Franco arcilloso' },
      { nombre: 'San Esteban',   T: 25, P_anual: 1250, suelo: 'Franco' },
    ]
  },
  'Santa Bárbara': {
    capital: 'Santa Bárbara',
    T: 23, P_anual: 1100, suelo: 'Franco arcilloso',
    coords: { x: 72, y: 38 },
    municipios: [
      { nombre: 'Santa Bárbara', T: 23, P_anual: 1100, suelo: 'Franco arcilloso' },
      { nombre: 'Quimistán',     T: 25, P_anual: 1050, suelo: 'Franco' },
      { nombre: 'Macuelizo',     T: 24, P_anual: 1000, suelo: 'Franco arcilloso' },
      { nombre: 'Ilama',         T: 24, P_anual: 1080, suelo: 'Franco' },
      { nombre: 'San Luis',      T: 23, P_anual: 1120, suelo: 'Franco arcilloso' },
      { nombre: 'Petoa',         T: 25, P_anual: 1000, suelo: 'Franco' },
    ]
  },
  'Valle': {
    capital: 'Nacaome',
    T: 30, P_anual: 600, suelo: 'Vertisol',
    coords: { x: 115, y: 75 },
    municipios: [
      { nombre: 'Nacaome',       T: 30, P_anual: 600,  suelo: 'Vertisol' },
      { nombre: 'San Lorenzo',   T: 30, P_anual: 580,  suelo: 'Franco arcilloso' },
      { nombre: 'Langue',        T: 29, P_anual: 650,  suelo: 'Franco' },
      { nombre: 'Goascorán',     T: 30, P_anual: 560,  suelo: 'Vertisol' },
      { nombre: 'Amapala',       T: 30, P_anual: 550,  suelo: 'Arenoso' },
    ]
  },
  'Yoro': {
    capital: 'Yoro',
    T: 24, P_anual: 1200, suelo: 'Franco',
    coords: { x: 120, y: 30 },
    municipios: [
      { nombre: 'Yoro',          T: 24, P_anual: 1200, suelo: 'Franco' },
      { nombre: 'El Progreso',   T: 27, P_anual: 1100, suelo: 'Aluvial' },
      { nombre: 'Olanchito',     T: 26, P_anual: 1300, suelo: 'Franco arcilloso' },
      { nombre: 'Morazán',       T: 25, P_anual: 1150, suelo: 'Franco' },
      { nombre: 'Sulaco',        T: 24, P_anual: 1050, suelo: 'Franco arcilloso' },
      { nombre: 'Victoria',      T: 24, P_anual: 1100, suelo: 'Franco' },
    ]
  },
};

/** Obtener datos climáticos para un departamento y municipio */
export function getClimateData(depto, municipio) {
  const dept = DEPARTAMENTOS_HN[depto];
  if (!dept) return { T: 26, P_anual: 700, suelo: 'Franco' };

  if (municipio) {
    const mun = dept.municipios.find(m => m.nombre === municipio);
    if (mun) return { T: mun.T, P_anual: mun.P_anual, suelo: mun.suelo };
  }

  return { T: dept.T, P_anual: dept.P_anual, suelo: dept.suelo };
}
