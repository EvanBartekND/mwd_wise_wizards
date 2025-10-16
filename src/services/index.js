import { createDay, getAllDays, getByID, deleteDay } from "./days.js";

(async () => {
  const newDay = await createDay("Test Day");
  console.log("Created:", newDay.id);

  const allDays = await getAllDays();
  console.log("All days:", allDays.map(d => d.get("name")));

  const singleDay = await getByID(newDay.id);
  console.log("Fetched by ID:", singleDay.get("name"));

  await deleteDay(newDay.id);
})();

