// src/components/Logging/ExerciseLog.js
import React, { useState } from "react";
import { createExerciseLog } from "../../Services/Logs";

export default function ExerciseLog({ currentUser, onLogSubmitted }) {
  const [exerciseType, setExerciseType] = useState("cardio");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!duration) return;

    await createExerciseLog(currentUser, exerciseType, duration, notes);
    onLogSubmitted();
    setDuration("");
    setNotes("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Log Exercise</h3>

      <label>Exercise Type</label>
      <select
        value={exerciseType}
        onChange={(e) => setExerciseType(e.target.value)}
      >
        <option value="cardio">Cardio</option>
        <option value="lifting">Lifting</option>
      </select>

      <input
        type="number"
        placeholder="Duration (minutes)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />

      <textarea
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />

      <button type="submit">Add Exercise</button>
    </form>
  );
}
