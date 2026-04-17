import React, { useState } from "react";

function Rifas() {
  const [myRaffles] = useState([
    {
    
      id: 1,
      title: "Rifa do iPhone 15",
      subtitle: "Aguardando sorteio - será realizado dia 23/04",
      number: 23,
      price: 10,
    },
    {
      id: 2,
      title: "Rifa do PlayStation 5",
      subtitle: "Sorteio em andamento...",
      number: 87,
      price: 20,
    },
    {
      id: 3,
      title: "Rifa da Moto",
      subtitle: "Sorteio realizado, você não foi contemplado com o prêmio",
      number: 5,
      price: 50,
    },
  ]);

  return (
    <div style={styles.container}>
      <h1>Minhas Rifas</h1>

      {myRaffles.length === 0 ? (
        <p>Você ainda não comprou nenhuma rifa.</p>
      ) : (
        <div style={styles.list}>
          {myRaffles.map((raffle) => (
            <div key={raffle.id} style={styles.card}>
              <h2>{raffle.title}</h2>
              <p style={styles.subtitle}>{raffle.subtitle}</p>

              <p>
                🎟 Número: <strong>{raffle.number}</strong>
              </p>

              <p>
                💰 Valor: R$ {raffle.price}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
    border: "5px",
  },
  subtitle:{
      fontSize: "14px",
      color: "#555",
      marginBottom: "5px",
  },
  list: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "500px",
    marginInline: "auto",
  },

  card: {
    padding: "20px",
    border: "solid black 5px",
    background: "#f1f5f9",
    borderRadius: "12px",
    textAlign: "left",
  },
};

export default Rifas;