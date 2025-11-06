import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Main from "./Main/Main";
import Daily from "./Daily/Daily";
import Log from "./Log/Log";
import Trends from "./Trends/Trends";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import AuthModule from "./Auth/Auth.js";
import { getCurrentUser } from "../Services/AuthService";

export default function Components() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setCurrentUser(getCurrentUser());
  }, []);

  return (
    <Router>
      {currentUser && <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />}

      <div>
        <Routes>
          {/* Default route redirects to auth or main */}
          <Route
            path="/"
            element={
              currentUser ? (
                <Navigate to="/main" replace />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* Auth module */}
          <Route path="/auth/*" element={<AuthModule setCurrentUser={setCurrentUser} />} />

          {/* Main page */}
          <Route
            path="/main"
            element={
              currentUser ? (
                <Main currentUser={currentUser} />
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />

          {/* Protected routes */}
          <Route
            path="/daily/:username"
            element={<ProtectedRoute element={Daily} currentUser={currentUser} />}
          />
          <Route
            path="/log/:username"
            element={<ProtectedRoute element={Log} currentUser={currentUser} />}
          />
          <Route
            path="/trends/:username"
            element={<ProtectedRoute element={Trends} currentUser={currentUser} />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
