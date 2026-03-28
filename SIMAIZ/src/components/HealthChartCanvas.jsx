import { useEffect, useRef } from 'react';

/**
 * HealthChartCanvas — Gráfica de salud promedio dibujada con canvas nativo.
 * Sin dependencia de Chart.js.
 */
export default function HealthChartCanvas({ healthHistory }) {
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

    // Grid lines
    ctx.strokeStyle = '#1e2b1c';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = H - (i / 4) * H;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = '#506050';
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    for (let i = 0; i <= 4; i++) {
      const y = H - (i / 4) * H;
      ctx.fillText(`${i * 25}`, 2, y - 2);
    }

    // Health line
    const pts = healthHistory
      .map((val, i) => ({ x: (i / (healthHistory.length - 1)) * W, y: H - (val / 100) * H }))
      .filter((_, i) => healthHistory[i] !== undefined);

    if (pts.length > 1) {
      // Line
      ctx.beginPath();
      ctx.strokeStyle = '#5dde3f';
      ctx.lineWidth = 2;
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
      ctx.stroke();

      // Fill gradient
      ctx.lineTo(pts[pts.length - 1].x, H);
      ctx.lineTo(pts[0].x, H);
      ctx.closePath();
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#5dde3f40');
      grad.addColorStop(1, '#5dde3f00');
      ctx.fillStyle = grad;
      ctx.fill();

      // Dots
      pts.forEach(pt => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#5dde3f';
        ctx.fill();
      });
    }
  }, [healthHistory]);

  return (
    <div className="mini-chart">
      <canvas ref={canvasRef} className="chart-canvas" />
    </div>
  );
}
