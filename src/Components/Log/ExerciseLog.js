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
    <div
      style={{
        backgroundColor: "white",
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "2rem",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Log Exercise</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#333"
            }}
          >
            Exercise Type
          </label>
          <select
            value={exerciseType}
            onChange={(e) => setExerciseType(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              boxSizing: "border-box",
              backgroundColor: "white",
              cursor: "pointer"
            }}
          >
            <option value="cardio">Cardio</option>
            <option value="lifting">Lifting</option>
          </select>
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#333"
            }}
          >
            Duration
          </label>
          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              boxSizing: "border-box"
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              fontSize: "0.9rem",
              fontWeight: "500",
              color: "#333"
            }}
          >
            Notes (Optional)
          </label>
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "1rem",
              boxSizing: "border-box",
              minHeight: "80px",
              fontFamily: "inherit",
              resize: "vertical"
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            width: "100%",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.9";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Add Exercise
        </button>
      </form>
    </div>
  );
}
