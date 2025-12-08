import React from "react";
import { getProgressColor } from "../../Utils/statistics";

/**
 * Mini bar chart component for day cards
 * @param {number} calories - Calories value
 * @param {number} cardio - Cardio minutes
 * @param {number} lift - Lift minutes
 * @param {object} goals - Goal values { calorieGoal, cardioGoal, liftGoal }
 */
const MiniChart = ({ calories, cardio, lift, goals = {} }) => {
  const chartHeight = 60;
  const barWidth = 30;
  const spacing = 10;
  
  // Calculate percentages (cap at 100% for display)
  const caloriesPct = goals.calorieGoal && calories
    ? Math.min((calories / goals.calorieGoal) * 100, 100)
    : 0;
  const cardioPct = goals.cardioGoal && cardio
    ? Math.min((cardio / goals.cardioGoal) * 100, 100)
    : 0;
  const liftPct = goals.liftGoal && lift
    ? Math.min((lift / goals.liftGoal) * 100, 100)
    : 0;
  
  // Get colors based on progress
  const caloriesColor = calories ? getProgressColor(caloriesPct) : "#e9ecef";
  const cardioColor = cardio ? getProgressColor(cardioPct) : "#e9ecef";
  const liftColor = lift ? getProgressColor(liftPct) : "#e9ecef";
  
  // Calculate bar heights
  const caloriesHeight = (caloriesPct / 100) * chartHeight;
  const cardioHeight = (cardioPct / 100) * chartHeight;
  const liftHeight = (liftPct / 100) * chartHeight;
  
  return (
    <div style={{ width: "100%", height: chartHeight + 30 }}>
      <svg width="100%" height={chartHeight} style={{ display: "block" }}>
        {/* Goal line (100%) */}
        <line
          x1="0"
          y1="5"
          x2="100%"
          y2="5"
          stroke="#ddd"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        
        {/* Calories bar */}
        <rect
          x={spacing}
          y={chartHeight - caloriesHeight}
          width={barWidth}
          height={caloriesHeight || 0}
          fill={caloriesColor}
          rx="2"
        />
        <text
          x={spacing + barWidth / 2}
          y={chartHeight + 12}
          textAnchor="middle"
          fontSize="9"
          fill="#666"
        >
          Cal
        </text>
        
        {/* Cardio bar */}
        <rect
          x={spacing * 2 + barWidth}
          y={chartHeight - cardioHeight}
          width={barWidth}
          height={cardioHeight || 0}
          fill={cardioColor}
          rx="2"
        />
        <text
          x={spacing * 2 + barWidth + barWidth / 2}
          y={chartHeight + 12}
          textAnchor="middle"
          fontSize="9"
          fill="#666"
        >
          Cardio
        </text>
        
        {/* Lift bar */}
        <rect
          x={spacing * 3 + barWidth * 2}
          y={chartHeight - liftHeight}
          width={barWidth}
          height={liftHeight || 0}
          fill={liftColor}
          rx="2"
        />
        <text
          x={spacing * 3 + barWidth * 2 + barWidth / 2}
          y={chartHeight + 12}
          textAnchor="middle"
          fontSize="9"
          fill="#666"
        >
          Lift
        </text>
      </svg>
    </div>
  );
};

export default MiniChart;

