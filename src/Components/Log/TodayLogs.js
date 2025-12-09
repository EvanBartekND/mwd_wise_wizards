import React from "react";

export default function TodayLogs({ foodLogs, exerciseLogs }) {
  return (
    <div>
      <h2>Today's Logs</h2>

      <h3>Food</h3>
      {foodLogs.length === 0 && <p>No food logged yet.</p>}
      <ul>
        {foodLogs.map((f, index) => (
          <li key={index}>
            {f.food} — {f.calories} calories
          </li>
        ))}
      </ul>

      <h3>Exercise</h3>
      {exerciseLogs.length === 0 && <p>No exercise logged yet.</p>}
      <ul>
        {exerciseLogs.map((e, index) => (
          <li key={index}>
            {e.type} — {e.duration} min — {e.caloriesBurned} calories burned
          </li>
        ))}
      </ul>
    </div>
  );
}
