const PLANET_COLORS = {
  Sun:          '#f5a623',
  Moon:         '#c0c0c0',
  Mercury:      '#a0c4ff',
  Venus:        '#ff9dc6',
  Mars:         '#ff4f4f',
  Jupiter:      '#7b68ee',
  Saturn:       '#c8a96e',
  Uranus:       '#40e0d0',
  Neptune:      '#4169e1',
  Pluto:        '#9b59b6',
  'Mean Node':  '#2ecc71',
  'North Node': '#2ecc71',
  'South Node': '#e74c3c',
  'Mean Lilith':'#ff69b4',
  Juno:         '#f39c12',
  Chiron:       '#8B4513',
  default:      '#888888',
};

export default function TimelineDrawer({ open, context, onClose }) {
  if (!open || !context) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '42vh',
      background: '#0a0a0a',
      color: '#fff',
      borderTop: '1px solid #2a2a2a',
      padding: '20px 24px',
      overflowY: 'auto',
      zIndex: 1000,
      boxShadow: '0 -8px 32px rgba(0,0,0,0.6)',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: '#666', letterSpacing: 1 }}>
          {context.type === 'day' ? 'DAY VIEW' : 'TRANSIT DETAIL'}
        </span>
        <button
          onClick={onClose}
          style={{
            background: '#222',
            color: '#aaa',
            border: '1px solid #333',
            borderRadius: 4,
            padding: '3px 12px',
            cursor: 'pointer',
            fontSize: 13,
          }}
        >
          ✕
        </button>
      </div>

      {context.type === 'day'   && <DayView   context={context} />}
      {context.type === 'event' && <EventView meta={context.data} />}
    </div>
  );
}

function DayView({ context }) {
  return (
    <div>
      <h2 style={{ fontSize: 18, marginBottom: 14 }}>📅 {context.date}</h2>

      {context.bodies.length === 0 && (
        <p style={{ color: '#555' }}>No data for this day.</p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: 10,
      }}>
        {context.bodies.map(b => (
          <div key={b.name} style={{
            background: '#161616',
            borderLeft: `3px solid ${PLANET_COLORS[b.name] || PLANET_COLORS.default}`,
            borderRadius: 5,
            padding: '8px 12px',
          }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{b.name}</div>
            <div style={{ color: '#aaa', fontSize: 12, marginTop: 3 }}>
              {b.sign} {b.longitude.toFixed(2)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventView({ meta }) {
  const color = PLANET_COLORS[meta.body] || PLANET_COLORS.default;

  return (
    <div>
      <h2 style={{
        fontSize: 18,
        marginBottom: 14,
        paddingLeft: 12,
        borderLeft: `3px solid ${color}`,
      }}>
        {meta.body}
      </h2>

      {/* Retrograde */}
      {(meta.type === 'retrograde-start' || meta.type === 'retrograde-end') && (
        <div style={{
          background: '#1a0a0a',
          border: '1px solid #3a1a1a',
          borderRadius: 6,
          padding: '12px 16px',
          marginBottom: 12,
        }}>
          <div style={{ color: '#ff4f4f', fontWeight: 700, marginBottom: 6 }}>
            {meta.type === 'retrograde-start' ? '℞ Retrograde Begins' : '☌ Stations Direct'}
          </div>
          <div style={{ color: '#aaa', fontSize: 13 }}>
            Date: {meta.date}
          </div>
          <div style={{ color: '#aaa', fontSize: 13 }}>
            Sign: {meta.sign}
          </div>
        </div>
      )}

      {/* Ingress / Egress */}
      {meta.type === 'ingress' && (
        <div style={{
          background: '#0a1a0a',
          border: '1px solid #1a3a1a',
          borderRadius: 6,
          padding: '12px 16px',
          marginBottom: 12,
        }}>
          <div style={{ color: '#2ecc71', fontWeight: 700, marginBottom: 8 }}>
            ➡ Sign Ingress
          </div>
          <div style={{
            display: 'flex',
            gap: 24,
            fontSize: 13,
            color: '#ccc',
          }}>
            <div>
              <div style={{ color: '#666', fontSize: 11, marginBottom: 3 }}>LEAVES</div>
              <strong>{meta.egress?.sign}</strong>
              <div style={{ color: '#555', fontSize: 11 }}>{meta.egress?.date}</div>
            </div>
            <div style={{ color: '#444', alignSelf: 'center', fontSize: 18 }}>→</div>
            <div>
              <div style={{ color: '#666', fontSize: 11, marginBottom: 3 }}>ENTERS</div>
              <strong style={{ color: '#2ecc71' }}>{meta.ingress?.sign}</strong>
              <div style={{ color: '#555', fontSize: 11 }}>{meta.ingress?.date}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
