import React, { useState, useEffect } from "react";
import { getAllPeople, People } from "../../Services/People";
import { getTodaysLogs } from "../../Services/Logs";
import { STAT_COLORS } from "../../Utils/colors";


import FoodLog from "./FoodLog";
import ExerciseLog from "./ExerciseLog";
import "./Log.css";

export default function Log({ currentUser }) {
  const [people, setPeople] = useState([]);
  const [todaysLog, setTodaysLog] = useState(null);
  const [view, setView] = useState("none");

  useEffect(() => {
    if (People.collection.length) {
      setPeople(People.collection);
    } else {
      getAllPeople().then((peopleData) => {
        setPeople(peopleData || []);
      });
    }
  }, []);

  useEffect(() => {
    if (currentUser) loadLogs();
  }, [currentUser]);

  async function loadLogs() {
    const logs = await getTodaysLogs(currentUser);
    // getTodaysLogs returns array, but now it's a single DailyLog object
    setTodaysLog(logs.length > 0 ? logs[0] : null);
  }

  if (!currentUser) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Please log in to view this page.</p>
      </div>
    );
  }

  const trackedCalories = todaysLog?.get("trackedCalories") ?? 0;
  const trackedCardio = todaysLog?.get("trackedCardio") ?? 0;
  const trackedLift = todaysLog?.get("trackedLift") ?? 0;
  const hasData = trackedCalories > 0 || trackedCardio > 0 || trackedLift > 0;

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>
        Log for {currentUser.get("username")}
      </h1>

      {/* Action Buttons */}
      <div style={{ marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <button
          onClick={() => setView(view === "food" ? "none" : "food")}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: view === "food" ? "#28a745" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (view !== "food") {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {view === "food" ? "✓ Logging Food" : "Log Food"}
        </button>
        <button
          onClick={() => setView(view === "exercise" ? "none" : "exercise")}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: view === "exercise" ? "#28a745" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            if (view !== "exercise") {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {view === "exercise" ? "✓ Logging Exercise" : "Log Exercise"}
        </button>
      </div>

      {/* Forms */}
      {view === "food" && (
        <div style={{ marginBottom: "2rem" }}>
          <FoodLog currentUser={currentUser} onLogSubmitted={loadLogs} />
        </div>
      )}

      {view === "exercise" && (
        <div style={{ marginBottom: "2rem" }}>
          <ExerciseLog currentUser={currentUser} onLogSubmitted={loadLogs} />
        </div>
      )}

      {/* Today's Summary */}
      <div>
        <h2 style={{ marginBottom: "1rem" }}>Today's Summary</h2>
        {!hasData ? (
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "2rem",
              borderRadius: "8px",
              textAlign: "center",
              color: "#666"
            }}
          >
            <p style={{ margin: 0, fontSize: "1rem" }}>
              No logs yet today. Start logging food or exercise above!
            </p>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "2rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1.5rem"
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px"
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Calories
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: STAT_COLORS.CALORIES
                  }}
                >
                  {trackedCalories.toLocaleString()}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#999", marginTop: "0.25rem" }}>
                  cal
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px"
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Cardio
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: STAT_COLORS.CARDIO
                  }}
                >
                  {trackedCardio}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#999", marginTop: "0.25rem" }}>
                  min
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px"
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}
                >
                  Lifting
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: STAT_COLORS.LIFTING
                  }}
                >
                  {trackedLift}
                </div>
                <div style={{ fontSize: "0.9rem", color: "#999", marginTop: "0.25rem" }}>
                  min
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
