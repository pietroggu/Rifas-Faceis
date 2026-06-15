import React from "react";

/**
 * Input component provides a reusable styled form input field with optional label and error display.
 */
function Input({ label, type = "text", value, onChange, error }) {
  return (
    <div style={styles.container}>
      {/* Renders the label element dynamically if text is supplied */}
      {label && <label style={styles.label}>{label}</label>}

      <input
        type={type}
        value={value}
        onChange={onChange}
        style={{
          ...styles.input,
          borderColor: error ? "#ef4444" : "#cbd5e1",
        }}
      />

      {/* Conditional Error Box Messaging view injection */}
      {error && <span style={styles.errorText}>{error}</span>}
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    marginBottom: "16px",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "0.875rem",
    fontWeight: "600",
    color: "#475569",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "0.95rem",
    borderRadius: "6px",
    border: "1px solid",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s ease",
  },
  errorText: {
    color: "#ef4444",
    fontSize: "0.75rem",
    marginTop: "4px",
    display: "block",
  },
};

export default Input;