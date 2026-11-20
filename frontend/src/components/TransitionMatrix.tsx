import { STATE_NAMES, STATE_SYMBOLS } from '../model';

type TransitionMatrixProps = {
  matrix: string[][];
  onChange: (row: number, column: number, value: string) => void;
};

export default function TransitionMatrix({ matrix, onChange }: TransitionMatrixProps) {
  return (
    <div className="matrix-wrap">
      <table className="matrix-table">
        <caption>Probabilidad de pasar del estado de la fila al estado de la columna</caption>
        <thead><tr><th scope="col">Desde / hacia</th>{STATE_NAMES.map((name, index) => <th scope="col" key={name}><span className="axis-symbol">{STATE_SYMBOLS[index]}</span><span>{name}</span></th>)}</tr></thead>
        <tbody>{matrix.map((row, rowIndex) => <tr key={STATE_SYMBOLS[rowIndex]}>
          <th scope="row"><span className="axis-symbol">{STATE_SYMBOLS[rowIndex]}</span><span>{STATE_NAMES[rowIndex]}</span></th>
          {row.map((value, columnIndex) => <td key={`${rowIndex}-${columnIndex}`}>
            <label className="percent-input"><input aria-label={`${STATE_NAMES[rowIndex]} a ${STATE_NAMES[columnIndex]}`} type="number" min="0" max="100" step="0.01" inputMode="decimal" value={value} onChange={(event) => onChange(rowIndex, columnIndex, event.target.value)} /><span>%</span></label>
          </td>)}
        </tr>)}</tbody>
      </table>
    </div>
  );
}
