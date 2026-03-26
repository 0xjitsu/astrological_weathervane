import { REFERENCES, METHODOLOGY, TECH_STACK } from '../data/references';

function Cite({ n, inline }) {
  const ref = REFERENCES.find((r) => r.id === n);
  if (!ref) return null;

  if (inline) {
    return (
      <a
        href={`#ref-${n}`}
        className="underline underline-offset-2 transition-colors"
        style={{ color: 'var(--accent-color, #a78bfa)' }}
      >
        {ref.author || ref.title}
      </a>
    );
  }

  return (
    <a
      href={`#ref-${n}`}
      className="text-[10px] font-mono align-super transition-colors"
      style={{ color: 'var(--accent-color, #a78bfa)' }}
    >
      [{n}]
    </a>
  );
}

export default function References() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Methodology */}
      <section>
        <h2 className="text-xl font-light tracking-tight mb-4">Methodology</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(METHODOLOGY).map(([key, m]) => (
            <div key={key} className="glass p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{m.icon}</span>
                <h3 className="text-sm font-semibold">{m.title}</h3>
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {m.content}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Data Sources */}
      <section>
        <h2 className="text-xl font-light tracking-tight mb-4">Data Sources</h2>
        <div className="space-y-3">
          {REFERENCES.map((ref) => (
            <div
              key={ref.id}
              id={`ref-${ref.id}`}
              className="glass p-4 scroll-mt-16 transition-all"
            >
              <div className="flex items-start gap-3">
                <span
                  className="inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-mono font-bold shrink-0 mt-0.5"
                  style={{
                    background: 'rgba(167,139,250,0.15)',
                    color: 'var(--accent-color, #a78bfa)',
                  }}
                >
                  {ref.id}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold hover:underline"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {ref.title}
                      <span className="inline-block ml-1 text-[11px] opacity-50">↗</span>
                    </a>
                    {ref.author && (
                      <span className="text-[12px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        — {ref.author}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] mt-1 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {ref.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Built With */}
      <section>
        <h2 className="text-xl font-light tracking-tight mb-4">Built With</h2>
        <div className="glass p-4">
          <div className="flex flex-wrap gap-2">
            {TECH_STACK.map((t) => (
              <a
                key={t.name}
                href={t.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-mono transition-colors"
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                }}
              >
                {t.name}
                <span className="text-[10px] opacity-50">↗</span>
              </a>
            ))}
          </div>
          <p className="text-[12px] font-mono mt-3" style={{ color: 'var(--text-muted)' }}>
            All astronomical data pre-computed via Swiss Ephemeris <Cite n={1} /> using pyswisseph <Cite n={2} />.
            No backend required at runtime — all transit-to-natal calculations run client-side in the browser.
          </p>
        </div>
      </section>

      {/* Disclaimer */}
      <div
        className="text-center text-[11px] font-mono py-4"
        style={{ color: 'var(--text-muted)' }}
      >
        This tool is for educational and entertainment purposes.
        Astronomical positions are accurate; astrological interpretations are cultural traditions, not science.
      </div>
    </div>
  );
}

export { Cite };
