import React, { useState, useEffect } from "react";
import { getAllDays, Days } from "../../Services/Days";

export default function Log ({username}) {
  const [days, setDays] = useState([]);

  // UseEffect to run when the page loads to
  // obtain async data and render
  useEffect(() => {
    if (Days.collection.length) {
      setDays(Days.collection);
    } else {
      getAllDays().then((days) => {
        console.log(days);
        setDays(days || []);      });
    }
  }, []);

  return (
    <div>
      <h1>Logging Page</h1>
      <h2>Click what you want to log</h2>
      <button>calories</button>
      <button>cardio</button>
      <button>lifting</button>

      <h2>All Days:</h2>
      <ul>
        {days.map((day) => (
          <li key={day.id}>{day.get("username")}</li>
        ))}
      </ul>
    </div>
  );
};

