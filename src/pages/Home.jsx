import React from "react";
import RaffleCard from "../components/RaffleCard";

/**
 * Página principal que lista as rifas
 */
function Home() {
  // Simulação de dados (futuramente virá do backend)
  const raffles = [
    {
      id: 1,
      title: "iPhone 15",
      description: "Concorra a um iPhone 15 novinho!",
      price: 10,
      totalNumbers: 100,
    },
    {
      id: 2,
      title: "PlayStation 5",
      description: "Ganhe um PS5 edição digital",
      price: 15,
      totalNumbers: 150,
    },
    {
      id: 3,
      title: "Notebook Gamer",
      description: "Notebook RTX para jogos pesados",
      price: 20,
      totalNumbers: 200,
    },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.center}>🎯 Rifas Disponíveis</h1>

      <div style={styles.grid}>
        {raffles.map((raffle) => (
          <div style={styles.cardWrapper} key={raffle.id}>
            <RaffleCard
              title={raffle.title}
              description={raffle.description}
              price={raffle.price}
              totalNumbers={raffle.totalNumbers}
            />
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
  center:{
    textAlign: "center",
    padding: "10px",
    margin: "5px"
  },
  cardWrapper: {
  flex: "1 1 280px",
  maxWidth: "320px",
  width: "100%",
},
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    marginTop: "20px",
  },
};

export default Home;