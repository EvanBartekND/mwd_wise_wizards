import React from "react";
import Login from "./Login";
import Signup from "./Signup";

export default function Main({ currentUser, setCurrentUser }) {

  return(
    <div>
      {!currentUser ? (
        <>
          <Login setCurrentUser={setCurrentUser} />
          <Signup setCurrentUser={setCurrentUser} />
        </>
      ) : (
        <p>Welcome, {currentUser.userName}!</p>
      )}
    </div>
  )
};
