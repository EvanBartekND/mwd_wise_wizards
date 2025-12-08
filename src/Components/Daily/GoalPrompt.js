import React from "react";
import GoalPromptOption from "./GoalPromptOption";

/**
 * Prompt component shown when user has no goals set
 * @param {function} onSelectMethod - Callback with "calculate" | "manual"
 */
const GoalPrompt = ({ onSelectMethod }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "2rem",
        gap: "1.5rem"
      }}
    >
      <h2 style={{ margin: 0, fontSize: "1.5rem", textAlign: "center" }}>
        Now Let's Set Your Calorie Goals
      </h2>
      <p style={{ color: "#666", textAlign: "center", marginBottom: "1rem" }}>
        Great! We have your body measurements. Choose how you'd like to set your calorie goals:
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          alignItems: "center"
        }}
      >
        <GoalPromptOption
          title="Calculate Automatically"
          description="We'll calculate your calorie goals based on your body measurements, activity level, and weight goals."
          onClick={() => onSelectMethod("calculate")}
        />

        <GoalPromptOption
          title="Enter Manually"
          description="Set your goals directly by entering your preferred calorie, cardio, and lifting targets."
          onClick={() => onSelectMethod("manual")}
        />
      </div>
    </div>
  );
};

export default GoalPrompt;

