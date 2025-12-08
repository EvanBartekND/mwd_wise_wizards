import React from "react";
import StatCard from "./StatCard";
import ProgressBar from "./ProgressBar";

/**
 * Weekly dashboard component showing aggregated statistics
 * @param {object} aggregates - Weekly aggregates data
 * @param {object} goals - User goals for comparison
 */
const WeeklyDashboard = ({ aggregates, goals }) => {
  if (!aggregates) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "#666" }}>
        Loading weekly statistics...
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: "1.5rem" }}>Weekly Summary</h2>
      
      {/* Stat Cards Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem"
        }}
      >
        <StatCard
          title="Average Calories"
          value={aggregates.avgCalories || 0}
          unit="cal"
          subtitle={`Total: ${aggregates.totalCalories?.toLocaleString() || 0} cal`}
          color="#007bff"
        />
        <StatCard
          title="Average Cardio"
          value={aggregates.avgCardio || 0}
          unit="min"
          subtitle={`Total: ${aggregates.totalCardio || 0} min`}
          color="#28a745"
        />
        <StatCard
          title="Average Lifting"
          value={aggregates.avgLift || 0}
          unit="min"
          subtitle={`Total: ${aggregates.totalLift || 0} min`}
          color="#dc3545"
        />
        <StatCard
          title="Days Logged"
          value={aggregates.daysWithData || 0}
          unit="/ 7"
          subtitle="This week"
          color="#6c757d"
        />
      </div>

      {/* Progress Bars */}
      {goals && (
        <div style={{ backgroundColor: "#f8f9fa", padding: "1.5rem", borderRadius: "8px" }}>
          <h3 style={{ marginTop: 0, marginBottom: "1rem" }}>Progress Toward Goals</h3>
          
          {goals.calorieGoal && (
            <ProgressBar
              value={aggregates.avgCalories || 0}
              max={goals.calorieGoal}
              label="Average Calories"
              unit="cal"
              showPercentage={true}
            />
          )}
          
          {goals.cardioGoal && (
            <ProgressBar
              value={aggregates.avgCardio || 0}
              max={goals.cardioGoal}
              label="Average Cardio"
              unit="min"
              showPercentage={true}
            />
          )}
          
          {goals.liftGoal && (
            <ProgressBar
              value={aggregates.avgLift || 0}
              max={goals.liftGoal}
              label="Average Lifting"
              unit="min"
              showPercentage={true}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyDashboard;

