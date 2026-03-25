import { ASPECT_COLORS } from '../utils/astroConstants';

export default function Legend() {
  return (
    <div className="mt-6 p-4 border border-zinc-700 rounded-lg text-xs font-mono">
      <div className="font-bold mb-2 text-[11px] uppercase tracking-widest opacity-50">
        Legend
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <div>
          <span style={{ color: ASPECT_COLORS.Conjunction }}>☌</span> Conjunction (0°)
        </div>
        <div>
          <span style={{ color: ASPECT_COLORS.Sextile }}>⚹</span> Sextile (60°)
        </div>
        <div>
          <span style={{ color: ASPECT_COLORS.Square }}>□</span> Square (90°)
        </div>
        <div>
          <span style={{ color: ASPECT_COLORS.Trine }}>△</span> Trine (120°)
        </div>
        <div>
          <span style={{ color: ASPECT_COLORS.Opposition }}>☍</span> Opposition (180°)
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <div>
          Orb: <span className="text-[#6bcb77]">●</span> {'<0.3°'}{' '}
          <span className="text-[#e8c547]">●</span> {'<0.7°'}{' '}
          <span className="text-[#ff9f43]">●</span> {'<1.0°'}
        </div>
        <div>℞ = Retrograde</div>
      </div>
      <div className="mt-2 opacity-50">
        Data: Swiss Ephemeris (pyswisseph) · 1° orb · PHT (UTC+8)
      </div>
    </div>
  );
}
