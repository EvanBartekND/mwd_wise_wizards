import React, { useState, useEffect } from "react";
import {
  getUserProfile,
  updateUserGoals,
  updateBodyData,
  updateUserProfile,
  hasUserGoals
} from "../../Services/People";
import GoalPrompt from "./GoalPrompt";
import DailyGoalsDisplay from "./DailyGoalsDisplay";
import DailyGoalsForm from "./DailyGoalsForm";
import BodyDataForm from "./BodyDataForm";
import CalorieCalculator from "./CalorieCalculator";

export default function Daily({ currentUser }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("loading"); // "loading" | "bodyData" | "goalPrompt" | "display" | "calculate" | "manual"
  const [saving, setSaving] = useState(false);
  const [calculatorBodyData, setCalculatorBodyData] = useState(null);

  // Load user profile on mount
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    loadProfile();
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const userProfile = await getUserProfile();
      setProfile(userProfile);

      // Determine view mode based on what data exists
      if (!userProfile.goalsSet) {
        // Check if body data exists first
        const hasBodyData = userProfile.height_cm && userProfile.weight_kg && userProfile.age_years && userProfile.gender;
        if (!hasBodyData) {
          // Step 1: Get body measurements first
          setViewMode("bodyData");
        } else {
          // Step 2: Body data exists, now get calorie goals
          setViewMode("goalPrompt");
        }
      } else {
        setViewMode("display");
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError("Failed to load your profile. Please try again.");
      setViewMode("bodyData"); // Start with body data even on error
    } finally {
      setLoading(false);
    }
  };

  // Handle prompt method selection
  const handlePromptMethod = (method) => {
    if (method === "calculate") {
      setViewMode("calculate");
      // Initialize calculator body data with existing profile data
      if (profile) {
        setCalculatorBodyData({
          height_cm: profile.height_cm,
          weight_kg: profile.weight_kg,
          age_years: profile.age_years,
          bodyFat_percent: profile.bodyFat_percent,
          gender: profile.gender
        });
      }
    } else if (method === "manual") {
      setViewMode("manual");
    }
  };

  // Handle saving goals (from manual form or calculated)
  const handleSaveGoals = async (goals) => {
    try {
      setSaving(true);
      await updateUserGoals(goals);
      // Reload profile to get updated data
      await loadProfile();
      // Switch to display view after saving
      setViewMode("display");
    } catch (err) {
      console.error("Error saving goals:", err);
      alert("Failed to save goals. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle saving body data
  const handleSaveBodyData = async (bodyData) => {
    try {
      setSaving(true);
      await updateBodyData(bodyData);
      // Update local calculator body data
      setCalculatorBodyData(bodyData);
      
      // If we're in bodyData step, move to goal prompt next
      if (viewMode === "bodyData") {
        // Check if we came from calculate view (editing existing body data)
        const userProfile = await getUserProfile();
        setProfile(userProfile);
        if (userProfile.goalsSet) {
          // Editing existing data from calculate view - return to calculate
          setViewMode("calculate");
        } else {
          // Initial setup - go to goal prompt
          setViewMode("goalPrompt");
        }
      } else if (viewMode === "calculate") {
        // If in calculate mode, just update the local data
        setCalculatorBodyData((prev) => ({ ...prev, ...bodyData }));
        await loadProfile();
      } else {
        // Otherwise just reload
        await loadProfile();
      }
    } catch (err) {
      console.error("Error saving body data:", err);
      alert("Failed to save body data. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle saving calculated goals (from calculator)
  const handleSaveCalculatedGoals = async (calculatedGoals) => {
    try {
      setSaving(true);
      // Save both goals and any body data that was entered
      await updateUserProfile({
        goals: calculatedGoals,
        bodyData: calculatorBodyData
      });
      // Reload profile
      await loadProfile();
      // Switch to display view
      setViewMode("display");
    } catch (err) {
      console.error("Error saving calculated goals:", err);
      alert("Failed to save goals. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle updating a single goal (from display edit)
  const handleUpdateGoal = async (goalKey, value) => {
    try {
      setSaving(true);
      await updateUserGoals({ [goalKey]: value });
      // Reload profile to get fresh data
      await loadProfile();
    } catch (err) {
      console.error("Error updating goal:", err);
      alert("Failed to update goal. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle calculator body data changes (for preview)
  const handleCalculatorBodyDataChange = (newBodyData) => {
    setCalculatorBodyData(newBodyData);
  };

  // Extract goals and bodyData from profile
  const goals = profile ? {
    calorieGoal: profile.calorieGoal,
    cardioGoal: profile.cardioGoal,
    liftGoal: profile.liftGoal,
    weightGoalType: profile.weightGoalType,
    weightGoalRate: profile.weightGoalRate,
    goalsSet: profile.goalsSet,
    goalsLastUpdated: profile.goalsLastUpdated
  } : null;

  const bodyData = profile ? {
    height_cm: profile.height_cm,
    weight_kg: profile.weight_kg,
    age_years: profile.age_years,
    bodyFat_percent: profile.bodyFat_percent,
    gender: profile.gender
  } : null;

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading your goals...</p>
      </div>
    );
  }

  // Error state
  if (error && viewMode === "loading") {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "red" }}>{error}</p>
        <button onClick={loadProfile} style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
          Retry
        </button>
      </div>
    );
  }

  // Not logged in
  if (!currentUser) {
    return <p className="daily-message">Please log in to view your daily goals.</p>;
  }

  // Render based on view mode
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Daily Goals for {currentUser.get("username")}</h1>

      {viewMode === "bodyData" && (
        <div>
          <BodyDataForm
            onSave={handleSaveBodyData}
            onChange={handleCalculatorBodyDataChange}
            initialData={bodyData || {}}
          />
          {goals?.goalsSet && (
            <button
              onClick={() => setViewMode("display")}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          )}
        </div>
      )}

      {viewMode === "goalPrompt" && (
        <GoalPrompt onSelectMethod={handlePromptMethod} />
      )}

      {viewMode === "display" && goals && (
        <>
          <DailyGoalsDisplay
            goals={goals}
            onUpdateGoal={(key, value) => {
              // Optimistic update - update local state immediately
              setProfile((prev) => {
                if (!prev) return prev;
                return {
                  ...prev,
                  [key]: value,
                  goalsLastUpdated: new Date()
                };
              });
            }}
            onSaveGoal={handleUpdateGoal}
          />
          <div style={{ marginTop: "2rem", padding: "1rem", borderTop: "1px solid #ddd" }}>
            <button
              onClick={() => setViewMode("calculate")}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "0.5rem",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Recalculate Goals
            </button>
            <button
              onClick={() => setViewMode("manual")}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Edit Goals Manually
            </button>
          </div>
        </>
      )}

      {viewMode === "calculate" && (
        <div>
          <div style={{ marginBottom: "1rem", padding: "1rem", backgroundColor: "#e7f3ff", borderRadius: "4px" }}>
            <p style={{ margin: 0, color: "#666" }}>
              Using your body measurements: {bodyData?.height_cm ? `${Math.round(bodyData.height_cm)}cm` : "—"}, 
              {bodyData?.weight_kg ? ` ${Math.round(bodyData.weight_kg)}kg` : " —"}, 
              {bodyData?.age_years ? ` Age ${bodyData.age_years}` : " —"}
            </p>
            <button
              onClick={() => setViewMode("bodyData")}
              style={{
                marginTop: "0.5rem",
                padding: "0.25rem 0.75rem",
                backgroundColor: "transparent",
                color: "#007bff",
                border: "1px solid #007bff",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem"
              }}
            >
              Edit Body Data
            </button>
          </div>
          <CalorieCalculator
            bodyData={calculatorBodyData || bodyData || {}}
            onSaveCalculatedGoals={handleSaveCalculatedGoals}
          />
          <button
            onClick={() => setViewMode(goals?.goalsSet ? "display" : "goalPrompt")}
            style={{
              marginTop: "2rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      )}

      {viewMode === "manual" && (
        <div>
          <DailyGoalsForm
            onSave={handleSaveGoals}
            initialValues={goals || {}}
          />
          <button
            onClick={() => setViewMode(goals?.goalsSet ? "display" : "goalPrompt")}
            style={{
              marginTop: "2rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {goals?.goalsSet ? "Back to Goals" : "Cancel"}
          </button>
        </div>
      )}

      {saving && (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", backgroundColor: "#007bff", color: "white", padding: "1rem", borderRadius: "4px" }}>
          Saving...
        </div>
      )}
    </div>
  );
}
