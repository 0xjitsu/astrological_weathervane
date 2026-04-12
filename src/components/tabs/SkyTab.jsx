import Filters from "../Filters";
import TransitTable from "../TransitTable";
import Legend from "../Legend";
import AnimatedStat from "../../modules/components/AnimatedStat"; // We will create this next

export default function SkyTab({ filters, setFilters, bodies, skyStats, filteredSky }) {
  return (
    <>
      <Filters 
        filters={filters} 
        onFilterChange={setFilters} 
        bodies={bodies} 
        mode="sky" 
      />

      <div
        className="text-[11px] sm:text-xs font-mono mb-3 flex flex-wrap gap-x-2 gap-y-0.5"
        style={{ color: 'var(--text-muted)' }}
      >
        <span><AnimatedStat value={skyStats.total} /> events</span>
        <span className="hidden sm:inline">·</span>
        <span><AnimatedStat value={skyStats.aspects} /> aspects</span>
        <span className="hidden sm:inline">·</span>
        <span><AnimatedStat value={skyStats.ingresses} /> ingresses</span>
        <span className="hidden sm:inline">·</span>
        <span><AnimatedStat value={skyStats.moonIngresses} /> moon ingresses</span>
      </div>

      <TransitTable events={filteredSky} />
      <Legend />
    </>
  );
}
