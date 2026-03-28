/**
 * LoadingScreen — Spinner de carga durante inicialización.
 */
export default function LoadingScreen() {
  return (
    <div className="sim-loading">
      <div className="load-spinner" />
      <div className="load-text">INICIALIZANDO SIMULACIÓN...</div>
    </div>
  );
}
