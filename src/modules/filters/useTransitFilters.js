import { useState } from "react";

export default function useTransitFilters(DEFAULT_FILTERS) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  function reset() {
    setFilters(DEFAULT_FILTERS);
  }

  return {
    filters,
    setFilters,
    reset
  };
}
