export const PLANET_SYMBOLS = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
  Chiron: '⚷',
  'True Node': '☊',
  'South Node': '☋',
  'Mean Lilith': '⚸',
};

export const ASPECT_COLORS = {
  Conjunction: '#e8c547',
  Sextile: '#4ecdc4',
  Square: '#ff6b6b',
  Trine: '#6bcb77',
  Opposition: '#ee6c4d',
};

// CSS variable versions for use in inline styles — these respect DesignCustomizer overrides
export const ASPECT_COLOR_VARS = {
  Conjunction: 'var(--color-conjunction, #e8c547)',
  Sextile: 'var(--color-sextile, #4ecdc4)',
  Square: 'var(--color-square, #ff6b6b)',
  Trine: 'var(--color-trine, #6bcb77)',
  Opposition: 'var(--color-opposition, #ee6c4d)',
};

export const ASPECT_ANGLES = {
  Conjunction: 0,
  Sextile: 60,
  Square: 90,
  Trine: 120,
  Opposition: 180,
};

export const ASPECT_SYMBOLS = {
  Conjunction: '☌',
  Sextile: '⚹',
  Square: '□',
  Trine: '△',
  Opposition: '☍',
};

export const TYPE_COLORS = {
  Aspect: '#a78bfa',
  Ingress: '#f59e0b',
  'Moon Ingress': '#94a3b8',
  'Transit-to-Natal': '#c084fc',
};

export const SIGNS = [
  { name: 'Aries', glyph: '♈' },
  { name: 'Taurus', glyph: '♉' },
  { name: 'Gemini', glyph: '♊' },
  { name: 'Cancer', glyph: '♋' },
  { name: 'Leo', glyph: '♌' },
  { name: 'Virgo', glyph: '♍' },
  { name: 'Libra', glyph: '♎' },
  { name: 'Scorpio', glyph: '♏' },
  { name: 'Sagittarius', glyph: '♐' },
  { name: 'Capricorn', glyph: '♑' },
  { name: 'Aquarius', glyph: '♒' },
  { name: 'Pisces', glyph: '♓' },
];

export const MONTHS = ['Mar', 'Apr', 'May', 'Jun'];
