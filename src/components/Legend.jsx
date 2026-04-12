import { memo } from 'react';
import { ASPECT_COLOR_VARS } from '../utils/astroConstants';

export default memo(function Legend() {
  return (
    <div
      className="mt-6 p-4 rounded-lg text-xs font-mono"
      style={{ border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}
    >
      <div
        className="font-bold mb-2 text-[11px] uppercase tracking-widest"
        style={{ opacity: 0.5 }}
      >
        Legend
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <div>
          <span style={{ color: ASPECT_COLOR_VARS.Conjunction }}>☌</span> Conjunction (0°)
        </div>
        <div>
          <span style={{ color: ASPECT_COLOR_VARS.Sextile }}>⚹</span> Sextile (60°)
        </div>
        <div>
          <span style={{ color: ASPECT_COLOR_VARS.Square }}>□</span> Square (90°)
        </div>
        <div>
          <span style={{ color: ASPECT_COLOR_VARS.Trine }}>△</span> Trine (120°)
        </div>
        <div>
          <span style={{ color: ASPECT_COLOR_VARS.Opposition }}>☍</span> Opposition (180°)
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
    </div>
  );
})
