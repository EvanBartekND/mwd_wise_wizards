import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTodaysLogs } from "../../Services/Logs";
import { getUserProfile } from "../../Services/People";
import { STAT_COLORS } from "../../Utils/colors";

export default function Main({ currentUser }) {
  const navigate = useNavigate();
  const [todaysLog, setTodaysLog] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  async function loadData() {
    try {
      setLoading(true);
      const [logs, profile] = await Promise.all([
        getTodaysLogs(currentUser),
        getUserProfile().catch(() => null)
      ]);
      
      setTodaysLog(logs.length > 0 ? logs[0] : null);
      setUserProfile(profile);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (!currentUser) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  const username = currentUser.get("username");
  const trackedCalories = todaysLog?.get("trackedCalories") ?? 0;
  const trackedCardio = todaysLog?.get("trackedCardio") ?? 0;
  const trackedLift = todaysLog?.get("trackedLift") ?? 0;

  const navigationCards = [
    {
      title: "Daily Goals",
      description: "Set and manage your daily calorie, cardio, and lifting goals",
      icon: "🎯",
      route: "/daily",
      color: "#007bff"
    },
    {
      title: "Log",
      description: "Log your food intake and exercise activities",
      icon: "📝",
      route: "/log",
      color: STAT_COLORS.CALORIES
    },
    {
      title: "Trends",
      description: "View your weekly statistics and progress trends",
      icon: "📊",
      route: "/trends",
      color: STAT_COLORS.CARDIO
    }
  ];

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Welcome Section */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ 
          fontSize: "2.5rem", 
          marginBottom: "0.5rem",
          color: "#333"
        }}>
          Welcome back, {username}! 👋
        </h1>
        <p style={{ 
          fontSize: "1.1rem", 
          color: "#666",
          marginBottom: "2rem"
        }}>
          Your fitness journey continues. Let's make today count!
        </p>

        {/* Today's Quick Stats */}
        {!loading && (trackedCalories > 0 || trackedCardio > 0 || trackedLift > 0) && (
          <div
            style={{
              display: "inline-flex",
              gap: "1.5rem",
              backgroundColor: "#f8f9fa",
              padding: "1.5rem 2rem",
              borderRadius: "12px",
              marginBottom: "2rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>
                Calories
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: STAT_COLORS.CALORIES }}>
                {trackedCalories.toLocaleString()}
              </div>
            </div>
            <div style={{ width: "1px", backgroundColor: "#ddd" }}></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>
                Cardio
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: STAT_COLORS.CARDIO }}>
                {trackedCardio} <span style={{ fontSize: "1rem" }}>min</span>
              </div>
            </div>
            <div style={{ width: "1px", backgroundColor: "#ddd" }}></div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.85rem", color: "#666", marginBottom: "0.25rem" }}>
                Lifting
              </div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: STAT_COLORS.LIFTING }}>
                {trackedLift} <span style={{ fontSize: "1rem" }}>min</span>
              </div>
            </div>
          </div>
        )}

        {!loading && trackedCalories === 0 && trackedCardio === 0 && trackedLift === 0 && (
          <div
            style={{
              backgroundColor: "#fff4e6",
              border: "1px solid #ffd700",
              padding: "1rem 1.5rem",
              borderRadius: "8px",
              marginBottom: "2rem",
              display: "inline-block"
            }}
          >
            <p style={{ margin: 0, color: "#666" }}>
              💡 Start your day by updating your goals or logging your activities!
            </p>
          </div>
        )}
      </div>

      {/* Navigation Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
          marginTop: "2rem"
        }}
      >
        {navigationCards.map((card) => (
          <div
            key={card.route}
            onClick={() => navigate(card.route)}
            style={{
              backgroundColor: "white",
              border: "2px solid #e0e0e0",
              borderRadius: "12px",
              padding: "2rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = card.color;
              e.currentTarget.style.boxShadow = `0 8px 16px rgba(0,0,0,0.15)`;
              e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#e0e0e0";
              e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                fontSize: "3.5rem",
                marginBottom: "1rem"
              }}
            >
              {card.icon}
            </div>
            <h2
              style={{
                margin: "0 0 0.75rem 0",
                fontSize: "1.5rem",
                fontWeight: "bold",
                color: "#333"
              }}
            >
              {card.title}
            </h2>
            <p
              style={{
                margin: "0 0 1.5rem 0",
                fontSize: "1rem",
                color: "#666",
                lineHeight: "1.5"
              }}
            >
              {card.description}
            </p>
            <div
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: card.color,
                color: "white",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "1rem",
                transition: "all 0.2s ease"
              }}
            >
              Go to {card.title} →
            </div>
          </div>
        ))}
      </div>

      {/* Quick Tips Section */}
      <div
        style={{
          marginTop: "3rem",
          padding: "1.5rem",
          backgroundColor: "#e7f3ff",
          borderRadius: "12px",
          borderLeft: "4px solid #007bff"
        }}
      >
        <h3 style={{ margin: "0 0 1rem 0", color: "#333", fontSize: "1.2rem" }}>
          💡 Quick Tips
        </h3>
        <ul style={{ margin: 0, paddingLeft: "1.5rem", color: "#555", lineHeight: "1.8" }}>
          <li>Set your daily goals to track progress effectively</li>
          <li>Log your meals and exercises throughout the day</li>
          <li>Review your trends weekly to see your improvement</li>
        </ul>
      </div>
    </div>
  );
}
