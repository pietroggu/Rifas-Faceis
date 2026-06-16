import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NumberCard from "../components/NumberCard";
import PurchaseModal from "../components/PurchaseModal";
import RaffleService from "../services/raffleService";

/**
 * Raffle component renders the deep-dive interactive view for a single raffle instance.
 * Maps out the reactive ticket allocation grid matrix directly linked to Prisma schema dimensions.
 */
function Raffle() {
  const { id } = useParams();
  const { user } = useAuth();

  const [raffle, setRaffle] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    /**
     * Resolves single raffle record datasets and initializes the virtual interactive ticket grid.
     */
    async function fetchData() {
      try {
        setLoading(true);
        const raffleData = await RaffleService.getRaffleById(id);
        setRaffle(raffleData);

        const totalTickets = raffleData.totalTickets || 100;
        const soldTickets = raffleData.tickets || [];

        // Generates an immutable tracking array representing every individual indexable slot
        const generatedGrid = Array.from({ length: totalTickets }, (_, index) => {
          const currentNumber = index + 1;
          
          // A ticket is occupied if its sequence number matches an item in the related tickets list
          const isSold = soldTickets.some((ticket) => ticket.number === currentNumber);

          return {
            id: currentNumber,
            number: currentNumber,
            isSold: isSold,
          };
        });

        setNumbers(generatedGrid);
      } catch (error) {
        console.error("Error building structural raffle matrix view:", error);
        alert("Erro ao carregar os detalhes da rifa.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchData();
    }
  }, [id]);

  /**
   * Selection event coordinator managing booking targets.
   * @param {number} number - The clicked ticket sequence index identifier.
   */
  function handleNumberClick(number) {
    setSelectedNumber(number);
    setModalOpen(true);
  }

  /**
   * Dispatches validation parameters to backend layers and reflects local operational status instantly.
   * @param {Object} data - Form variables payload forwarded via modal layers.
   */
  async function handleConfirmPurchase(data) {
    try {
      // Binds the active session ID to the outbound transaction request
      await RaffleService.purchaseNumber(id, data.number, {
        name: data.name,
        phone: data.phone,
        userId: data.userId, 
      });

      alert(`Compra realizada com sucesso!\nNúmero: ${data.number}`);
      setModalOpen(false);

      // Instantaneous local UI mutation to preserve bandwidth and skip roundtrip loading lags
      setNumbers((prev) =>
        prev.map((n) => (n.number === data.number ? { ...n, isSold: true } : n))
      );
    } catch (err) {
      alert(err.message || "Erro ao registrar compra. Tente novamente.");
    }
  }

  if (loading) return <p style={styles.stateText}>Carregando detalhes da rifa...</p>;
  if (!raffle) return <p style={styles.stateText}>Rifa não encontrada.</p>;

  return (
    <div style={styles.container}>
      <h1>{raffle.name}</h1>
      {raffle.description && <p>{raffle.description}</p>}

      <div style={styles.metaDetails}>
        <p>🏆 Prêmio: <strong>{raffle.prize}</strong></p>
        {raffle.category && <p>📁 Categoria: {raffle.category}</p>}
        <p>💰 Valor por número: <strong>{raffle.formattedPrice}</strong></p>
        <p>📅 Data do Sorteio: {raffle.formattedDrawDate}</p>
      </div>

      {/* Ticket Grid Execution Block */}
      <div style={styles.grid}>
        {numbers.map((num) => (
          <NumberCard
            key={num.id}
            number={num.number}
            sold={num.isSold}
            onClick={handleNumberClick}
          />
        ))}
      </div>

      <PurchaseModal
        open={modalOpen}
        number={selectedNumber}
        price={raffle.ticketPrice}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmPurchase}
        user={user}
      />
    </div>
  );
}

const styles = {
  container: { padding: "40px 20px", textAlign: "center", backgroundColor: "#f8fafc", minHeight: "100vh" },
  metaDetails: { margin: "20px auto", maxWidth: "500px", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "left" },
  stateText: { textAlign: "center", padding: "40px", fontSize: "1.1rem", color: "#64748b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, 50px)", gap: "10px", justifyContent: "center", marginTop: "30px" },
};

export default Raffle;