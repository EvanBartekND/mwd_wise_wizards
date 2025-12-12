import React from "react";
import { formatDateDisplay, getDayName } from "../../Utils/dateUtils";
import ProgressBar from "./ProgressBar";
import { STAT_COLORS } from "../../Utils/colors";

/**
 * Day detail modal component
 * @param {object} dayData - Day data object
 * @param {Date} date - Date for this day
 * @param {object} goals - User goals for comparison
 * @param {function} onClose - Close handler
 */
const DayDetailModal = ({ dayData, date, goals, onClose }) => {
  if (!date) return null;

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
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem" }}>
              {getDayName(date)} - {formatDateDisplay(date)}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Close
          </button>
        </div>

        {hasData ? (
          <div>
            <h3 style={{ marginBottom: "1rem" }}>Daily Statistics</h3>
            
            {/* Statistics */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem"
              }}
            >
              <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Calories</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: STAT_COLORS.CALORIES }}>
                  {calories?.toLocaleString() || "—"}
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Cardio</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: STAT_COLORS.CARDIO }}>
                  {cardio || "—"} <span style={{ fontSize: "1rem" }}>min</span>
                </div>
              </div>
              <div style={{ textAlign: "center", padding: "1rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>Lifting</div>
                <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: STAT_COLORS.LIFTING }}>
                  {lift || "—"} <span style={{ fontSize: "1rem" }}>min</span>
                </div>
              </div>
            </div>

            {/* Progress Toward Goals */}
            {goals && (
              <div style={{ backgroundColor: "#f8f9fa", padding: "1.5rem", borderRadius: "8px" }}>
                <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Progress Toward Goals</h3>
                
                {goals.calorieGoal && (
                  <ProgressBar
                    value={calories || 0}
                    max={goals.calorieGoal}
                    label="Calories"
                    unit="cal"
                    showPercentage={true}
                  />
                )}
                
                {goals.cardioGoal && (
                  <ProgressBar
                    value={cardio || 0}
                    max={goals.cardioGoal}
                    label="Cardio"
                    unit="min"
                    showPercentage={true}
                  />
                )}
                
                {goals.liftGoal && (
                  <ProgressBar
                    value={lift || 0}
                    max={goals.liftGoal}
                    label="Lifting"
                    unit="min"
                    showPercentage={true}
                  />
                )}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "3rem", color: "#999" }}>
            <p style={{ fontSize: "1.1rem" }}>No data logged for this day</p>
            <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
              Visit the Log page to add your daily stats
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DayDetailModal;

