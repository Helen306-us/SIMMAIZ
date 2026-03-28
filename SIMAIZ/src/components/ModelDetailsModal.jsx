/**
 * ModelDetailsModal — Modal técnico con las fórmulas y constantes del modelo.
 */
export default function ModelDetailsModal({ onClose }) {
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-modal technical-modal">
        <div className="detail-header">
          <h2>Especificaciones Técnicas: Modelo SimMaíz</h2>
          <button className="detail-close" onClick={onClose}>✕</button>
        </div>

        <div className="detail-body">
          {/* 1. Factor Ambiental */}
          <section className="tech-section">
            <h3>1. Factor de Absorción Ambiental (F<sub>amb</sub>)</h3>
            <p>Determina la eficiencia con la que la planta extrae nutrientes del suelo basándose en restricciones externas.</p>
            <div className="formula-box">
              F<sub>amb</sub> = C<sub>pH</sub> × C<sub>T</sub> × C<sub>Agua</sub>
            </div>
            <div className="tech-grid">
              <div className="tech-item">
                <strong>C<sub>pH</sub> (Acidez)</strong>
                <ul>
                  <li>1.00 : pH 6.0 – 7.0 (Óptimo)</li>
                  <li>0.70 : pH 5.5 – 6.0 (Moderado)</li>
                  <li>0.50 : pH &lt; 5.5 (Crítico)</li>
                </ul>
              </div>
              <div className="tech-item">
                <strong>C<sub>T</sub> (Temperatura)</strong>
                <ul>
                  <li>1.00 : 20°C – 30°C (Óptimo)</li>
                  <li>0.80 : 15°C – 20°C (Estrés térmico)</li>
                  <li>0.60 : &gt; 35°C (Deshidratación)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. Etapas Fenológicas */}
          <section className="tech-section">
            <h3>2. Pesos Nutricionales por Etapa (FEN)</h3>
            <p>La importancia del Nitrógeno (N), Fósforo (P) y Potasio (K) cambia según el ciclo de vida de 180 días.</p>
            <table className="tech-table">
              <thead>
                <tr>
                  <th>Etapa</th>
                  <th>Días</th>
                  <th>N (Veg)</th>
                  <th>P (Raíz)</th>
                  <th>K (Estruct.)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Establecimiento</td>
                  <td>0 - 30</td>
                  <td>30%</td>
                  <td className="highlight-p">50%</td>
                  <td>20%</td>
                </tr>
                <tr>
                  <td>Crecimiento Rápido</td>
                  <td>31 - 65</td>
                  <td className="highlight-n">50%</td>
                  <td>10%</td>
                  <td className="highlight-k">40%</td>
                </tr>
                <tr>
                  <td>Llenado de Grano</td>
                  <td>66 - 180</td>
                  <td className="highlight-n">60%</td>
                  <td>15%</td>
                  <td>25%</td>
                </tr>
              </tbody>
            </table>
          </section>

          {/* 3. Eficiencia de Recuperación */}
          <section className="tech-section">
            <h3>3. Curva de Recuperabilidad R(t)</h3>
            <p>La capacidad de revertir una deficiencia mediante fertilización disminuye conforme la planta envejece.</p>
            <div className="formula-box">
              R(t) = 1 - (t / 120)<sup>2</sup>
            </div>
            <p className="tech-note">
              Donde <em>t</em> es el día de aplicación. A partir del día 120, la eficiencia es 0, lo que significa que el daño nutricional se vuelve permanente (necrosis tisular).
            </p>
          </section>

          {/* 4. Variabilidad Espacial */}
          <section className="tech-section">
            <h3>4. Estocasticidad Gaussiana</h3>
            <p>Cada una de las 64+ parcelas recibe una desviación única para simular la heterogeneidad real del suelo.</p>
            <div className="formula-box">
              Disponibilidad<sub>i</sub> = Insumo<sub>base</sub> × F<sub>amb</sub> × (1 + N(0, σ))
            </div>
            <p className="tech-note">Donde σ = 0.15 (15% de varianza espacial).</p>
          </section>
        </div>
      </div>
    </div>
  );
}
