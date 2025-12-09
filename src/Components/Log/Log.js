import React, { useState, useEffect } from "react";
import { getAllPeople, People } from "../../Services/People";
import { getTodaysLogs } from "../../Services/Logs";


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
    return <p>Please log in to view this page.</p>;
  }

  const trackedCalories = todaysLog?.get("trackedCalories") ?? 0;
  const trackedCardio = todaysLog?.get("trackedCardio") ?? 0;
  const trackedLift = todaysLog?.get("trackedLift") ?? 0;
  const hasData = trackedCalories > 0 || trackedCardio > 0 || trackedLift > 0;

  return (
    <div>
      <h1>{currentUser.get("username")}'s Logging Page</h1>

      <h2>Click what you want to log</h2>
      <button onClick={() => setView("food")}>Log Food</button>
      <button onClick={() => setView("exercise")}>Log Exercise</button>
      <button onClick={() => setView("none")}>Hide</button>

      {view === "food" && (
        <FoodLog currentUser={currentUser} onLogSubmitted={loadLogs} />
      )}

      {view === "exercise" && (
        <ExerciseLog currentUser={currentUser} onLogSubmitted={loadLogs} />
      )}

      <h2>Today's Summary</h2>
      {!hasData ? (
        <p>No logs yet today. Start logging food or exercise above!</p>
      ) : (
        <div style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "1.5rem", 
          borderRadius: "8px",
          maxWidth: "500px"
        }}>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.25rem" }}>
              Calories
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#007bff" }}>
              {trackedCalories.toLocaleString()} cal
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.25rem" }}>
              Cardio
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#28a745" }}>
              {trackedCardio} min
            </div>
          </div>
          <div>
            <div style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.25rem" }}>
              Lifting
            </div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#dc3545" }}>
              {trackedLift} min
            </div>
          </div>
        </div>
      )}

      <h2>All People:</h2>
      <ul>
        {people.map((person) => (
          <li key={person.id}>{person.get("username")}</li>
        ))}
      </ul>
    </div>
  );
}
