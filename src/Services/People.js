import Parse from "parse";

export let People = {};
People.collection = [];
//create new person
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
// geeting a person by id
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
// deleting person
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
//getting all peeps
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

