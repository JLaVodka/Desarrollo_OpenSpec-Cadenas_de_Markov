import { useMemo, useState } from 'react';
import MarkovDiagram from './components/MarkovDiagram';
import PredictionChart from './components/PredictionChart';
import TransitionMatrix from './components/TransitionMatrix';
import {
  DEFAULT_MATRIX,
  STATE_NAMES,
  validatePercentMatrix,
  toProportions,
  type PredictionResponse,
} from './model';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const defaultProportions = DEFAULT_MATRIX.map((row) => row.map((value) => value / 100));

export default function App() {
  const [matrix, setMatrix] = useState(() => DEFAULT_MATRIX.map((row) => row.map(String)));
  const [calculatedMatrix, setCalculatedMatrix] = useState<number[][]>(defaultProportions);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isResultCurrent = useMemo(() => {
    if (!result) return true;
    if (validatePercentMatrix(matrix)) return false;
    return JSON.stringify(toProportions(matrix)) === JSON.stringify(calculatedMatrix);
  }, [matrix, result, calculatedMatrix]);

  function updateCell(row: number, column: number, value: string) {
    setMatrix((current) => current.map((values, rowIndex) =>
      rowIndex === row ? values.map((cell, columnIndex) => columnIndex === column ? value : cell) : values,
    ));
    setError(null);
  }

  async function calculate() {
    const validationError = validatePercentMatrix(matrix);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const applied = toProportions(matrix);
      const response = await fetch(`${API_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matrix: applied }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        const detail = body?.detail;
        const message = typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
            ? detail.map((item: { msg?: string }) => item.msg).filter(Boolean).join(' ')
            : 'El servidor rechazó el cálculo. Revisa la matriz e inténtalo de nuevo.';
        throw new Error(message);
      }
      const payload = await response.json() as PredictionResponse;
      setResult(payload);
      setCalculatedMatrix(applied);
    } catch (cause) {
      setError(cause instanceof Error && !(cause instanceof SyntaxError) && cause.message !== 'Failed to fetch'
        ? cause.message
        : 'No se pudo conectar con el servidor. Comprueba que FastAPI esté ejecutándose.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <div className="eyebrow"><span className="eyebrow-dot" /> MODELO PROBABILÍSTICO · CADENA DE MARKOV</div>
        <h1>Enemy Behavior Predictor</h1>
        <p className="intro">Explora cómo evoluciona la probabilidad de cada estado en un modelo académico de tres estados.</p>
        <p className="scope-note">Es un modelo matemático ilustrativo, no un videojuego ni una IA real. Un paso representa un ciclo de decisión.</p>
      </header>

      <section className="panel diagram-panel" aria-labelledby="diagram-title">
        <div className="section-heading">
          <div><span className="section-index">01</span><h2 id="diagram-title">Cadena de Markov</h2></div>
          <span className="panel-hint">Transiciones entre estados</span>
        </div>
        <MarkovDiagram matrix={calculatedMatrix} />
        <div className="state-legend">{STATE_NAMES.map((name, index) => <span key={name}><i className={`legend-dot legend-${index}`} />{name}</span>)}</div>
      </section>

      <section className="panel matrix-panel" aria-labelledby="matrix-title">
        <div className="section-heading">
          <div><span className="section-index">02</span><h2 id="matrix-title">Matriz de transición</h2></div>
          <span className="panel-hint">Probabilidades en porcentaje</span>
        </div>
        <p className="section-copy">Cada fila describe desde qué estado parte el enemigo; cada columna indica a cuál puede pasar en el siguiente ciclo.</p>
        <TransitionMatrix matrix={matrix} onChange={updateCell} />
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="action-row">
          <button type="button" className="calculate-button" onClick={calculate} disabled={loading}>
            {loading ? <><span className="spinner" />Calculando…</> : <>Calcular predicción <span aria-hidden="true">→</span></>}
          </button>
          <span className="action-note">Inicio fijo: 100% Patrullando · S₀ = [1, 0, 0]</span>
        </div>
      </section>

      {result && <>
        <section className="panel results-panel" aria-labelledby="results-title">
          <div className="section-heading">
            <div><span className="section-index">03</span><h2 id="results-title">Resultados numéricos</h2></div>
            <span className="panel-hint">Probabilidad de estar en cada estado</span>
          </div>
          {!isResultCurrent && <p className="stale-note" role="status">Mostrando el último cálculo exitoso. Pulsa «Calcular predicción» para actualizarlo.</p>}
          <div className="results-table-wrap"><table className="results-table">
            <thead><tr><th scope="col">Pasos</th>{STATE_NAMES.map((name) => <th scope="col" key={name}>{name}</th>)}</tr></thead>
            <tbody>{result.predictions.map(({ steps, probabilities }) => <tr key={steps}>
              <th scope="row">{steps} <span>{steps === 1 ? 'paso' : 'pasos'}</span></th>
              {probabilities.map((probability, index) => <td key={`${steps}-${index}`}>{(probability * 100).toFixed(2)}<span>%</span></td>)}
            </tr>)}</tbody>
          </table></div>
        </section>

        <section className="panel chart-panel" aria-labelledby="chart-title">
          <div className="section-heading">
            <div><span className="section-index">04</span><h2 id="chart-title">Evolución de probabilidades</h2></div>
            <span className="panel-hint">Comparación por horizonte</span>
          </div>
          <PredictionChart predictions={result.predictions} />
        </section>
      </>}

      <footer className="page-footer">Distribución de estado después de n pasos · Sₙ = S₀ × Pⁿ · Matriz homogénea de primer orden</footer>
    </main>
  );
}
