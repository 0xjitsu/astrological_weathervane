import { PLANET_SYMBOLS } from '../utils/astroConstants';

const selectStyle = {
  background: 'var(--bg-input)',
  borderColor: 'var(--border-color)',
  color: 'var(--text-primary)',
};

const inputStyle = {
  background: 'var(--bg-input)',
  borderColor: 'var(--border-color)',
  color: 'var(--text-primary)',
};

const SKY_TYPE_OPTIONS = [
  ['all', 'All Types'],
  ['Aspect', 'Aspects'],
  ['Ingress', 'Ingresses'],
  ['Moon Ingress', 'Moon Ingresses'],
];

const NATAL_TYPE_OPTIONS = [['all', 'All Types']];

const ASPECT_OPTIONS = [
  ['all', 'All Aspects'],
  ['Conjunction', '☌ Conjunction'],
  ['Opposition', '☍ Opposition'],
  ['Square', '□ Square'],
  ['Trine', '△ Trine'],
  ['Sextile', '⚹ Sextile'],
];

const MONTH_OPTIONS = [
  ['all', 'All Months'],
  ['3', 'March'],
  ['4', 'April'],
  ['5', 'May'],
  ['6', 'June'],
];

export default function Filters({ filters, onFilterChange, bodies, mode }) {
  const typeOptions = mode === 'natal' ? NATAL_TYPE_OPTIONS : SKY_TYPE_OPTIONS;

  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-5 sm:items-center">
      <input
        type="text"
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        className="col-span-2 sm:flex-1 sm:min-w-[120px] px-3 py-2 border rounded-md text-[13px] font-mono focus:outline-none focus:border-[#a78bfa]"
        style={{ ...inputStyle, '--tw-ring-color': '#a78bfa' }}
        aria-label="Search transits"
      />

      {mode !== 'natal' && (
        <select
          value={filters.type}
          onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
          className="px-2.5 py-2 border rounded-md text-[13px] font-mono cursor-pointer focus:outline-none"
          style={selectStyle}
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
        className="px-2.5 py-2 border rounded-md text-[13px] font-mono cursor-pointer focus:outline-none"
        style={selectStyle}
        aria-label="Filter by aspect"
      >
        {ASPECT_OPTIONS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>

      <select
        value={filters.month}
        onChange={(e) => onFilterChange({ ...filters, month: e.target.value })}
        className="px-2.5 py-2 border rounded-md text-[13px] font-mono cursor-pointer focus:outline-none"
        style={selectStyle}
        aria-label="Filter by month"
      >
        {MONTH_OPTIONS.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>

      <select
        value={filters.body}
        onChange={(e) => onFilterChange({ ...filters, body: e.target.value })}
        className="px-2.5 py-2 border rounded-md text-[13px] font-mono cursor-pointer focus:outline-none"
        style={selectStyle}
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
