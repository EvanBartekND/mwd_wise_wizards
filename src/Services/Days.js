import Parse from "parse";

// export async function createDay(Name) {
//   console.log("Creating:", Name);
//   const Day = Parse.Object.extend("day");
//   const day = new Day();
//   day.set("name", Name);
//   const result = await day.save();
//   return result;
// }

// export async function getByID(id) {
//   const Day = Parse.Object.extend("day");
//   const query = new Parse.Query(Day);
//   const result = await query.get(id);
//   return result;
// }

export let Days = {};
Days.collection = [];

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

// export async function deleteDay(id) {
//   const Day = Parse.Object.extend("day");
//   const query = new Parse.Query(Day);
//   const day = await query.get(id);
//   await day.destroy();
//   console.log(`Deleted day with id: ${id}`);
// }
