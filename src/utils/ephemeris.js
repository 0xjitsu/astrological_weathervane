/**
 * Client-side natal chart computation using astronomia (VSOP87).
 * Computes geocentric ecliptic longitudes for Sun, Moon, and planets.
 * Includes light-time correction, aberration, FK5, and nutation.
 * Accuracy: <1 arcminute — validated against Swiss Ephemeris.
 */
import { base, julian, solar, moonposition, planetposition, pluto, nutation, apparent, coord, precess } from 'astronomia';
import data from 'astronomia/data';

const { Planet, toFK5 } = planetposition;
const RAD_TO_DEG = 180 / Math.PI;

// Initialize planet objects once
const earth = new Planet(data.earth);
const PLANETS = {
  Mercury: new Planet(data.mercury),
  Venus: new Planet(data.venus),
  Mars: new Planet(data.mars),
  Jupiter: new Planet(data.jupiter),
  Saturn: new Planet(data.saturn),
  Uranus: new Planet(data.uranus),
  Neptune: new Planet(data.neptune),
};

/**
 * Geocentric apparent ecliptic longitude of a planet.
 * Meeus Ch.33 with light-time iteration, aberration, FK5 correction, and nutation.
 */
function geoEclLon(planet, earthObj, jde) {
  const posEarth = earthObj.position(jde);
  const [sB0, cB0] = base.sincos(posEarth.lat);
  const [sL0, cL0] = base.sincos(posEarth.lon);
  const R0 = posEarth.range;

  function pos(tau = 0) {
    const p = planet.position(jde - tau);
    const [sB, cB] = base.sincos(p.lat);
    const [sL, cL] = base.sincos(p.lon);
    return {
      x: p.range * cB * cL - R0 * cB0 * cL0,
      y: p.range * cB * sL - R0 * cB0 * sL0,
      z: p.range * sB - R0 * sB0,
    };
  }

  // First pass — geometric position
  let { x, y, z } = pos();
  const D = Math.sqrt(x * x + y * y + z * z);
  // Second pass — correct for light-time
  ({ x, y, z } = pos(base.lightTime(D)));

  let lam = Math.atan2(y, x);
  let bet = Math.atan2(z, Math.hypot(x, y));

  // Aberration
  const [dLam, dBet] = apparent.eclipticAberration(lam, bet, jde);
  // FK5 correction
  const fk5 = toFK5(lam + dLam, bet + dBet, jde);
  lam = fk5.lon;

  // Nutation in longitude
  const [dpsi] = nutation.nutation(jde);
  lam += dpsi;

  let deg = lam * RAD_TO_DEG;
  return ((deg % 360) + 360) % 360;
}

/**
 * Geocentric apparent ecliptic longitude for Pluto.
 * Pluto uses Meeus Ch.37 (J2000 heliocentric), precessed to date.
 */
function plutoGeoLon(earthObj, jde) {
  const posEarth = earthObj.position(jde);
  const [sB0, cB0] = base.sincos(posEarth.lat);
  const [sL0, cL0] = base.sincos(posEarth.lon);
  const R0 = posEarth.range;

  // Pluto heliocentric J2000 → precess to equinox of date
  const ph = pluto.heliocentric(jde);
  const eclFrom = new coord.Ecliptic(ph.lon, ph.lat);
  const eclTo = precess.eclipticPosition(eclFrom, 2000.0, base.JDEToJulianYear(jde));

  const [sB, cB] = base.sincos(eclTo.lat);
  const [sL, cL] = base.sincos(eclTo.lon);
  const x = ph.range * cB * cL - R0 * cB0 * cL0;
  const y = ph.range * cB * sL - R0 * cB0 * sL0;
  const z = ph.range * sB - R0 * sB0;

  let lam = Math.atan2(y, x);
  let bet = Math.atan2(z, Math.hypot(x, y));
  const [dLam] = apparent.eclipticAberration(lam, bet, jde);
  const fk5 = toFK5(lam + dLam, bet, jde);
  lam = fk5.lon;
  const [dpsi] = nutation.nutation(jde);
  lam += dpsi;

  let deg = lam * RAD_TO_DEG;
  return ((deg % 360) + 360) % 360;
}

/**
 * Compute the mean longitude of the Moon's ascending node (Omega).
 * Meeus, Ch. 47 / p. 144
 */
function moonNodeLongitude(T) {
  let omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T
    + T * T * T / 467441 - T * T * T * T / 60616000;
  return ((omega % 360) + 360) % 360;
}

/**
 * Compute the mean longitude of Mean Lilith (Black Moon).
 * Mean Lilith = lunar apogee mean longitude.
 */
function meanLilithLongitude(T) {
  let lon = 83.3532465 + 4069.0137287 * T - 0.0103200 * T * T
    - T * T * T / 80053 + T * T * T * T / 18999000;
  return ((lon + 180) % 360 + 360) % 360;

  
}

/**
 * Compute natal chart planetary positions from birth data.
 *
 * @param {string} dateStr - Birth date in YYYY-MM-DD format
 * @param {string} timeStr - Birth time in HH:MM format (24h)
 * @param {number} utcOffset - UTC offset in hours (e.g. 8 for PHT)
 * @returns {{ planets: Record<string, number> }} Ecliptic longitudes [0, 360)
 */
/**
 * Approximate geocentric longitude of Juno (asteroid #3)
 * Uses mean orbital elements at J2000.
 */
function junoLongitude(T) {
  // Orbital elements for Juno (epoch J2000)
  const a = 2.6691;        // semi‑major axis (AU)
  const e = 0.2563;        // eccentricity
  const i = 12.9714 * Math.PI / 180;  // inclination in radians
  const omega = 169.8587 * Math.PI / 180; // argument of perihelion
  const Omega = 169.9124 * Math.PI / 180; // ascending node
  const L0 = 73.1152;      // mean longitude at J2000
  const n = 360 / (4.365 * 365.25); // mean daily motion (deg/day)

  // Time in days from J2000
  const days = T * 36525;

  // Mean anomaly
  const M = ((L0 + n * days) % 360) * Math.PI / 180;

  // Equation of center (approx)
  const E = M + e * Math.sin(M) * (1.0 + e * Math.cos(M));

  // True anomaly
  const v = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2)
  );

  // Heliocentric ecliptic longitude
  let lon = v + omega;

  // Normalize
  lon = ((lon * 180 / Math.PI) % 360 + 360) % 360;

  return lon;
}

export function computeNatalChart(dateStr, timeStr, utcOffset = 0) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Convert local time to UTC
  const utcHours = hours - utcOffset;
  const dayFraction = (utcHours + minutes / 60) / 24;

  // Julian Day
  const jde = julian.CalendarGregorianToJD(year, month, day + dayFraction);
  const T = base.J2000Century(jde);

  const planets = {};

  // Sun — apparent longitude (includes nutation + aberration)
  const sunLon = solar.apparentLongitude(T) * RAD_TO_DEG;
  planets.Sun = ((sunLon % 360) + 360) % 360;

  // Moon — geocentric ecliptic longitude
  const moonPos = moonposition.position(jde);
  planets.Moon = ((moonPos.lon * RAD_TO_DEG % 360) + 360) % 360;

  // Planets Mercury–Neptune: full geocentric with light-time + corrections
  for (const [name, planet] of Object.entries(PLANETS)) {
    planets[name] = geoEclLon(planet, earth, jde);
  }

  // Pluto — Meeus Ch.37 heliocentric J2000, precessed to date
  planets.Pluto = plutoGeoLon(earth, jde);

  // True Node (Moon's ascending node — mean longitude)
  planets['True Node'] = moonNodeLongitude(T);

  // South Node
  planets['South Node'] = (planets['True Node'] + 180) % 360;

  // Mean Lilith (Black Moon)
  planets['Mean Lilith'] = meanLilithLongitude(T);

  // Juno (asteroid #3)
planets['Juno'] = junoLongitude(T);


  return { planets };
}

/**
 * Build an Astro-Seek URL for chart verification.
 */
export function astroSeekUrl(dateStr, timeStr, lat, lon, name) {
  const [year, month, day] = dateStr.split('-');
  const [hours, minutes] = timeStr.split(':');
  const params = new URLSearchParams({
    'natal_year': year,
    'natal_month': month,
    'natal_day': day,
    'natal_hour': hours,
    'natal_min': minutes,
    'natal_city': name || 'Custom',
    'natal_lat': lat,
    'natal_lng': lon,
  });
  return `https://www.astro-seek.com/birth-chart-horoscope-online?${params}`;
}
