import { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { enUS } from "date-fns/locale";

import TimelineDrawer from "./TimelineDrawer";
import { PLANET_COLORS } from "../utils/colors";
import { GLYPHS } from "../utils/glyphs";
import { ASPECT_GLYPHS } from "../utils/aspectGlyphs";

import "react-big-calendar/lib/css/react-big-calendar.css";

// Calendar localization
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

// Event coloring
function eventStyleGetter(event) {
  const body = event.meta?.body;
  const isRetro = event.meta?.retrograde === true;

  const bg = isRetro ? "#1a0000" : PLANET_COLORS[body] || "#444";
  const border = isRetro ? "#ff4f4f" : PLANET_COLORS[body] || "#444";

  return {
    style: {
      backgroundColor: bg,
      borderLeft: `4px solid ${border}`,
      padding: "2px 4px",
      borderRadius: "4px",
      color: "white",
      opacity: 0.95,
      fontSize: "12px"
    }
  };
}

// Event rendering
function EventRenderer({ event }) {
  const body = event.meta?.body;
  const glyph = GLYPHS[body] || "";
  const aspect = event.meta?.aspect;
  const aspGlyph = ASPECT_GLYPHS[aspect] || "";
  
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <span>{glyph}</span>
      <span>{event.title}</span>
      {aspGlyph && <span style={{ opacity: 0.7 }}>{aspGlyph}</span>}
      {event.meta?.retrograde && <span style={{ color: "#ff9999" }}>℞</span>}
    </div>
  );
}

export default function AstroCalendar({ dailyPositions, calendarEvents }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContext, setDrawerContext] = useState(null);

  function onSelectEvent(event) {
    setDrawerContext({ type: "event", data: event.meta });
    setDrawerOpen(true);
  }

  function onSelectSlot(slot) {
    const date = slot.start.toISOString().split("T")[0];
    const dataForDay = dailyPositions[date] || {};

    const bodies = Object.entries(dataForDay).map(([name, lon]) => ({
      name,
      longitude: lon,
      sign: Math.floor((lon % 360) / 30)
    }));

    setDrawerContext({
      type: "day",
      date,
      bodies
    });

    setDrawerOpen(true);
  }

  return (
    <>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        view="month"
        selectable
        eventPropGetter={eventStyleGetter}
        components={{ event: EventRenderer }}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        style={{
          height: "78vh",
          background: "#0e0e0e",
          borderRadius: "8px",
          padding: "8px"
        }}
      />

      <TimelineDrawer
        open={drawerOpen}
        context={drawerContext}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
}
