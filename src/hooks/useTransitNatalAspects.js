import { useMemo } from 'react';
import { computeTransitToNatal } from '../utils/aspectCalculator';

export default function useTransitNatalAspects(natalChart, dailyPositions) {
  return useMemo(() => {
    if (!natalChart || !natalChart.planets || !Object.keys(natalChart.planets).length) {
      return [];
    }
    return computeTransitToNatal(dailyPositions, natalChart.planets, 1.0);
  }, [natalChart, dailyPositions]);
}
