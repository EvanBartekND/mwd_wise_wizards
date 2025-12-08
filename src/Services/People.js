import Parse from "parse";
import {
  calculateBMRWithBodyFat,
  calculateBMRWithoutBodyFat,
  calculateTDEE,
  calculateCalorieGoal,
  calculateGoalsFromBodyData
} from "../Utils/calculations";

export let People = {};
People.collection = [];

// Get or create current user's person record
export const getCurrentUserPerson = async () => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("No user logged in");
  }

  const Person = Parse.Object.extend("people");
  const query = new Parse.Query(Person);
  query.equalTo("user", currentUser);

  try {
    let person = await query.first();
    
    // If person doesn't exist, create one
    if (!person) {
      person = new Person();
      person.set("user", currentUser);
      person = await person.save();
      console.log("Created new person record for user");
    }
    
    return person;
  } catch (error) {
    console.error("Error getting/creating person:", error);
    throw error;
  }
};

// Get user profile (goals + body data)
export const getUserProfile = async () => {
  try {
    const person = await getCurrentUserPerson();
    
    return {
      objectId: person.id,
      // Body Data
      height_cm: person.get("height_cm") || null,
      weight_kg: person.get("weight_kg") || null,
      age_years: person.get("age_years") || null,
      bodyFat_percent: person.get("bodyFat_percent") || null,
      gender: person.get("gender") || null,
      
      // Goals
      calorieGoal: person.get("calorieGoal") || null,
      cardioGoal: person.get("cardioGoal") || null,
      liftGoal: person.get("liftGoal") || null,
      weightGoalType: person.get("weightGoalType") || null,
      weightGoalRate: person.get("weightGoalRate") || null,
      
      // Metadata
      goalsSet: person.get("goalsSet") || false,
      goalsLastUpdated: person.get("goalsLastUpdated") || null,
      
      // Parse object (for direct access)
      parseObject: person
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
};

// Update user goals (partial update)
export const updateUserGoals = async (goals) => {
  try {
    const person = await getCurrentUserPerson();
    
    // Update goal fields
    if (goals.calorieGoal !== undefined) {
      person.set("calorieGoal", goals.calorieGoal);
    }
    if (goals.cardioGoal !== undefined) {
      person.set("cardioGoal", goals.cardioGoal);
    }
    if (goals.liftGoal !== undefined) {
      person.set("liftGoal", goals.liftGoal);
    }
    if (goals.weightGoalType !== undefined) {
      person.set("weightGoalType", goals.weightGoalType);
    }
    if (goals.weightGoalRate !== undefined) {
      person.set("weightGoalRate", goals.weightGoalRate);
    }
    
    // Update metadata
    person.set("goalsLastUpdated", new Date());
    person.set("goalsSet", true);
    
    const saved = await person.save();
    console.log("Updated user goals:", saved);
    return saved;
  } catch (error) {
    console.error("Error updating user goals:", error);
    throw error;
  }
};

// Update body data (partial update)
export const updateBodyData = async (bodyData) => {
  try {
    const person = await getCurrentUserPerson();
    
    // Update body data fields
    if (bodyData.height_cm !== undefined) {
      person.set("height_cm", bodyData.height_cm);
    }
    if (bodyData.weight_kg !== undefined) {
      person.set("weight_kg", bodyData.weight_kg);
    }
    if (bodyData.age_years !== undefined) {
      person.set("age_years", bodyData.age_years);
    }
    if (bodyData.bodyFat_percent !== undefined) {
      person.set("bodyFat_percent", bodyData.bodyFat_percent);
    }
    if (bodyData.gender !== undefined) {
      person.set("gender", bodyData.gender);
    }
    
    const saved = await person.save();
    console.log("Updated body data:", saved);
    return saved;
  } catch (error) {
    console.error("Error updating body data:", error);
    throw error;
  }
};

// Update complete profile (goals + body data)
export const updateUserProfile = async (profileData) => {
  try {
    const person = await getCurrentUserPerson();
    
    // Update body data
    if (profileData.bodyData) {
      if (profileData.bodyData.height_cm !== undefined) {
        person.set("height_cm", profileData.bodyData.height_cm);
      }
      if (profileData.bodyData.weight_kg !== undefined) {
        person.set("weight_kg", profileData.bodyData.weight_kg);
      }
      if (profileData.bodyData.age_years !== undefined) {
        person.set("age_years", profileData.bodyData.age_years);
      }
      if (profileData.bodyData.bodyFat_percent !== undefined) {
        person.set("bodyFat_percent", profileData.bodyData.bodyFat_percent);
      }
      if (profileData.bodyData.gender !== undefined) {
        person.set("gender", profileData.bodyData.gender);
      }
    }
    
    // Update goals
    if (profileData.goals) {
      if (profileData.goals.calorieGoal !== undefined) {
        person.set("calorieGoal", profileData.goals.calorieGoal);
      }
      if (profileData.goals.cardioGoal !== undefined) {
        person.set("cardioGoal", profileData.goals.cardioGoal);
      }
      if (profileData.goals.liftGoal !== undefined) {
        person.set("liftGoal", profileData.goals.liftGoal);
      }
      if (profileData.goals.weightGoalType !== undefined) {
        person.set("weightGoalType", profileData.goals.weightGoalType);
      }
      if (profileData.goals.weightGoalRate !== undefined) {
        person.set("weightGoalRate", profileData.goals.weightGoalRate);
      }
      
      person.set("goalsLastUpdated", new Date());
      person.set("goalsSet", true);
    }
    
    const saved = await person.save();
    console.log("Updated user profile:", saved);
    return saved;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Check if user has goals set
export const hasUserGoals = async () => {
  try {
    const person = await getCurrentUserPerson();
    return person.get("goalsSet") || false;
  } catch (error) {
    console.error("Error checking user goals:", error);
    return false;
  }
};

// Delete person record (for account deletion)
export const deleteCurrentUserPerson = async () => {
  try {
    const person = await getCurrentUserPerson();
    await person.destroy();
    console.log("Deleted person record");
    return true;
  } catch (error) {
    console.error("Error deleting person:", error);
    throw error;
  }
};

// Legacy functions (kept for backward compatibility)
export const createPerson = (Name) => {
  console.log("Creating person:", Name);
  const Person = Parse.Object.extend("people");
  const person = new Person();
  person.set("name", Name);

  return person
    .save()
    .then((result) => {
      console.log("Created person:", result);
      return result;
    })
    .catch((error) => {
      console.log("Error creating person:", error);
    });
};

export const getPersonByID = (id) => {
  const Person = Parse.Object.extend("people");
  const query = new Parse.Query(Person);

  return query
    .get(id)
    .then((result) => {
      console.log("Found person:", result);
      return result;
    })
    .catch((error) => {
      console.log("Error getting person:", error);
    });
};

export const deletePerson = (id) => {
  const Person = Parse.Object.extend("people");
  const query = new Parse.Query(Person);

  return query
    .get(id)
    .then((person) => {
      console.log("Deleting person:", person);
      return person.destroy();
    })
    .then(() => {
      console.log("Deleted person with ID:", id);
    })
    .catch((error) => {
      console.log("Error deleting person:", error);
    });
};

export const getAllPeople = () => {
  const Person = Parse.Object.extend("people");
  const query = new Parse.Query(Person);

  return query
    .find()
    .then((results) => {
      console.log("results: ", results);
      return results;
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};
