import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

/**
 * Reusable input component with label, validation feedback,
 * and password visibility toggle support.
 */
function Input({
  label,
  type = "text",
  value,
  onChange,
  error,
  autoFocus = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isPasswordField = type === "password";

  const inputType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  const inputStyle = {
    ...styles.input,
    padding: isPasswordField
      ? "10px 40px 10px 12px"
      : "10px 12px",
    borderColor: error ? "#ef4444" : "#cbd5e1",
    backgroundColor: error ? "#FEF2F2" : "#FFFFFF",
  };

  const eyeButtonStyle = {
    ...styles.eyeButton,
    color: isHovered ? "#2563EB" : "#64748b",
  };

  return (
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}

      <div style={styles.inputWrapper}>
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          autoFocus={autoFocus}
          style={inputStyle}
        />

        {isPasswordField && (
          <button
            type="button"
            aria-label={
              showPassword ? "Ocultar senha" : "Mostrar senha"
            }
            onClick={() => setShowPassword((prev) => !prev)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={eyeButtonStyle}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>

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

  inputWrapper: {
    position: "relative",
  },

  input: {
    width: "100%",
    fontSize: "0.95rem",
    borderRadius: "6px",
    border: "1px solid",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
  },

  eyeButton: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "18px",
    padding: 0,
  },

  errorText: {
    display: "block",
    marginTop: "4px",
    color: "#ef4444",
    fontSize: "0.75rem",
  },
};

export default Input;