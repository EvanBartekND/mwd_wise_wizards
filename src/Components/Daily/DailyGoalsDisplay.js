import React, { useState } from "react";
import GoalCard from "./GoalCard";
import GoalInput from "./GoalInput";

/**
 * Display component for current daily goals with edit capability
 * @param {object} goals - Goals object
 * @param {function} onUpdateGoal - Callback to update a goal
 * @param {function} onSaveGoal - Callback to save a goal
 */
const DailyGoalsDisplay = ({ goals, onUpdateGoal, onSaveGoal }) => {
  const [editingGoal, setEditingGoal] = useState(null);

  const handleEdit = (goalKey) => {
    setEditingGoal(editingGoal === goalKey ? null : goalKey);
  };

  const handleSave = async (goalKey, value) => {
    if (onSaveGoal) {
      await onSaveGoal(goalKey, value);
    }
    setEditingGoal(null);
  };

  const goalConfigs = [
    {
      key: "calorieGoal",
      label: "Daily Calorie Goal",
      unit: "calories",
      value: goals?.calorieGoal
    },
    {
      key: "cardioGoal",
      label: "Daily Cardio Goal",
      unit: "minutes",
      value: goals?.cardioGoal
    },
    {
      key: "liftGoal",
      label: "Daily Lifting Goal",
      unit: "minutes",
      value: goals?.liftGoal
    }
  ];

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Your Current Daily Goals</h2>
      
      {goalConfigs.map(({ key, label, unit, value }) => (
        <div key={key}>
          {editingGoal === key ? (
            <GoalInput
              label={label}
              type="number"
              value={value || ""}
              onChange={(newValue) => onUpdateGoal && onUpdateGoal(key, newValue)}
              onSave={(newValue) => handleSave(key, newValue)}
              unit={unit}
              validation={(val) => {
                if (val === null || val === undefined || val === "") {
                  return { isValid: false, errors: ["This field is required"] };
                }
                if (typeof val === "number" && val < 0) {
                  return { isValid: false, errors: ["Value must be positive"] };
                }
                return { isValid: true, errors: [] };
              }}
            />
          ) : (
            <GoalCard
              label={label}
              value={value}
              unit={unit}
              onEdit={() => handleEdit(key)}
              editing={editingGoal === key}
            />
          )}
        </div>
      ))}

      {goals?.goalsLastUpdated && (
        <p style={{ marginTop: "1rem", color: "#666", fontSize: "0.9rem" }}>
          Last updated: {new Date(goals.goalsLastUpdated).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default DailyGoalsDisplay;

