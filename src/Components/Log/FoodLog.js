// src/components/Logging/FoodLog.js
import React, { useState } from "react";
import Parse from "parse";

export default function FoodLog({ currentUser, onLogSubmitted }) {
  const [food, setFood] = useState("");
  const [calories, setCalories] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!food || !calories) return;

    const Log = Parse.Object.extend("Logs");
    const log = new Log();

    log.set("user", currentUser);
    log.set("type", "food");
    log.set("food", food);
    log.set("calories", Number(calories));
    log.set("date", new Date());

    await log.save();
    onLogSubmitted(); 
    setFood("");
    setCalories("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Log Food</h3>

      <input
        type="text"
        placeholder="Food item"
        value={food}
        onChange={(e) => setFood(e.target.value)}
      />

      <input
        type="number"
        placeholder="Calories"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
      />

      <button type="submit">Add Food</button>
    </form>
  );
}
