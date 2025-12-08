import React from "react";

/**
 * Component to display calculation preview results
 * @param {number} bmr - Basal Metabolic Rate
 * @param {number} tdee - Total Daily Energy Expenditure
 * @param {number} calorieGoal - Calculated calorie goal
 * @param {string} weightGoalType - Weight goal type (gain/loss/maintain)
 */
const CalculationPreview = ({ bmr, tdee, calorieGoal, weightGoalType }) => {
  if (!bmr || !tdee || !calorieGoal) {
    return null;
  }

  const goalTypeLabels = {
    loss: "Weight Loss",
    gain: "Weight Gain",
    maintain: "Weight Maintenance"
  };

  return (
    <div
      style={{
        border: "2px solid #007bff",
        borderRadius: "8px",
        padding: "1.5rem",
        backgroundColor: "#f0f8ff",
        marginTop: "1rem"
      }}
    >
      <h3 style={{ marginTop: 0, color: "#007bff" }}>Calculation Results</h3>
      
      <div style={{ marginBottom: "0.75rem" }}>
        <strong>Basal Metabolic Rate (BMR):</strong>{" "}
        <span style={{ fontSize: "1.1rem", color: "#333" }}>{bmr.toLocaleString()} calories/day</span>
        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#666" }}>
          Calories your body burns at rest
        </p>
      </div>

      <div style={{ marginBottom: "0.75rem" }}>
        <strong>Total Daily Energy Expenditure (TDEE):</strong>{" "}
        <span style={{ fontSize: "1.1rem", color: "#333" }}>{tdee.toLocaleString()} calories/day</span>
        <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#666" }}>
          Total calories burned including activity
        </p>
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "4px",
          border: "1px solid #007bff"
        }}
      >
        <strong style={{ fontSize: "1.1rem" }}>Recommended Daily Calorie Goal:</strong>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#007bff", marginTop: "0.5rem" }}>
          {calorieGoal.toLocaleString()} calories/day
        </div>
        {weightGoalType && (
          <p style={{ margin: "0.5rem 0 0 0", color: "#666" }}>
            For {goalTypeLabels[weightGoalType] || weightGoalType}
          </p>
        )}
      </div>
    </div>
  );
};

export default CalculationPreview;

