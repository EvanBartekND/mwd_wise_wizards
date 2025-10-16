import React from "react";

const InputDailyExercise = () => {
  return (
    <div>
      <h1>Exercise Goals</h1>

      <h2>Input your Desired Cardio time in minutes</h2>
      <input type="number" /> <button>Submit</button>

      <h2>Input your Desired Lifting time in minutes</h2>
      <input type="number" /> <button>Submit</button>
    </div>
  );
};

export default InputDailyExercise;
