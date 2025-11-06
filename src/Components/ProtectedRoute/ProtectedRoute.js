import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

// alr, I made this to wrap routes so that if there is no user in the url, it redirects to login/create.
export default function ProtectedRoute({ currentUser, children }) {
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

