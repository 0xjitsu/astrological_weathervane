import AstroCalendar from "../AstroCalendar";

export default function CalendarTab({ dailyPositions, calendarEvents }) {
  return (
    <AstroCalendar
      dailyPositions={dailyPositions}
      calendarEvents={calendarEvents}
    />
  );
}
