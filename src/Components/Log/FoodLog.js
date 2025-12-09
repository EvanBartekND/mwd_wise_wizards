import React, { useState } from "react";
import Parse from "parse";

const API_KEY = "5ccp4E8Y19irErPjmCowx7Mav4xcOvc3rzScgMWQ"; // Your USDA API key

async function searchFoods(query) {
  if (!query || query.length < 3) return [];

  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("USDA API request failed");
  }

  const data = await response.json();
  return data.foods || [];
}

async function getFoodDetails(fdcId) {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${API_KEY}`
  );

  if (!response.ok) {
    throw new Error("USDA API request failed");
  }

  return response.json();
}

export default function FoodLog({ currentUser, onLogSaved }) {
  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [manualCalorieEntry, setManualCalorieEntry] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setFoodName(query);

    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchFoods(query);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const selectFood = async (item) => {
    setFoodName(item.description);
    setSearchResults([]);
    setCalories("");
    setManualCalorieEntry(false);

    try {
      const details = await getFoodDetails(item.fdcId);

      console.log("Food Nutrients:", details.foodNutrients);

      // Find calorie nutrient (number 208, unit kcal)
      const energy = details.foodNutrients?.find((n) => {
        const nutrientNumber = n.number?.toString() || n.nutrientNumber?.toString() || "";
        const unitName = (n.unitName || "").toLowerCase();

        return nutrientNumber === "208" && (unitName === "kcal" || unitName === "kcal");
      });

      if (energy && energy.amount) {
        setCalories(energy.amount.toString());
        setManualCalorieEntry(false);
      } else {
        setCalories("");
        setManualCalorieEntry(true);
      }
    } catch (err) {
      console.error("Failed to get food details", err);
      setCalories("");
      setManualCalorieEntry(true);
    }
  };

  const saveFoodLog = async () => {
    if (!foodName || !calories) {
      alert("Please enter food name and calories.");
      return;
    }

    try {
      const FoodLog = Parse.Object.extend("FoodLogs");
      const log = new FoodLog();

      log.set("user", currentUser);
      log.set("foodName", foodName);
      log.set("calories", Number(calories));
      log.set("date", new Date());

      await log.save();

      alert("Food logged!");
      setFoodName("");
      setCalories("");
      setSearchResults([]);
      setManualCalorieEntry(false);

      if (onLogSaved) onLogSaved();
    } catch (err) {
      console.error("Error saving food log:", err);
      alert("Failed to save food log");
    }
  };

  return (
    <div className="log-box">
      <h2>Log Food</h2>

      <input
        placeholder="Search food..."
        value={foodName}
        onChange={handleSearch}
        autoComplete="off"
      />

      {loading && <p>Searching...</p>}

      {searchResults.length > 0 && (
        <ul className="search-results">
          {searchResults.map((item) => (
            <li
              key={item.fdcId}
              onClick={() => selectFood(item)}
              style={{
                cursor: "pointer",
                padding: "8px",
                borderBottom: "1px solid #eee",
              }}
            >
              {item.description}
            </li>
          ))}
        </ul>
      )}

      <input
        placeholder="Calories"
        type="number"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        disabled={!manualCalorieEntry ? true : false}
      />
      {manualCalorieEntry && <p>Please enter calories manually.</p>}

      <button onClick={saveFoodLog}>Add Food</button>
    </div>
  );
}




