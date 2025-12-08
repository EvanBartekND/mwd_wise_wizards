import Parse from "parse";
import { getWeekStart, getWeekEnd, getWeekDates, getStartOfDay } from "../Utils/dateUtils";
import {
  calculateAverage,
  calculateTotal,
  calculateProgressPercentage,
  countDaysWithData
} from "../Utils/statistics";

export let Days = {};
Days.collection = [];

// Get all days for current user within a date range
export const getUserDaysInRange = async (startDate, endDate) => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("No user logged in");
  }

  const Day = Parse.Object.extend("day");
  const query = new Parse.Query(Day);
  
  // Query by user (if using Pointer) or username (if using string)
  // Try Pointer first, fallback to username string
  try {
    query.equalTo("user", currentUser);
  } catch (e) {
    // Fallback to username if Pointer doesn't exist yet
    query.equalTo("username", currentUser.get("username"));
  }
  
  // Query by date range
  const start = getStartOfDay(startDate);
  const end = getStartOfDay(endDate);
  end.setHours(23, 59, 59, 999); // End of day
  
  query.greaterThanOrEqualTo("date", start);
  query.lessThanOrEqualTo("date", end);
  query.ascending("date");

  try {
    const results = await query.find();
    return results;
  } catch (error) {
    console.error("Error getting user days in range:", error);
    throw error;
  }
};

// Get all days for current user in a specific week
export const getUserDaysForWeek = async (weekStartDate) => {
  try {
    const weekEnd = getWeekEnd(weekStartDate);
    const days = await getUserDaysInRange(weekStartDate, weekEnd);
    
    // Get all 7 dates in the week
    const weekDates = getWeekDates(weekStartDate);
    
    // Create a map of dates to day objects
    const daysMap = new Map();
    days.forEach(day => {
      const dayDate = new Date(day.get("date"));
      const dateKey = dayDate.toDateString();
      daysMap.set(dateKey, day);
    });
    
    // Return array of 7 day objects (may have nulls for missing days)
    return weekDates.map(date => {
      const dateKey = date.toDateString();
      return daysMap.get(dateKey) || null;
    });
  } catch (error) {
    console.error("Error getting user days for week:", error);
    throw error;
  }
};

// Get a specific day for current user
export const getUserDay = async (date) => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("No user logged in");
  }

  const Day = Parse.Object.extend("day");
  const query = new Parse.Query(Day);
  
  try {
    query.equalTo("user", currentUser);
  } catch (e) {
    query.equalTo("username", currentUser.get("username"));
  }
  
  const dayStart = getStartOfDay(date);
  const dayEnd = getStartOfDay(date);
  dayEnd.setHours(23, 59, 59, 999);
  
  query.greaterThanOrEqualTo("date", dayStart);
  query.lessThanOrEqualTo("date", dayEnd);

  try {
    const result = await query.first();
    return result;
  } catch (error) {
    console.error("Error getting user day:", error);
    throw error;
  }
};

// Create or update a day for current user
export const saveUserDay = async (date, trackedData) => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("No user logged in");
  }

  try {
    // Try to get existing day
    let day = await getUserDay(date);
    
    if (day) {
      // Update existing day
      if (trackedData.trackedCalories !== undefined) {
        day.set("trackedCalories", trackedData.trackedCalories);
      }
      if (trackedData.trackedCardio !== undefined) {
        day.set("trackedCardio", trackedData.trackedCardio);
      }
      if (trackedData.trackedLift !== undefined) {
        day.set("trackedLift", trackedData.trackedLift);
      }
      // Handle legacy field names
      if (trackedData.trackedcalories !== undefined) {
        day.set("trackedcalories", trackedData.trackedcalories);
      }
      if (trackedData.trackedcardio !== undefined) {
        day.set("trackedcardio", trackedData.trackedcardio);
      }
      if (trackedData.trackedlift !== undefined) {
        day.set("trackedlift", trackedData.trackedlift);
      }
    } else {
      // Create new day
      const Day = Parse.Object.extend("day");
      day = new Day();
      
      // Set user (try Pointer first, fallback to username)
      try {
        day.set("user", currentUser);
      } catch (e) {
        day.set("username", currentUser.get("username"));
      }
      
      // Set date
      const dayStart = getStartOfDay(date);
      day.set("date", dayStart);
      
      // Set tracked data
      if (trackedData.trackedCalories !== undefined) {
        day.set("trackedCalories", trackedData.trackedCalories);
      }
      if (trackedData.trackedCardio !== undefined) {
        day.set("trackedCardio", trackedData.trackedCardio);
      }
      if (trackedData.trackedLift !== undefined) {
        day.set("trackedLift", trackedData.trackedLift);
      }
      // Handle legacy field names
      if (trackedData.trackedcalories !== undefined) {
        day.set("trackedcalories", trackedData.trackedcalories);
      }
      if (trackedData.trackedcardio !== undefined) {
        day.set("trackedcardio", trackedData.trackedcardio);
      }
      if (trackedData.trackedlift !== undefined) {
        day.set("trackedlift", trackedData.trackedlift);
      }
    }
    
    const saved = await day.save();
    console.log("Saved user day:", saved);
    return saved;
  } catch (error) {
    console.error("Error saving user day:", error);
    throw error;
  }
};

// Get weekly aggregates for current user
export const getWeeklyAggregates = async (weekStartDate, userGoals) => {
  try {
    const weekDays = await getUserDaysForWeek(weekStartDate);
    
    // Extract data from Parse objects
    const daysData = weekDays.map(day => {
      if (!day) return null;
      
      // Try new field names first, fallback to legacy
      return {
        trackedCalories: day.get("trackedCalories") ?? day.get("trackedcalories") ?? null,
        trackedCardio: day.get("trackedCardio") ?? day.get("trackedcardio") ?? null,
        trackedLift: day.get("trackedLift") ?? day.get("trackedlift") ?? null,
        date: day.get("date") ? new Date(day.get("date")) : null
      };
    });
    
    // Filter out null days
    const validDays = daysData.filter(day => day !== null);
    
    // Extract arrays of values
    const calories = daysData.map(day => day?.trackedCalories ?? null);
    const cardio = daysData.map(day => day?.trackedCardio ?? null);
    const lift = daysData.map(day => day?.trackedLift ?? null);
    
    // Calculate averages
    const avgCalories = calculateAverage(calories);
    const avgCardio = calculateAverage(cardio);
    const avgLift = calculateAverage(lift);
    
    // Calculate totals
    const totalCalories = calculateTotal(calories);
    const totalCardio = calculateTotal(cardio);
    const totalLift = calculateTotal(lift);
    
    // Count days with data
    const daysWithData = countDaysWithData(daysData);
    
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
      weekDays: daysData
    };
  } catch (error) {
    console.error("Error getting weekly aggregates:", error);
    throw error;
  }
};

// Get all weeks that have data for current user
export const getUserWeeksWithData = async () => {
  const currentUser = Parse.User.current();
  if (!currentUser) {
    throw new Error("No user logged in");
  }

  const Day = Parse.Object.extend("day");
  const query = new Parse.Query(Day);
  
  try {
    query.equalTo("user", currentUser);
  } catch (e) {
    query.equalTo("username", currentUser.get("username"));
  }
  
  query.ascending("date");
  query.select("date");

  try {
    const results = await query.find();
    const weekStarts = new Set();
    
    results.forEach(day => {
      const date = day.get("date");
      if (date) {
        const weekStart = getWeekStart(new Date(date));
        weekStarts.add(weekStart.toISOString());
      }
    });
    
    return Array.from(weekStarts)
      .map(iso => new Date(iso))
      .sort((a, b) => b - a); // Most recent first
  } catch (error) {
    console.error("Error getting user weeks with data:", error);
    throw error;
  }
};

// Helper function to extract day data from Parse object
export const extractDayData = (day) => {
  if (!day) return null;
  
  return {
    objectId: day.id,
    date: day.get("date") ? new Date(day.get("date")) : null,
    trackedCalories: day.get("trackedCalories") ?? day.get("trackedcalories") ?? null,
    trackedCardio: day.get("trackedCardio") ?? day.get("trackedcardio") ?? null,
    trackedLift: day.get("trackedLift") ?? day.get("trackedlift") ?? null,
    parseObject: day
  };
};

// Legacy functions (kept for backward compatibility)
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

export const getAllDays = () => {
  const Day = Parse.Object.extend("day");
  const query = new Parse.Query(Day);

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
