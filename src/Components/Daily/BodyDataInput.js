import React from "react";

/**
 * Reusable body data input component
 * @param {string} label - Label for the input
 * @param {string} field - Field name
 * @param {number|string} value - Current value
 * @param {function} onChange - Callback when value changes
 * @param {string} unit - Unit to display (e.g., "cm", "kg", "years", "%")
 * @param {string} type - Input type (default "number")
 * @param {boolean} required - Whether field is required
 */
const BodyDataInput = ({
  label,
  field,
  value,
  onChange,
  unit = "",
  type = "number",
  required = false,
  options = null // For select inputs
}) => {
  const handleChange = (e) => {
    // For select elements (when options are provided), use the string value directly
    // For number inputs, parse as float
    // For text inputs, use the string value
    let newValue;
    if (options) {
      // Select element - use string value directly, empty string becomes null
      newValue = e.target.value === "" ? null : e.target.value;
    } else if (type === "number") {
      // Number input - parse as float
      newValue = parseFloat(e.target.value) || null;
    } else {
      // Text input - use string value
      newValue = e.target.value;
    }
    onChange(field, newValue);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "500" }}>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
        {unit && <span style={{ marginLeft: "0.5rem", color: "#666", fontSize: "0.9rem" }}>({unit})</span>}
      </label>
      {options ? (
        <select
          value={value || ""}
          onChange={handleChange}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "100%",
            maxWidth: "300px"
          }}
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={handleChange}
          placeholder={`Enter ${label.toLowerCase()}`}
          style={{
            padding: "0.5rem",
            fontSize: "1rem",
            border: "1px solid #ccc",
            borderRadius: "4px",
            width: "100%",
            maxWidth: "300px"
          }}
        />
      )}
    </div>
  );
};

export default BodyDataInput;

