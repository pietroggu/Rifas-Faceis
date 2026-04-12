import React from "react";

/**
 * Componente que representa uma rifa individual
 * @param {Object} props
 * @param {string} props.title - Nome da rifa
 * @param {string} props.description - Descrição da rifa
 * @param {number} props.price - Preço por número
 * @param {number} props.totalNumbers - Quantidade total de números
 */
function RaffleCard({ title, description, price, totalNumbers }) {
  return (
    <div style={styles.card}>
      <h2>{title}</h2>
      <p>{description}</p>

      <div style={styles.info}>
        <span>💰 R$ {price.toFixed(2)}</span>
        <span>🎟 {totalNumbers} números</span>
      </div>

      <button style={styles.button}>
        Participar
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "16px",
    width: "280px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  info: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    cursor: "pointer",
  },
};

export default RaffleCard;