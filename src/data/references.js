export const REFERENCES = [
  {
    id: 1,
    title: 'Swiss Ephemeris',
    author: 'Astrodienst AG',
    url: 'https://www.astro.com/swisseph/',
    description:
      'High-precision astronomical calculation engine based on JPL DE441 ephemeris. Provides planetary positions accurate to sub-arcsecond precision for millennia. The gold standard for astrological software.',
  },
  {
    id: 2,
    title: 'pyswisseph',
    author: 'Stanislas Marquis',
    url: 'https://github.com/astrorigin/pyswisseph',
    description:
      'Python bindings for the Swiss Ephemeris C library. Used to pre-compute all planetary longitudes and daily positions for this application.',
  },
  {
    id: 3,
    title: 'JPL DE441 Ephemeris',
    author: 'NASA Jet Propulsion Laboratory',
    url: 'https://ssd.jpl.nasa.gov/planets/eph_export.html',
    description:
      'The Development Ephemeris DE441 from JPL provides high-accuracy planetary and lunar positions. Swiss Ephemeris uses DE441 as its primary data source.',
  },
  {
    id: 4,
    title: 'Astro-Seek Transit Calculator',
    author: 'Astro-Seek.com',
    url: 'https://www.astro-seek.com/transit-chart-planetary-transits-online-calculator',
    description:
      'Online transit calculator used for cross-validation of computed aspect dates and orbs. One of the most comprehensive free astrology tools available.',
  },
  {
    id: 5,
    title: 'Cafe Astrology — Planetary Transits',
    author: 'Cafe Astrology',
    url: 'https://cafeastrology.com/transits/',
    description:
      'Reference for transit interpretation and aspect significance. Provides accessible descriptions of planetary transit meanings.',
  },
  {
    id: 6,
    title: 'Ptolemaic Aspects',
    author: 'Claudius Ptolemy, Tetrabiblos (2nd century CE)',
    url: 'https://en.wikipedia.org/wiki/Astrological_aspect',
    description:
      'The five major aspects used in this application (Conjunction, Sextile, Square, Trine, Opposition) originate from Ptolemy\'s Tetrabiblos, the foundational text of Western astrology.',
  },
  {
    id: 7,
    title: 'Chiron Discovery & Ephemeris',
    author: 'Charles T. Kowal (1977)',
    url: 'https://en.wikipedia.org/wiki/2060_Chiron',
    description:
      'Chiron, discovered in 1977, is included as a key body in modern astrological practice. Its orbit bridges Saturn and Uranus, symbolizing the "wounded healer" archetype.',
  },
  {
    id: 8,
    title: 'True Node vs Mean Node',
    author: 'Various astrological traditions',
    url: 'https://www.astro.com/astrowiki/en/Lunar_Node',
    description:
      'This application uses the True (osculating) Lunar Node rather than the Mean Node, providing more astronomically accurate nodal positions.',
  },
  {
    id: 9,
    title: 'Astronomia (VSOP87)',
    author: 'commenthol',
    url: 'https://github.com/commenthol/astronomia',
    description:
      'Pure JavaScript astronomical library implementing VSOP87 planetary theory and Meeus algorithms. Powers the client-side natal chart computation with sub-arcminute accuracy for all major planets.',
  },
  {
    id: 10,
    title: 'Astro-Seek Birth Chart Calculator',
    author: 'Astro-Seek.com',
    url: 'https://www.astro-seek.com/birth-chart-horoscope-online',
    description:
      'Online natal chart calculator used for cross-verification of computed birth chart positions. Deep-linked from the Quick Entry tab for independent validation.',
  },
  {
    id: 11,
    title: 'Astronomical Algorithms',
    author: 'Jean Meeus (1991)',
    url: 'https://en.wikipedia.org/wiki/Astronomical_Algorithms',
    description:
      'Foundational reference for planetary position computation. Algorithms for lunar nodes (Ch. 47), Pluto (Ch. 37), and geocentric coordinate conversion (Ch. 33) are used in the client-side ephemeris engine.',
  },
];

export const METHODOLOGY = {
  ephemeris: {
    title: 'Ephemeris Engine',
    icon: '⚙',
    content:
      'Daily transit positions are pre-computed using the Swiss Ephemeris (DE441) via pyswisseph for 00:00 UTC+8 each day. Natal chart positions are computed client-side using the astronomia library (VSOP87 theory + Meeus algorithms) with light-time correction, aberration, FK5, and nutation — achieving sub-arcminute accuracy validated against Swiss Ephemeris.',
  },
  aspects: {
    title: 'Aspect Calculation',
    icon: '☌',
    content:
      'Five major Ptolemaic aspects are tracked: Conjunction (0°), Sextile (60°), Square (90°), Trine (120°), and Opposition (180°). For sky-to-sky transits, aspects are pre-computed. For transit-to-natal overlays, aspects are calculated client-side by comparing daily transit positions against natal chart longitudes.',
  },
  orbs: {
    title: 'Orb Tolerance',
    icon: '◎',
    content:
      'A default orb of 1.0° is used for all aspects. Orbs are color-coded: green (<0.3°) indicates exact aspects, yellow (<0.7°) indicates close aspects, and orange (<1.0°) indicates wider aspects. Tighter orbs indicate stronger aspect influence.',
  },
  dedup: {
    title: 'Date Range Grouping',
    icon: '⟷',
    content:
      'When a transit aspect is active across consecutive days, the events are grouped into a single entry showing the date range. The displayed date and orb correspond to the day of tightest (most exact) orb within the range.',
  },
  timezone: {
    title: 'Timezone',
    icon: '🕐',
    content:
      'All calculations use PHT (Philippine Time, UTC+8). Exact aspect times shown for sky transits are computed to the nearest hour in this timezone.',
  },
  bodies: {
    title: 'Celestial Bodies',
    icon: '☉',
    content:
      '14 bodies are tracked: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, Chiron, True Node, South Node, and Mean Lilith (Black Moon). Retrograde status is indicated where applicable.',
  },
};

export const TECH_STACK = [
  { name: 'React', url: 'https://react.dev' },
  { name: 'Vite', url: 'https://vite.dev' },
  { name: 'Tailwind CSS', url: 'https://tailwindcss.com' },
  { name: 'Swiss Ephemeris', url: 'https://www.astro.com/swisseph/' },
  { name: 'Astronomia', url: 'https://github.com/commenthol/astronomia' },
  { name: 'Vercel', url: 'https://vercel.com' },
];
