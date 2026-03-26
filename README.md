<div align="center">

# Astrological Weathervane

**Planetary transit tracker with natal chart overlay and client-side ephemeris computation.**

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?logo=gnu)](LICENSE)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/0xjitsu/astrological_weathervane)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Vite 6](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](https://astrological-weathervane.vercel.app/) · [Quick Start](#quick-start) · [Features](#features) · [Deploy](#deploy)

</div>

---

## Why This Exists

Most astrology apps require accounts, subscriptions, or server-side computation to show planetary transits against a natal chart. This app runs entirely in the browser — no backend, no API keys, no tracking. Enter your birth data and see transit aspects instantly, verified against Swiss Ephemeris precision.

---

## Quick Start

```bash
git clone https://github.com/0xjitsu/astrological_weathervane.git
cd astrological_weathervane
npm install
npm run dev
```

Open `http://localhost:5173` — that's it.

---

## Features

| Feature | Description |
|---------|-------------|
| **Sky Transits** | Daily planetary positions for Mar–Jun 2026 with aspect detection (conjunction, opposition, trine, square, sextile) |
| **Birth Chart Calculator** | Enter birth date + time + city — positions computed client-side via VSOP87 ephemeris (<1 arcminute accuracy) |
| **Transit-to-Natal Overlay** | See which transits aspect your natal planets, with orb-aware filtering |
| **Astro-Seek Verification** | Deep links to Astro-Seek with your exact birth data pre-filled for cross-validation |
| **130+ City Database** | Built-in coordinates and IANA timezones — no geocoding API needed |
| **Dark/Light Theme** | Glass morphism UI with customizable accent colors, fonts, and border radius |
| **Scroll Progress** | Fixed gradient bar for long-form navigation |
| **Academic References** | Cited sources with DOI/institutional links (Swiss Ephemeris, JPL DE441, Meeus) |

---

## How It Works

```
Birth Data (date + time + city)
        │
        ▼
┌─────────────────────────┐
│   City Database (130+)  │──▶ lat/lon + IANA timezone
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Ephemeris Engine      │──▶ VSOP87B heliocentric → geocentric conversion
│   (astronomia v4.2)     │   Light-time · Aberration · FK5 · Nutation
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Natal Chart (12 pts)  │──▶ Sun, Moon, Mercury–Pluto, True Node, Mean Lilith
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│   Aspect Calculator     │──▶ Transit planets × Natal planets
│   (orb-aware matching)  │   Conjunction · Opposition · Trine · Square · Sextile
└─────────────────────────┘
```

All computation runs in the browser — zero network requests after initial page load.

---

## Project Structure

```
src/
├── components/
│   ├── BirthDataInput.jsx      # Birth data form with city autocomplete
│   ├── NatalChartInput.jsx     # Tabbed input (Quick Entry / Manual / Upload)
│   ├── NatalOverlay.jsx        # Transit-to-natal aspect display
│   ├── PlanetaryPositions.jsx  # Daily position cards
│   ├── TransitTable.jsx        # Filterable transit event table
│   ├── Filters.jsx             # Search + dropdown filters
│   ├── DesignCustomizer.jsx    # Theme/accent/font controls
│   ├── References.jsx          # Academic citations section
│   ├── ScrollProgress.jsx      # Gradient scroll indicator
│   ├── Legend.jsx              # Aspect color legend
│   └── ThemeToggle.jsx         # Dark/light switch
├── data/
│   ├── cities.js               # 130+ cities (lat/lon/timezone)
│   ├── dailyPositions.json     # Pre-computed Swiss Ephemeris positions
│   ├── transitData.json        # Transit events Mar–Jun 2026
│   ├── references.js           # Cited sources with URLs/DOIs
│   └── sampleNatal.json        # Example natal chart
├── hooks/
│   └── useTransitNatalAspects.js
├── utils/
│   ├── ephemeris.js            # Client-side VSOP87 computation engine
│   ├── geocoding.js            # City search + UTC offset derivation
│   ├── aspectCalculator.js     # Aspect detection with configurable orbs
│   ├── astroConstants.js       # Zodiac signs, planet glyphs, colors
│   └── formatters.js           # Degree/sign formatting helpers
├── App.jsx
├── App.css
└── main.jsx
```

---

<details>
<summary><strong>Developer Setup</strong></summary>

### Prerequisites

- Node.js 18+ (or Bun)
- npm / bun

### Install & Run

```bash
npm install    # or: bun install
npm run dev    # Vite dev server on :5173
npm run build  # Production build → dist/
npm run preview # Preview production build
```

### Bundle Notes

The `astronomia` library adds ~1.76 MB to the bundle (664 KB gzipped) due to VSOP87B planetary data tables. A future optimization could code-split this behind the birth chart tab.

</details>

---

## Deploy

One-click deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xjitsu/astrological_weathervane)

Or manually:

```bash
npx vercel --prod
```

No environment variables required — the app is fully static.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | ![React](https://img.shields.io/badge/React_19-61dafb?logo=react&logoColor=black&style=flat-square) |
| Build | ![Vite](https://img.shields.io/badge/Vite_6-646cff?logo=vite&logoColor=white&style=flat-square) |
| Styling | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06b6d4?logo=tailwindcss&logoColor=white&style=flat-square) |
| Ephemeris | ![astronomia](https://img.shields.io/badge/astronomia-VSOP87B-orange?style=flat-square) |
| Hosting | ![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white&style=flat-square) |

---

## License

<div align="center">

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?logo=gnu&style=for-the-badge)](LICENSE)

</div>

This project is dual-licensed:

- **AGPL v3** — free for open-source and personal use ([full text](LICENSE))
- **Commercial License** — available for proprietary/commercial use

For commercial licensing, contact via [GitHub](https://github.com/0xjitsu).

---

<div align="center">

**Track the sky. Know yourself.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xjitsu/astrological_weathervane)

[Get Started](#quick-start) · [Report a Bug](https://github.com/0xjitsu/astrological_weathervane/issues) · [Request a Feature](https://github.com/0xjitsu/astrological_weathervane/issues)

</div>
