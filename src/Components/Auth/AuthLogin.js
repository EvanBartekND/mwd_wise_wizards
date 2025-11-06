import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../Services/AuthService.js";
import AuthForm from "./AuthForm";

const AuthLogin = ({ setCurrentUser }) => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && login) {
      loginUser(user).then((loggedInUser) => {
        if (loggedInUser) {
          alert(`Welcome back, ${loggedInUser.get("username") || "user"}!`);
          
          // update currentUser in Components
          setCurrentUser(loggedInUser);

          // redirect
          navigate("/main");
        } else {
          alert("Login failed. Please check your credentials.");
        }
        setLogin(false);
      });
    }
  }, [user, login, navigate, setCurrentUser]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setLogin(true);
  };

  return (
    <div>
      <AuthForm
        user={user}
        onChange={onChangeHandler}
        onSubmit={onSubmitHandler}
        hideUsername={true}
      />
    </div>
  );
};

export default AuthLogin;
