import React from "react";

/**
 * NumberCard represents an individual interactive unit in the ticket matrix selection board.
 * Aligned with standard properties coming from the parent view context layer.
 */
function NumberCard({ number, sold, onClick }) {
  
  /**
   * Intercepts and delegates structural selection events back to the parent component context
   * only if the ticket target state is unreserved.
   */
  function handleClick() {
    if (!sold && onClick) {
      onClick(number);
    }
  }

  // Dynamic style composition matching runtime allocation states
  const computedCardStyle = {
    ...styles.base,
    backgroundColor: sold ? "#cbd5e1" : "#10b981",
    cursor: sold ? "not-allowed" : "pointer",
    boxShadow: sold ? "none" : "0 4px 6px -1px rgba(16, 185, 129, 0.2)",
    transform: sold ? "none" : "scale(1)",
  };

  return (
    <div 
      onClick={handleClick} 
      style={computedCardStyle}
      title={sold ? `Número ${number} - Esgotado` : `Selecionar Número ${number}`}
    >
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
    fontWeight: "600",
    fontSize: "0.95rem",
    color: "#ffffff",
    transition: "transform 0.15s ease, background-color 0.15s ease",
    userSelect: "none",
  },
};

export default NumberCard;