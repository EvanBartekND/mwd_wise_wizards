import React, { useState } from "react";
import GoalInput from "./GoalInput";

/**
 * Manual goal input form component
 * @param {function} onSave - Callback to save goals
 * @param {object} initialValues - Initial goal values
 */
const DailyGoalsForm = ({ onSave, initialValues = {} }) => {
  const [goals, setGoals] = useState({
    calorieGoal: initialValues.calorieGoal || null,
    cardioGoal: initialValues.cardioGoal || null,
    liftGoal: initialValues.liftGoal || null
  });

  const handleGoalChange = (key, value) => {
    setGoals((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key, value) => {
    if (onSave) {
      await onSave({ [key]: value });
    }
  };

  return (
    <div>
      <h2>Set Your Daily Goals</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Enter your desired daily targets below. Changes are saved automatically.
      </p>

      <GoalInput
        label="Daily Calorie Goal"
        type="number"
        value={goals.calorieGoal || ""}
        onChange={(value) => handleGoalChange("calorieGoal", value)}
        onSave={(value) => handleSave("calorieGoal", value)}
        unit="calories"
        placeholder="e.g., 2000"
        validation={(val) => {
          if (val === null || val === undefined || val === "") {
            return { isValid: false, errors: ["Please enter a calorie goal"] };
          }
          if (val < 1000 || val > 10000) {
            return { isValid: false, errors: ["Calorie goal should be between 1000-10000"] };
          }
          return { isValid: true, errors: [] };
        }}
      />

      <GoalInput
        label="Daily Cardio Goal"
        type="number"
        value={goals.cardioGoal || ""}
        onChange={(value) => handleGoalChange("cardioGoal", value)}
        onSave={(value) => handleSave("cardioGoal", value)}
        unit="minutes"
        placeholder="e.g., 30"
        validation={(val) => {
          if (val !== null && val !== undefined && val !== "" && val < 0) {
            return { isValid: false, errors: ["Minutes must be positive"] };
          }
          return { isValid: true, errors: [] };
        }}
      />

      <GoalInput
        label="Daily Lifting Goal"
        type="number"
        value={goals.liftGoal || ""}
        onChange={(value) => handleGoalChange("liftGoal", value)}
        onSave={(value) => handleSave("liftGoal", value)}
        unit="minutes"
        placeholder="e.g., 45"
        validation={(val) => {
          if (val !== null && val !== undefined && val !== "" && val < 0) {
            return { isValid: false, errors: ["Minutes must be positive"] };
          }
          return { isValid: true, errors: [] };
        }}
      />
    </div>
  );
};

export default DailyGoalsForm;

