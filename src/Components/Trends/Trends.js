import React, { useState, useEffect } from "react";
import { getAllDays, Days } from "../../Services/Days";

export default function Log({ currentUser }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    if (!currentUser) return; // don't load if no user

    if (Days.collection.length) {
      setDays(Days.collection);
    } else {
      getAllDays().then((fetchedDays) => {
        console.log(fetchedDays);
        setDays(fetchedDays || []);
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return <p>Please log in to view your logging page.</p>;
  }

  return (
    <div>
      <h1>{currentUser.get("username")}'s Logging Page</h1>
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
}
