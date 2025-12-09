// src/Services/Logs.js
import Parse from "parse";
import { getWeekStart, getWeekEnd, getWeekDates, getStartOfDay, formatDateAPI } from "../Utils/dateUtils";
import {
  calculateAverage,
  calculateTotal,
  calculateProgressPercentage,
  countDaysWithData
} from "../Utils/statistics";

/**
 * Get or create a DailyLog for a specific date
 * Ensures exactly one row per day per person
 * Returns the DailyLog Parse object
 */
async function getOrCreateDailyLog(currentUser, date) {
  const dayStart = getStartOfDay(date);
  const dayEnd = getStartOfDay(date);
  dayEnd.setHours(23, 59, 59, 999);

  const DailyLog = Parse.Object.extend("DailyLogs");
  
  // First, try to find existing log(s) for this date
  const query = new Parse.Query(DailyLog);
  query.equalTo("user", currentUser);
  query.greaterThanOrEqualTo("date", dayStart);
  query.lessThanOrEqualTo("date", dayEnd);

  const existingLogs = await query.find();

  // If we have multiple logs for the same day (shouldn't happen, but handle it)
  if (existingLogs.length > 1) {
    // Merge all duplicates into the first one
    const primaryLog = existingLogs[0];
    let totalCalories = primaryLog.get("trackedCalories") || 0;
    let totalCardio = primaryLog.get("trackedCardio") || 0;
    let totalLift = primaryLog.get("trackedLift") || 0;

    // Sum up values from all duplicates
    for (let i = 1; i < existingLogs.length; i++) {
      const dup = existingLogs[i];
      totalCalories += (dup.get("trackedCalories") || 0);
      totalCardio += (dup.get("trackedCardio") || 0);
      totalLift += (dup.get("trackedLift") || 0);
    }

    // Update primary log with merged values
    primaryLog.set("trackedCalories", totalCalories);
    primaryLog.set("trackedCardio", totalCardio);
    primaryLog.set("trackedLift", totalLift);
    primaryLog.set("date", dayStart); // Ensure date is normalized
    await primaryLog.save();

    // Delete all duplicate logs
    const deletePromises = existingLogs.slice(1).map(dup => dup.destroy());
    await Promise.all(deletePromises);

    return primaryLog;
  }

  // If we have exactly one log, ensure date is normalized and return it
  if (existingLogs.length === 1) {
    const log = existingLogs[0];
    const logDate = getStartOfDay(log.get("date"));
    
    // Ensure the date is normalized to start of day
    if (logDate.getTime() !== dayStart.getTime()) {
      log.set("date", dayStart);
      await log.save();
    }
    
    return log;
  }

  // No log exists, create a new one
  // Use save with error handling to catch race conditions
  try {
    const dailyLog = new DailyLog();
    dailyLog.set("user", currentUser);
    dailyLog.set("date", dayStart);
    dailyLog.set("trackedCalories", 0);
    dailyLog.set("trackedCardio", 0);
    dailyLog.set("trackedLift", 0);
    await dailyLog.save();
    return dailyLog;
  } catch (error) {
    // If save failed (e.g., duplicate created by another request), try to fetch it
    if (error.code === 137 || error.message?.includes("duplicate")) {
      // Duplicate key error - try to fetch the existing one
      const retryQuery = new Parse.Query(DailyLog);
      retryQuery.equalTo("user", currentUser);
      retryQuery.greaterThanOrEqualTo("date", dayStart);
      retryQuery.lessThanOrEqualTo("date", dayEnd);
      const existing = await retryQuery.first();
      if (existing) {
        return existing;
      }
    }
    // Re-throw if it's a different error or we couldn't find the duplicate
    throw error;
  }
}

/**
 * Get today's daily log
 * Returns the DailyLog object for today (or null if no data exists)
 */
export async function getTodaysLogs(currentUser) {
  const today = new Date();
  const dayStart = getStartOfDay(today);
  const dayEnd = getStartOfDay(today);
  dayEnd.setHours(23, 59, 59, 999);

  const DailyLog = Parse.Object.extend("DailyLogs");
  const query = new Parse.Query(DailyLog);
  
  query.equalTo("user", currentUser);
  query.greaterThanOrEqualTo("date", dayStart);
  query.lessThanOrEqualTo("date", dayEnd);

  const dailyLog = await query.first();
  
  // Return array format for compatibility, or empty array if no log exists
  return dailyLog ? [dailyLog] : [];
}

/**
 * Create/update food log - adds calories to today's DailyLog
 * Uses atomic increment to prevent race conditions
 */
export async function createFoodLog(currentUser, foodName, calories) {
  const today = new Date();
  const dailyLog = await getOrCreateDailyLog(currentUser, today);
  
  // Use increment for atomic operation (prevents race conditions)
  dailyLog.increment("trackedCalories", Number(calories));
  
  await dailyLog.save();
  
  // Fetch fresh data to return
  await dailyLog.fetch();
  return dailyLog;
}

/**
 * Create/update exercise log - adds duration to today's DailyLog
 * Uses atomic increment to prevent race conditions
 */
export async function createExerciseLog(currentUser, exerciseType, duration, notes = "") {
  const today = new Date();
  const dailyLog = await getOrCreateDailyLog(currentUser, today);
  
  const durationNum = Number(duration);
  
  // Use increment for atomic operation (prevents race conditions)
  if (exerciseType === "cardio") {
    dailyLog.increment("trackedCardio", durationNum);
  } else if (exerciseType === "lifting" || exerciseType === "lift") {
    dailyLog.increment("trackedLift", durationNum);
  }
  
  await dailyLog.save();
  
  // Fetch fresh data to return
  await dailyLog.fetch();
  return dailyLog;
}

/**
 * Get daily log data for a specific date
 * Returns an object with trackedCalories, trackedCardio, trackedLift for a specific date
 */
export async function getDayAggregates(currentUser, date) {
  const dayStart = getStartOfDay(date);
  const dayEnd = getStartOfDay(date);
  dayEnd.setHours(23, 59, 59, 999);

  const DailyLog = Parse.Object.extend("DailyLogs");
  const query = new Parse.Query(DailyLog);
  
  query.equalTo("user", currentUser);
  query.greaterThanOrEqualTo("date", dayStart);
  query.lessThanOrEqualTo("date", dayEnd);

  const dailyLog = await query.first();

  if (!dailyLog) {
    return {
      trackedCalories: null,
      trackedCardio: null,
      trackedLift: null,
      date: date
    };
  }

  const trackedCalories = dailyLog.get("trackedCalories");
  const trackedCardio = dailyLog.get("trackedCardio");
  const trackedLift = dailyLog.get("trackedLift");

  return {
    trackedCalories: trackedCalories > 0 ? trackedCalories : null,
    trackedCardio: trackedCardio > 0 ? trackedCardio : null,
    trackedLift: trackedLift > 0 ? trackedLift : null,
    date: date
  };
}

/**
 * Get daily log data for all days in a week
 * Returns array of 7 day objects (may have nulls for days with no data)
 * Handles duplicates by merging them
 */
export async function getUserDaysForWeek(currentUser, weekStartDate) {
  const weekEnd = getWeekEnd(weekStartDate);
  const weekDates = getWeekDates(weekStartDate);

  const dayStart = getStartOfDay(weekStartDate);
  const dayEnd = getStartOfDay(weekEnd);
  dayEnd.setHours(23, 59, 59, 999);

  // Query DailyLogs for the week
  const DailyLog = Parse.Object.extend("DailyLogs");
  const query = new Parse.Query(DailyLog);
  
  query.equalTo("user", currentUser);
  query.greaterThanOrEqualTo("date", dayStart);
  query.lessThanOrEqualTo("date", dayEnd);
  query.ascending("date");

  const dailyLogs = await query.find();

  // Group logs by date and merge duplicates
  const dayDataMap = new Map();
  
  dailyLogs.forEach(log => {
    const logDate = log.get("date");
    // Normalize the date to start of day for consistent comparison
    const normalizedDate = getStartOfDay(logDate);
    // Use formatDateAPI which uses local timezone (YYYY-MM-DD)
    const dateKey = formatDateAPI(normalizedDate);
    
    const trackedCalories = log.get("trackedCalories") || 0;
    const trackedCardio = log.get("trackedCardio") || 0;
    const trackedLift = log.get("trackedLift") || 0;
    
    // If we already have data for this date, merge the values (handle duplicates)
    if (dayDataMap.has(dateKey)) {
      const existing = dayDataMap.get(dateKey);
      existing.trackedCalories = (existing.trackedCalories || 0) + trackedCalories;
      existing.trackedCardio = (existing.trackedCardio || 0) + trackedCardio;
      existing.trackedLift = (existing.trackedLift || 0) + trackedLift;
    } else {
      // Only set to null if the value is undefined/null, preserve 0 values
      dayDataMap.set(dateKey, {
        trackedCalories: trackedCalories !== undefined && trackedCalories !== null ? trackedCalories : null,
        trackedCardio: trackedCardio !== undefined && trackedCardio !== null ? trackedCardio : null,
        trackedLift: trackedLift !== undefined && trackedLift !== null ? trackedLift : null,
        date: normalizedDate
      });
    }
  });

  // Return array of 7 day objects matching weekDates
  return weekDates.map(date => {
    // Normalize the date and use formatDateAPI for timezone-independent comparison
    const normalizedDate = getStartOfDay(date);
    const dateKey = formatDateAPI(normalizedDate);
    const dayData = dayDataMap.get(dateKey);
    
    if (!dayData) {
      return null;
    }
    
    return dayData;
  });
}

/**
 * Get weekly aggregates (averages, totals, etc.) from aggregated day data
 */
export async function getWeeklyAggregates(currentUser, weekStartDate, userGoals) {
  const weekDays = await getUserDaysForWeek(currentUser, weekStartDate);
  
  // Extract arrays of values
  const calories = weekDays.map(day => day?.trackedCalories ?? null);
  const cardio = weekDays.map(day => day?.trackedCardio ?? null);
  const lift = weekDays.map(day => day?.trackedLift ?? null);
  
  // Calculate averages
  const avgCalories = calculateAverage(calories);
  const avgCardio = calculateAverage(cardio);
  const avgLift = calculateAverage(lift);
  
  // Calculate totals
  const totalCalories = calculateTotal(calories);
  const totalCardio = calculateTotal(cardio);
  const totalLift = calculateTotal(lift);
  
  // Count days with data
  const daysWithData = countDaysWithData(weekDays);
  
  // Calculate progress toward goals
  const progress = {
    calories: userGoals?.calorieGoal ? calculateProgressPercentage(avgCalories, userGoals.calorieGoal) : 0,
    cardio: userGoals?.cardioGoal ? calculateProgressPercentage(avgCardio, userGoals.cardioGoal) : 0,
    lift: userGoals?.liftGoal ? calculateProgressPercentage(avgLift, userGoals.liftGoal) : 0
  };
  
  return {
    avgCalories: Math.round(avgCalories),
    avgCardio: Math.round(avgCardio),
    avgLift: Math.round(avgLift),
    totalCalories,
    totalCardio,
    totalLift,
    daysWithData,
    progress,
    weekDays: weekDays
  };
}

/**
 * Extract day data in format expected by components
 */
export const extractDayData = (dayData) => {
  if (!dayData) return null;
  
  return {
    trackedCalories: dayData.trackedCalories ?? null,
    trackedCardio: dayData.trackedCardio ?? null,
    trackedLift: dayData.trackedLift ?? null,
    date: dayData.date ? new Date(dayData.date) : null
  };
};

/**
 * Get all weeks that have data for current user (based on DailyLogs)
 */
export async function getUserWeeksWithData(currentUser) {
  if (!currentUser) {
    throw new Error("No user logged in");
  }

  const dayStart = getStartOfDay(new Date(0)); // Start from epoch
  const dayEnd = getStartOfDay(new Date());
  dayEnd.setHours(23, 59, 59, 999);

  // Query DailyLogs to find dates
  const DailyLog = Parse.Object.extend("DailyLogs");
  const query = new Parse.Query(DailyLog);
  
  query.equalTo("user", currentUser);
  query.greaterThanOrEqualTo("date", dayStart);
  query.select("date");
  query.ascending("date");

  const dailyLogs = await query.find();

  const weekStarts = new Set();
  
  // Process daily logs to find unique week starts
  dailyLogs.forEach(log => {
    const date = log.get("date");
    if (date) {
      const weekStart = getWeekStart(new Date(date));
      weekStarts.add(weekStart.toISOString());
    }
  });
  
  return Array.from(weekStarts)
    .map(iso => new Date(iso))
    .sort((a, b) => b - a); // Most recent first
}