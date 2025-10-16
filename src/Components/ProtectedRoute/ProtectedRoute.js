import React from "react";
import { Navigate } from "react-router-dom";

// alr, I made this to wrap routes so that if there is no user in the url, it redirects to login/create.
export default function ProtectedRoute({ currentUser, children }) {
  if (!currentUser) {
    return <Navigate to="/" replace />; 
  }
  return children;
}
