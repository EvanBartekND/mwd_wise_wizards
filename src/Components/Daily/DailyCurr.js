// comp for Disp current goals per user
import React from "react";

//This will display all of the goals per said user 
const DailyCurr = ({ user }) => {
  return (
    <div>
      <h2>Your Current Daily Goals</h2>
      <p><strong>Name:</strong> {user.userName || "—"}</p>
      <p><strong>Calorie Goal:</strong> {user.dailyCalories || "—"}</p>
      <p><strong>Cardio Minute Goal:</strong> {user.dailyCardioMinutes || "—"}</p>
      <p><strong>Lift Minute Goal:</strong> {user.dailyLiftMinutes || "—"}</p>
    </div>
  );
};

export default DailyCurr;
