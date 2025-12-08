import React from "react";

/**
 * Reusable stat card component for displaying statistics
 * @param {string} title - Card title
 * @param {string|number} value - Stat value
 * @param {string} unit - Unit to display (e.g., "calories", "min")
 * @param {string} subtitle - Optional subtitle
 * @param {string} color - Optional color theme
 */
const StatCard = ({ title, value, unit = "", subtitle = "", color = "#007bff" }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1.5rem",
        backgroundColor: "white",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        minWidth: "200px",
        flex: "1"
      }}
    >
      <h3
        style={{
          margin: "0 0 0.5rem 0",
          fontSize: "0.9rem",
          fontWeight: "500",
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: "0.5px"
        }}
      >
        {title}
      </h3>
      <div
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          color: color,
          marginBottom: "0.25rem"
        }}
      >
        {value}
        {unit && <span style={{ fontSize: "1rem", color: "#666", marginLeft: "0.25rem" }}>{unit}</span>}
      </div>
      {subtitle && (
        <p style={{ margin: 0, fontSize: "0.85rem", color: "#999" }}>{subtitle}</p>
      )}
    </div>
  );
};

export default StatCard;

