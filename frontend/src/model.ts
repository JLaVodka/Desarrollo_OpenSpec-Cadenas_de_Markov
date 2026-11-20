export const STATE_SYMBOLS = ['P', 'C', 'A'] as const;
export const STATE_NAMES = ['Patrullando', 'Persiguiendo', 'Atacando'] as const;
export const HORIZONS = [1, 3, 5, 10] as const;
export const DEFAULT_MATRIX = [
  [75, 25, 0],
  [10, 60, 30],
  [20, 30, 50],
];

export type Prediction = { steps: number; probabilities: number[] };
export type PredictionResponse = {
  initial_state: number[];
  steps: number[];
  predictions: Prediction[];
};

export function validatePercentMatrix(matrix: string[][]): string | null {
  if (matrix.length !== 3 || matrix.some((row) => row.length !== 3)) {
    return 'La matriz debe tener 3 filas y 3 columnas.';
  }
  for (let row = 0; row < 3; row += 1) {
    const values = matrix[row].map((value) => value.trim());
    if (values.some((value) => value === '')) {
      return `Completa todos los valores de la fila ${row + 1}.`;
    }
    const numbers = values.map(Number);
    if (numbers.some((value) => !Number.isFinite(value))) {
      return `La fila ${row + 1} solo puede contener números finitos.`;
    }
    if (numbers.some((value) => value < 0 || value > 100)) {
      return `Cada probabilidad de la fila ${row + 1} debe estar entre 0% y 100%.`;
    }
    const sum = numbers.reduce((total, value) => total + value, 0);
    if (Math.abs(sum - 100) > 0.0000000001) {
      return `La fila ${row + 1} debe sumar 100% (actual: ${sum}%).`;
    }
  }
  return null;
}

export function toProportions(matrix: string[][]): number[][] {
  return matrix.map((row) => row.map((value) => Number(value) / 100));
}
