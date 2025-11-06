import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

// This component wraps protected routes that require authentication.
export default function ProtectedRoute({ element: Component, currentUser, ...rest }) {
  const navigate = useNavigate();

  const goBackHandler = () => {
    navigate(-1);
  };

  // If not logged in, show unauthorized message
  if (!currentUser) {
    return (
      <div>
        <p>Unauthorized! Please log in to continue.</p>
        <button onClick={goBackHandler}>Go Back</button>
      </div>
    );
  }

  // If logged in, render the component
  return <Component {...rest} currentUser={currentUser} />;
}


