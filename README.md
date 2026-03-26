<div align="center">

# Astrological Weathervane

**See where the planets are today — and how they relate to the sky when you were born.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-8b5cf6?style=for-the-badge&logo=google-chrome&logoColor=white)](https://astrological-weathervane.vercel.app/)

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?logo=gnu)](LICENSE)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/0xjitsu/astrological_weathervane)
[![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Vite 6](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![No Backend](https://img.shields.io/badge/Backend-None_Required-22c55e?style=flat-square)](https://astrological-weathervane.vercel.app/)
[![Privacy](https://img.shields.io/badge/Tracking-Zero-22c55e?style=flat-square&logo=shieldsdotio&logoColor=white)](https://astrological-weathervane.vercel.app/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Live Demo](https://astrological-weathervane.vercel.app/) · [Quick Start](#quick-start) · [Features](#features) · [Deploy Your Own](#deploy)

</div>

---

## What Is This?

In astrology, **transits** are the current positions of planets in the sky. When a transiting planet forms a geometric angle (called an **aspect**) to a planet's position in your birth chart, astrologers consider that significant.

This app lets you:

1. **Browse daily planetary positions** for March–June 2026
2. **Enter your birth details** (date, time, city) to generate your birth chart
3. **See which transits are hitting your chart** right now — with exact degrees and aspect types

Everything runs in your browser. No account needed, no data sent anywhere.

---

## Why This Exists

Most astrology tools require subscriptions, accounts, or server-side computation. This one doesn't. It's a **free, private, open-source** alternative that:

- Computes your birth chart **in-browser** using NASA-grade planetary math
- Requires **zero accounts, zero API keys, zero tracking**
- Lets you **verify every position** against established astrology sites
- Works **offline** after the first page load

---

## Quick Start

Just visit the live app — no installation needed:

> **https://astrological-weathervane.vercel.app/**

Or run it locally:

```bash
git clone https://github.com/0xjitsu/astrological_weathervane.git
cd astrological_weathervane
npm install
npm run dev
```

---

## Features

| Feature | What It Does | Who It's For |
|---------|-------------|--------------|
| ![Sky](https://img.shields.io/badge/Sky_Transits-8b5cf6?style=flat-square) | Shows where every planet is right now, day by day | Anyone curious about planetary positions |
| ![Birth](https://img.shields.io/badge/Birth_Chart-f59e0b?style=flat-square) | Enter your birthday + time + city to compute your chart | Anyone who knows their birth time |
| ![Aspects](https://img.shields.io/badge/Transit_Aspects-ef4444?style=flat-square) | Shows when today's planets form angles to your natal planets | Astrology students and practitioners |
| ![Verify](https://img.shields.io/badge/Verify-22c55e?style=flat-square) | One-click link to Astro-Seek with your data pre-filled | Anyone who wants to double-check |
| ![Cities](https://img.shields.io/badge/130+_Cities-3b82f6?style=flat-square) | Built-in city database — no address lookup needed | Everyone (Manila, NYC, London, Tokyo, etc.) |
| ![Theme](https://img.shields.io/badge/Customizable-a855f7?style=flat-square) | Dark/light mode, accent colors, fonts, border radius | Design-conscious users |
| ![Privacy](https://img.shields.io/badge/Privacy_First-22c55e?style=flat-square) | No backend, no cookies, no analytics — all local | Privacy-conscious users |
| ![References](https://img.shields.io/badge/Cited_Sources-6b7280?style=flat-square) | Links to Swiss Ephemeris, JPL, and Meeus textbook | Researchers and skeptics |

---

## How Accurate Is It?

| Method | Source | Accuracy |
|--------|--------|----------|
| Daily transit positions | Pre-computed from **Swiss Ephemeris** (JPL DE441) | Sub-arcsecond |
| Birth chart computation | Computed live via **VSOP87B** (astronomia library) | < 1 arcminute (~0.016°) |

For context, a 1 arcminute error is like being off by the width of a coin viewed from 70 meters away. Both methods are the same ones used by professional astrology software.

---

## How It Works

```
You enter: birthday + birth time + city
                    │
                    ▼
        ┌───────────────────────┐
        │   City Database       │ → finds coordinates + timezone
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Ephemeris Engine    │ → calculates where each planet
        │   (runs in browser)   │   was at the moment you were born
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Your Birth Chart    │ → Sun, Moon, and 10 other points
        └───────────┬───────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   Aspect Finder       │ → compares today's planets
        │                       │   to your birth chart positions
        └───────────────────────┘
                    │
                    ▼
            Transit aspects shown
            (conjunction, trine, square, etc.)
```

All of this happens in your browser. Nothing is sent to a server.

---

## Jargon Buster

New to astrology? Here's a quick glossary of terms used in the app:

| Term | Plain English |
|------|--------------|
| **Transit** | Where a planet is right now |
| **Natal** | Where a planet was when you were born |
| **Aspect** | A specific angle between two planets (e.g., 0°, 90°, 120°, 180°) |
| **Conjunction** (0°) | Two planets in the same spot — intensifies their combined energy |
| **Opposition** (180°) | Two planets directly across from each other — tension/awareness |
| **Trine** (120°) | Easy flow between two planets — harmony |
| **Square** (90°) | Friction between two planets — challenge/growth |
| **Sextile** (60°) | Gentle opportunity between two planets |
| **Orb** | How many degrees of "wiggle room" an aspect allows |
| **Ephemeris** | A table of planetary positions over time |

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
│   ├── cities.js               # 130+ cities with coordinates and timezones
│   ├── dailyPositions.json     # Pre-computed planetary positions (Swiss Ephemeris)
│   ├── transitData.json        # Transit events Mar–Jun 2026
│   ├── references.js           # Academic sources with URLs
│   └── sampleNatal.json        # Example natal chart for demo
├── hooks/
│   └── useTransitNatalAspects.js
├── utils/
│   ├── ephemeris.js            # VSOP87 computation engine (runs in browser)
│   ├── geocoding.js            # City search + timezone offset
│   ├── aspectCalculator.js     # Aspect detection with configurable orbs
│   ├── astroConstants.js       # Zodiac signs, planet symbols, colors
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

One-click deploy — no environment variables needed:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xjitsu/astrological_weathervane)

Or from the command line:

```bash
npx vercel --prod
```

The app is fully static — no backend, no database, no secrets.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | ![React](https://img.shields.io/badge/React_19-61dafb?logo=react&logoColor=black&style=flat-square) |
| Build Tool | ![Vite](https://img.shields.io/badge/Vite_6-646cff?logo=vite&logoColor=white&style=flat-square) |
| Styling | ![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06b6d4?logo=tailwindcss&logoColor=white&style=flat-square) |
| Planetary Math | ![astronomia](https://img.shields.io/badge/astronomia_v4.2-VSOP87B-f97316?style=flat-square) |
| Hosting | ![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white&style=flat-square) |
| Language | ![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-f7df1e?logo=javascript&logoColor=black&style=flat-square) |

---

## License

<div align="center">

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg?logo=gnu&style=for-the-badge)](LICENSE)
[![Commercial](https://img.shields.io/badge/Commercial_License-Available-orange?style=for-the-badge)](https://github.com/0xjitsu)

</div>

This project is dual-licensed:

- **AGPL v3** — free for open-source and personal use ([full text](LICENSE))
- **Commercial License** — available for proprietary/commercial use

For commercial licensing, contact via [GitHub](https://github.com/0xjitsu).

---

<div align="center">

**Track the sky. Know yourself.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xjitsu/astrological_weathervane)

[Get Started](https://astrological-weathervane.vercel.app/) · [Report a Bug](https://github.com/0xjitsu/astrological_weathervane/issues) · [Request a Feature](https://github.com/0xjitsu/astrological_weathervane/issues)

</div>
