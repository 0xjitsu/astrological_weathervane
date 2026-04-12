import Filters from "../Filters";
import NatalOverlay from "../NatalOverlay";
import Legend from "../Legend";
import AnimatedStat from "../../modules/components/AnimatedStat";

export default function NatalTab({
  filters,
  setFilters,
  bodies,
  natalStats,
  filteredNatal,
  natalChart
}) {
  return (
    <>
      <Filters 
        filters={filters} 
        onFilterChange={setFilters} 
        bodies={bodies} 
        mode="natal" 
      />

      <div
        className="text-[11px] sm:text-xs font-mono mb-3 flex flex-wrap gap-x-2 gap-y-0.5"
        style={{ color: 'var(--text-muted)' }}
      >
        <span><AnimatedStat value={natalStats.total} /> aspects</span>
        <span className="hidden sm:inline">·</span>
        <span><AnimatedStat value={natalStats.planetary} /> planetary</span>
        <span className="hidden sm:inline">·</span>
        <span><AnimatedStat value={natalStats.lunar} /> lunar</span>
      </div>

      <NatalOverlay aspects={filteredNatal} chartName={natalChart?.name} />
      <Legend />
    </>
  );
}
