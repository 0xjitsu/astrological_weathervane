import { SIGNS } from './astroConstants';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(dateStr) {
  const dt = new Date(dateStr + 'T00:00:00');
  return `${DAYS[dt.getDay()]}, ${MONTH_NAMES[dt.getMonth()]} ${dt.getDate()}`;
}

export function getSignFromLongitude(longitude) {
  const idx = Math.floor(longitude / 30) % 12;
  return SIGNS[idx];
}

export function formatPosition(longitude) {
  const sign = getSignFromLongitude(longitude);
  const degInSign = longitude % 30;
  const deg = Math.floor(degInSign);
  const min = Math.round((degInSign - deg) * 60);
  return `${deg}°${sign.glyph}${String(min).padStart(2, '0')}'`;
}

export function getOrbColor(orb) {
  const val = typeof orb === 'string' ? parseFloat(orb) : orb;
  if (val < 0.3) return '#6bcb77';
  if (val < 0.7) return '#e8c547';
  return '#ff9f43';
}

export function parseOrb(orb) {
  if (!orb) return null;
  return typeof orb === 'string' ? parseFloat(orb) : orb;
}
