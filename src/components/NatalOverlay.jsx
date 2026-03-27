import { memo } from 'react';
import { PLANET_SYMBOLS, ASPECT_COLOR_VARS, TYPE_COLORS } from '../utils/astroConstants';
import { formatDate, getOrbColor } from '../utils/formatters';

function AspectBadge({ aspect, color }) {
  return (
    <span
      className="inline-block px-2 py-0.5 rounded text-[11px] font-bold"
      style={{
        background: `color-mix(in srgb, ${color} 15%, transparent)`,
        color: color,
        border: `1px solid color-mix(in srgb, ${color} 33%, transparent)`,
      }}
    >
      {aspect}
    </span>
  );
}

export default memo(function NatalOverlay({ aspects, chartName }) {
  if (!aspects.length) {
    return (
      <div className="text-center py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
        <span className="block text-2xl mb-2 opacity-40">✦</span>
        No transit-to-natal aspects found for the current filters.
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
              <th className="px-2.5 py-2 border-b" style={{ opacity: 0.5, borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Aspect</th>
              <th className="px-2.5 py-2 border-b" style={{ opacity: 0.5, borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Event</th>
              <th className="px-2.5 py-2 border-b text-center" style={{ opacity: 0.5, borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>Orb</th>
            </tr>
          </thead>
          <tbody>
            {aspects.map((e, idx) => {
              const aspColor = ASPECT_COLOR_VARS[e.aspect] || '#999';
              const isMoonTransit = e.transitBody === 'Moon';

              return (
                <tr
                  key={idx}
                  className="transition-colors"
                  style={{
                    background: isMoonTransit ? 'var(--highlight-slate)' : 'var(--highlight-purple)',
                    opacity: isMoonTransit ? 0.7 : 1,
                  }}
                >
                  <td className="px-2.5 py-2 font-mono text-xs whitespace-nowrap border-b" style={{ opacity: 0.9, borderColor: 'var(--border-subtle)' }}>
                    {formatDate(e.date)}
                  </td>

                  <td className="px-2.5 py-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                    <AspectBadge aspect={e.aspect} color={aspColor} />
                  </td>

                  <td className="px-2.5 py-2 border-b font-semibold" style={{ borderColor: 'var(--border-subtle)' }}>
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

                  <td
                    className="px-2.5 py-2 font-mono text-xs text-center border-b"
                    style={{ color: getOrbColor(e.orb), borderColor: 'var(--border-subtle)' }}
                  >
                    {e.orb}°
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: card layout */}
      <div className="sm:hidden space-y-2">
        {aspects.map((e, idx) => {
          const aspColor = ASPECT_COLOR_VARS[e.aspect] || '#999';
          const isMoonTransit = e.transitBody === 'Moon';

          return (
            <div
              key={idx}
              className="rounded-lg p-3 border-l-3"
              style={{
                background: isMoonTransit ? 'var(--highlight-slate)' : 'var(--highlight-purple)',
                borderLeftColor: aspColor,
                borderTop: '1px solid var(--border-subtle)',
                borderRight: '1px solid var(--border-subtle)',
                borderBottom: '1px solid var(--border-subtle)',
                opacity: isMoonTransit ? 0.7 : 1,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-mono text-xs" style={{ opacity: 0.8 }}>
                  {formatDate(e.date)}
                </span>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-xs" style={{ color: getOrbColor(e.orb) }}>
                    {e.orb}°
                  </span>
                  <AspectBadge aspect={e.aspect} color={aspColor} />
                </div>
              </div>
              <div className="text-sm font-semibold">
                <span className="opacity-60 text-xs">Tr.</span>{' '}
                <span className="mr-0.5">{PLANET_SYMBOLS[e.transitBody] || ''}</span>
                {e.transitBody}
                <span className="mx-1.5 font-bold" style={{ color: aspColor }}>
                  {e.aspect}
                </span>
                <span className="opacity-60 text-xs">N.</span>{' '}
                <span className="mr-0.5">{PLANET_SYMBOLS[e.natalBody] || ''}</span>
                {e.natalBody}
              </div>
              {e.position && (
                <div className="text-[11px] opacity-55 font-mono mt-1">{e.position}</div>
              )}
              {e.dateRange && (
                <div className="text-[10px] opacity-40 font-mono mt-0.5">
                  active: {e.dateRange.replace(/2026-/g, '').replace(' to ', ' → ')}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
})
