import React from "react";
import { formatWeekRange, getPreviousWeek, getNextWeek } from "../../Utils/dateUtils";

/**
 * Week selector component for navigating between weeks
 * @param {Date} weekStart - Current week start date
 * @param {function} onWeekChange - Callback when week changes
 * @param {boolean} canGoPrevious - Whether previous button should be enabled
 * @param {boolean} canGoNext - Whether next button should be enabled
 */
const WeekSelector = ({ weekStart, onWeekChange, canGoPrevious = true, canGoNext = true }) => {
  const handlePrevious = () => {
    if (canGoPrevious && onWeekChange) {
      onWeekChange(getPreviousWeek(weekStart));
    }
  };

  const handleNext = () => {
    if (canGoNext && onWeekChange) {
      onWeekChange(getNextWeek(weekStart));
    }
  };

  const handleToday = () => {
    const today = new Date();
    // Get current week start
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(today);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    
    if (onWeekChange) {
      onWeekChange(weekStart);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        marginBottom: "1.5rem"
      }}
    >
      <button
        onClick={handlePrevious}
        disabled={!canGoPrevious}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: canGoPrevious ? "#007bff" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: canGoPrevious ? "pointer" : "not-allowed",
          fontSize: "0.9rem"
        }}
      >
        ← Previous
      </button>

      <div style={{ textAlign: "center", flex: "1" }}>
        <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#333" }}>
          {formatWeekRange(weekStart)}
        </h3>
        <button
          onClick={handleToday}
          style={{
            marginTop: "0.5rem",
            padding: "0.25rem 0.75rem",
            backgroundColor: "transparent",
            color: "#007bff",
            border: "1px solid #007bff",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.85rem"
          }}
        >
          This Week
        </button>
      </div>

      <button
        onClick={handleNext}
        disabled={!canGoNext}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: canGoNext ? "#007bff" : "#ccc",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: canGoNext ? "pointer" : "not-allowed",
          fontSize: "0.9rem"
        }}
      >
        Next →
      </button>
    </div>
  );
};

export default WeekSelector;

