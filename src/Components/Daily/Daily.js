import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DailyTitle from "./DailyTitle";
import DailyInfo from "./DailyInfo";
import InputDailyExcercise from "./InputDailyExcercise";
import DailyCurr from "./DailyCurr";

export default function Daily({ currentUser }) {
  const [user, setUser] = useState({});
  const { username } = useParams();

  const handleCaloriesSubmit = (calories) => {
    console.log("Submitted calories:", calories);
    setUser((prevUser) => ({
      ...prevUser,
      dailyCalories: calories,
    }));
  };

  return (
    <>
      <h1>Daily Goals for {username}</h1>
      {currentUser ? (
        <>
          <DailyCurr user={user} />
          <DailyTitle onSubmit={handleCaloriesSubmit} />
          <DailyInfo />
          <InputDailyExcercise />
        </>
      ) : (
        <p>Please log in to view your daily goals.</p>
      )}
    </>
  );
}


