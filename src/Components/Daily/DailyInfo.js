import React from "react";

const DailyInfo = () => {
  return (
    <div>
      <h2>Or fill out your information and we'll calculate it</h2>

      <p>Height (Feet)</p>
      <input type="number" />

      <p>Weight</p>
      <input type="number" />

      <p>Estimated Body Fat</p>
      <select name="percentage" id="percentage">
        <option value="10">10%</option>
        <option value="15">15%</option>
        <option value="20">20%</option>
        <option value="25">25%</option>
        <option value="30">30%</option>
        <option value="35">35%</option>
        <option value="40">40%</option>
      </select>

      <button>Submit</button>
    </div>
  );
};

export default DailyInfo;
