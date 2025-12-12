import React from "react";
import MiniChart from "./MiniChart";
import { formatDateDisplay, getDayName } from "../../Utils/dateUtils";

/**
 * Day card component showing a single day's data
 * @param {object} dayData - Day data object
 * @param {Date} date - Date for this day
 * @param {object} goals - User goals for comparison
 * @param {function} onClick - Click handler to open detail view
 */
const DayCard = ({ dayData, date, goals, onClick }) => {
  const hasData = dayData && (
    (dayData.trackedCalories !== null && dayData.trackedCalories !== undefined) ||
    (dayData.trackedCardio !== null && dayData.trackedCardio !== undefined) ||
    (dayData.trackedLift !== null && dayData.trackedLift !== undefined)
  );

  const calories = dayData?.trackedCalories ?? null;
  const cardio = dayData?.trackedCardio ?? null;
  const lift = dayData?.trackedLift ?? null;

  return (
    <div
      onClick={onClick}
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        backgroundColor: hasData ? "white" : "#f8f9fa",
        cursor: "pointer",
        transition: "all 0.2s",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ marginBottom: "0.75rem" }}>
        <div style={{ fontSize: "0.85rem", color: "#666", fontWeight: "500" }}>
          {getDayName(date, true)}
        </div>
        <div style={{ fontSize: "1rem", fontWeight: "bold", color: "#333" }}>
          {formatDateDisplay(date)}
        </div>
      </div>

      {hasData ? (
        <>
          <div style={{ marginBottom: "0.5rem", fontSize: "0.85rem", color: "#666" }}>
            <div>Cal: {calories?.toLocaleString() || "—"}</div>
            <div>Cardio: {cardio || "—"} min</div>
            <div>Lift: {lift || "—"} min</div>
          </div>
          <div style={{ flex: "1", display: "flex", alignItems: "flex-end" }}>
            <MiniChart
              calories={calories}
              cardio={cardio}
              lift={lift}
              goals={goals}
            />
          </div>
        </>
      ) : (
        <div
          style={{
            flex: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#999",
            fontSize: "0.9rem"
          }}
        >
          No data logged
        </div>
      )}
    </div>
  );
};

export default DayCard;

