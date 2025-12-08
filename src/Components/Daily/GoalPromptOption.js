import React from "react";

/**
 * Reusable prompt option button component
 * @param {string} title - Button title
 * @param {string} description - Button description
 * @param {function} onClick - Click handler
 * @param {boolean} disabled - Whether button is disabled
 */
const GoalPromptOption = ({ title, description, onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        maxWidth: "400px",
        padding: "2rem",
        border: "2px solid #007bff",
        borderRadius: "8px",
        backgroundColor: disabled ? "#f0f0f0" : "white",
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left",
        transition: "all 0.2s",
        opacity: disabled ? 0.6 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = "#f0f8ff";
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = "white";
        }
      }}
    >
      <h3 style={{ margin: "0 0 0.5rem 0", color: "#007bff", fontSize: "1.25rem" }}>
        {title}
      </h3>
      <p style={{ margin: 0, color: "#666", fontSize: "0.95rem" }}>
        {description}
      </p>
    </button>
  );
};

export default GoalPromptOption;

