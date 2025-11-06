import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../Services/AuthService.js";
import AuthForm from "./AuthForm";

const AuthRegister = ({ setCurrentUser }) => {  
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [add, setAdd] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (newUser && add) {
      createUser(newUser).then((userCreated) => {
        if (userCreated) {
          alert(
            `${userCreated.get("username") || "User"}, you successfully registered!`
          );

          // update currentUser in Components
          setCurrentUser(userCreated);

          // redirect to main page
          navigate("/main");
        } else {
          alert("Registration failed. Please try again.");
        }
        setAdd(false);
      });
    }
  }, [newUser, add, navigate, setCurrentUser]);

  const onChangeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setAdd(true);
  };

  return (
    <div>
      <AuthForm
        user={newUser}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
      />
    </div>
  );
};

export default AuthRegister;
