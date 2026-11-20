import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { STATE_NAMES } from '../model';
import type { Prediction } from '../model';

const colors = ['#3478a4', '#2f8c78', '#d28a43'];

export default function PredictionChart({ predictions }: { predictions: Prediction[] }) {
  const data = predictions.map(({ steps, probabilities }) => ({
    horizonte: `${steps} ${steps === 1 ? 'paso' : 'pasos'}`,
    Patrullando: probabilities[0] * 100,
    Persiguiendo: probabilities[1] * 100,
    Atacando: probabilities[2] * 100,
  }));
  return (
    <div className="chart-wrap" role="img" aria-label="Gráfica de barras agrupadas con las probabilidades por estado y horizonte">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 12, left: 4, bottom: 8 }} barGap={5}>
          <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#e5ebed" />
          <XAxis dataKey="horizonte" tickLine={false} axisLine={false} />
          <YAxis domain={[0, 100]} tickFormatter={(value: number) => `${value}%`} tickLine={false} axisLine={false} width={48} />
          <Tooltip formatter={(value) => `${Number(value).toFixed(2)}%`} />
          <Legend />
          {STATE_NAMES.map((name, index) => <Bar key={name} dataKey={name} fill={colors[index]} radius={[4, 4, 0, 0]} maxBarSize={28} />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
