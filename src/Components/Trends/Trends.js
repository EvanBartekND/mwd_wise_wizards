import React, { useState, useEffect } from "react";
import { getUserDaysForWeek, getWeeklyAggregates } from "../../Services/Days";
import { getUserProfile } from "../../Services/People";
import { getCurrentWeekStart } from "../../Utils/dateUtils";
import WeeklyDashboard from "./WeeklyDashboard";
import WeekSelector from "./WeekSelector";
import WeekDisplay from "./WeekDisplay";
import DayDetailModal from "./DayDetailModal";

export default function Trends({ currentUser }) {
  const [selectedWeekStart, setSelectedWeekStart] = useState(getCurrentWeekStart());
  const [weekDays, setWeekDays] = useState([]);
  const [weeklyAggregates, setWeeklyAggregates] = useState(null);
  const [userGoals, setUserGoals] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // { date, dayData }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data on mount and when week changes
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    loadTrendsData();
  }, [currentUser, selectedWeekStart]);

  const loadTrendsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load user goals
      const profile = await getUserProfile();
      setUserGoals({
        calorieGoal: profile.calorieGoal,
        cardioGoal: profile.cardioGoal,
        liftGoal: profile.liftGoal
      });

      // Load week days and aggregates
      const [days, aggregates] = await Promise.all([
        getUserDaysForWeek(selectedWeekStart),
        getWeeklyAggregates(selectedWeekStart, {
          calorieGoal: profile.calorieGoal,
          cardioGoal: profile.cardioGoal,
          liftGoal: profile.liftGoal
        })
      ]);

      setWeekDays(days);
      setWeeklyAggregates(aggregates);
    } catch (err) {
      console.error("Error loading trends data:", err);
      setError("Failed to load trends data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWeekChange = (newWeekStart) => {
    setSelectedWeekStart(newWeekStart);
  };

  const handleDayClick = (date, dayData) => {
    setSelectedDay({ date, dayData });
  };

  const handleCloseModal = () => {
    setSelectedDay(null);
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading your trends...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button
          onClick={loadTrendsData}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return <p>Please log in to view your trends.</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Trends for {currentUser.get("username")}</h1>

      {/* Week Selector */}
      <WeekSelector
        weekStart={selectedWeekStart}
        onWeekChange={handleWeekChange}
        canGoPrevious={true}
        canGoNext={true}
      />

      {/* Weekly Dashboard */}
      <div style={{ marginBottom: "2rem" }}>
        <WeeklyDashboard aggregates={weeklyAggregates} goals={userGoals} />
      </div>

      {/* Week Display */}
      <div style={{ marginBottom: "2rem" }}>
        <WeekDisplay
          weekDays={weekDays}
          weekStart={selectedWeekStart}
          goals={userGoals}
          onDayClick={handleDayClick}
        />
      </div>

      {/* Day Detail Modal */}
      {selectedDay && (
        <DayDetailModal
          dayData={selectedDay.dayData}
          date={selectedDay.date}
          goals={userGoals}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
