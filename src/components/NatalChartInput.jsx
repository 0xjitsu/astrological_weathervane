import { useState, useRef } from 'react';
import { PLANET_SYMBOLS, SIGNS } from '../utils/astroConstants';
import BirthDataInput from './BirthDataInput';

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

function parseNatalJson(data) {
  // Format 1: { name, planets: { Sun: 175.3, ... } }
  if (data.planets && typeof data.planets === 'object') {
    const planets = {};
    for (const [key, val] of Object.entries(data.planets)) {
      if (typeof val === 'number' && val >= 0 && val < 360) {
        planets[key] = val;
      }
    }
    if (Object.keys(planets).length < 2) return null;
    return { name: data.name || 'Uploaded Chart', planets };
  }

  // Format 2: Flat { name?, Sun: 175.3, Moon: 252.4, ... }
  const planets = {};
  const skip = new Set(['name', 'angles', 'houses', 'retrograde']);
  for (const [key, val] of Object.entries(data)) {
    if (skip.has(key)) continue;
    if (typeof val === 'number' && val >= 0 && val < 360) {
      planets[key] = val;
    }
  }
  if (Object.keys(planets).length < 2) return null;
  return { name: data.name || 'Uploaded Chart', planets };
}

const inputCss = {
  background: 'var(--bg-input)',
  borderColor: 'var(--border-color)',
  color: 'var(--text-primary)',
};

const EMPTY_FIELDS = Object.fromEntries(
  BODIES.map((b) => [b, { deg: '', sign: 0, min: '' }])
);

const TABS = [
  { id: 'quick', label: 'Quick Entry', desc: 'Birth date + city' },
  { id: 'manual', label: 'Manual', desc: 'Enter longitudes' },
  { id: 'upload', label: 'Upload', desc: 'JSON file' },
];

export default function NatalChartInput({ onNatalChartChange, sampleNatal }) {

  const [activeTab, setActiveTab] = useState('quick');
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [chartName, setChartName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);
  const fileRef = useRef(null);

  function loadFromParsed(parsed) {
    const loaded = {};
    for (const body of BODIES) {
      if (parsed.planets[body] !== undefined) {
        loaded[body] = lonToFields(parsed.planets[body]);
      } else {
        loaded[body] = { deg: '', sign: 0, min: '' };
      }
    }
    setFields(loaded);
    setChartName(parsed.name);
    setUploadMsg({ type: 'success', text: `Loaded "${parsed.name}" (${Object.keys(parsed.planets).length} bodies)` });
  }

  function handleFile(file) {
    setUploadMsg(null);
    if (!file || !file.name.endsWith('.json')) {
      setUploadMsg({ type: 'error', text: 'Please upload a .json file' });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const parsed = parseNatalJson(data);
        if (!parsed) {
          setUploadMsg({ type: 'error', text: 'Invalid chart: need at least 2 planets with longitudes 0–360' });
          return;
        }
        loadFromParsed(parsed);
      } catch {
        setUploadMsg({ type: 'error', text: 'Invalid JSON file' });
      }
    };
    reader.readAsText(file);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }

  function loadExample() {
    if (!sampleNatal) return;
    const parsed = parseNatalJson(sampleNatal);
    if (parsed) loadFromParsed(parsed);
  }

  function clearForm() {
    setFields(EMPTY_FIELDS);
    setChartName('');
    setUploadMsg(null);
    onNatalChartChange(null);
  }

  function exportChart() {
    const planets = {};
    for (const body of BODIES) {
      const f = fields[body];
      if (f.deg !== '' && f.min !== '') {
        planets[body] = fieldsToLon(Number(f.deg), Number(f.sign), Number(f.min));
      }
    }
    if (planets['True Node'] !== undefined) {
      planets['South Node'] = (planets['True Node'] + 180) % 360;
    }
    const blob = new Blob(
      [JSON.stringify({ name: chartName || 'Chart', planets }, null, 2)],
      { type: 'application/json' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(chartName || 'chart').toLowerCase().replace(/\s+/g, '-')}-natal.json`;
    a.click();
    URL.revokeObjectURL(url);
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

  const hasData = BODIES.some((b) => fields[b].deg !== '');

  return (
    <div className="glass p-5 mb-6">
      <h3 className="text-lg font-semibold mb-3">Enter Natal Chart</h3>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-0.5 rounded-lg" style={{ background: 'var(--bg-subtle)' }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 px-3 py-2 text-xs font-mono rounded-md transition-all cursor-pointer"
            style={{
              background: activeTab === tab.id ? 'var(--accent-color, #a78bfa)' : 'transparent',
              color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 600 : 400,
            }}
          >
            <span className="block">{tab.label}</span>
            <span className="block text-[10px] opacity-60 hidden sm:block">{tab.desc}</span>
          </button>
        ))}
      </div>

      {/* Quick Entry Tab */}
      {activeTab === 'quick' && (
        <BirthDataInput
          onNatalChartChange={(chart) => {
            onNatalChartChange(chart);
            // Also populate manual fields if chart was computed
            if (chart?.planets) {
              const loaded = {};
              for (const body of BODIES) {
                if (chart.planets[body] !== undefined) {
                  loaded[body] = lonToFields(chart.planets[body]);
                } else {
                  loaded[body] = { deg: '', sign: 0, min: '' };
                }
              }
              setFields(loaded);
              setChartName(chart.name || '');
            }
          }}
        />
      )}

      {/* Manual Entry Tab */}
      {activeTab === 'manual' && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={loadExample}
              className="px-3 py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer"
              style={{ borderColor: 'rgba(167,139,250,0.4)', color: 'var(--accent-highlight, #c084fc)' }}
            >
              Load Example
            </button>
            {hasData && (
              <button
                onClick={exportChart}
                className="px-3 py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer"
                style={{ borderColor: 'rgba(74,222,128,0.4)', color: '#4ade80' }}
              >
                Export JSON
              </button>
            )}
            <button
              onClick={clearForm}
              className="px-3 py-1.5 text-xs font-mono rounded border transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Clear
            </button>
          </div>

          {uploadMsg && (
            <div
              className="mb-3 px-3 py-2 rounded text-xs font-mono"
              style={{
                background: uploadMsg.type === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)',
                color: uploadMsg.type === 'success' ? '#4ade80' : '#ff6b6b',
                border: `1px solid ${uploadMsg.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(255,107,107,0.3)'}`,
              }}
            >
              {uploadMsg.type === 'success' ? '✓ ' : '✗ '}{uploadMsg.text}
            </div>
          )}

          <div className="mb-3">
            <input
              type="text"
              placeholder="Chart name (e.g. Pia)"
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              className="px-3 py-1.5 border rounded text-sm font-mono w-full max-w-xs focus:outline-none"
              style={inputCss}
            />
          </div>

          <div className="hidden sm:grid grid-cols-[140px_64px_120px_64px] gap-2 mb-1 px-1 text-[10px] font-mono uppercase tracking-wider" style={{ opacity: 0.4, color: 'var(--text-secondary)' }}>
            <span>Planet</span>
            <span className="text-center">Deg</span>
            <span>Sign</span>
            <span className="text-center">Min</span>
          </div>

          <div className="space-y-1.5">
            {BODIES.map((body) => {
              const f = fields[body];
              return (
                <div key={body} className="space-y-1 sm:space-y-0">
                  {/* Mobile: 2 rows | Desktop: 1 row */}
                  <div className="sm:grid sm:grid-cols-[140px_64px_120px_64px] sm:gap-2 sm:items-center">
                    {/* Planet name — full width on mobile, first col on desktop */}
                    <div className="flex items-center gap-1.5 text-sm min-w-0 mb-1 sm:mb-0">
                      <span className="text-base w-5 text-center shrink-0">
                        {PLANET_SYMBOLS[body] || '•'}
                      </span>
                      <span className="truncate text-xs sm:text-sm">{body}</span>
                    </div>
                    {/* Deg/Sign/Min — 3-col grid on mobile, inline on desktop */}
                    <div className="grid grid-cols-[1fr_2fr_1fr] gap-1.5 sm:contents">
                      <input
                        type="number"
                        min={0}
                        max={29}
                        placeholder="°"
                        value={f.deg}
                        onChange={(e) => updateField(body, 'deg', e.target.value)}
                        className="w-full px-1.5 py-2.5 border rounded text-center text-sm font-mono focus:outline-none"
                        style={inputCss}
                      />
                      <select
                        value={f.sign}
                        onChange={(e) => updateField(body, 'sign', e.target.value)}
                        className="w-full px-1 py-2.5 border rounded text-xs sm:text-sm font-mono cursor-pointer focus:outline-none min-w-0"
                        style={inputCss}
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
                        className="w-full px-1.5 py-2.5 border rounded text-center text-sm font-mono focus:outline-none"
                        style={inputCss}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleCalculate}
            className="mt-4 px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
            style={{ background: 'var(--accent-color, #a78bfa)', color: '#fff' }}
          >
            Calculate Transit Aspects
          </button>
        </>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className="mb-4 p-6 rounded-lg border-2 border-dashed text-center cursor-pointer transition-all duration-200"
            style={{
              borderColor: dragOver ? 'var(--accent-color, #a78bfa)' : 'var(--border-color)',
              background: dragOver ? 'rgba(167,139,250,0.08)' : 'var(--bg-subtle)',
              color: 'var(--text-muted)',
            }}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => handleFile(e.target.files[0])}
            />
            <div className="text-sm font-mono">
              Drop a natal chart JSON here, or <span style={{ color: 'var(--accent-color, #a78bfa)' }}>click to browse</span>
            </div>
            <div className="text-[11px] mt-1 opacity-60">
              Accepts: {'{ planets: { Sun: 175.3, ... } }'} or flat format
            </div>
          </div>

          {uploadMsg && (
            <div
              className="mb-3 px-3 py-2 rounded text-xs font-mono"
              style={{
                background: uploadMsg.type === 'success' ? 'rgba(74,222,128,0.1)' : 'rgba(255,107,107,0.1)',
                color: uploadMsg.type === 'success' ? '#4ade80' : '#ff6b6b',
                border: `1px solid ${uploadMsg.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(255,107,107,0.3)'}`,
              }}
            >
              {uploadMsg.type === 'success' ? '✓ ' : '✗ '}{uploadMsg.text}
            </div>
          )}

          {hasData && (
            <div className="flex gap-2">
              <button
                onClick={handleCalculate}
                className="px-5 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                style={{ background: 'var(--accent-color, #a78bfa)', color: '#fff' }}
              >
                Use Uploaded Chart
              </button>
              <button
                onClick={exportChart}
                className="px-3 py-2 text-xs font-mono rounded border transition-colors cursor-pointer"
                style={{ borderColor: 'rgba(74,222,128,0.4)', color: '#4ade80' }}
              >
                Export JSON
              </button>
              <button
                onClick={clearForm}
                className="px-3 py-2 text-xs font-mono rounded border transition-colors cursor-pointer"
                style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
              >
                Clear
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
