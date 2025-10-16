import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Main from "./Main/Main";
import Daily from "./Daily/Daily";
import Log from "./Log/Log";
import Trends from "./Trends/Trends";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute"


export default function Components() {
    
    // store the currently logged in user
    const [currentUser, setCurrentUser] = useState(null);

    return (
    <Router>
      <Navbar currentUser={currentUser} />
      <div>
        <Routes>
            <Route
                path="/"
                element={<Main currentUser={currentUser} setCurrentUser={setCurrentUser} />}
            />
            <Route
            path="/daily/:username"
            element={
                <ProtectedRoute currentUser={currentUser}>
                <Daily currentUser={currentUser} />
                </ProtectedRoute>
            }
            />
            <Route
                path="/log/:username"
                element={<Log currentUser={currentUser} />}
            />
            <Route
                path="/trends/:username"
                element={<Trends currentUser={currentUser} />}
            />
        </Routes>
      </div>
    </Router>
    );
}

