import React from "react";
import { getProgressColor } from "../../Utils/statistics";

/**
 * Reusable progress bar component
 * @param {number} value - Current value
 * @param {number} max - Maximum/goal value
 * @param {string} label - Label for the progress bar
 * @param {string} unit - Unit to display
 * @param {boolean} showPercentage - Whether to show percentage
 */
const ProgressBar = ({ value, max, label, unit = "", showPercentage = true }) => {
  const percentage = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const color = getProgressColor(percentage);
  
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
        <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{label}</span>
        <span style={{ fontSize: "0.9rem", color: "#666" }}>
          {value?.toLocaleString() || "0"} {unit}
          {showPercentage && max > 0 && (
            <span style={{ marginLeft: "0.5rem" }}>({Math.round(percentage)}%)</span>
          )}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "20px",
          backgroundColor: "#e9ecef",
          borderRadius: "10px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: color,
            transition: "width 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: "0.5rem"
          }}
        >
          {percentage > 15 && (
            <span style={{ color: "white", fontSize: "0.75rem", fontWeight: "bold" }}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      </div>
      {max > 0 && (
        <div style={{ fontSize: "0.8rem", color: "#999", marginTop: "0.25rem" }}>
          Goal: {max.toLocaleString()} {unit}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

