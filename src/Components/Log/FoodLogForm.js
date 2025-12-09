import React, { useState, useEffect } from "react";
import { getAllPeople, People } from "../../Services/People";
import FoodLogForm from "./FoodLogForm";
import ExerciseLogForm from "./ExerciseLogForm";
import TodayLogs from "./TodayLogs";


export default function Log({ currentUser }) {
  const [people, setPeople] = useState([]);
  const [foodLogs, setFoodLogs] = useState([]);
  const [exerciseLogs, setExerciseLogs] = useState([]);

  // load user data (unchanged from your People service)
  useEffect(() => {
    if (People.collection.length) {
      setPeople(People.collection);
    } else {
      getAllPeople().then((peopleData) => {
        setPeople(peopleData || []);
      });
    }
  }, []);

  if (!currentUser) {
    return (
      <p className="daily-message">
        Please log in to view your daily logs.
      </p>
    );
  }

  // Only allow logs for today's date
  const today = new Date().toISOString().split("T")[0];

  const addFoodLog = (entry) => {
    setFoodLogs((prev) => [...prev, { ...entry, date: today }]);
  };

  const addExerciseLog = (entry) => {
    setExerciseLogs((prev) => [...prev, { ...entry, date: today }]);
  };

  return (
    <div className="daily-container">
      <h1 className="daily-header">
        {currentUser.get("username")}'s Logging Page
      </h1>

      <div className="daily-card">
        <TodayLogs foodLogs={foodLogs} exerciseLogs={exerciseLogs} />
      </div>

      <div className="daily-card">
        <FoodLogForm onSubmit={addFoodLog} />
      </div>

      <div className="daily-card">
        <ExerciseLogForm onSubmit={addExerciseLog} />
      </div>

      <div className="daily-card">
        <h2>All People (Dev Tool)</h2>
        <ul>
          {people.map((person) => (
            <li key={person.id}>{person.get("username")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
