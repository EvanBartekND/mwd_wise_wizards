import React, { useState, useEffect } from "react";
import { getAllPeople, People } from "../../Services/People";

export default function Log({ currentUser }) {
  const [people, setPeople] = useState([]);

  // Run on mount: get people data (cached if available)
  useEffect(() => {
    if (People.collection.length) {
      setPeople(People.collection);
    } else {
      getAllPeople().then((peopleData) => {
        console.log(peopleData);
        setPeople(peopleData || []);
      });
    }
  }, []);

  if (!currentUser) {
    return <p>Please log in to view the log page.</p>;
  }

  return (
    <div>
      <h1>{currentUser.get("username")}'s Logging Page</h1>
      <h2>Click what you want to log</h2>
      <button>calories</button>
      <button>cardio</button>
      <button>lifting</button>

      <h2>All People:</h2>
      <ul>
        {people.map((person) => (
          <li key={person.id}>{person.get("username")}</li>
        ))}
      </ul>
    </div>
  );
}
