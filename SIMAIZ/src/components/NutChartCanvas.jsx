import { useEffect, useRef } from 'react';

/**
 * NutChartCanvas — Gráfica de barras de nutrientes dibujada con canvas nativo.
 */
export default function NutChartCanvas({ N, P, K, Famb }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const W = rect.width;
    const H = rect.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#111711';
    ctx.fillRect(0, 0, W, H);

    const nuts = [
      { label: 'N', soil: N, avail: N * Famb, color: '#4ade80' },
      { label: 'P', soil: P, avail: P * Famb, color: '#a855f7' },
      { label: 'K', soil: K, avail: K * Famb, color: '#fb923c' },
    ];

    const bw = W / (nuts.length * 3 + 1);
    nuts.forEach((n, i) => {
      const x = (i * 3 + 1.5) * bw;

      // Soil bar (faded)
      const sh = (n.soil / 100) * (H - 16);
      ctx.fillStyle = n.color + '40';
      ctx.fillRect(x - bw, H - sh - 4, bw * 0.85, sh);

      // Available bar (solid)
      const ah = (n.avail / 100) * (H - 16);
      ctx.fillStyle = n.color;
      ctx.fillRect(x, H - ah - 4, bw * 0.85, ah);

      // Label
      ctx.fillStyle = n.color;
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(n.label, x + bw * 0.45, H - 1);
    });
  }, [N, P, K, Famb]);

  return (
    <div className="mini-chart">
      <canvas ref={canvasRef} className="chart-canvas" />
    </div>
  );
}
