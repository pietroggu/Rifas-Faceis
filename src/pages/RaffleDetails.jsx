import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import NumberCard from "../components/NumberCard";
import PurchaseModal from "../components/PurchaseModal";
import RaffleService from "../services/raffleService";
import { ShoppingCart } from "lucide-react";

export default function RaffleDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart();
  const navigate = useNavigate();

  const [raffle, setRaffle] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchNumber, setSearchNumber] = useState("");

  useEffect(() => {
    async function fetchRaffleData() {
      try {
        setLoading(true);
        setError(null);

        const raffleData = await RaffleService.getRaffleById(id);
        setRaffle(raffleData);

        const totalTickets = raffleData.totalTickets || 100;
        const soldTickets = raffleData.tickets || [];

        const soldMap = new Map(
          soldTickets.map(ticket => [ticket.number, ticket])
        );

        const generatedGrid = Array.from({ length: totalTickets }, (_, index) => {
          const currentNumber = index + 1;
          const ticket = soldMap.get(currentNumber);
          return {
            id: currentNumber,
            number: currentNumber,
            isSold: !!ticket,
            validation: ticket ? (ticket.validation || 0) : 0,
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

    if (id) fetchRaffleData();
  }, [id]);

  const handleNumberClick = useCallback((number) => {
    if (raffle?.drawnAt) return;
    setSelectedNumber(number);
    setModalOpen(true);
  }, [raffle]);

  function handleConfirmPurchase(data) {
    addToCart({
      raffleId: id,
      raffleName: raffle.name,
      price: raffle.ticketPrice || 10,
      number: data.number,
    });
    setModalOpen(false);
  }

  const soldCount = numbers.filter(n => n.isSold && n.validation === 0).length;
  const raffleItemsInCart = cartItems.filter(item => item.raffleId === id).length;
  const availableCount = (raffle?.totalTickets || 0) - soldCount - raffleItemsInCart;
  const progress = raffle?.totalTickets
    ? Math.round((soldCount / raffle.totalTickets) * 100)
    : 0;

  const filteredNumbers = numbers.filter(num => {
    if (!searchNumber) return true;
    return num.number.toString().includes(searchNumber);
  });

  if (loading) return <p style={styles.stateText}>Carregando detalhes da rifa...</p>;
  if (error) return <p style={{ ...styles.stateText, color: "#ef4444" }}>{error}</p>;
  if (!raffle) return <p style={styles.stateText}>Rifa não encontrada.</p>;

  const winnerTicket = raffle.tickets?.find(t => t.id === raffle.winnerTicketId);

  return (
    <main style={styles.container}>
      <header>
        <h1>{raffle.name}</h1>
        {raffle.drawnAt && (
              <div style={styles.closedBanner}>
                🔒 As vendas estão encerradas para esta rifa.
              </div>
            )}
        {/* Card do vencedor — aparece apenas se o sorteio foi realizado */}
        {raffle.drawnAt && (
          <div style={styles.winnerCard}>
            <div style={styles.winnerCardHeader}>
              <div>
                <p style={styles.winnerCardTitle}>Sorteio realizado</p>
                <p style={styles.winnerCardDate}>
                  {new Date(raffle.drawnAt).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div style={styles.winnerDivider} />

            <div style={styles.winnerInfo}>
              <div style={styles.winnerInfoItem}>
                <span style={styles.winnerInfoLabel}>Número sorteado</span>
                <span style={styles.winnerInfoValue}>
                  #{winnerTicket?.number ?? "—"}
                </span>
              </div>
              <div style={styles.winnerInfoItem}>
                <span style={styles.winnerInfoLabel}>Vencedor</span>
                <span style={styles.winnerInfoValue}>
                  {raffle.winnerUser?.name ?? "—"}
                </span>
              </div>
            </div>
          </div>
        )}

        {raffle.description && (
          <p style={styles.description}>{raffle.description}</p>
        )}
      </header>

      {/* Botão de editar (para autores/admins) */}
      {(() => {
        const privilegedUsers = [3, 7];
        const canEdit =
          privilegedUsers.includes(Number(user?.id)) ||
          Number(raffle?.authorId) === Number(user?.id);

        return canEdit ? (
          <div style={{ maxWidth: "500px", margin: "0 auto 16px", textAlign: "center" }}>
            <button
              onClick={() => navigate(`/editar-rifa/${id}`)}
              style={{
                padding: "8px 18px",
                background: "#2563EB",
                color: "#fff",
                border: "none",
                alignItems: "center",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              ✏️ Editar rifa
            </button>
          </div>
        ) : null;
      })()}

      {cartItems.length > 0 && (
        <button onClick={() => navigate("/cart")} style={styles.floatingCart}>
          <ShoppingCart size={18} /> Carrinho ({raffleItemsInCart})
        </button>
      )}

      <div style={styles.prizeCard}>
        <span style={styles.prizeLabel}>🏆 PRÊMIO</span>
        <h2 style={styles.prizeText}>{raffle.prize}</h2>
      </div>

      {raffle.imageUrl && (
        <div style={styles.imageWrapper}>
          <img src={raffle.imageUrl} alt={raffle.name} style={styles.image} />
        </div>
      )}

      <section style={styles.metaDetails}>
        {raffle.category && <p>📁 Categoria: {raffle.category}</p>}
        <p>💰 Valor por número: <strong>{raffle.formattedPrice}</strong></p>
        <p>📅 Data do Sorteio: {raffle.formattedDrawDate}</p>
      </section>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <strong style={{ fontSize: "1.4rem", color: "#2563eb" }}>
            {raffle.totalTickets}
          </strong>
          <span>Total</span>
        </div>
        <div style={styles.statCard}>
          <strong style={{ fontSize: "1.4rem", color: "#64748b" }}>
            {soldCount}
          </strong>
          <span>Vendidos</span>
        </div>
        <div style={styles.statCard}>
          <strong style={{ fontSize: "1.4rem", color: "#10b981" }}>
            {availableCount}
          </strong>
          <span>Disponíveis</span>
        </div>
      </div>

      <div style={styles.progressWrapper}>
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBar, width: `${progress}%` }} />
        </div>
        <span style={styles.progressText}>{progress}% vendido</span>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "10px 20px",
            cursor: "pointer",
            backgroundColor: "#64748b",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontWeight: "600",
          }}
        >
          Ver Rifas
        </button>
      </div>

      <section style={styles.searchSection}>
        <input
          type="text"
          placeholder="🔍 Buscar número..."
          value={searchNumber}
          onChange={(e) => setSearchNumber(e.target.value)}
          style={styles.searchInput}
        />
      </section>

      <div style={styles.legend}>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: "#10b981" }} />
          Disponível
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: "#cbd5e1" }} />
          Reservado/Vendido
        </div>
        <div style={styles.legendItem}>
          <div style={{ ...styles.legendColor, background: "#2563eb" }} />
          No carrinho
        </div>
      </div>

      <section style={styles.grid} aria-label="Ticket Selection Grid">
        {filteredNumbers.map((num) => {
          const isInCart = cartItems.some(
            item => item.raffleId === id && item.number === num.number
          );
          return (
            <NumberCard
              key={num.id}
              number={num.number}
              sold={num.isSold && num.validation === 0}
              isInCart={isInCart}
              onClick={handleNumberClick}
              disabled={!!raffle.drawnAt}
            />
          );
        })}
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
  container: {
    padding: "40px 20px 120px",
    textAlign: "center",
    backgroundColor: "#f5f6fa",
    minHeight: "100vh",
  },

  description: {
    color: "#475569",
    fontSize: "1.1rem",
    margin: "10px 0 20px",
  },

  /* ---------- CARD DO VENCEDOR ---------- */

  winnerCard: {
    maxWidth: "500px",
    margin: "16px auto 20px",
    background: "#fefce8",
    border: "1px solid #fde68a",
    borderRadius: "12px",
    padding: "20px 24px",
    textAlign: "left",
    boxSizing: "border-box",
  },

  winnerCardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },

  winnerTrophy: {
    fontSize: "2.2rem",
    lineHeight: 1,
    flexShrink: 0,
  },

  winnerCardTitle: {
    margin: 0,
    fontWeight: "700",
    color: "#92400e",
    fontSize: "1rem",
  },

  winnerCardDate: {
    margin: "2px 0 0",
    color: "#b45309",
    fontSize: "0.82rem",
  },

  winnerDivider: {
    borderTop: "1px solid #fde68a",
    margin: "14px 0",
  },

  winnerInfo: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },

  winnerInfoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  winnerInfoLabel: {
    fontSize: "0.75rem",
    color: "#92400e",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  winnerInfoValue: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#78350f",
  },

  /* ---------- RESTANTE ---------- */

  imageWrapper: {
    margin: "20px auto",
    maxWidth: "500px",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },

  image: {
    width: "100%",
    height: "auto",
    display: "block",
    objectFit: "cover",
    maxHeight: "300px",
  },

  metaDetails: {
    margin: "20px auto",
    maxWidth: "500px",
    padding: "15px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    textAlign: "left",
  },

  stateText: {
    textAlign: "center",
    padding: "40px",
    fontSize: "1.1rem",
    color: "#64748b",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 50px)",
    gap: "10px",
    justifyContent: "center",
    marginTop: "30px",
  },

  prizeCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    margin: "0 auto 20px",
    maxWidth: "700px",
    borderLeft: "6px solid #f59e0b",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },

  prizeLabel: {
    color: "#f59e0b",
    fontWeight: "700",
    fontSize: "0.85rem",
    textTransform: "uppercase",
  },

  prizeText: {
    color: "#0f172a",
    marginTop: "8px",
    fontSize: "1.5rem",
    fontWeight: "700",
  },

  floatingCart: {
    position: "fixed",
    bottom: "70px",
    right: "24px",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "999px",
    padding: "14px 18px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
  },

  progressWrapper: {
    maxWidth: "500px",
    margin: "10px auto 20px",
  },

  progressText: {
    display: "block",
    marginTop: "6px",
    color: "#64748b",
    fontSize: "0.9rem",
    fontWeight: "600",
  },

  progressContainer: {
    width: "100%",
    maxWidth: "500px",
    height: "12px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
    margin: "10px auto 20px",
  },

  progressBar: {
    height: "100%",
    background: "#10b981",
  },

  statsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
    margin: "20px 0",
  },

  statCard: {
    background: "#fff",
    padding: "15px",
    minWidth: "90px",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    display: "flex",
    textAlign: "center",
    flexDirection: "column",
    gap: "5px",
  },

  searchSection: {
    marginTop: "25px",
    marginBottom: "20px",
  },

  searchInput: {
    width: "100%",
    maxWidth: "300px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
  },

  legend: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "20px",
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.9rem",
  },

  legendColor: {
    width: "16px",
    height: "16px",
    borderRadius: "4px",
  },
  closedBanner: {
    maxWidth: "500px",
    margin: "0 auto 16px",
    background: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "10px 16px",
    color: "#64748b",
    fontWeight: "600",
    fontSize: "0.9rem",
    textAlign: "center",
  },
};