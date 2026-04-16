import React, { useState } from "react";
import RaffleCard from "../components/RaffleCard";

function Boss() {
  const [raffles, setRaffles] = useState([]);
  const [showForm, setShowForm] = useState(false);

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

      {/* BOTÃO */}
      <button style={styles.button} onClick={() => setShowForm(!showForm)}>
        + Criar nova rifa
      </button>

      {/* FORM */}
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

      {/* LISTA */}
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

  button: {
    padding: "12px 20px",
    marginTop: "10px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    maxWidth: "500px",
    marginInline: "auto",
    padding: "30px",
    background: "#f1f5f9",
    borderRadius: "12px",
    minHeight: "300px",
    justifyContent: "center",
  },

  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
  },

  createButton: {
    padding: "12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
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