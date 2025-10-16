import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup({ setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter a username.");
      return;
    }

    // Create new user
    const newUser = { userName: username };
    setCurrentUser(newUser);
    setError("");
    navigate(`/daily/${username}`);
  };

  return (
    <div>
      <h2>Create Account</h2>
      <form onSubmit={handleSignup}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <button type="submit">Create Account</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
