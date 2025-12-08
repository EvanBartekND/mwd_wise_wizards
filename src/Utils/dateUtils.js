/**
 * Date utility functions for Trends page
 */

// Get start of week (Monday) for a given date
export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(d);
  weekStart.setDate(diff);
  weekStart.setHours(0, 0, 0, 0);
  return weekStart;
};

// Get end of week (Sunday) for a given date
export const getWeekEnd = (date) => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
};

// Get array of 7 dates for a week (Monday to Sunday)
export const getWeekDates = (weekStart) => {
  const dates = [];
  const start = new Date(weekStart);
  start.setHours(0, 0, 0, 0); // Start of day
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Format date for display (e.g., "Jan 15" or "Monday, Jan 15")
export const formatDateDisplay = (date, includeDayName = false) => {
  const d = new Date(date);
  const options = includeDayName
    ? { weekday: 'long', month: 'short', day: 'numeric' }
    : { month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
};

// Format date for API (YYYY-MM-DD)
export const formatDateAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Check if two dates are the same day
export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Get previous week start
export const getPreviousWeek = (weekStart) => {
  const prev = new Date(weekStart);
  prev.setDate(prev.getDate() - 7);
  return prev;
};

// Get next week start
export const getNextWeek = (weekStart) => {
  const next = new Date(weekStart);
  next.setDate(next.getDate() + 7);
  return next;
};

// Get current week start
export const getCurrentWeekStart = () => {
  return getWeekStart(new Date());
};

// Get day name (Monday, Tuesday, etc.)
export const getDayName = (date, short = false) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { weekday: short ? 'short' : 'long' });
};

// Parse date string (handles various formats)
export const parseDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Get date at start of day (00:00:00)
export const getStartOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get date at end of day (23:59:59)
export const getEndOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Format week range for display (e.g., "Jan 1 - Jan 7, 2025")
export const formatWeekRange = (weekStart) => {
  const start = new Date(weekStart);
  const end = getWeekEnd(weekStart);
  const year = start.getFullYear();
  
  const startStr = formatDateDisplay(start);
  const endStr = formatDateDisplay(end);
  
  // If same year, don't repeat it
  if (start.getFullYear() === end.getFullYear()) {
    return `${startStr} - ${endStr}, ${year}`;
  }
  return `${startStr}, ${start.getFullYear()} - ${endStr}, ${end.getFullYear()}`;
};

