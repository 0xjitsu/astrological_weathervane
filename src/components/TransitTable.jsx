import { memo } from 'react';
import { PLANET_SYMBOLS, ASPECT_COLOR_VARS, TYPE_COLORS } from '../utils/astroConstants';
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

export default memo(function TransitTable({ events }) {
  if (!events.length) {
    return (
      <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
        <span className="block text-2xl mb-2 opacity-40">✦</span>
        No events match your filters.
      </div>
    );
  }

  return (
    <>
      {/* Desktop: table layout */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm" style={{ borderCollapse: 'separate', borderSpacing: '0 2px' }}>
          <thead>
            <tr className="text-left text-[11px] font-mono uppercase tracking-wider">
              <th className="px-2.5 py-2 border-b" style={{ opacity: 0.5, borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Date</th>
              <th className="px-2.5 py-2 border-b" style={{ opacity: 0.5, borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Type</th>
              <th className="px-2.5 py-2 border-b" style={{ opacity: 0.5, borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Event</th>
              <th className="px-2.5 py-2 border-b text-center" style={{ opacity: 0.5, borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Orb</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e, idx) => {
              const isMoonIng = e.type === 'Moon Ingress';
              const isHighlight = e.highlight;
              const dimmed = isMoonIng && !isHighlight;
              const aspColor = ASPECT_COLOR_VARS[e.aspect] || '#999';
              const orbVal = parseOrb(e.orb);

              let rowBg = 'transparent';
              if (isHighlight && !isMoonIng) rowBg = 'var(--highlight-purple)';
              if (isMoonIng && isHighlight) rowBg = 'var(--highlight-amber)';

              return (
                <tr
                  key={idx}
                  className="transition-colors"
                  style={{
                    background: rowBg,
                    '--tw-bg-opacity': 1,
                  }}
                  onMouseEnter={(ev) => { if (rowBg === 'transparent') ev.currentTarget.style.background = 'var(--row-hover)'; }}
                  onMouseLeave={(ev) => { ev.currentTarget.style.background = rowBg; }}
                >
                  <td
                    className="px-2.5 py-2 font-mono text-xs whitespace-nowrap border-b"
                    style={{ opacity: dimmed ? 0.5 : 0.9, borderColor: 'var(--border-subtle)' }}
                  >
                    {formatDate(e.date)}
                    {e.time && (
                      <div className="text-[10px] opacity-60">{e.time}</div>
                    )}
                  </td>

                  <td className="px-2.5 py-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <TypeBadge type={e.type} />
                  </td>

                  <td
                    className="px-2.5 py-2 border-b"
                    style={{
                      fontWeight: isHighlight ? 600 : 400,
                      opacity: dimmed ? 0.55 : 1,
                      borderColor: 'var(--border-subtle)',
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

                  <td
                    className="px-2.5 py-2 font-mono text-xs text-center border-b"
                    style={{ color: orbVal ? getOrbColor(orbVal) : '', borderColor: 'var(--border-subtle)' }}
                  >
                    {e.orb || '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: card layout */}
      <div className="sm:hidden space-y-2">
        {events.map((e, idx) => {
          const isMoonIng = e.type === 'Moon Ingress';
          const isHighlight = e.highlight;
          const dimmed = isMoonIng && !isHighlight;
          const aspColor = ASPECT_COLOR_VARS[e.aspect] || '#999';
          const orbVal = parseOrb(e.orb);

          let cardBg = 'var(--bg-surface)';
          if (isHighlight && !isMoonIng) cardBg = 'var(--highlight-purple)';
          if (isMoonIng && isHighlight) cardBg = 'var(--highlight-amber)';

          return (
            <div
              key={idx}
              className="rounded-lg p-3 border-l-3"
              style={{
                background: cardBg,
                borderLeftColor: aspColor,
                borderTop: '1px solid var(--border-subtle)',
                borderRight: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                opacity: dimmed ? 0.6 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs" style={{ opacity: 0.8 }}>
                  {formatDate(e.date)}
                  {e.time && <span className="ml-1 opacity-60">{e.time}</span>}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  {e.orb && (
                    <span className="font-mono text-xs" style={{ color: orbVal ? getOrbColor(orbVal) : '' }}>
                      {e.orb}
                    </span>
                  )}
                  <TypeBadge type={e.type} />
                </div>
              </div>
              <div style={{ fontWeight: isHighlight ? 600 : 400 }}>
                {e.type === 'Aspect' ? (
                  <span className="text-sm">
                    <span className="mr-1">{PLANET_SYMBOLS[e.body1] || ''}</span>
                    {e.body1}
                    <span className="mx-1.5 font-bold" style={{ color: aspColor }}>
                      {e.aspect}
                    </span>
                    <span className="mr-1">{PLANET_SYMBOLS[e.body2] || ''}</span>
                    {e.body2}
                  </span>
                ) : (
                  <span className="text-sm">
                    {e.body1 && <span className="mr-1">{PLANET_SYMBOLS[e.body1] || ''}</span>}
                    {e.description}
                  </span>
                )}
              </div>
              {e.position && (
                <div className="text-[11px] opacity-55 font-mono mt-1">{e.position}</div>
              )}
              {e.date_range && (
                <div className="text-[10px] opacity-40 font-mono mt-0.5">
                  active: {e.date_range.replace('2026-', '').replace('2026-', ' → ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
})
