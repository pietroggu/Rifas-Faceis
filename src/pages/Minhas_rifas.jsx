import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Rifas() {
  const navigate = useNavigate();

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
      subtitle: "Sorteio realizado, você não foi contemplado",
      number: 5,
      price: 50,
    },
  ]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Minhas Rifas</h1>

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
                💰 Valor: <strong>R$ {raffle.price}</strong>
              </p>

              <button
                style={styles.button}
                onMouseOver={(e) =>
                  (e.target.style.background = "#1d4ed8")
                }
                onMouseOut={(e) =>
                  (e.target.style.background = "#2563EB")
                }
                onMouseDown={(e) =>
                  (e.target.style.transform = "scale(0.97)")
                }
                onMouseUp={(e) =>
                  (e.target.style.transform = "scale(1)")
                }
                onClick={() => navigate(`/rifa/undefined`)}
              >
                Ver detalhes
              </button>
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

  title: {
    marginBottom: "50px",
  },

  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },

  list: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "500px",
    marginInline: "auto",
  },

  card: {
    padding: "20px",
    border: "1px solid #ddd",
    background: "#f8fafc",
    borderRadius: "12px",
    textAlign: "left",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    transition: "0.2s",
  },

  button: {
    marginTop: "15px",
    padding: "10px 16px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s ease",
  },
};

export default Rifas;