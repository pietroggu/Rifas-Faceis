import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ticketApi } from "../api/ticket.api"; // Unified api module instance

/**
 * MyRaffles component displays a real-time list of raffles and tickets purchased by the authenticated user.
 */
function MyRaffles() {
  const navigate = useNavigate();
  const [myRaffles, setMyRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserTickets() {
      try {
        const data = await ticketApi.getMyPurchasedTickets();
        // Fallback guarantee to avoid structural map crashes over undefined objects
        setMyRaffles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserTickets();
  }, []);

  /**
   * Formats ISO DateTime strings into a friendly local presentation format.
   */
  function formatDrawDate(dateString) {
    if (!dateString) return "Data não definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  if (loading) return <p style={styles.center}>Carregando suas rifas...</p>;
  if (error) return <p style={styles.errorText}>Erro: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Minhas Rifas</h1>

      {myRaffles.length === 0 ? (
        <p style={styles.emptyMessage}>Você ainda não comprou nenhuma rifa.</p>
      ) : (
        <div style={styles.list}>
          {myRaffles.map((ticket) => {
            // Safe fallback handling in case the backend nests the relation inside a 'raffle' object
            const raffle = ticket.raffle || {};
            const raffleId = raffle.id || ticket.raffleId;
            const raffleName = raffle.name || "Rifa não identificada";
            const ticketPrice = raffle.ticketPrice || 0;
            const drawDateFormatted = formatDrawDate(raffle.drawDate);

            return (
              <div key={ticket.id} style={styles.card}>
                <h2 style={styles.cardTitle}>{raffleName}</h2>
                <p style={styles.subtitle}>Sorteio programado para: {drawDateFormatted}</p>
                
                <div style={styles.detailsGroup}>
                  <p style={styles.detailText}>
                    {/* Aligned with standard prisma Ticket schemas (usually 'number' or 'ticketNumber') */}
                    <strong>Número comprado:</strong> #{ticket.number ?? ticket.ticketNumber}
                  </p>
                  <p style={styles.detailText}>
                    <strong>Valor pago:</strong> R$ {ticketPrice.toFixed(2)}
                  </p>
                </div>

                {/* Redirects dynamically to the correct raffle details route */}
                <button 
                  style={styles.button}
                  onClick={() => navigate(`/rifa/${raffleId}`)}
                  disabled={!raffleId}
                >
                  Ver detalhes
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Centralized clean styling architecture
const styles = {
  container: {
    padding: "40px 20px",
    textAlign: "center",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  center: {
    textAlign: "center",
    padding: "40px 20px",
    color: "#64748b",
  },
  errorText: {
    textAlign: "center",
    color: "#ef4444",
    padding: "40px 20px",
    fontWeight: "600",
  },
  title: {
    marginBottom: "40px",
    color: "#1e293b",
    fontSize: "2rem",
    fontWeight: "bold",
  },
  emptyMessage: {
    color: "#64748b",
    fontSize: "1rem",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "500px",
    marginInline: "auto",
  },
  card: {
    padding: "24px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: "12px",
    textAlign: "left",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
  },
  cardTitle: {
    fontSize: "1.25rem",
    color: "#0f172a",
    margin: "0 0 6px 0",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: "0 0 16px 0",
  },
  detailsGroup: {
    borderTop: "1px solid #f1f5f9",
    paddingTop: "12px",
    marginBottom: "16px",
  },
  detailText: {
    margin: "4px 0",
    fontSize: "0.95rem",
    color: "#334155",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2563EB",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.95rem",
    transition: "background-color 0.2s ease",
  },
};

export default MyRaffles;