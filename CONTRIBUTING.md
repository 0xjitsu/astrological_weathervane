# Contributing to Astrological Weathervane

Thanks for your interest in contributing! This guide covers everything you need to get started.

---

## Quick Start

```bash
git clone https://github.com/0xjitsu/astrological_weathervane.git
cd astrological_weathervane
npm install
npm run dev
```

The app runs at `http://localhost:5173` with hot reload.

---

## How to Contribute

### Reporting Bugs

Open an [issue](https://github.com/0xjitsu/astrological_weathervane/issues) with:

- What you expected vs. what happened
- Browser and OS
- Steps to reproduce
- Screenshot if it's a visual bug

### Suggesting Features

Open an [issue](https://github.com/0xjitsu/astrological_weathervane/issues) with:

- What problem does it solve?
- Who benefits?
- Any reference implementations or examples?

### Submitting Code

1. Fork the repo and create a branch from `test` (not `main`)
2. Make your changes — keep them focused on one thing
3. Run `npm run build` to verify it compiles
4. Commit with a clear message explaining **why**, not just what
5. Open a PR targeting the `test` branch

PRs go through `test` first, then get merged to `main` after review.

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Production — always deployable |
| `test` | Integration — PRs land here first |
| `feature/*` | Your work — branch from `test` |

---

## Code Style

- **JavaScript** (ES2024) — no TypeScript in this project (yet)
- **React 19** functional components with hooks
- **Tailwind CSS v4** for styling — no inline styles or CSS modules
- **camelCase** for functions and variables
- **PascalCase** for components
- **UPPER_SNAKE_CASE** for constants

Keep it simple:

- No unnecessary abstractions — three similar lines beat a premature helper
- No new dependencies without discussion in the PR
- No secrets or API keys — the app is fully static

---

## Project Structure

| Directory | What goes here |
|-----------|---------------|
| `src/components/` | React components (one per file) |
| `src/data/` | Static data files (cities, positions, references) |
| `src/utils/` | Pure utility functions |
| `src/hooks/` | Custom React hooks |

---

## Contributor License Agreement (CLA)

By submitting a pull request to this repository, you agree to the following terms:

1. **You grant the maintainer (0xJitsu) a perpetual, worldwide, non-exclusive, royalty-free, irrevocable license** to use, reproduce, modify, distribute, sublicense, and relicense your contributions under any license — including proprietary/commercial licenses.

2. **You represent that you have the right** to grant this license. If your employer has rights to your contributions, you represent that your employer has authorized you to make contributions on their behalf, or that your employer has waived such rights.

3. **You understand that this project is dual-licensed** under AGPL v3 (open source) and a commercial license. Your contributions may be distributed under either or both licenses.

4. **You are not expected to provide support** for your contributions, but you may do so voluntarily.

This CLA is necessary to maintain the dual-licensing model: open source for the community, commercial license available for proprietary use. Without it, the project cannot offer both options.

---

## Questions?

Open an issue or reach out via [GitHub](https://github.com/0xjitsu).
