import React, { useState } from "react";
import AuthLogin from "./AuthLogin.js";
import AuthRegister from "./AuthRegister.js";

const AuthModule = ({ setCurrentUser }) => {
  const [mode, setMode] = useState("login");

  return (
    <div>
      <h2>Welcome! Please log in or register</h2>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setMode("login")} disabled={mode === "login"}>
          Login
        </button>
        &nbsp;
        <button onClick={() => setMode("register")} disabled={mode === "register"}>
          Register
        </button>
      </div>

      <div>
        {mode === "login" ? (
          <AuthLogin setCurrentUser={setCurrentUser} />
        ) : (
          <AuthRegister setCurrentUser={setCurrentUser} />
        )}
      </div>
    </div>
  );
};

export default AuthModule;
