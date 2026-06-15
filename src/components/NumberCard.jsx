import React from "react";

/**
 * NumberCard represents an individual raffle ticket slot option item.
 */
function NumberCard({ number, sold, onClick }) {
  /**
   * Dispatches click actions back to root layout if ticket is available.
   */
  function handleClick() {
    if (!sold && onClick) {
      onClick(number);
    }
  }

  // Dynamic composition of base structural style attributes depending on backend state
  const computedCardStyle = {
    ...styles.base,
    backgroundColor: sold ? "#cbd5e1" : "#10b981",
    cursor: sold ? "not-allowed" : "pointer",
    boxShadow: sold ? "none" : "0 4px 6px -1px rgba(0,0,0,0.1)",
  };

  return (
    <div onClick={handleClick} style={computedCardStyle}>
      {number}
    </div>
  );
}

const styles = {
  base: {
    width: "50px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    fontWeight: "bold",
    color: "#ffffff",
    transition: "transform 0.15s ease, background-color 0.15s ease",
    userSelect: "none",
  },
};

export default NumberCard;