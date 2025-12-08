// Unit Conversions
export const feetToCm = (feet, inches = 0) => {
  return (feet * 30.48) + (inches * 2.54);
};

export const lbsToKg = (lbs) => {
  return lbs * 0.453592;
};

export const cmToFeet = (cm) => {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return { feet, inches };
};

export const kgToLbs = (kg) => {
  return kg * 2.20462;
};

// Validation
export const validateBodyData = (data) => {
  const errors = [];
  
  if (data.height_cm !== null && data.height_cm !== undefined) {
    if (data.height_cm < 50 || data.height_cm > 250) {
      errors.push("Height must be between 50-250 cm");
    }
  }
  
  if (data.weight_kg !== null && data.weight_kg !== undefined) {
    if (data.weight_kg < 20 || data.weight_kg > 300) {
      errors.push("Weight must be between 20-300 kg");
    }
  }
  
  if (data.age_years !== null && data.age_years !== undefined) {
    if (data.age_years < 13 || data.age_years > 120) {
      errors.push("Age must be between 13-120 years");
    }
  }
  
  if (data.bodyFat_percent !== null && data.bodyFat_percent !== undefined) {
    if (data.bodyFat_percent < 0 || data.bodyFat_percent > 100) {
      errors.push("Body fat % must be between 0-100");
    }
  }
  
  return { isValid: errors.length === 0, errors };
};

// Constants
export const ACTIVITY_LEVELS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  veryActive: 1.9
};

export const WEIGHT_GOAL_RATES = {
  aggressive: 1000,  // cal/day
  regular: 500,
  slow: 250
};

export const WEIGHT_GOAL_TYPES = {
  loss: "loss",
  maintain: "maintain",
  gain: "gain"
};

// Calculate BMR with body fat (LBM method)
export const calculateBMRWithBodyFat = (weight_kg, bodyFat_percent) => {
  if (!weight_kg || bodyFat_percent === null || bodyFat_percent === undefined) {
    return null;
  }
  
  // LBM = weight_kg × (1 - bodyFat_percent/100)
  const LBM = weight_kg * (1 - bodyFat_percent / 100);
  
  // BMR = 370 + (21.6 × LBM)
  const BMR = 370 + (21.6 * LBM);
  
  return Math.round(BMR);
};

// Calculate BMR without body fat (Mifflin-St Jeor)
export const calculateBMRWithoutBodyFat = (weight_kg, height_cm, age_years, gender = "male") => {
  if (!weight_kg || !height_cm || !age_years) {
    return null;
  }
  
  // Base: BMR = (10 × weight_kg) + (6.25 × height_cm) - (5 × age_years) + 5
  let BMR = (10 * weight_kg) + (6.25 * height_cm) - (5 * age_years);
  
  // If female: subtract 161 instead of +5
  if (gender === "female") {
    BMR -= 161;
  } else {
    BMR += 5;
  }
  
  return Math.round(BMR);
};

// Calculate TDEE (Total Daily Energy Expenditure)
export const calculateTDEE = (BMR, activityLevel = "sedentary") => {
  if (!BMR || !ACTIVITY_LEVELS[activityLevel]) {
    return null;
  }
  
  const multiplier = ACTIVITY_LEVELS[activityLevel];
  return Math.round(BMR * multiplier);
};

// Calculate calorie goal based on weight goal
export const calculateCalorieGoal = (TDEE, weightGoalType, weightGoalRate) => {
  if (!TDEE) {
    return null;
  }
  
  if (weightGoalType === "maintain" || !weightGoalType) {
    return TDEE;
  }
  
  const rateValue = WEIGHT_GOAL_RATES[weightGoalRate] || WEIGHT_GOAL_RATES.regular;
  
  if (weightGoalType === "loss") {
    return Math.round(TDEE - rateValue);
  } else if (weightGoalType === "gain") {
    return Math.round(TDEE + rateValue);
  }
  
  return TDEE;
};

// Complete calculation flow
export const calculateGoalsFromBodyData = (
  bodyData,
  weightGoalType,
  weightGoalRate,
  activityLevel = "sedentary"
) => {
  let BMR = null;
  
  // Determine which BMR calculation to use
  if (bodyData.bodyFat_percent !== null && bodyData.bodyFat_percent !== undefined) {
    // Use LBM method if body fat is provided
    BMR = calculateBMRWithBodyFat(bodyData.weight_kg, bodyData.bodyFat_percent);
  } else {
    // Use Mifflin-St Jeor if no body fat
    BMR = calculateBMRWithoutBodyFat(
      bodyData.weight_kg,
      bodyData.height_cm,
      bodyData.age_years,
      bodyData.gender || "male"
    );
  }
  
  if (!BMR) {
    return { error: "Insufficient data to calculate BMR" };
  }
  
  // Calculate TDEE
  const TDEE = calculateTDEE(BMR, activityLevel);
  
  if (!TDEE) {
    return { error: "Could not calculate TDEE" };
  }
  
  // Calculate calorie goal
  const calorieGoal = calculateCalorieGoal(TDEE, weightGoalType, weightGoalRate);
  
  return {
    BMR,
    TDEE,
    calorieGoal,
    weightGoalType: weightGoalType || "maintain",
    weightGoalRate: weightGoalRate || "regular"
  };
};

