import React from "react";
import { NavLink } from "react-router-dom";

// Navbar component that has all the routes and will maintain current user throught the app. reduces uncessecary gets and therefore load time
export default function Navbar({ currentUser }) {
  return (
    <nav>
      
      <h1>Wise Wizards Fitness</h1>
      <div>
        {currentUser ? (
          <>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink to={`/daily/${currentUser.userName}`}>Daily</NavLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink to={`/log/${currentUser.userName}`}>Log</NavLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink to={`/trends/${currentUser.userName}`}>Trends</NavLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>Welcome, {currentUser.userName}!</span>

          </>
        ) : (
          <NavLink to="/">Login / Signup</NavLink>
        )}
      </div>
    </nav>
  );
}
