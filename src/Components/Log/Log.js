import React, { useState, useEffect } from "react";
import { getAllPeople, People } from "../../Services/People";
import { getTodaysLogs } from "../../Services/Logs";


import FoodLog from "./FoodLog";
import ExerciseLog from "./ExerciseLog";
import "./Log.css";

export default function Log({ currentUser }) {
  const [people, setPeople] = useState([]);
  const [todaysLogs, setTodaysLogs] = useState([]);
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
    setTodaysLogs(logs);
  }

  if (!currentUser) {
    return <p>Please log in to view this page.</p>;
  }

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

      <h2>Today's Logs</h2>
      {todaysLogs.length === 0 ? (
        <p>No logs yet today.</p>
      ) : (
        <ul>
          {todaysLogs.map((log) => (
            <li key={log.id}>
              {log.get("type") === "food" ? (
                <>
                  <strong>Food:</strong> {log.get("food")} —{" "}
                  {log.get("calories")} cal
                </>
              ) : (
                <>
                  <strong>Exercise:</strong> {log.get("exerciseType")} —{" "}
                  {log.get("duration")} min
                </>
              )}
            </li>
          ))}
        </ul>
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
