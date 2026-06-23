import React from "react";

/**
 * NumberCard represents an individual interactive unit in the ticket matrix selection board.
 * Aligned with standard properties coming from the parent view context layer.
 */
function NumberCard({ number, sold, isCancelled, isInCart, onClick }) {
  /**
   * Intercepts and delegates structural selection events back to the parent component context
   * only if the ticket target state is unreserved.
   */
  function handleClick() {
    const isAvailable = !sold || isCancelled;
    if (isAvailable && onClick) {
      onClick(number);
    }
  }

  const isBlocked = (sold && !isCancelled) || isInCart;

  // Dynamic style composition matching runtime allocation states
  let backgroundColor = "#10b981";

  if (sold) {
    backgroundColor = "#cbd5e1";
  }

  if (isCancelled) {
    backgroundColor = "#ef4444";
  }

  if (isInCart) {
    backgroundColor = "#2563eb";
  }

  const computedCardStyle = {
    ...styles.base,
    backgroundColor,
    cursor: isBlocked ? "not-allowed" : "pointer",
  };

  return (
    <div 
      onClick={handleClick} 
      style={computedCardStyle}
      title={isBlocked ? `Número ${number} - Esgotado` : `Selecionar Número ${number}`}
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