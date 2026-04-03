import { useMemo } from "react";

export default function useNatalTransits(natalAspects, filters) {
  return useMemo(() => {
    return natalAspects.filter(e => {
      if (filters.aspect !== "all" && e.aspect !== filters.aspect) return false;

      if (filters.month !== "all") {
        const m = parseInt(e.date.split("-")[1]);
        if (m !== parseInt(filters.month)) return false;
      }

      if (filters.body !== "all") {
        if (e.transitBody !== filters.body && e.natalBody !== filters.body)
          return false;
      }

      if (filters.search) {
        const q = filters.search.toLowerCase();
        return e.description.toLowerCase().includes(q);
      }

      return true;
    });
  }, [natalAspects, filters]);
}
