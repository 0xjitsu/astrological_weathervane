const SIGNS = [
  'Aries','Taurus','Gemini','Cancer',
  'Leo','Virgo','Libra','Scorpio',
  'Sagittarius','Capricorn','Aquarius','Pisces'
];

export function signOf(longitude) {
  return SIGNS[Math.floor(((longitude % 360) + 360) % 360 / 30)];
}

export function generateCalendarEvents(dailyPositions) {
  // dailyPositions shape: { "2026-03-25": { Sun: 4.02, Moon: 78.99, ... }, ... }
  const dates = Object.keys(dailyPositions).sort();
  const bodyNames = Object.keys(dailyPositions[dates[0]]).filter(
    b => b !== 'True Node' // exclude True Node everywhere
  );

  const events = [];

  for (const body of bodyNames) {
    for (let i = 1; i < dates.length; i++) {
      const prevDate = dates[i - 1];
      const currDate = dates[i];
      const prev = dailyPositions[prevDate][body];
      const curr = dailyPositions[currDate][body];

      if (prev == null || curr == null) continue;

      const prevSign = signOf(prev);
      const currSign = signOf(curr);

      // Retrograde detection — longitude moves backward
      const isRetro = curr < prev && Math.abs(curr - prev) < 10;
      const prevPrevDate = dates[i - 2];
      const prevPrev = prevPrevDate ? dailyPositions[prevPrevDate][body] : null;
      const wasRetro = prevPrev != null
        ? prev < prevPrev && Math.abs(prev - prevPrev) < 10
        : false;

      if (isRetro && !wasRetro) {
        events.push({
          title: `${body} Rx`,
          start: new Date(currDate),
          end: new Date(currDate),
          allDay: true,
          meta: {
            body,
            type: 'retrograde-start',
            date: currDate,
            sign: currSign,
          }
        });
      }

      if (!isRetro && wasRetro) {
        events.push({
          title: `${body} Direct`,
          start: new Date(currDate),
          end: new Date(currDate),
          allDay: true,
          meta: {
            body,
            type: 'retrograde-end',
            date: currDate,
            sign: currSign,
          }
        });
      }

      // Ingress — sign change
      if (prevSign !== currSign) {
        events.push({
          title: `${body} → ${currSign}`,
          start: new Date(currDate),
          end: new Date(currDate),
          allDay: true,
          meta: {
            body,
            type: 'ingress',
            date: currDate,
            ingress: { sign: currSign, date: currDate },
            egress: { sign: prevSign, date: prevDate },
          }
        });
      }
    }
  }

  return events;
}
