import React, { useEffect, useState } from "react";
import RaffleCard from "../components/RaffleCard";

/**
 * Página principal que lista as rifas buscadas do backend
 */
function Home() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function fetchRifas() {
      try {
        const response = await fetch("http://localhost:3000/rifas");
        if (!response.ok) {
          throw new Error("Erro ao buscar rifas");
        }
        const data = await response.json();
        setRifas(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRifas();
  }, []);

  if (loading) {
    return <p style={styles.center}>Carregando rifas...</p>;
  }

  if (erro) {
    return <p style={styles.erro}>Erro: {erro}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.center}>🎯 Rifas Disponíveis</h1>

      {rifas.length === 0 ? (
        <p style={styles.center}>Nenhuma rifa disponível no momento.</p>
      ) : (
        <div style={styles.grid}>
          {rifas.map((rifa) => (
            <div style={styles.cardWrapper} key={rifa.id}>
              <RaffleCard
                id={rifa.id}
                nome={rifa.nome}
                descricao={rifa.descricao}
                valor_numero={rifa.valor_numero}
                quantidade_numeros={rifa.quantidade_numeros}
              />
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
  },
  center: {
    textAlign: "center",
    padding: "10px",
    margin: "5px",
  },
  erro: {
    textAlign: "center",
    color: "red",
    marginTop: "20px",
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
