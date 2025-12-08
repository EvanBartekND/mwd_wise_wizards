/**
 * Statistics utility functions for Trends page
 */

// Calculate average of array (ignores null/undefined values)
export const calculateAverage = (values) => {
  const validValues = values.filter(val => val !== null && val !== undefined && !isNaN(val));
  if (validValues.length === 0) return 0;
  const sum = validValues.reduce((acc, val) => acc + val, 0);
  return sum / validValues.length;
};

// Calculate total of array (ignores null/undefined values)
export const calculateTotal = (values) => {
  return values
    .filter(val => val !== null && val !== undefined && !isNaN(val))
    .reduce((acc, val) => acc + val, 0);
};

// Calculate percentage toward goal
export const calculateProgressPercentage = (actual, goal) => {
  if (!goal || goal === 0) return 0;
  if (!actual || actual === 0) return 0;
  const percentage = (actual / goal) * 100;
  return Math.min(percentage, 100); // Cap at 100%
};

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return Math.round(num).toLocaleString();
};

// Round to specified decimal places
export const roundTo = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return 0;
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
};

// Get color based on progress percentage
export const getProgressColor = (percentage) => {
  if (percentage >= 100) return "#28a745"; // Green - goal met
  if (percentage >= 50) return "#ffc107"; // Yellow - partial
  if (percentage > 0) return "#dc3545"; // Red - below goal
  return "#6c757d"; // Gray - no data
};

// Calculate days with data count
export const countDaysWithData = (days) => {
  return days.filter(day => 
    day && (
      day.trackedCalories !== null && day.trackedCalories !== undefined ||
      day.trackedCardio !== null && day.trackedCardio !== undefined ||
      day.trackedLift !== null && day.trackedLift !== undefined
    )
  ).length;
};

// Calculate average progress toward goals
export const calculateAverageProgress = (days, goals) => {
  if (!days || days.length === 0 || !goals) return { calories: 0, cardio: 0, lift: 0 };
  
  const validDays = days.filter(day => day !== null && day !== undefined);
  if (validDays.length === 0) return { calories: 0, cardio: 0, lift: 0 };
  
  const calorieProgresses = validDays
    .map(day => calculateProgressPercentage(day.trackedCalories, goals.calorieGoal))
    .filter(p => p > 0);
  
  const cardioProgresses = validDays
    .map(day => calculateProgressPercentage(day.trackedCardio, goals.cardioGoal))
    .filter(p => p > 0);
  
  const liftProgresses = validDays
    .map(day => calculateProgressPercentage(day.trackedLift, goals.liftGoal))
    .filter(p => p > 0);
  
  return {
    calories: calculateAverage(calorieProgresses),
    cardio: calculateAverage(cardioProgresses),
    lift: calculateAverage(liftProgresses)
  };
};

