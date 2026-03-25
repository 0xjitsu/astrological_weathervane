import { useState, useMemo } from 'react';
import transitData from './data/transitData.json';
import dailyPositions from './data/dailyPositions.json';
import sampleNatal from './data/sampleNatal.json';
import PlanetaryPositions from './components/PlanetaryPositions';
import Filters from './components/Filters';
import TransitTable from './components/TransitTable';
import NatalChartInput from './components/NatalChartInput';
import NatalOverlay from './components/NatalOverlay';
import Legend from './components/Legend';
import useTransitNatalAspects from './hooks/useTransitNatalAspects';

const DEFAULT_FILTERS = { search: '', type: 'all', aspect: 'all', month: 'all', body: 'all' };

export default function App() {
  const [activeTab, setActiveTab] = useState('sky');
  const [showPositions, setShowPositions] = useState(false);
  const [natalChart, setNatalChart] = useState(null);
  const [showNatalInput, setShowNatalInput] = useState(true);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  const natalAspects = useTransitNatalAspects(natalChart, dailyPositions);

  // Collect all unique body names for the body filter
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

  // Filter sky events
  const filteredSky = useMemo(() => {
    return transitData.events.filter((e) => {
      if (filters.type !== 'all' && e.type !== filters.type) return false;
      if (filters.aspect !== 'all' && e.aspect !== filters.aspect) return false;
      if (filters.month !== 'all') {
        const m = parseInt(e.date.split('-')[1]);
        if (m !== parseInt(filters.month)) return false;
      }
      if (filters.body !== 'all') {
        if (e.body1 !== filters.body && e.body2 !== filters.body) return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          e.description.toLowerCase().includes(q) ||
          (e.body1 && e.body1.toLowerCase().includes(q)) ||
          (e.body2 && e.body2.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [filters]);

  // Filter natal aspects
  const filteredNatal = useMemo(() => {
    return natalAspects.filter((e) => {
      if (filters.aspect !== 'all' && e.aspect !== filters.aspect) return false;
      if (filters.month !== 'all') {
        const m = parseInt(e.date.split('-')[1]);
        if (m !== parseInt(filters.month)) return false;
      }
      if (filters.body !== 'all') {
        if (e.transitBody !== filters.body && e.natalBody !== filters.body) return false;
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return e.description.toLowerCase().includes(q);
      }
      return true;
    });
  }, [natalAspects, filters]);

  const currentEvents = activeTab === 'sky' ? filteredSky : filteredNatal;
  const bodies = activeTab === 'sky' ? skyBodies : natalBodies;

  // Stats
  const stats = useMemo(() => {
    if (activeTab === 'sky') {
      const aspects = filteredSky.filter((e) => e.type === 'Aspect').length;
      const ingresses = filteredSky.filter((e) => e.type === 'Ingress').length;
      const moonIng = filteredSky.filter((e) => e.type === 'Moon Ingress').length;
      return `${filteredSky.length} events · ${aspects} aspects · ${ingresses} ingresses · ${moonIng} moon ingresses`;
    }
    const planetAspects = filteredNatal.filter((e) => e.transitBody !== 'Moon').length;
    const moonAspects = filteredNatal.filter((e) => e.transitBody === 'Moon').length;
    return `${filteredNatal.length} aspects · ${planetAspects} planetary · ${moonAspects} lunar`;
  }, [activeTab, filteredSky, filteredNatal]);

  function handleTabChange(tab) {
    setActiveTab(tab);
    setFilters(DEFAULT_FILTERS);
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-[960px] mx-auto">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="text-[13px] tracking-[0.25em] uppercase opacity-50 mb-2 font-mono">
          Swiss Ephemeris · 1° Orb · PHT (UTC+8)
        </div>
        <h1 className="text-3xl font-light tracking-tight mb-1">
          Planetary Transits & Aspects
        </h1>
        <div className="text-base opacity-60">March 25 – June 24, 2026</div>
      </header>

      {/* Planetary Positions */}
      <PlanetaryPositions
        positions={transitData.positions}
        isOpen={showPositions}
        onToggle={() => setShowPositions(!showPositions)}
      />

      {/* Tabs */}
      <div className="flex gap-1 mb-5 border-b border-zinc-700/60">
        {[
          { id: 'sky', label: 'Sky Transits' },
          { id: 'natal', label: 'Transit-to-Natal' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-purple-400 text-purple-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
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

      {/* Natal Chart Input (shown when natal tab active) */}
      {activeTab === 'natal' && showNatalInput && (
        <NatalChartInput
          onNatalChartChange={(chart) => {
            setNatalChart(chart);
            if (chart) setShowNatalInput(false);
          }}
          sampleNatal={sampleNatal}
        />
      )}

      {/* Edit Chart button when chart is loaded */}
      {activeTab === 'natal' && natalChart && !showNatalInput && (
        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-zinc-400 font-mono">
            Natal chart: <span className="text-purple-300">{natalChart.name}</span>
          </span>
          <button
            onClick={() => setShowNatalInput(true)}
            className="px-2.5 py-1 text-[11px] font-mono rounded border border-zinc-600 text-zinc-400 hover:bg-zinc-700/50 transition-colors cursor-pointer"
          >
            Edit Chart
          </button>
          <button
            onClick={() => {
              setNatalChart(null);
              setShowNatalInput(true);
            }}
            className="px-2.5 py-1 text-[11px] font-mono rounded border border-zinc-600 text-zinc-400 hover:bg-zinc-700/50 transition-colors cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Show filters and table for sky tab, or for natal tab when chart loaded */}
      {(activeTab === 'sky' || (activeTab === 'natal' && natalChart)) && (
        <>
          {/* Filters */}
          <Filters
            filters={filters}
            onFilterChange={setFilters}
            bodies={bodies}
            mode={activeTab}
          />

          {/* Stats */}
          <div className="text-xs font-mono opacity-50 mb-3">{stats}</div>

          {/* Table */}
          {activeTab === 'sky' ? (
            <TransitTable events={filteredSky} />
          ) : (
            <NatalOverlay aspects={filteredNatal} chartName={natalChart?.name} />
          )}
        </>
      )}

      {/* Legend */}
      <Legend />
    </div>
  );
}
