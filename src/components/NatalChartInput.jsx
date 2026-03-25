import { useState } from 'react';
import { PLANET_SYMBOLS, SIGNS } from '../utils/astroConstants';

const BODIES = [
  'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
  'Uranus', 'Neptune', 'Pluto', 'Chiron', 'True Node', 'Mean Lilith',
];

function lonToFields(lon) {
  const signIdx = Math.floor(lon / 30) % 12;
  const degInSign = lon % 30;
  const deg = Math.floor(degInSign);
  const min = Math.round((degInSign - deg) * 60);
  return { deg, sign: signIdx, min };
}

function fieldsToLon(deg, signIdx, min) {
  return signIdx * 30 + deg + min / 60;
}

const inputClass =
  'w-14 px-2 py-1.5 border border-zinc-700 rounded text-center text-sm font-mono bg-transparent text-zinc-200 focus:outline-none focus:border-zinc-500';
const selectClass =
  'px-2 py-1.5 border border-zinc-700 rounded text-sm font-mono bg-transparent text-zinc-200 cursor-pointer focus:outline-none focus:border-zinc-500';

export default function NatalChartInput({ onNatalChartChange, sampleNatal }) {
  const emptyFields = Object.fromEntries(
    BODIES.map((b) => [b, { deg: '', sign: 0, min: '' }])
  );

  const [fields, setFields] = useState(emptyFields);
  const [chartName, setChartName] = useState('');

  function loadExample() {
    if (!sampleNatal) return;
    const loaded = {};
    for (const body of BODIES) {
      if (sampleNatal.planets[body] !== undefined) {
        loaded[body] = lonToFields(sampleNatal.planets[body]);
      } else {
        loaded[body] = { deg: '', sign: 0, min: '' };
      }
    }
    setFields(loaded);
    setChartName(sampleNatal.name || 'Sample');
  }

  function clearForm() {
    setFields(emptyFields);
    setChartName('');
    onNatalChartChange(null);
  }

  function handleCalculate() {
    const planets = {};
    let valid = false;
    for (const body of BODIES) {
      const f = fields[body];
      if (f.deg !== '' && f.min !== '') {
        planets[body] = fieldsToLon(Number(f.deg), Number(f.sign), Number(f.min));
        valid = true;
      }
    }
    // Add South Node derived from True Node
    if (planets['True Node'] !== undefined) {
      planets['South Node'] = (planets['True Node'] + 180) % 360;
    }
    if (valid) {
      onNatalChartChange({ name: chartName || 'Chart', planets });
    }
  }

  function updateField(body, key, value) {
    setFields((prev) => ({
      ...prev,
      [body]: { ...prev[body], [key]: value },
    }));
  }

  return (
    <div className="glass p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Enter Natal Chart</h3>
        <div className="flex gap-2">
          <button
            onClick={loadExample}
            className="px-3 py-1.5 text-xs font-mono rounded border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition-colors cursor-pointer"
          >
            Load Example
          </button>
          <button
            onClick={clearForm}
            className="px-3 py-1.5 text-xs font-mono rounded border border-zinc-600 text-zinc-400 hover:bg-zinc-700/50 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mb-3">
        <input
          type="text"
          placeholder="Chart name (e.g. Pia)"
          value={chartName}
          onChange={(e) => setChartName(e.target.value)}
          className="px-3 py-1.5 border border-zinc-700 rounded text-sm font-mono bg-transparent text-zinc-200 w-full max-w-xs focus:outline-none focus:border-zinc-500"
        />
      </div>

      {/* Header row */}
      <div className="hidden sm:grid grid-cols-[140px_64px_120px_64px] gap-2 mb-1 px-1 text-[10px] font-mono uppercase tracking-wider opacity-40">
        <span>Planet</span>
        <span className="text-center">Deg</span>
        <span>Sign</span>
        <span className="text-center">Min</span>
      </div>

      <div className="space-y-1.5">
        {BODIES.map((body) => {
          const f = fields[body];
          return (
            <div
              key={body}
              className="grid grid-cols-[140px_64px_120px_64px] gap-2 items-center"
            >
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-base w-5 text-center">
                  {PLANET_SYMBOLS[body] || '•'}
                </span>
                <span className="truncate">{body}</span>
              </div>
              <input
                type="number"
                min={0}
                max={29}
                placeholder="°"
                value={f.deg}
                onChange={(e) => updateField(body, 'deg', e.target.value)}
                className={inputClass}
              />
              <select
                value={f.sign}
                onChange={(e) => updateField(body, 'sign', e.target.value)}
                className={selectClass}
              >
                {SIGNS.map((s, i) => (
                  <option key={i} value={i}>
                    {s.glyph} {s.name}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={0}
                max={59}
                placeholder="'"
                value={f.min}
                onChange={(e) => updateField(body, 'min', e.target.value)}
                className={inputClass}
              />
            </div>
          );
        })}
      </div>

      <button
        onClick={handleCalculate}
        className="mt-4 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-colors cursor-pointer"
      >
        Calculate Transit Aspects
      </button>
    </div>
  );
}
