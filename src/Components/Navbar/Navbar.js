import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../Services/AuthService.js";
import "./Navbar.css";


export default function Navbar({ currentUser, setCurrentUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      setCurrentUser(null); // instantly clears navbar
      navigate("/auth");    // redirect to login/register
    }
  };

  const handleLogoClick = () => {
    if (currentUser) {
      navigate("/main");
    }
  };

  return (
    <nav>
      <h1 
        onClick={handleLogoClick}
        style={{
          cursor: currentUser ? "pointer" : "default",
          transition: "opacity 0.2s ease"
        }}
        onMouseEnter={(e) => {
          if (currentUser) {
            e.currentTarget.style.opacity = "0.8";
          }
        }}
        onMouseLeave={(e) => {
          if (currentUser) {
            e.currentTarget.style.opacity = "1";
          }
        }}
      >
        Wise Wizards Fitness
      </h1>
      <div>
        {currentUser ? (
          <>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink to="/daily">Daily</NavLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink to="/log">Log</NavLink>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink to="/trends">Trends</NavLink>
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
