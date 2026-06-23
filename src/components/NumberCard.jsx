import React from "react";

/**
 * NumberCard represents an individual interactive unit in the ticket matrix selection board.
 * Aligned with standard properties coming from the parent view context layer.
 */
function NumberCard({ number, sold, isCancelled, isInCart, onClick, disabled }) {
  function handleClick() {
    if (disabled) return;
    const isAvailable = !sold || isCancelled;
    if (isAvailable && onClick) {
      onClick(number);
    }
  }

  const isBlocked = (sold && !isCancelled) || isInCart;

  let backgroundColor = "#10b981";
  if (sold) backgroundColor = "#cbd5e1";
  if (isCancelled) backgroundColor = "#ef4444";
  if (isInCart) backgroundColor = "#2563eb";
  if (disabled && !sold && !isInCart) backgroundColor = "#cbd5e1";

  const computedCardStyle = {
    ...styles.base,
    backgroundColor,
    cursor: isBlocked || disabled ? "not-allowed" : "pointer",
    opacity: disabled && !sold && !isInCart ? 1 : 1,
  };

  return (
    <div
      onClick={handleClick}
      style={computedCardStyle}
      title={
        disabled
          ? `Número ${number} - Vendas encerradas`
          : isBlocked
          ? `Número ${number} - Esgotado`
          : `Selecionar Número ${number}`
      }
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