import { useMemo } from "react";

export function useSkyStats(filteredSky) {
  return useMemo(() => {
    let aspects = 0, ing = 0, moonIng = 0;

    for (const e of filteredSky) {
      if (e.type === "Aspect") aspects++;
      else if (e.type === "Ingress") ing++;
      else if (e.type === "Moon Ingress") moonIng++;
    }

    return {
      total: filteredSky.length,
      aspects,
      ingresses: ing,
      moonIngresses: moonIng
    };
  }, [filteredSky]);
}

export function useNatalStats(filteredNatal) {
  return useMemo(() => {
    let planetary = 0, lunar = 0;

    for (const e of filteredNatal) {
      if (e.transitBody === "Moon") lunar++;
      else planetary++;
    }

    return {
      total: filteredNatal.length,
      planetary,
      lunar
    };
  }, [filteredNatal]);
}
