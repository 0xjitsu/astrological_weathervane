import { useMemo } from "react";
import transitData from "../../data/transitData.json";

export default function useSkyTransits(filters) {
  return useMemo(() => {
    return transitData.events.filter(e => {
      if (filters.type !== "all" && e.type !== filters.type) return false;
      if (filters.aspect !== "all" && e.aspect !== filters.aspect) return false;

      if (filters.month !== "all") {
        const m = parseInt(e.date.split("-")[1]);
        if (m !== parseInt(filters.month)) return false;
      }

      if (filters.body !== "all") {
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
}
