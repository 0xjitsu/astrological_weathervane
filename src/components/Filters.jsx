import { PLANET_SYMBOLS } from '../utils/astroConstants';

const selectClass =
  'px-2.5 py-2 border border-zinc-700 rounded-md text-[13px] font-mono bg-transparent text-zinc-200 cursor-pointer focus:outline-none focus:border-zinc-500';
const inputClass =
  'flex-1 min-w-[120px] px-3 py-2 border border-zinc-700 rounded-md text-[13px] font-mono bg-transparent text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500';

export default function Filters({ filters, onFilterChange, bodies, mode }) {
  const typeOptions =
    mode === 'natal'
      ? [['all', 'All Types']]
      : [
          ['all', 'All Types'],
          ['Aspect', 'Aspects'],
          ['Ingress', 'Ingresses'],
          ['Moon Ingress', 'Moon Ingresses'],
        ];

  const aspectOptions = [
    ['all', 'All Aspects'],
    ['Conjunction', '☌ Conjunction'],
    ['Opposition', '☍ Opposition'],
    ['Square', '□ Square'],
    ['Trine', '△ Trine'],
    ['Sextile', '⚹ Sextile'],
  ];

  const monthOptions = [
    ['all', 'All Months'],
    ['3', 'March'],
    ['4', 'April'],
    ['5', 'May'],
    ['6', 'June'],
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-5 items-center">
      <input
        type="text"
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        className={inputClass}
        aria-label="Search transits"
      />

      {mode !== 'natal' && (
        <select
          value={filters.type}
          onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
          className={selectClass}
          aria-label="Filter by type"
        >
          {typeOptions.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      )}

      <select
        value={filters.aspect}
        onChange={(e) => onFilterChange({ ...filters, aspect: e.target.value })}
        className={selectClass}
        aria-label="Filter by aspect"
      >
        {aspectOptions.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>

      <select
        value={filters.month}
        onChange={(e) => onFilterChange({ ...filters, month: e.target.value })}
        className={selectClass}
        aria-label="Filter by month"
      >
        {monthOptions.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>

      <select
        value={filters.body}
        onChange={(e) => onFilterChange({ ...filters, body: e.target.value })}
        className={selectClass}
        aria-label="Filter by body"
      >
        <option value="all">All Bodies</option>
        {bodies.map((b) => (
          <option key={b} value={b}>
            {PLANET_SYMBOLS[b] || ''} {b}
          </option>
        ))}
      </select>
    </div>
  );
}
