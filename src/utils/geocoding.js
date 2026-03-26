/**
 * Lightweight city search using a static database.
 * No external API needed — works fully offline.
 */
import CITIES from '../data/cities.js';

/**
 * Search cities by name (fuzzy, case-insensitive).
 * Returns top N matches sorted by relevance.
 */
export function searchCities(query, limit = 6) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().trim();

  const scored = CITIES
    .map(city => {
      const name = city.name.toLowerCase();
      const full = `${name}, ${city.country.toLowerCase()}`;
      let score = 0;

      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 80;
      else if (full.startsWith(q)) score = 75;
      else if (name.includes(q)) score = 60;
      else if (full.includes(q)) score = 50;
      else return null;

      return { ...city, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

/**
 * Get UTC offset in hours for a timezone at a given date.
 * Uses the browser's Intl API — works without any library.
 */
export function getUtcOffset(tz, date = new Date()) {
  const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
  const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
  return (tzDate - utcDate) / (60 * 60 * 1000);
}
