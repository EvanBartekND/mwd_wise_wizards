import React, { useState, useEffect } from "react";

/**
 * Reusable goal input component with auto-save functionality
 * @param {string} label - Label for the input
 * @param {string} type - Input type (number, text, etc.)
 * @param {number|string} value - Current value
 * @param {function} onChange - Callback when value changes
 * @param {function} onSave - Callback to save (debounced)
 * @param {number} debounceMs - Debounce delay in milliseconds (default 500)
 * @param {function} validation - Optional validation function
 * @param {string} unit - Unit to display (e.g., "calories", "minutes")
 */
const GoalInput = ({
  label,
  type = "number",
  value,
  onChange,
  onSave,
  debounceMs = 500,
  validation,
  unit = "",
  placeholder = ""
}) => {
  const [localValue, setLocalValue] = useState(value || "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalValue(value || "");
  }, [value]);

  useEffect(() => {
    if (localValue === value) return;

    // Validate if validation function provided
    if (validation) {
      const validationResult = validation(localValue);
      if (!validationResult.isValid) {
        setError(validationResult.errors[0]);
        return;
      }
      setError("");
    }

    setSaving(true);
    setSaved(false);

    const timer = setTimeout(async () => {
      try {
        const numValue = type === "number" ? parseFloat(localValue) : localValue;
        if (onChange) {
          onChange(numValue);
        }
        if (onSave) {
          await onSave(numValue);
        }
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch (err) {
        setError(err.message || "Error saving");
      } finally {
        setSaving(false);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, value, onChange, onSave, debounceMs, type, validation]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        {label}
        {unit && <span style={{ marginLeft: "0.5rem", color: "#666" }}>({unit})</span>}
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <input
          type={type}
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            border: error ? "2px solid red" : "1px solid #ccc",
            borderRadius: "4px",
            width: "200px"
          }}
        />
        {saving && <span style={{ color: "#666", fontSize: "0.9rem" }}>Saving...</span>}
        {saved && !saving && (
          <span style={{ color: "green", fontSize: "0.9rem" }}>✓ Saved</span>
        )}
        {error && <span style={{ color: "red", fontSize: "0.9rem" }}>{error}</span>}
      </div>
    </div>
  );
};

export default GoalInput;

