import Parse from "parse";
//creating a new day
export let Days = {};
Days.collection = [];

export const createDay = (Name) => {
  console.log("Creating:", Name);
  const Day = Parse.Object.extend("day");
  const day = new Day();
  day.set("name", Name);

  return day
    .save()
    .then((result) => {
      console.log("Created day:", result);
      return result;
    })
    .catch((error) => {
      console.log("Error creating day:", error);
    });
};
//getting user by ID
export const getByID = (id) => {
  const Day = Parse.Object.extend("day");
  const query = new Parse.Query(Day);

  return query
    .get(id)
    .then((result) => {
      console.log("Found day:", result);
      return result;
    })
    .catch((error) => {
      console.log("Error getting day:", error);
    });
};
//delete day
export const deleteDay = (id) => {
  const Day = Parse.Object.extend("day");
  const query = new Parse.Query(Day);

  return query
    .get(id)
    .then((day) => {
      console.log("Deleting day:", day);
      return day.destroy();
    })
    .then(() => {
      console.log("Deleted day with ID:", id);
    })
    .catch((error) => {
      console.log("Error deleting day:", error);
    });
};
//getting all days
export const getAllDays = () => {
  const Day = Parse.Object.extend("day");
  const query = new Parse.Query(Day);

  return query
    .find()
    .then((results) => {
      console.log("results: ", results);
      // returns array of Day objects
      return results;
    })
    .catch((error) => {
      console.log("error: ", error);
    });
};

