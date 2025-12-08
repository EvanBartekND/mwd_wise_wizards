import React, { useState, useEffect } from "react";
import BodyDataInput from "./BodyDataInput";
import { feetToCm, lbsToKg, validateBodyData } from "../../Utils/calculations";

/**
 * Body data input form component
 * @param {function} onSave - Callback to save body data
 * @param {function} onChange - Callback when data changes (for calculator preview)
 * @param {object} initialData - Initial body data values
 */
const BodyDataForm = ({ onSave, onChange, initialData = {} }) => {
  const [bodyData, setBodyData] = useState({
    height_cm: initialData.height_cm || null,
    weight_kg: initialData.weight_kg || null,
    age_years: initialData.age_years || null,
    bodyFat_percent: initialData.bodyFat_percent || null,
    gender: initialData.gender || null
  });

  const [heightFeet, setHeightFeet] = useState(null);
  const [heightInches, setHeightInches] = useState(null);
  const [weightLbs, setWeightLbs] = useState(null);
  const [useMetric, setUseMetric] = useState(true);

  useEffect(() => {
    if (bodyData.height_cm && !heightFeet) {
      const totalInches = bodyData.height_cm / 2.54;
      setHeightFeet(Math.floor(totalInches / 12));
      setHeightInches(Math.round(totalInches % 12));
    }
    if (bodyData.weight_kg && !weightLbs) {
      setWeightLbs((bodyData.weight_kg * 2.20462).toFixed(1));
    }
  }, [bodyData.height_cm, bodyData.weight_kg, heightFeet, weightLbs]);

  const handleFieldChange = (field, value) => {
    const newData = { ...bodyData, [field]: value };
    setBodyData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const handleHeightChange = (feet, inches) => {
    setHeightFeet(feet);
    setHeightInches(inches);
    const cm = feetToCm(feet || 0, inches || 0);
    handleFieldChange("height_cm", cm || null);
  };

  const handleWeightChange = (lbs) => {
    setWeightLbs(lbs);
    const kg = lbs ? lbsToKg(parseFloat(lbs)) : null;
    handleFieldChange("weight_kg", kg);
  };

  const handleSave = async () => {
    // Check minimum required fields for body data
    if (!bodyData.height_cm || !bodyData.weight_kg || !bodyData.age_years || !bodyData.gender) {
      alert("Please fill in all required fields: Height, Weight, Age, and Gender.");
      return;
    }
    
    const validation = validateBodyData(bodyData);
    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }
    if (onSave) {
      await onSave(bodyData);
      // Don't show alert - let parent handle next step
    }
  };

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" }
  ];

  return (
    <div>
      <h2>Let's Start With Your Body Measurements</h2>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        We need your basic measurements first. You'll set your calorie goals next.
      </p>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          <input
            type="checkbox"
            checked={useMetric}
            onChange={(e) => setUseMetric(e.target.checked)}
            style={{ marginRight: "0.5rem" }}
          />
          Use Metric (kg, cm)
        </label>
      </div>

      {useMetric ? (
        <>
          <BodyDataInput
            label="Height"
            field="height_cm"
            value={bodyData.height_cm}
            onChange={handleFieldChange}
            unit="cm"
            required
          />
          <BodyDataInput
            label="Weight"
            field="weight_kg"
            value={bodyData.weight_kg}
            onChange={handleFieldChange}
            unit="kg"
            required
          />
        </>
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Height <span style={{ color: "#666" }}>(feet and inches)</span>
            </label>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="number"
                value={heightFeet || ""}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0, heightInches || 0)}
                placeholder="Feet"
                style={{ padding: "0.5rem", width: "80px" }}
              />
              <span>ft</span>
              <input
                type="number"
                value={heightInches || ""}
                onChange={(e) => handleHeightChange(heightFeet || 0, parseInt(e.target.value) || 0)}
                placeholder="Inches"
                style={{ padding: "0.5rem", width: "80px" }}
              />
              <span>in</span>
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Weight <span style={{ color: "#666" }}>(lbs)</span>
            </label>
            <input
              type="number"
              value={weightLbs || ""}
              onChange={(e) => handleWeightChange(e.target.value)}
              placeholder="Weight in lbs"
              style={{ padding: "0.5rem", width: "200px" }}
            />
          </div>
        </>
      )}

      <BodyDataInput
        label="Age"
        field="age_years"
        value={bodyData.age_years}
        onChange={handleFieldChange}
        unit="years"
        required
      />

      <BodyDataInput
        label="Gender"
        field="gender"
        value={bodyData.gender}
        onChange={handleFieldChange}
        options={genderOptions}
        required
      />

      <BodyDataInput
        label="Body Fat Percentage"
        field="bodyFat_percent"
        value={bodyData.bodyFat_percent}
        onChange={handleFieldChange}
        unit="%"
      />
      <p style={{ fontSize: "0.85rem", color: "#666", marginTop: "-0.5rem", marginBottom: "1rem" }}>
        Optional - Leave blank to use standard calculation method
      </p>

      <button
        onClick={handleSave}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "1rem"
        }}
      >
        Continue to Set Goals
      </button>
    </div>
  );
};

export default BodyDataForm;

