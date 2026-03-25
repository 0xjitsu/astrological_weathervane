import { PLANET_SYMBOLS, ASPECT_COLORS, TYPE_COLORS } from '../utils/astroConstants';
import { formatDate, getOrbColor, parseOrb } from '../utils/formatters';

function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] || '#666';
  return (
    <span
      className="inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide"
      style={{
        background: color + '22',
        color: color,
        border: `1px solid ${color}44`,
      }}
    >
      {type === 'Moon Ingress' ? '☽ INGRESS' : type.toUpperCase()}
    </span>
  );
}

export default function TransitTable({ events }) {
  if (!events.length) {
    return (
      <div className="text-center py-12 text-zinc-500 font-mono text-sm">
        No events match your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: '0 2px' }}>
        <thead>
          <tr className="text-left text-[11px] font-mono uppercase tracking-wider">
            <th className="px-2.5 py-2 opacity-50 border-b border-zinc-700/60">Date</th>
            <th className="px-2.5 py-2 opacity-50 border-b border-zinc-700/60">Type</th>
            <th className="px-2.5 py-2 opacity-50 border-b border-zinc-700/60">Event</th>
            <th className="px-2.5 py-2 opacity-50 border-b border-zinc-700/60 text-center">Orb</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e, idx) => {
            const isMoonIng = e.type === 'Moon Ingress';
            const isHighlight = e.highlight;
            const dimmed = isMoonIng && !isHighlight;
            const aspColor = ASPECT_COLORS[e.aspect] || '#999';
            const orbVal = parseOrb(e.orb);

            let rowBg = 'transparent';
            if (isHighlight && !isMoonIng) rowBg = 'rgba(167,139,250,0.06)';
            if (isMoonIng && isHighlight) rowBg = 'rgba(245,158,11,0.08)';

            return (
              <tr
                key={idx}
                className="hover:bg-zinc-800/40 transition-colors"
                style={{ background: rowBg }}
              >
                {/* Date */}
                <td
                  className="px-2.5 py-2 font-mono text-xs whitespace-nowrap border-b border-white/[0.04]"
                  style={{ opacity: dimmed ? 0.5 : 0.9 }}
                >
                  {formatDate(e.date)}
                  {e.time && (
                    <div className="text-[10px] opacity-60">{e.time}</div>
                  )}
                </td>

                {/* Type */}
                <td className="px-2.5 py-2 border-b border-white/[0.04]">
                  <TypeBadge type={e.type} />
                </td>

                {/* Event */}
                <td
                  className="px-2.5 py-2 border-b border-white/[0.04]"
                  style={{
                    fontWeight: isHighlight ? 600 : 400,
                    opacity: dimmed ? 0.55 : 1,
                  }}
                >
                  <div>
                    {e.type === 'Aspect' ? (
                      <span>
                        <span className="mr-1">{PLANET_SYMBOLS[e.body1] || ''}</span>
                        {e.body1}
                        <span className="mx-1.5 font-bold" style={{ color: aspColor }}>
                          {e.aspect}
                        </span>
                        <span className="mr-1">{PLANET_SYMBOLS[e.body2] || ''}</span>
                        {e.body2}
                      </span>
                    ) : (
                      <span>
                        {e.body1 && (
                          <span className="mr-1">{PLANET_SYMBOLS[e.body1] || ''}</span>
                        )}
                        {e.description}
                      </span>
                    )}
                  </div>
                  {e.position && (
                    <div className="text-[11px] opacity-55 font-mono mt-0.5">
                      {e.position}
                    </div>
                  )}
                  {e.date_range && (
                    <div className="text-[10px] opacity-40 font-mono mt-0.5">
                      active: {e.date_range.replace('2026-', '').replace('2026-', ' → ')}
                    </div>
                  )}
                </td>

                {/* Orb */}
                <td
                  className="px-2.5 py-2 font-mono text-xs text-center border-b border-white/[0.04]"
                  style={{ color: orbVal ? getOrbColor(orbVal) : '' }}
                >
                  {e.orb || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
