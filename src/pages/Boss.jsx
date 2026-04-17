import React, { useState } from "react";
import RaffleCard from "../components/RaffleCard";

function Boss() {
  const [raffles, setRaffles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [text, settext] = useState(true);

  const [newRaffle, setNewRaffle] = useState({
    title: "",
    price: "",
    totalNumbers: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setNewRaffle({ ...newRaffle, [name]: value });
  }

  function handleCreate() {
    if (!newRaffle.title || !newRaffle.price || !newRaffle.totalNumbers) {
      alert("Preencha todos os campos!");
      return;
    }

    const raffle = {
      id: Date.now(),
      title: newRaffle.title,
      description: "Rifa criada por você",
      price: newRaffle.price,
      totalNumbers: newRaffle.totalNumbers,
    };

    setRaffles([...raffles, raffle]);

    setNewRaffle({ title: "", price: "", totalNumbers: "" });
    setShowForm(false);
  }

  return (
    <div style={styles.container}>
      <h1>Gerenciar Rifas</h1>

      <button style={styles.button} onClick={() => setShowForm(!showForm)}>
        + Criar nova rifa
      </button>

      {showForm && (
        <div style={styles.form}>
          <h2>Criar nova rifa</h2>

          <input
            style={styles.input}
            type="text"
            name="title"
            placeholder="Nome da rifa"
            value={newRaffle.title}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="number"
            name="price"
            placeholder="Preço (R$)"
            value={newRaffle.price}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            type="number"
            name="totalNumbers"
            placeholder="Quantidade de números"
            value={newRaffle.totalNumbers}
            onChange={handleChange}
          />

          <button style={styles.createButton} onClick={handleCreate}>
            Criar Rifa
          </button>
        </div>
      )}
      {text && (
        <div style={styles.summaryCard}>
          <h2 style={styles.summaryTitle}>Minha Rifa</h2>

          <div style={styles.summaryItem}>
            <span>📱 Produto:</span>
            <strong>iPhone</strong>
          </div>

          <div style={styles.summaryItem}>
            <span>🎟 Rifas vendidas:</span>
            <strong>8</strong>
          </div>

          <div style={styles.summaryItem}>
            <span>💰 Valor arrecadado:</span>
            <strong>R$ 120,00</strong>
          </div>
        </div>
      )}

      <div style={styles.grid}>
        {raffles.map((raffle) => (
          <div style={styles.cardWrapper} key={raffle.id}>
            <RaffleCard {...raffle} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  summaryCard: {
  marginTop: "20px",
  width: "90%",
  maxWidth: "400px",
  margin: "20px auto",
  padding: "20px",
  background: "#f1f5f9",
  borderRadius: "12px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  textAlign: "left",
  },

  summaryTitle: {
    textAlign: "center",
    marginBottom: "10px",
  },

  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
  },
  button: {
    padding: "12px 20px",
    marginTop: "10px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  rifas_adquiridas:{
    marginTop: "20px",
    color: "black",
    border: "solid black 4px"
  },
  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "90%",
    maxWidth: "400px", 
    margin: "0 auto", 
    padding: "10px",
    background: "#f1f5f9",
    borderRadius: "12px",
    alignItems: "stretch", 
  },

  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    boxSizing: "border-box",
  },

  createButton: {
    padding: "12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    width: "100%", 
    boxSizing: "border-box",
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    marginTop: "30px",
  },

  cardWrapper: {
    flex: "1 1 280px",
    maxWidth: "320px",
    width: "100%",
  },
};

export default Boss;