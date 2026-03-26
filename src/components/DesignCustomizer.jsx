import { useState, useCallback } from 'react';

// ── Award-winning curated theme presets ──────────
// Each theme is a complete color system: accent + aspects + glass + font + radius
const THEME_PRESETS = [
  {
    id: 'cosmic-violet',
    name: 'Cosmic Violet',
    description: 'Deep violet with warm gold accents',
    accent: '#a78bfa',
    highlight: '#c084fc',
    aspects: {
      conjunction: '#e8c547',
      sextile: '#4ecdc4',
      square: '#ff6b6b',
      trine: '#6bcb77',
      opposition: '#ee6c4d',
    },
    glass: { name: 'Frost', blur: '12px', opacity: 0.7, darkOpacity: 0.4 },
    font: "'Crimson Pro', 'Cormorant Garamond', Georgia, serif",
    borderRadius: 0.75,
  },
  {
    id: 'nebula',
    name: 'Nebula',
    description: 'Deep sapphire with aurora tones',
    accent: '#6366f1',
    highlight: '#818cf8',
    aspects: {
      conjunction: '#fbbf24',
      sextile: '#34d399',
      square: '#f472b6',
      trine: '#2dd4bf',
      opposition: '#fb923c',
    },
    glass: { name: 'Frost', blur: '12px', opacity: 0.7, darkOpacity: 0.4 },
    font: "system-ui, -apple-system, sans-serif",
    borderRadius: 0.625,
  },
  {
    id: 'solar-flare',
    name: 'Solar Flare',
    description: 'Warm amber with fiery highlights',
    accent: '#f59e0b',
    highlight: '#fbbf24',
    aspects: {
      conjunction: '#fcd34d',
      sextile: '#a3e635',
      square: '#ef4444',
      trine: '#4ade80',
      opposition: '#f97316',
    },
    glass: { name: 'Clear', blur: '4px', opacity: 0.85, darkOpacity: 0.25 },
    font: "'Crimson Pro', 'Cormorant Garamond', Georgia, serif",
    borderRadius: 0.5,
  },
  {
    id: 'observatory',
    name: 'Observatory',
    description: 'Cool steel blue, scientific precision',
    accent: '#64748b',
    highlight: '#94a3b8',
    aspects: {
      conjunction: '#cbd5e1',
      sextile: '#67e8f9',
      square: '#fca5a5',
      trine: '#86efac',
      opposition: '#fdba74',
    },
    glass: { name: 'Solid', blur: '0px', opacity: 1, darkOpacity: 0.7 },
    font: "'Inter', system-ui, sans-serif",
    borderRadius: 0.375,
  },
  {
    id: 'eclipse',
    name: 'Eclipse',
    description: 'Deep rose with muted earth tones',
    accent: '#e11d48',
    highlight: '#fb7185',
    aspects: {
      conjunction: '#d4a574',
      sextile: '#5eead4',
      square: '#fda4af',
      trine: '#86efac',
      opposition: '#c084fc',
    },
    glass: { name: 'Frost', blur: '12px', opacity: 0.7, darkOpacity: 0.4 },
    font: "'Crimson Pro', 'Cormorant Garamond', Georgia, serif",
    borderRadius: 1,
  },
  {
    id: 'supernova',
    name: 'Supernova',
    description: 'Electric cyan, high contrast neon',
    accent: '#06b6d4',
    highlight: '#22d3ee',
    aspects: {
      conjunction: '#facc15',
      sextile: '#a78bfa',
      square: '#f43f5e',
      trine: '#34d399',
      opposition: '#fb923c',
    },
    glass: { name: 'Clear', blur: '4px', opacity: 0.85, darkOpacity: 0.25 },
    font: "system-ui, -apple-system, sans-serif",
    borderRadius: 0.75,
  },
];

const GLASS_OPTIONS = [
  { name: 'Frost', blur: '12px', opacity: 0.7, darkOpacity: 0.4 },
  { name: 'Clear', blur: '4px', opacity: 0.85, darkOpacity: 0.25 },
  { name: 'Solid', blur: '0px', opacity: 1, darkOpacity: 0.7 },
];

const FONT_OPTIONS = [
  { name: 'Crimson Pro', value: "'Crimson Pro', 'Cormorant Garamond', Georgia, serif" },
  { name: 'System', value: "system-ui, -apple-system, sans-serif" },
  { name: 'Geist', value: "'Inter', system-ui, sans-serif" },
];

const DEFAULT_THEME = THEME_PRESETS[0];
const STORAGE_KEY = 'astro-design-config';

function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

function applyConfig(config) {
  const root = document.documentElement;
  if (config.accent) {
    root.style.setProperty('--accent-color', config.accent);
    root.style.setProperty('--accent-highlight', config.highlight || config.accent);
  }
  if (config.aspects) {
    Object.entries(config.aspects).forEach(([key, val]) => {
      root.style.setProperty(`--color-${key}`, val);
    });
  }
  if (config.glass) {
    root.style.setProperty('--glass-blur', config.glass.blur);
    root.style.setProperty('--glass-opacity', config.glass.opacity);
    root.style.setProperty('--glass-dark-opacity', config.glass.darkOpacity);
  }
  if (config.font) {
    root.style.setProperty('--font-display', config.font);
  }
  if (config.borderRadius !== undefined) {
    root.style.setProperty('--radius', config.borderRadius + 'rem');
  }
}

function clearConfig() {
  const root = document.documentElement;
  [
    '--accent-color', '--accent-highlight',
    '--color-conjunction', '--color-sextile', '--color-square', '--color-trine', '--color-opposition',
    '--glass-blur', '--glass-opacity', '--glass-dark-opacity',
    '--font-display', '--radius',
  ].forEach((prop) => root.style.removeProperty(prop));
  localStorage.removeItem(STORAGE_KEY);
}

// Apply saved config on module load (before component mount)
const savedConfig = loadConfig();
if (savedConfig) applyConfig(savedConfig);

export default function DesignCustomizer() {
  const [open, setOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config, setConfig] = useState(() => loadConfig() || {
    themeId: DEFAULT_THEME.id,
    accent: DEFAULT_THEME.accent,
    highlight: DEFAULT_THEME.highlight,
    aspects: { ...DEFAULT_THEME.aspects },
    glass: DEFAULT_THEME.glass,
    font: DEFAULT_THEME.font,
    borderRadius: DEFAULT_THEME.borderRadius,
  });

  const update = useCallback((patch) => {
    setConfig((prev) => {
      const next = { ...prev, ...patch };
      saveConfig(next);
      applyConfig(next);
      return next;
    });
  }, []);

  function handleThemePreset(theme) {
    const next = {
      themeId: theme.id,
      accent: theme.accent,
      highlight: theme.highlight,
      aspects: { ...theme.aspects },
      glass: theme.glass,
      font: theme.font,
      borderRadius: theme.borderRadius,
    };
    setConfig(next);
    saveConfig(next);
    applyConfig(next);
  }

  function handleAspectColor(key, color) {
    update({ themeId: null, aspects: { ...config.aspects, [key]: color } });
  }

  function handleReset() {
    clearConfig();
    setConfig({
      themeId: DEFAULT_THEME.id,
      accent: DEFAULT_THEME.accent,
      highlight: DEFAULT_THEME.highlight,
      aspects: { ...DEFAULT_THEME.aspects },
      glass: DEFAULT_THEME.glass,
      font: DEFAULT_THEME.font,
      borderRadius: DEFAULT_THEME.borderRadius,
    });
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Customize design"
        className="p-2 rounded-lg transition-all duration-300 cursor-pointer"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-secondary)',
        }}
      >
        <span className="inline-block text-lg leading-none">🎨</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out"
        style={{
          width: 'min(340px, 88vw)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          background: 'var(--bg-primary)',
          borderLeft: '1px solid var(--border-color)',
        }}
      >
        <div className="h-full overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Design Themes
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded cursor-pointer text-lg leading-none"
              style={{ color: 'var(--text-muted)' }}
            >
              ✕
            </button>
          </div>

          {/* Theme Presets — the star feature */}
          <Section title="Theme Presets">
            <div className="space-y-2">
              {THEME_PRESETS.map((theme) => {
                const isActive = config.themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemePreset(theme)}
                    className="w-full text-left px-3 py-2.5 rounded-lg border cursor-pointer transition-all"
                    style={{
                      borderColor: isActive ? theme.accent : 'var(--border-color)',
                      background: isActive
                        ? `color-mix(in srgb, ${theme.accent} 10%, transparent)`
                        : 'var(--bg-subtle)',
                    }}
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      {/* Color swatch strip */}
                      <div className="flex gap-0.5 shrink-0">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: theme.accent }}
                        />
                        {Object.values(theme.aspects).map((c, i) => (
                          <span
                            key={i}
                            className="w-2 h-2 rounded-full self-center"
                            style={{ background: c, opacity: 0.8 }}
                          />
                        ))}
                      </div>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: isActive ? theme.accent : 'var(--text-primary)' }}
                      >
                        {theme.name}
                      </span>
                      {isActive && (
                        <span
                          className="ml-auto text-[9px] font-mono uppercase tracking-wider"
                          style={{ color: theme.accent }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <div
                      className="text-[10px] font-mono pl-[calc(0.75rem+15px+5*10px)]"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {theme.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </Section>

          {/* Advanced toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full text-left px-3 py-2 rounded-lg border cursor-pointer transition-all text-[11px] font-mono uppercase tracking-wider mb-4"
            style={{
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)',
              background: showAdvanced ? 'var(--bg-subtle)' : 'transparent',
            }}
          >
            {showAdvanced ? '▾' : '▸'} Fine-Tune Colors
          </button>

          {showAdvanced && (
            <>
              {/* Accent Color */}
              <Section title="Accent Override">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={config.accent}
                    onChange={(e) => update({ themeId: null, accent: e.target.value, highlight: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {config.accent}
                  </span>
                </div>
              </Section>

              {/* Aspect Colors */}
              <Section title="Aspect Colors">
                <div className="space-y-2">
                  {Object.entries(config.aspects || DEFAULT_THEME.aspects).map(([key, color]) => (
                    <div key={key} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => handleAspectColor(key, e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                      />
                      <span className="text-xs font-mono capitalize" style={{ color: 'var(--text-secondary)' }}>
                        {key}
                      </span>
                      <span className="text-[10px] font-mono ml-auto" style={{ color: 'var(--text-muted)' }}>
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Glass Effect */}
              <Section title="Glass Effect">
                <div className="grid grid-cols-3 gap-2">
                  {GLASS_OPTIONS.map((opt) => (
                    <button
                      key={opt.name}
                      onClick={() => update({ themeId: null, glass: opt })}
                      className="px-3 py-2 rounded-lg border cursor-pointer text-xs font-mono transition-all"
                      style={{
                        borderColor: config.glass?.name === opt.name ? 'var(--accent-color, #a78bfa)' : 'var(--border-color)',
                        background: config.glass?.name === opt.name ? 'var(--highlight-purple)' : 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Border Radius */}
              <Section title="Border Radius">
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.125"
                    value={config.borderRadius}
                    onChange={(e) => update({ themeId: null, borderRadius: parseFloat(e.target.value) })}
                    className="flex-1 accent-[var(--accent-color,#a78bfa)]"
                  />
                  <span className="text-xs font-mono w-12 text-right" style={{ color: 'var(--text-muted)' }}>
                    {config.borderRadius}rem
                  </span>
                </div>
              </Section>

              {/* Font */}
              <Section title="Display Font">
                <div className="space-y-1.5">
                  {FONT_OPTIONS.map((f) => (
                    <button
                      key={f.name}
                      onClick={() => update({ themeId: null, font: f.value })}
                      className="w-full text-left px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all"
                      style={{
                        fontFamily: f.value,
                        borderColor: config.font === f.value ? 'var(--accent-color, #a78bfa)' : 'var(--border-color)',
                        background: config.font === f.value ? 'var(--highlight-purple)' : 'var(--bg-subtle)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full mt-2 px-4 py-2.5 rounded-lg border text-xs font-mono cursor-pointer transition-colors"
            style={{
              borderColor: 'rgba(255,107,107,0.4)',
              color: '#ff6b6b',
              background: 'transparent',
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <div
        className="text-[10px] font-mono uppercase tracking-widest mb-2"
        style={{ color: 'var(--text-muted)', opacity: 0.7 }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
