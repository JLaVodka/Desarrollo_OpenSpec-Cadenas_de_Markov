import { STATE_NAMES, STATE_SYMBOLS } from '../model';

type MarkovDiagramProps = { matrix: number[][] | null };
const points = [
  { x: 120, y: 190 },
  { x: 380, y: 82 },
  { x: 380, y: 298 },
];

function curve(from: number, to: number) {
  const start = points[from];
  const end = points[to];
  if (from === 0 && to === 1) return `M ${start.x + 30} ${start.y - 18} Q 240 82 ${end.x - 38} ${end.y + 8}`;
  if (from === 1 && to === 0) return `M ${end.x - 38} ${end.y - 7} Q 240 35 ${start.x + 28} ${start.y - 32}`;
  if (from === 0 && to === 2) return `M ${start.x + 30} ${start.y + 18} Q 240 300 ${end.x - 38} ${end.y - 8}`;
  if (from === 2 && to === 0) return `M ${end.x - 38} ${end.y + 7} Q 240 350 ${start.x + 28} ${start.y + 32}`;
  if (from === 1 && to === 2) return `M ${start.x} ${start.y + 32} Q 452 190 ${end.x} ${end.y - 32}`;
  return `M ${end.x + 18} ${end.y - 32} Q 500 190 ${start.x + 18} ${start.y + 32}`;
}

const labelPositions: Record<string, { x: number; y: number }> = {
  '0-1': { x: 244, y: 94 }, '1-0': { x: 233, y: 51 },
  '0-2': { x: 244, y: 279 }, '2-0': { x: 230, y: 330 },
  '1-2': { x: 440, y: 190 }, '2-1': { x: 485, y: 190 },
};

export default function MarkovDiagram({ matrix }: MarkovDiagramProps) {
  const activeMatrix = matrix ?? [
    [0.75, 0.25, 0], [0.1, 0.6, 0.3], [0.2, 0.3, 0.5],
  ];
  return (
    <div className="diagram-scroll">
      <svg className="markov-diagram" viewBox="0 0 540 390" role="img" aria-label="Diagrama de transiciones de la cadena de Markov">
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L7,3 z" fill="#71858b" />
          </marker>
        </defs>
        {activeMatrix.flatMap((row, from) => row.map((probability, to) => {
          if (probability <= 0) return null;
          if (from === to) {
            const { x, y } = points[from];
            const path = from === 0
              ? `M ${x - 28} ${y - 26} C ${x - 72} ${y - 72}, ${x + 52} ${y - 74}, ${x + 34} ${y - 25}`
              : from === 1
                ? `M ${x - 26} ${y - 27} C ${x - 72} ${y - 72}, ${x + 48} ${y - 75}, ${x + 33} ${y - 26}`
                : `M ${x - 27} ${y + 27} C ${x - 78} ${y + 72}, ${x + 48} ${y + 78}, ${x + 34} ${y + 25}`;
            return <g key={`${from}-${to}`}><path d={path} className="edge" markerEnd="url(#arrow)" /><text x={x + 2} y={from === 2 ? y + 70 : y - 62} className="edge-label" textAnchor="middle">{(probability * 100).toFixed(0)}%</text></g>;
          }
          const label = labelPositions[`${from}-${to}`];
          return <g key={`${from}-${to}`}><path d={curve(from, to)} className="edge" markerEnd="url(#arrow)" /><text x={label.x} y={label.y} className="edge-label" textAnchor="middle">{(probability * 100).toFixed(0)}%</text></g>;
        }))}
        {points.map(({ x, y }, index) => (
          <g key={STATE_SYMBOLS[index]}>
            <circle cx={x} cy={y} r="39" className={`state-node state-${STATE_SYMBOLS[index].toLowerCase()}`} />
            <text x={x} y={y - 3} className="node-symbol" textAnchor="middle">{STATE_SYMBOLS[index]}</text>
            <text x={x} y={y + 15} className="node-name" textAnchor="middle">{STATE_NAMES[index]}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}
