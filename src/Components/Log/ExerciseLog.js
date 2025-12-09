// src/components/Logging/ExerciseLog.js
import React, { useState } from "react";
import Parse from "parse";

export default function ExerciseLog({ currentUser, onLogSubmitted }) {
  const [exerciseType, setExerciseType] = useState("cardio");
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!duration) return;

    const Log = Parse.Object.extend("Logs");
    const log = new Log();

    log.set("user", currentUser);
    log.set("type", "exercise");
    log.set("exerciseType", exerciseType);
    log.set("duration", Number(duration));
    log.set("notes", notes);
    log.set("date", new Date());

    await log.save();
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
