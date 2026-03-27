import { PLANET_SYMBOLS } from '../utils/astroConstants';

export default function PlanetaryPositions({ positions, isOpen, onToggle }) {
  return (
    <div className="mb-5">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 rounded-lg cursor-pointer text-sm font-display flex justify-between items-center transition-colors"
        style={{
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          background: 'var(--bg-surface)',
        }}
      >
        <span className="font-semibold">☉ Planetary Positions — March 25, 2026</span>
        <span className="text-lg">{isOpen ? '▴' : '▾'}</span>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div
            className="rounded-b-lg p-4 grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2"
            style={{
              border: '1px solid var(--border-color)',
              borderTop: 'none',
            }}
          >
            {Object.entries(positions).map(([name, p]) => (
              <div
                key={name}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md"
                style={{ background: 'var(--bg-subtle)' }}
              >
                <span className="text-lg w-6 text-center">
                  {PLANET_SYMBOLS[name] || '•'}
                </span>
                <div>
                  <div className="text-[13px] font-semibold">{name}</div>
                  <div className="text-[13px] font-mono" style={{ opacity: 0.8 }}>
                    {p.formatted} {p.sign}{' '}
                    {p.motion === 'Rx' && (
                      <span className="text-[#ff6b6b]">℞</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
