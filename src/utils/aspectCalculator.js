import { ASPECT_ANGLES } from './astroConstants';
import { formatPosition } from './formatters';

function angleDiff(a, b) {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
}

export function computeTransitToNatal(dailyPositions, natalPlanets, maxOrb = 1.0) {
  const events = [];
  const aspects = Object.entries(ASPECT_ANGLES);

  for (const [dateStr, dayPositions] of Object.entries(dailyPositions)) {
    for (const [tPlanet, tLon] of Object.entries(dayPositions)) {
      for (const [nPlanet, nLon] of Object.entries(natalPlanets)) {
        // Skip self-aspects
        if (tPlanet === nPlanet) continue;

        const diff = angleDiff(tLon, nLon);

        for (const [aspName, aspAngle] of aspects) {
          const orbVal = Math.abs(diff - aspAngle);
          if (orbVal <= maxOrb) {
            events.push({
              date: dateStr,
              type: 'Transit-to-Natal',
              transitBody: tPlanet,
              natalBody: nPlanet,
              aspect: aspName,
              transitPos: tLon,
              natalPos: nLon,
              orb: Math.round(orbVal * 100) / 100,
              transitFormatted: formatPosition(tLon),
              natalFormatted: formatPosition(nLon),
              description: `Tr. ${tPlanet} ${aspName} Natal ${nPlanet}`,
              position: `${formatPosition(tLon)} / ${formatPosition(nLon)}`,
              highlight: true,
            });
          }
        }
      }
    }
  }

  return deduplicateConsecutive(events);
}

function deduplicateConsecutive(events) {
  // Group by (transitBody, natalBody, aspect)
  const groups = {};
  for (const e of events) {
    const key = `${e.transitBody}|${e.natalBody}|${e.aspect}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  }

  const result = [];

  for (const group of Object.values(groups)) {
    group.sort((a, b) => a.date.localeCompare(b.date));

    let cluster = [group[0]];

    for (let i = 1; i < group.length; i++) {
      const prevDate = new Date(group[i - 1].date);
      const currDate = new Date(group[i].date);
      const diffDays = (currDate - prevDate) / (1000 * 60 * 60 * 24);

      if (diffDays <= 2) {
        cluster.push(group[i]);
      } else {
        result.push(pickBest(cluster));
        cluster = [group[i]];
      }
    }
    result.push(pickBest(cluster));
  }

  return result.sort((a, b) => a.date.localeCompare(b.date));
}

function pickBest(cluster) {
  const best = cluster.reduce((a, b) => (a.orb < b.orb ? a : b));
  if (cluster.length > 1) {
    best.dateRange = `${cluster[0].date} to ${cluster[cluster.length - 1].date}`;
  }
  return best;
}
