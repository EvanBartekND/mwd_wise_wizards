// src/Services/Logs.js
import Parse from "parse";

export async function getTodaysLogs(currentUser) {
  const Log = Parse.Object.extend("Logs");
  const query = new Parse.Query(Log);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  query.equalTo("user", currentUser);
  query.greaterThanOrEqualTo("date", today);
  query.ascending("createdAt");

  return await query.find();
}
