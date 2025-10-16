
import Parse from "parse";


Parse.initialize("BqjCnghSPHSxTnsyrO069gyVW041muljb7kD6W8w", "UwvTiR7EYux1Ifm9FOHgCoIvZN94zA8Pcg7PT2to");
Parse.serverURL = "https://parseapi.back4app.com"; 

async function createDay(Name) {
  console.log("Creating:", Name);
  const Day = Parse.Object.extend("Day");
  const day = new Day();
  day.set("name", Name);
  const result = await day.save();
  return result;
}

async function getByID(id) {
  const Day = Parse.Object.extend("Day");
  const query = new Parse.Query(Day);
  const result = await query.get(id);
  return result;
}

async function getAllDays() {
  const Day = Parse.Object.extend("Day");
  const query = new Parse.Query(Day);
  const results = await query.find(); // ✅ correct method
  return results;
}

async function deleteDay(id) {
  const Day = Parse.Object.extend("Day");
  const query = new Parse.Query(Day);
  const day = await query.get(id);
  await day.destroy();
  console.log(`Deleted day with id: ${id}`);
}

module.exports = { createDay, getByID, getAllDays, deleteDay };

	
