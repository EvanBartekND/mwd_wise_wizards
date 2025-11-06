import React, { useState } from "react";
import DailyTitle from "./DailyTitle";
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
    return <p>Please log in to view your daily goals.</p>;
  }

  return (
    <>
      <h1>Daily Goals for {currentUser.get("username")}</h1>
      <DailyCurr user={user} />
      <DailyTitle onSubmit={handleCaloriesSubmit} />
      <DailyInfo />
      <InputDailyExcercise />
    </>
  );
}
