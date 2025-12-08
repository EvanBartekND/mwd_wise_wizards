import React, { useState } from "react";

/**
 * Reusable goal card component that displays a goal and allows editing
 * @param {string} label - Goal label (e.g., "Calorie Goal")
 * @param {number|string} value - Current goal value
 * @param {string} unit - Unit to display
 * @param {function} onEdit - Callback when edit button is clicked
 * @param {boolean} editing - Whether this goal is currently being edited
 */
const GoalCard = ({ label, value, unit = "", onEdit, editing = false }) => {
  const displayValue = value !== null && value !== undefined ? value : "—";
  
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        marginBottom: "1rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f9f9f9"
      }}
    >
      <div>
        <h3 style={{ margin: 0, marginBottom: "0.25rem", fontSize: "1rem", fontWeight: "bold" }}>
          {label}
        </h3>
        <p style={{ margin: 0, fontSize: "1.25rem", color: "#333" }}>
          {displayValue} {unit && <span style={{ fontSize: "0.9rem", color: "#666" }}>{unit}</span>}
        </p>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          disabled={editing}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: editing ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: editing ? "not-allowed" : "pointer"
          }}
        >
          {editing ? "Editing..." : "Edit"}
        </button>
      )}
    </div>
  );
};

export default GoalCard;

