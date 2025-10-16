// Daily parent comp
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DailyTitle from "./DailyTitle.js";
import DailyInfo from "./DailyInfo.js";
import InputDailyExcercise from "./InputDailyExcercise.js";
import DailyCurr from "./DailyCurr.js";

export default function Daily({ currentUser }) {
  const [user, setUser] = useState({});
  const { username } = useParams();

// removed loading data with axios service to prepare for actual endpoint one.

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
      <DailyCurr user={user} />
      <DailyTitle onSubmit={handleCaloriesSubmit} />
      <DailyInfo />
      <InputDailyExcercise />
    </>
  );
};

