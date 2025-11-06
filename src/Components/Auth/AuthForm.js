import React from "react";

// hideUsername toggles if the username field is displayed
const AuthForm = ({ user, onChange, onSubmit, hideUsername }) => {
  return (
    <div>
      <form onSubmit={onSubmit}>
        {!hideUsername && (
          <div>
            <label>Username</label>
            <br />
            <input
              type="text"
              value={user.username || ""}
              onChange={onChange}
              name="username"
              placeholder="username"
              required
            />
          </div>
        )}

        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={user.email || ""}
            onChange={onChange}
            name="email"
            placeholder="email"
            required
          />
        </div>

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={user.password || ""}
            onChange={onChange}
            name="password"
            placeholder="password"
            required
          />
        </div>

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AuthForm;
