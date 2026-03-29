import { useState, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import TimelineDrawer from './TimelineDrawer';
import { signOf } from '../utils/calendarEvents';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales
});

const PLANET_COLORS = {
  Sun:          '#f5a623',
  Moon:         '#c0c0c0',
  Mercury:      '#a0c4ff',
  Venus:        '#ff9dc6',
  Mars:         '#ff4f4f',
  Jupiter:      '#7b68ee',
  Saturn:       '#c8a96e',
  Uranus:       '#40e0d0',
  Neptune:      '#4169e1',
  Pluto:        '#9b59b6',
  'Mean Node':  '#2ecc71',
  'North Node': '#2ecc71',
  'South Node': '#e74c3c',
  'Mean Lilith':'#ff69b4',
  Juno:         '#f39c12',
  Chiron:       '#8B4513',
  default:      '#888888',
};

function eventStyleGetter(event) {
  const color = PLANET_COLORS[event.meta?.body] || PLANET_COLORS.default;
  const isRetro = event.meta?.type === 'retrograde-start';
  return {
    style: {
      backgroundColor: isRetro ? '#1a0000' : color,
      borderLeft: isRetro ? `3px solid #ff4f4f` : `3px solid ${color}`,
      borderRadius: '3px',
      color: '#fff',
      fontSize: '11px',
      padding: '1px 5px',
      opacity: 0.92,
    }
  };
}

export default function AstroCalendar({ dailyPositions, calendarEvents }) {
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [drawerContext, setDrawerContext] = useState(null);

  const onSelectEvent = (event) => {
    setDrawerContext({ type: 'event', data: event.meta });
    setDrawerOpen(true);
  };

  const onSelectSlot = (slot) => {
    const dateStr = slot.start.toISOString().split('T')[0];
    const dayData = dailyPositions[dateStr] || {};

    const bodies = Object.entries(dayData)
      .filter(([name]) => name !== 'True Node')
      .map(([name, longitude]) => ({
        name,
        longitude,
        sign: signOf(longitude),
      }));

    setDrawerContext({ type: 'day', date: dateStr, bodies });
    setDrawerOpen(true);
  };

  return (
    <div className="p-4 bg-gray-950 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">🪐 Astrological Weathervane</h1>

      <Calendar
        localizer={localizer}
        events={calendarEvents}
        defaultView="month"
        views={['month']}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        eventPropGetter={eventStyleGetter}
        style={{
          height: '78vh',
          background: '#111',
          borderRadius: '8px',
          padding: '8px',
        }}
      />

      <TimelineDrawer
        open={drawerOpen}
        context={drawerContext}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
}
