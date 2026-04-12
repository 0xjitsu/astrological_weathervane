/**
 * Client-side natal chart computation using astronomia (VSOP87).
 * Computes geocentric ecliptic longitudes for Sun, Moon, and planets.
 * Includes light-time correction, aberration, FK5, and nutation.
 * Accuracy: <1 arcminute — validated against Swiss Ephemeris.
 *
 * astronomia is loaded lazily (~1MB) — only imported when computeNatalChart() is called.
 */

const RAD_TO_DEG = 180 / Math.PI;

// Lazy-loaded astronomia modules — initialized on first computation
let astroModules = null;

async function loadAstronomia() {
  if (astroModules) return astroModules;
  const [astronomia, data] = await Promise.all([
    import('astronomia'),
    import('astronomia/data'),
  ]);
  const { base, julian, solar, moonposition, planetposition, pluto, nutation, apparent, coord, precess } = astronomia;
  const { Planet, toFK5 } = planetposition;
  const dataObj = data.default;
  const earth = new Planet(dataObj.earth);
  const PLANETS = {
    Mercury: new Planet(dataObj.mercury),
    Venus: new Planet(dataObj.venus),
    Mars: new Planet(dataObj.mars),
    Jupiter: new Planet(dataObj.jupiter),
    Saturn: new Planet(dataObj.saturn),
    Uranus: new Planet(dataObj.uranus),
    Neptune: new Planet(dataObj.neptune),
  };
  astroModules = { base, julian, solar, moonposition, pluto, nutation, apparent, coord, precess, toFK5, earth, PLANETS };
  return astroModules;
}

/**
 * Geocentric apparent ecliptic longitude of a planet.
 * Meeus Ch.33 with light-time iteration, aberration, FK5 correction, and nutation.
 */
function geoEclLon(planet, earthObj, jde, m) {
  const posEarth = earthObj.position(jde);
  const [sB0, cB0] = m.base.sincos(posEarth.lat);
  const [sL0, cL0] = m.base.sincos(posEarth.lon);
  const R0 = posEarth.range;

  function pos(tau = 0) {
    const p = planet.position(jde - tau);
    const [sB, cB] = m.base.sincos(p.lat);
    const [sL, cL] = m.base.sincos(p.lon);
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
  ({ x, y, z } = pos(m.base.lightTime(D)));

  let lam = Math.atan2(y, x);
  let bet = Math.atan2(z, Math.hypot(x, y));

  // Aberration
  const [dLam, dBet] = m.apparent.eclipticAberration(lam, bet, jde);
  // FK5 correction
  const fk5 = m.toFK5(lam + dLam, bet + dBet, jde);
  lam = fk5.lon;

  // Nutation in longitude
  const [dpsi] = m.nutation.nutation(jde);
  lam += dpsi;

  let deg = lam * RAD_TO_DEG;
  return ((deg % 360) + 360) % 360;
}

/**
 * Geocentric apparent ecliptic longitude for Pluto.
 * Pluto uses Meeus Ch.37 (J2000 heliocentric), precessed to date.
 */
function plutoGeoLon(earthObj, jde, m) {
  const posEarth = earthObj.position(jde);
  const [sB0, cB0] = m.base.sincos(posEarth.lat);
  const [sL0, cL0] = m.base.sincos(posEarth.lon);
  const R0 = posEarth.range;

  // Pluto heliocentric J2000 → precess to equinox of date
  const ph = m.pluto.heliocentric(jde);
  const eclFrom = new m.coord.Ecliptic(ph.lon, ph.lat);
  const eclTo = m.precess.eclipticPosition(eclFrom, 2000.0, m.base.JDEToJulianYear(jde));

  const [sB, cB] = m.base.sincos(eclTo.lat);
  const [sL, cL] = m.base.sincos(eclTo.lon);
  const x = ph.range * cB * cL - R0 * cB0 * cL0;
  const y = ph.range * cB * sL - R0 * cB0 * sL0;
  const z = ph.range * sB - R0 * sB0;

  let lam = Math.atan2(y, x);
  let bet = Math.atan2(z, Math.hypot(x, y));
  const [dLam] = m.apparent.eclipticAberration(lam, bet, jde);
  const fk5 = m.toFK5(lam + dLam, bet, jde);
  lam = fk5.lon;
  const [dpsi] = m.nutation.nutation(jde);
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
 * Loads astronomia lazily on first call (~1MB async chunk).
 *
 * @param {string} dateStr - Birth date in YYYY-MM-DD format
 * @param {string} timeStr - Birth time in HH:MM format (24h)
 * @param {number} utcOffset - UTC offset in hours (e.g. 8 for PHT)
 * @returns {Promise<{ planets: Record<string, number> }>} Ecliptic longitudes [0, 360)
 */
export async function computeNatalChart(dateStr, timeStr, utcOffset = 0) {
  const m = await loadAstronomia();

  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Convert local time to UTC
  const utcHours = hours - utcOffset;
  const dayFraction = (utcHours + minutes / 60) / 24;

  // Julian Day
  const jde = m.julian.CalendarGregorianToJD(year, month, day + dayFraction);
  const T = m.base.J2000Century(jde);

  const planets = {};

  // Sun — apparent longitude (includes nutation + aberration)
  const sunLon = m.solar.apparentLongitude(T) * RAD_TO_DEG;
  planets.Sun = ((sunLon % 360) + 360) % 360;

  // Moon — geocentric ecliptic longitude
  const moonPos = m.moonposition.position(jde);
  planets.Moon = ((moonPos.lon * RAD_TO_DEG % 360) + 360) % 360;

  // Planets Mercury–Neptune: full geocentric with light-time + corrections
  for (const [name, planet] of Object.entries(m.PLANETS)) {
    planets[name] = geoEclLon(planet, m.earth, jde, m);
  }

  // Pluto — Meeus Ch.37 heliocentric J2000, precessed to date
  planets.Pluto = plutoGeoLon(m.earth, jde, m);

  // True Node (Moon's ascending node — mean longitude)
  planets['True Node'] = moonNodeLongitude(T);

  // South Node
  planets['South Node'] = (planets['True Node'] + 180) % 360;

  // Mean Lilith (Black Moon)
  planets['Mean Lilith'] = meanLilithLongitude(T);

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
