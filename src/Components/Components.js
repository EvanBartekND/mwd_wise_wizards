import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Main from "./Main/Main";
import Daily from "./Daily/Daily";
import Log from "./Log/Log";
import Trends from "./Trends/Trends";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";

export default function Components() {
  // store the currently logged in user
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <Router>
      {/* Navbar displayed persistently */}
      <Navbar currentUser={currentUser} />

      <div>
        <Routes>
          {/* Public route: home/login */}
          <Route
            path="/"
            element={<Main currentUser={currentUser} setCurrentUser={setCurrentUser} />}
          />

          {/* Protected routes use our new element-based ProtectedRoute */}
          <Route
            path="/daily/:username"
            element={
              <ProtectedRoute element={Daily} currentUser={currentUser} />
            }
          />
          <Route
            path="/log/:username"
            element={
              <ProtectedRoute element={Log} currentUser={currentUser} />
            }
          />
          <Route
            path="/trends/:username"
            element={
              <ProtectedRoute element={Trends} currentUser={currentUser} />
            }
          />

          {/* Redirect any unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}


