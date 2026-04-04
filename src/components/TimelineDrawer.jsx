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

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: 10
      }}>
        {context.bodies.map(b => (
          <div key={b.name} style={{
            background: "#161616",
            borderLeft: `4px solid ${PLANET_COLORS[b.name] || "#555"}`,
            borderRadius: 6,
            padding: "10px 14px"
          }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>
              {GLYPHS[b.name] || ""} {b.name}
            </div>
            <div style={{ color: "#aaa", fontSize: 12 }}>
              {b.sign} — {b.longitude.toFixed(2)}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function EventView({ meta }) {
  return (
    <div>
      <h2 style={{
        fontSize: 18,
        marginBottom: 10,
        borderLeft: `4px solid ${PLANET_COLORS[meta.body] || "#666"}`,
        paddingLeft: 10
      }}>
        {GLYPHS[meta.body] || ""} {meta.body}
      </h2>

      {meta.retrograde && (
        <div style={{
          background: "#1f0000",
          padding: "10px",
          borderRadius: 6,
          border: "1px solid #551111",
          marginBottom: 12
        }}>
          <strong style={{ color: "#ff7777" }}>℞ Retrograde Active</strong>
        </div>
      )}

      {meta.aspect && (
        <div style={{
          background: "#0e0e0e",
          padding: "10px",
          borderRadius: 6,
          border: "1px solid #222",
          marginBottom: 12
        }}>
          <strong>{ASPECT_GLYPHS[meta.aspect]} {meta.aspect}</strong>
        </div>
      )}

      {meta.ingress && (
        <div style={{
          background: "#0e1f0e",
          padding: "10px",
          borderRadius: 6,
          border: "1px solid #335533",
          marginBottom: 12
        }}>
          <strong style={{ color: "#44dd88" }}>Sign Ingress</strong>
          <div>Enters {meta.ingress.sign} on {meta.ingress.date}</div>
        </div>
      )}
    </div>
  );
}

