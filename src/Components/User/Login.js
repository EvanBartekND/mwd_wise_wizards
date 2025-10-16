import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setCurrentUser }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username) {
      setError("Please enter a username.");
      return;
    }

    // Log in as this user (no user list)
    setCurrentUser({ userName: username });
    setError("");
    navigate(`/daily/${username}`);
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
