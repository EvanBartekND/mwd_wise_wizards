import React, { useState } from "react";
import CalculationPreview from "./CalculationPreview";
import { calculateGoalsFromBodyData, ACTIVITY_LEVELS, WEIGHT_GOAL_RATES } from "../../Utils/calculations";

/**
 * Calorie calculator component
 * @param {object} bodyData - Body data for calculations
 * @param {function} onSaveCalculatedGoals - Callback to save calculated goals
 */
const CalorieCalculator = ({ bodyData, onSaveCalculatedGoals }) => {
  const [calculationMethod, setCalculationMethod] = useState("withBodyFat");
  const [weightGoalType, setWeightGoalType] = useState("maintain");
  const [weightGoalRate, setWeightGoalRate] = useState("regular");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [calculationResults, setCalculationResults] = useState(null);

  const handleCalculate = () => {
    // Validate body data
    if (!bodyData.weight_kg || !bodyData.height_cm || !bodyData.age_years) {
      alert("Please fill in height, weight, and age to calculate goals.");
      return;
    }

    if (calculationMethod === "withBodyFat" && !bodyData.bodyFat_percent) {
      alert("Please enter body fat percentage or switch to the standard calculation method.");
      return;
    }

    if (calculationMethod === "withoutBodyFat" && !bodyData.gender) {
      alert("Please select gender for the standard calculation method.");
      return;
    }

    // Use body fat if method is "withBodyFat" and body fat is provided
    const dataForCalc = calculationMethod === "withBodyFat" 
      ? bodyData 
      : { ...bodyData, bodyFat_percent: null };

    const results = calculateGoalsFromBodyData(
      dataForCalc,
      weightGoalType,
      weightGoalRate,
      activityLevel
    );

    if (results.error) {
      alert(results.error);
      return;
    }

    setCalculationResults(results);
  };

  const handleSave = async () => {
    if (!calculationResults) {
      alert("Please calculate first before saving.");
      return;
    }

    if (onSaveCalculatedGoals) {
      await onSaveCalculatedGoals({
        calorieGoal: calculationResults.calorieGoal,
        weightGoalType: calculationResults.weightGoalType,
        weightGoalRate: calculationResults.weightGoalRate
      });
    }
  };

  return (
    <div>
      <h2>Calculate Your Calorie Goals</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Choose your calculation method and preferences, then calculate your recommended daily calorie goal.
      </p>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Calculation Method
        </label>
        <div style={{ display: "flex", gap: "1rem" }}>
          <label>
            <input
              type="radio"
              value="withBodyFat"
              checked={calculationMethod === "withBodyFat"}
              onChange={(e) => setCalculationMethod(e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            With Body Fat % (More Accurate)
          </label>
          <label>
            <input
              type="radio"
              value="withoutBodyFat"
              checked={calculationMethod === "withoutBodyFat"}
              onChange={(e) => setCalculationMethod(e.target.value)}
              style={{ marginRight: "0.5rem" }}
            />
            Standard Method
          </label>
        </div>
        <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "0.5rem" }}>
          {calculationMethod === "withBodyFat"
            ? "Uses Lean Body Mass (LBM) calculation for higher accuracy"
            : "Uses Mifflin-St Jeor equation (requires gender)"}
        </p>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Weight Goal
        </label>
        <select
          value={weightGoalType}
          onChange={(e) => setWeightGoalType(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem", marginRight: "1rem" }}
        >
          <option value="loss">Weight Loss</option>
          <option value="maintain">Weight Maintenance</option>
          <option value="gain">Weight Gain</option>
        </select>
      </div>

      {weightGoalType !== "maintain" && (
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
            Rate
          </label>
          <select
            value={weightGoalRate}
            onChange={(e) => setWeightGoalRate(e.target.value)}
            style={{ padding: "0.5rem", fontSize: "1rem" }}
          >
            <option value="slow">Slow ({weightGoalType === "loss" ? "-" : "+"}250 cal/day)</option>
            <option value="regular">Regular ({weightGoalType === "loss" ? "-" : "+"}500 cal/day)</option>
            <option value="aggressive">Aggressive ({weightGoalType === "loss" ? "-" : "+"}1000 cal/day)</option>
          </select>
        </div>
      )}

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
          Activity Level
        </label>
        <select
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem", width: "100%", maxWidth: "300px" }}
        >
          <option value="sedentary">Sedentary (little/no exercise)</option>
          <option value="light">Light (exercise 1-3 days/week)</option>
          <option value="moderate">Moderate (exercise 3-5 days/week)</option>
          <option value="active">Active (exercise 6-7 days/week)</option>
          <option value="veryActive">Very Active (hard exercise daily)</option>
        </select>
      </div>

      <button
        onClick={handleCalculate}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem",
          marginRight: "1rem"
        }}
      >
        Calculate Goals
      </button>

      {calculationResults && (
        <>
          <CalculationPreview
            bmr={calculationResults.BMR}
            tdee={calculationResults.TDEE}
            calorieGoal={calculationResults.calorieGoal}
            weightGoalType={calculationResults.weightGoalType}
          />
          <button
            onClick={handleSave}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
              marginTop: "1rem"
            }}
          >
            Save Calculated Goals
          </button>
        </>
      )}
    </div>
  );
};

export default CalorieCalculator;

