import React, { useState } from "react";

const DailyTitle = ({ onSubmit }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => setValue(e.target.value);

  const handleSubmit = () => {
    if (onSubmit) onSubmit(value);
    setValue("");
  };

  return (
    <div>
      <h2>Input your Desired Daily Calorie Intake</h2>
      <input value={value} onChange={handleChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default DailyTitle;
