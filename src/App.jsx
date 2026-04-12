import SkyTab from "./components/tabs/SkyTab";
import NatalTab from "./components/tabs/NatalTab";
import CalendarTab from "./components/tabs/CalendarTab";
import useSkyTransits from "./modules/transits/useSkyTransits";
import useNatalTransits from "./modules/transits/useNatalTransits";
import useTransitFilters from "./modules/filters/useTransitFilters";
import { useSkyStats, useNatalStats } from "./modules/stats/useTransitStats";

import { useState, useMemo, useEffect, useRef } from 'react';
import transitData from './data/transitData.json';
import dailyPositions from './data/dailyPositions.json';
import sampleNatal from './data/sampleNatal.json';

import PlanetaryPositions from './components/PlanetaryPositions';
import Filters from './components/Filters';
import TransitTable from './components/TransitTable';
import NatalChartInput from './components/NatalChartInput';
import NatalOverlay from './components/NatalOverlay';
import Legend from './components/Legend';
import References from './components/References';
import ThemeToggle from './components/ThemeToggle';
import DesignCustomizer from './components/DesignCustomizer';
import ScrollProgress from './components/ScrollProgress';
import useTransitNatalAspects from './hooks/useTransitNatalAspects';

import AstroCalendar from './components/AstroCalendar';
import { generateCalendarEvents } from './utils/calendarEvents';

const DEFAULT_FILTERS = { search: '', type: 'all', aspect: 'all', month: 'all', body: 'all' };

const TABS = [
  { id: 'sky',        label: 'Sky Transits' },
  { id: 'natal',      label: 'Transit-to-Natal' },
  { id: 'calendar',   label: 'Calendar' },
  { id: 'references', label: 'References' },
];

// — Animated number hook ————————————————
function useAnimatedNumber(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;

    const start = performance.now();
    startRef.current = start;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (target - from) * eased);
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        fromRef.current = target;
      }
    }

    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);

  return display;
}

function AnimatedStat({ value, suffix = '' }) {
  const animated = useAnimatedNumber(value);
  return <>{animated}{suffix}</>;
}

export default function App() {
  const [activeTab, setActiveTab]           = useState('sky');
  const [showPositions, setShowPositions]   = useState(false);
  const [natalChart, setNatalChart]         = useState(null);
  const [showNatalInput, setShowNatalInput] = useState(true);

  const { filters, setFilters, reset } = useTransitFilters(DEFAULT_FILTERS);

  const natalAspects = useTransitNatalAspects(natalChart, dailyPositions);

  // Bodies for filters
  const skyBodies = useMemo(() => {
    const s = new Set();
    transitData.events.forEach((e) => {
      if (e.body1) s.add(e.body1);
      if (e.body2) s.add(e.body2);
    });
    return [...s].sort();
  }, []);

  const natalBodies = useMemo(() => {
    const s = new Set();
    natalAspects.forEach((e) => {
      s.add(e.transitBody);
      s.add(e.natalBody);
    });
    return [...s].sort();
  }, [natalAspects]);

  const bodies = activeTab === 'sky' ? skyBodies : natalBodies;

  // Modular filtering hooks
  const filteredSky = useSkyTransits(filters);
  const filteredNatal = useNatalTransits(natalAspects, filters);

  // Stats via modular hooks
  const skyStats   = useSkyStats(filteredSky);
  const natalStats = useNatalStats(filteredNatal);

  // Calendar events
  const calendarEvents = useMemo(
    () => generateCalendarEvents(dailyPositions),
    []
  );

  function handleTabChange(tab) {
    setActiveTab(tab);
    if (tab !== 'references') setFilters(DEFAULT_FILTERS);
  }

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen px-4 py-6 max-w-[960px] mx-auto animate-fade-in">

        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-end gap-1.5 mb-2">
            <DesignCustomizer />
            <ThemeToggle />
          </div>
          <div className="text-center">
            <div
              className="text-[11px] sm:text-[13px] tracking-[0.15em] sm:tracking-[0.25em] uppercase mb-2 font-mono"
              style={{ color: 'var(--text-secondary)' }}
            >
              Swiss Ephemeris · 1° Orb · PHT (UTC+8)
            </div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight mb-1">
              <span className="celestial-spin mr-2">☉</span>
              Planetary Transits &amp; Aspects
            </h1>
            <div className="text-sm sm:text-base" style={{ color: 'var(--text-secondary)' }}>
              March 25 – June 24, 2026
            </div>
          </div>
        </header>

        {/* Planetary Positions */}
        {activeTab !== 'references' && activeTab !== 'calendar' && (
          <PlanetaryPositions
            positions={transitData.positions}
            isOpen={showPositions}
            onToggle={() => setShowPositions(!showPositions)}
          />
        )}

        {/* Tabs */}
        <div
          className="flex gap-0.5 sm:gap-1 mb-5 border-b overflow-x-auto"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className="px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer border-b-3 -mb-px whitespace-nowrap"
              style={{
                borderColor: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-highlight)' : 'var(--text-muted)',
              }}
            >
              {tab.label}
              {tab.id === 'natal' && natalChart && (
                <span className="ml-2 text-[10px] font-mono opacity-60">
                  ({natalChart.name})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Natal Chart Input */}
        {activeTab === 'natal' && showNatalInput && (
          <NatalChartInput
            onNatalChartChange={(chart) => {
              setNatalChart(chart);
              if (chart) setShowNatalInput(false);
            }}
            sampleNatal={sampleNatal}
          />
        )}

        {/* Edit Chart button */}
        {activeTab === 'natal' && natalChart && !showNatalInput && (
          <div className="mb-4 flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs sm:text-sm font-mono" style={{ color: 'var(--text-secondary)' }}>
              Natal chart:{' '}
              <span style={{ color: 'var(--accent-highlight)' }}>{natalChart.name}</span>
            </span>
            <button
              onClick={() => setShowNatalInput(true)}
              className="px-2.5 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Edit Chart
            </button>
            <button
              onClick={() => { setNatalChart(null); setShowNatalInput(true); }}
              className="px-2.5 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            >
              Clear
            </button>
          </div>
        )}

        {/* Sky Transits */}
        {activeTab === 'sky' && (
  <SkyTab
    filters={filters}
    setFilters={setFilters}
    bodies={bodies}
    skyStats={skyStats}
    filteredSky={filteredSky}
  />
)}


        {/* Transit-to-Natal */}
        {activeTab === 'natal' && natalChart && (
  <NatalTab
    filters={filters}
    setFilters={setFilters}
    bodies={bodies}
    natalStats={natalStats}
    filteredNatal={filteredNatal}
    natalChart={natalChart}
  />
)}


        {/* Calendar tab */}
        {activeTab === 'calendar' && (
  <CalendarTab
    dailyPositions={dailyPositions}
    calendarEvents={calendarEvents}
  />
)}


        {/* References */}
        {activeTab === 'references' && <References />}

      </div>
    </>
  );
}
