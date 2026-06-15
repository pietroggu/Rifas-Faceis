import React, { useState, useEffect } from "react";

/**
 * PurchaseModal shows a focus context display capturing user metadata fields to buy a raffle slot.
 */
function PurchaseModal({ open, number, price, onClose, onConfirm, user }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Hydrate user data fields instantly when modal triggers open based on authentication state
  useEffect(() => {
    if (open && user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [open, user]);

  if (!open) return null;

  /**
   * Action trigger parsing user inputs and bubbling data properties context outwards.
   */
  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !phone) {
      alert("Preencha todos os campos!");
      return;
    }

    onConfirm({
      number,
      name,
      phone,
    });

    // Reset input fields states cleanly for processing upcoming transactions
    setName("");
    setPhone("");
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Comprar número {number}</h2>
        <p style={styles.subtitle}>Valor: R$ {price?.toFixed(2)}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <input
            type="tel"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancelar
            </button>
            <button type="submit" style={styles.confirmButton}>
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(15, 23, 42, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "340px",
    textAlign: "center",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "1.25rem",
    color: "#0f172a",
  },
  subtitle: {
    margin: "0 0 20px 0",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#2563EB",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "0.95rem",
    outline: "none",
    boxSizing: "border-box",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    background: "#f1f5f9",
    color: "#475569",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  confirmButton: {
    flex: 1,
    padding: "12px",
    background: "#10B981",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default PurchaseModal;