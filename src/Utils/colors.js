/**
 * Color constants for the application
 * Separates stat colors from progress bar colors for visual distinction
 */

// Stat colors - used for displaying data values (text, stat cards, etc.)
export const STAT_COLORS = {
  CALORIES: "#6f42c1",  // Purple/Indigo - distinct from progress colors
  CARDIO: "#17a2b8",    // Teal/Cyan - distinct from progress colors
  LIFTING: "#fd7e14"    // Orange - distinct from progress colors
};

// Progress bar colors - used for showing progress toward goals
// These are semantic colors (green = good, yellow = partial, red = warning)
export const PROGRESS_COLORS = {
  GOAL_MET: "#28a745",      // Green - 100%+
  PARTIAL: "#ffc107",       // Yellow - 50-99%
  BELOW_GOAL: "#dc3545",    // Red - 1-49%
  NO_DATA: "#6c757d"        // Gray - 0%
};

// UI colors (buttons, etc.)
export const UI_COLORS = {
  PRIMARY: "#007bff",
  SECONDARY: "#6c757d",
  SUCCESS: "#28a745",
  DANGER: "#dc3545",
  WARNING: "#ffc107",
  INFO: "#17a2b8"
};

