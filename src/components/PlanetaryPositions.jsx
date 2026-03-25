import { PLANET_SYMBOLS } from '../utils/astroConstants';

export default function PlanetaryPositions({ positions, isOpen, onToggle }) {
  return (
    <div className="mb-5">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 border border-zinc-700 rounded-lg cursor-pointer text-sm font-display flex justify-between items-center hover:bg-zinc-800/50 transition-colors text-zinc-100 bg-transparent"
      >
        <span className="font-semibold">☉ Planetary Positions — March 25, 2026</span>
        <span className="text-lg">{isOpen ? '▴' : '▾'}</span>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-in-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="border border-t-0 border-zinc-700 rounded-b-lg p-4 grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2">
            {Object.entries(positions).map(([name, p]) => (
              <div
                key={name}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-white/[0.03]"
              >
                <span className="text-lg w-6 text-center">
                  {PLANET_SYMBOLS[name] || '•'}
                </span>
                <div>
                  <div className="text-[13px] font-semibold">{name}</div>
                  <div className="text-[13px] font-mono opacity-80">
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
