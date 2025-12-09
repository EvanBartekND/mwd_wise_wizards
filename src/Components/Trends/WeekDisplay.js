import React from "react";
import DayCard from "./DayCard";
import { getWeekDates } from "../../Utils/dateUtils";
import { extractDayData } from "../../Services/Logs";

/**
 * Week display component showing 7 day cards
 * @param {array} weekDays - Array of 7 day objects (may have nulls)
 * @param {Date} weekStart - Week start date
 * @param {object} goals - User goals
 * @param {function} onDayClick - Callback when day card is clicked
 */
const WeekDisplay = ({ weekDays, weekStart, goals, onDayClick }) => {
  const weekDates = getWeekDates(weekStart);

  // Extract day data (already in correct format, but extractDayData handles null checks)
  const daysData = weekDays.map((day, index) => {
    return extractDayData(day);
  });

  return (
    <div>
      <h2 style={{ marginBottom: "1rem" }}>This Week</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem"
        }}
      >
        {weekDates.map((date, index) => (
          <DayCard
            key={date.toISOString()}
            dayData={daysData[index]}
            date={date}
            goals={goals}
            onClick={() => onDayClick && onDayClick(date, daysData[index])}
          />
        ))}
      </div>
    </div>
  );
};

export default WeekDisplay;

