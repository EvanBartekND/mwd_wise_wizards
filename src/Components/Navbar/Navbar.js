import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../Services/AuthService.js";

export default function Navbar({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      setCurrentUser(null); // instantly clears navbar
      navigate("/auth");    // redirect to login/register
    }
  };

  return (
    <nav>
      <h1>Wise Wizards Fitness</h1>
      <div>
        {currentUser ? (
          <>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink to={`/daily/${currentUser.get("username")}`}>Daily</NavLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink to={`/log/${currentUser.get("username")}`}>Log</NavLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink to={`/trends/${currentUser.get("username")}`}>Trends</NavLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>Welcome, {currentUser.get("username")}!</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : null}
      </div>
    </nav>
  );
}
