import React, { useState } from "react";
import { createFoodLog } from "../../Services/Logs";

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

export default function FoodLog({ currentUser, onLogSubmitted }) {
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
      await createFoodLog(currentUser, foodName, calories);

      alert("Food logged!");
      setFoodName("");
      setCalories("");
      setSearchResults([]);
      setManualCalorieEntry(false);

      if (onLogSubmitted) onLogSubmitted();
    } catch (err) {
      console.error("Error saving food log:", err);
      alert("Failed to save food log");
    }
  };

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
      <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Log Food</h2>

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
          Search for Food
        </label>
        <input
          placeholder="Search food..."
          value={foodName}
          onChange={handleSearch}
          autoComplete="off"
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

      {loading && (
        <p style={{ color: "#666", fontSize: "0.9rem", marginTop: "-0.5rem", marginBottom: "1rem" }}>
          Searching...
        </p>
      )}

      {searchResults.length > 0 && (
        <div
          style={{
            marginBottom: "1rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "white"
          }}
        >
          {searchResults.map((item) => (
            <div
              key={item.fdcId}
              onClick={() => selectFood(item)}
              style={{
                cursor: "pointer",
                padding: "0.75rem",
                borderBottom: "1px solid #eee",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f8f9fa")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
            >
              {item.description}
            </div>
          ))}
        </div>
      )}

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
          Calories
        </label>
        <input
          placeholder="Calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          disabled={!manualCalorieEntry}
          style={{
            width: "100%",
            padding: "0.75rem",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "1rem",
            boxSizing: "border-box",
            backgroundColor: manualCalorieEntry ? "white" : "#f8f9fa",
            cursor: manualCalorieEntry ? "text" : "not-allowed"
          }}
        />
        {manualCalorieEntry && (
          <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.25rem", marginBottom: 0 }}>
            Please enter calories manually.
          </p>
        )}
      </div>

      <button
        onClick={saveFoodLog}
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
        Add Food
      </button>
    </div>
  );
}




