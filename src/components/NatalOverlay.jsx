import { PLANET_SYMBOLS, ASPECT_COLORS, TYPE_COLORS } from '../utils/astroConstants';
import { formatDate, getOrbColor } from '../utils/formatters';

export default function NatalOverlay({ aspects, chartName }) {
  if (!aspects.length) {
    return (
      <div className="text-center py-12 text-zinc-500 font-mono text-sm">
        No transit-to-natal aspects found for the current filters.
      </div>
    );
  }

  const color = TYPE_COLORS['Transit-to-Natal'];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: '0 2px' }}>
        <thead>
          <tr className="text-left text-[11px] font-mono uppercase tracking-wider">
            <th className="px-2.5 py-2 opacity-50 border-b border-zinc-700/60">Date</th>
            <th className="px-2.5 py-2 opacity-50 border-b border-zinc-700/60">Aspect</th>
            <th className="px-2.5 py-2 opacity-50 border-b border-zinc-700/60">Event</th>
            <th className="px-2.5 py-2 opacity-50 border-b border-zinc-700/60 text-center">Orb</th>
          </tr>
        </thead>
        <tbody>
          {aspects.map((e, idx) => {
            const aspColor = ASPECT_COLORS[e.aspect] || '#999';
            const isMoonTransit = e.transitBody === 'Moon';

            return (
              <tr
                key={idx}
                className="hover:bg-zinc-800/40 transition-colors"
                style={{
                  background: isMoonTransit
                    ? 'rgba(148,163,184,0.04)'
                    : 'rgba(192,132,252,0.04)',
                  opacity: isMoonTransit ? 0.7 : 1,
                }}
              >
                {/* Date */}
                <td className="px-2.5 py-2 font-mono text-xs whitespace-nowrap border-b border-white/[0.04] opacity-90">
                  {formatDate(e.date)}
                </td>

                {/* Aspect Badge */}
                <td className="px-2.5 py-2 border-b border-white/[0.04]">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[11px] font-bold"
                    style={{
                      background: aspColor + '25',
                      color: aspColor,
                      border: `1px solid ${aspColor}55`,
                    }}
                  >
                    {e.aspect}
                  </span>
                </td>

                {/* Event */}
                <td className="px-2.5 py-2 border-b border-white/[0.04] font-semibold">
                  <div>
                    <span className="opacity-60 text-xs">Tr.</span>{' '}
                    <span className="mr-0.5">{PLANET_SYMBOLS[e.transitBody] || ''}</span>
                    {e.transitBody}
                    <span className="mx-1.5 font-bold" style={{ color: aspColor }}>
                      {e.aspect}
                    </span>
                    <span className="opacity-60 text-xs">Natal</span>{' '}
                    <span className="mr-0.5">{PLANET_SYMBOLS[e.natalBody] || ''}</span>
                    {e.natalBody}
                  </div>
                  {e.position && (
                    <div className="text-[11px] opacity-55 font-mono mt-0.5 font-normal">
                      {e.position}
                    </div>
                  )}
                  {e.dateRange && (
                    <div className="text-[10px] opacity-40 font-mono mt-0.5 font-normal">
                      active: {e.dateRange.replace(/2026-/g, '').replace(' to ', ' → ')}
                    </div>
                  )}
                </td>

                {/* Orb */}
                <td
                  className="px-2.5 py-2 font-mono text-xs text-center border-b border-white/[0.04]"
                  style={{ color: getOrbColor(e.orb) }}
                >
                  {e.orb}°
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
