import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NumberCard from "../components/NumberCard";
import PurchaseModal from "../components/PurchaseModal";
import RaffleService from "../services/raffleService";

/**
 * RaffleDetails Component
 * Renders the detailed view of a single raffle, including its information,
 * image, and an interactive grid for ticket selection and purchasing.
 */
export default function RaffleDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  // State Management
  const [raffle, setRaffle] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  /**
   * Fetches the raffle data and builds the interactive ticket grid.
   */
  useEffect(() => {
    async function fetchRaffleData() {
      try {
        setLoading(true);
        setError(null);
        
        const raffleData = await RaffleService.getRaffleById(id);
        setRaffle(raffleData);

        const totalTickets = raffleData.totalTickets || 100;
        const soldTickets = raffleData.tickets || [];

        // Generate the ticket grid grid matrix based on total capacity
        const generatedGrid = Array.from({ length: totalTickets }, (_, index) => {
          const currentNumber = index + 1;
          const isSold = soldTickets.some((ticket) => ticket.number === currentNumber);

          return {
            id: currentNumber,
            number: currentNumber,
            isSold,
          };
        });

        setNumbers(generatedGrid);
      } catch (err) {
        console.error("Error fetching raffle details:", err);
        setError("Failed to load raffle details. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchRaffleData();
    }
  }, [id]);

  /**
   * Opens the purchase modal for the selected ticket number.
   * @param {number} number - The chosen ticket number.
   */
  const handleNumberClick = useCallback((number) => {
    setSelectedNumber(number);
    setModalOpen(true);
  }, []);

  /**
   * Handles the ticket purchase confirmation and updates the local state UI.
   * @param {Object} data - Purchase details from the modal form.
   */
  async function handleConfirmPurchase(data) {
    try {
      await RaffleService.purchaseNumber(id, data.number, {
        name: data.name,
        phone: data.phone,
        userId: data.userId, 
      });

      alert(`Compra realizada com sucesso!\nNúmero: ${data.number}`);
      setModalOpen(false);

      // Optimistic local state update to avoid an extra API roundtrip
      setNumbers((prevNumbers) =>
        prevNumbers.map((n) => (n.number === data.number ? { ...n, isSold: true } : n))
      );
    } catch (err) {
      alert(err.message || "Erro ao registrar compra. Tente novamente.");
    }
  }

  // Render State Blocks (Loading / Error)
  if (loading) return <p style={styles.stateText}>Carregando detalhes da rifa...</p>;
  if (error) return <p style={{ ...styles.stateText, color: "#ef4444" }}>{error}</p>;
  if (!raffle) return <p style={styles.stateText}>Rifa não encontrada.</p>;

  return (
    <main style={styles.container}>
      <header>
        <h1>{raffle.name}</h1>
        {raffle.description && <p style={styles.description}>{raffle.description}</p>}
      </header>

      {/* FIXED: Added image rendering support */}
      {raffle.imageUrl && (
        <div style={styles.imageWrapper}>
          <img src={raffle.imageUrl} alt={raffle.name} style={styles.image} />
        </div>
      )}

      <section style={styles.metaDetails}>
        <p>🏆 Prêmio: <strong>{raffle.prize}</strong></p>
        {raffle.category && <p>📁 Categoria: {raffle.category}</p>}
        <p>💰 Valor por número: <strong>{raffle.formattedPrice}</strong></p>
        <p>📅 Data do Sorteio: {raffle.formattedDrawDate}</p>
      </section>

      {/* Ticket Grid Execution Block */}
      <section style={styles.grid} aria-label="Ticket Selection Grid">
        {numbers.map((num) => (
          <NumberCard
            key={num.id}
            number={num.number}
            sold={num.isSold}
            onClick={handleNumberClick}
          />
        ))}
      </section>

      <PurchaseModal
        open={modalOpen}
        number={selectedNumber}
        price={raffle.ticketPrice}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmPurchase}
        user={user}
      />
    </main>
  );
}

const styles = {
  container: { padding: "40px 20px", textAlign: "center", backgroundColor: "#f8fafc", minHeight: "100vh" },
  description: { color: "#475569", fontSize: "1.1rem", margin: "10px 0 20px" },
  imageWrapper: { margin: "20px auto", maxWidth: "500px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  image: { width: "100%", height: "auto", display: "block", objectFit: "cover", maxHeight: "300px" },
  metaDetails: { margin: "20px auto", maxWidth: "500px", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "left" },
  stateText: { textAlign: "center", padding: "40px", fontSize: "1.1rem", color: "#64748b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, 50px)", gap: "10px", justifyContent: "center", marginTop: "30px" },
};