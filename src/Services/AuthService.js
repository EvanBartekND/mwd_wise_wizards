import Parse from "parse";


// Create (Register) a new user
export const createUser = ({ username, email, password }) => {
  const user = new Parse.User();

  user.set("username", username); 
  user.set("email", email);
  user.set("password", password);
  return user
    .signUp()
    .then((createdUser) => {
      console.log("User registered:", createdUser);
      return createdUser;
    })
    .catch((error) => {
      console.error("Error while registering user:", error);
      return null;
    });
};

// Login an existing user
export const loginUser = ({ email, password }) => {
  return Parse.User.logIn(email, password)
    .then((loggedInUser) => {
      console.log("User logged in:", loggedInUser);
      return loggedInUser;
    })
    .catch((error) => {
      console.log("Error while logging in:", error);
      return null;
    });
};

// Log out the current user
export const logoutUser = () => {
  return Parse.User.logOut()
    .then(() => {
      console.log("User logged out");
      return true;
    })
    .catch((error) => {
      console.error("Error while logging out:", error);
      return false;
    });
};

// Get current logged-in user (from local storage/session)
export const getCurrentUser = () => {
  const currentUser = Parse.User.current();
  if (currentUser) {
    console.log("Current user:", currentUser);
  } else {
    console.log("No user currently logged in.");
  }
  return currentUser;
};

// Update a user’s profile info (idk if this is a security risk or not)
export const updateUser = async (updates) => {
  const user = Parse.User.current();
  if (!user) {
    console.error("No user logged in to update.");
    return null;
  }

  Object.keys(updates).forEach((key) => {
    user.set(key, updates[key]);
  });

  try {
    const updatedUser = await user.save();
    console.log("User updated:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};
