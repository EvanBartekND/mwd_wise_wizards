import React from "react";

export default function Main({ currentUser }) {
  return (
    <div>
      {currentUser ? (
        <p>Welcome, {currentUser.get("username")}!</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
