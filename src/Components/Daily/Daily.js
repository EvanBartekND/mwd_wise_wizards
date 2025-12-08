import React, { useState } from "react";
import DailyTitle from "./DailyTitle";
import "./Daily.css";
import DailyInfo from "./DailyInfo";
import InputDailyExcercise from "./InputDailyExcercise";
import DailyCurr from "./DailyCurr";

export default function Daily({ currentUser }) {
  const [user, setUser] = useState({});

  const handleCaloriesSubmit = (calories) => {
    console.log("Submitted calories:", calories);
    setUser((prevUser) => ({
      ...prevUser,
      dailyCalories: calories,
    }));
  };

  if (!currentUser) {
    return <p className="daily-message">Please log in to view your daily goals.</p>;
  }

  return (
    <div className="daily-container">
      <h1 className="daily-header">Daily Goals for {currentUser.get("username")}</h1>

      <div className="daily-card">
        <DailyCurr user={user} />
      </div>

      <div className="daily-card">
        <DailyTitle onSubmit={handleCaloriesSubmit} />
      </div>

      <div className="daily-card">
        <DailyInfo />
      </div>

      <div className="daily-card">
        <InputDailyExcercise />
      </div>
    </div>
  );
}
