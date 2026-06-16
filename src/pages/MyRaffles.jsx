import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketService from "../services/ticketService";

/**
 * MyRaffles component displays raffles where the authenticated user has purchased tickets.
 * Groups tickets by raffle and shows all numbers purchased per raffle.
 * Uses the new RESTful API endpoint GET /api/users/me/tickets via TicketService.
 */
function MyRaffles() {
  const navigate = useNavigate();
  const [groupedRaffles, setGroupedRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUserTickets() {
      try {
        // Fetch all tickets purchased by the user
        const tickets = await TicketService.getMyPurchasedTickets();
        
        // Group tickets by raffle
        const grouped = groupTicketsByRaffle(tickets);
        setGroupedRaffles(grouped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUserTickets();
  }, []);

  /**
   * Groups tickets by raffle ID and aggregates raffle metadata.
   * @param {Array} tickets - Array of ticket objects
   * @returns {Array} Grouped raffles with ticket numbers
   */
  function groupTicketsByRaffle(tickets) {
    if (!Array.isArray(tickets) || tickets.length === 0) {
      return [];
    }

    const raffleMap = new Map();

    tickets.forEach((ticket) => {
      const raffle = ticket.raffle || {};
      const raffleId = raffle.id || ticket.raffleId;

      if (!raffleId) return;

      // Extract ticket number with fallback
      const ticketNumber = ticket.number ?? ticket.ticketNumber;
      if (!ticketNumber) return;

      // If this raffle doesn't exist in the map, create it
      if (!raffleMap.has(raffleId)) {
        raffleMap.set(raffleId, {
          id: raffleId,
          name: raffle.name || ticket.raffleName || "Rifa não identificada",
          prize: raffle.prize || "Prêmio não definido",
          imageUrl: raffle.imageUrl || raffle.prizeImage || raffle.image || null,
          ticketPrice: raffle.ticketPrice || 0,
          drawDate: raffle.drawDate,
          totalTickets: raffle.totalTickets || 0,
          tickets: [], // Will store ticket numbers
          purchasedAt: ticket.purchasedAt, // Keep latest purchase date
        });
      }

      // Add ticket number to the raffle's ticket list
      const raffleData = raffleMap.get(raffleId);
      raffleData.tickets.push({
        number: ticketNumber,
        id: ticket.id,
        purchasedAt: ticket.purchasedAt,
        isPaid: ticket.isPaid,
        statusLabel: ticket.statusLabel,
      });

      // Update purchase date if this ticket is newer
      if (ticket.purchasedAt && 
          (!raffleData.latestPurchase || new Date(ticket.purchasedAt) > new Date(raffleData.latestPurchase))) {
        raffleData.latestPurchase = ticket.purchasedAt;
      }
    });

    // Convert map to array and sort by latest purchase date
    return Array.from(raffleMap.values())
      .sort((a, b) => {
        const dateA = a.latestPurchase ? new Date(a.latestPurchase) : new Date(0);
        const dateB = b.latestPurchase ? new Date(b.latestPurchase) : new Date(0);
        return dateB - dateA; // Most recent first
      });
  }

  /**
   * Formats ISO DateTime strings into a friendly local presentation format.
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  function formatDrawDate(dateString) {
    if (!dateString) return "Data não definida";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    });
  }

  /**
   * Formats purchase date for display.
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date string
   */
  function formatPurchaseDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  /**
   * Formats currency values to Brazilian Real (BRL).
   * @param {number} value - Amount to format
   * @returns {string} Formatted currency string
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  /**
   * Sorts ticket numbers in ascending order.
   * @param {Array} tickets - Array of ticket objects
   * @returns {Array} Sorted tickets
   */
  function sortTicketNumbers(tickets) {
    return [...tickets].sort((a, b) => a.number - b.number);
  }

  /**
   * Handles image load errors by showing a fallback.
   * @param {Event} e - Image error event
   */
  function handleImageError(e) {
    e.target.onerror = null;
    e.target.style.display = 'none';
    // Show fallback text or icon
    const parent = e.target.parentElement;
    if (parent && !parent.querySelector('.fallback-icon')) {
      const fallback = document.createElement('div');
      fallback.className = 'fallback-icon';
      fallback.style.cssText = `
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #f1f5f9;
        color: #94a3b8;
        font-size: 3rem;
        border-radius: 8px;
      `;
      fallback.textContent = '🎁';
      parent.appendChild(fallback);
    }
  }

  if (loading) return <p style={styles.center}>Carregando suas rifas...</p>;
  if (error) return <p style={styles.errorText}>Erro: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Minhas Rifas</h1>

      {groupedRaffles.length === 0 ? (
        <p style={styles.emptyMessage}>Você ainda não comprou nenhuma rifa.</p>
      ) : (
        <div style={styles.list}>
          {groupedRaffles.map((raffle) => {
            const sortedTickets = sortTicketNumbers(raffle.tickets);
            const totalSpent = raffle.ticketPrice * raffle.tickets.length;
            const drawDateFormatted = formatDrawDate(raffle.drawDate);
            const hasImage = raffle.imageUrl && raffle.imageUrl.trim() !== '';

            return (
              <div key={raffle.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>{raffle.name}</h2>
                  <span style={styles.ticketCount}>
                    {raffle.tickets.length} {raffle.tickets.length === 1 ? "número" : "números"}
                  </span>
                </div>
                
                {/* Prize Image Section */}
                <div style={styles.prizeImageContainer}>
                  {hasImage ? (
                    <img 
                      src={raffle.imageUrl} 
                      alt={`Prêmio: ${raffle.prize}`}
                      style={styles.prizeImage}
                      onError={handleImageError}
                      loading="lazy"
                    />
                  ) : (
                    <div style={styles.prizeImagePlaceholder}>
                      <span style={styles.prizeEmoji}>🎁</span>
                      <span style={styles.prizePlaceholderText}>Imagem do prêmio</span>
                    </div>
                  )}
                </div>

                <p style={styles.subtitle}>
                  <strong>Prêmio:</strong> {raffle.prize}
                </p>
                <p style={styles.subtitle}>
                  <strong>Sorteio:</strong> {drawDateFormatted}
                </p>

                <div style={styles.detailsGroup}>
                  <div style={styles.ticketsGrid}>
                    <p style={styles.ticketsLabel}>
                      <strong>Números comprados:</strong>
                    </p>
                    <div style={styles.numbersContainer}>
                      {sortedTickets.map((ticket) => (
                        <span key={ticket.id} style={styles.numberBadge}>
                          #{ticket.number}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={styles.purchaseInfo}>
                    <p style={styles.detailText}>
                      <strong>Valor por número:</strong> {formatCurrency(raffle.ticketPrice)}
                    </p>
                    <p style={styles.detailText}>
                      <strong>Total gasto:</strong> {formatCurrency(totalSpent)}
                    </p>
                    {raffle.latestPurchase && (
                      <p style={styles.detailText}>
                        <strong>Última compra:</strong> {formatPurchaseDate(raffle.latestPurchase)}
                      </p>
                    )}
                  </div>
                </div>

                <button 
                  style={styles.button}
                  onClick={() => navigate(`/raffle/${raffle.id}`)}
                >
                  Ver detalhes da rifa
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
    fontSize: "1rem",
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
    maxWidth: "600px",
    marginInline: "auto",
  },
  card: {
    padding: "24px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: "12px",
    textAlign: "left",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  cardTitle: {
    fontSize: "1.25rem",
    color: "#0f172a",
    margin: "0",
  },
  ticketCount: {
    backgroundColor: "#e2e8f0",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    color: "#475569",
    whiteSpace: "nowrap",
  },
  prizeImageContainer: {
    width: "100%",
    height: "200px",
    marginBottom: "16px",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
    position: "relative",
  },
  prizeImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  prizeImagePlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
  },
  prizeEmoji: {
    fontSize: "3rem",
    marginBottom: "8px",
  },
  prizePlaceholderText: {
    fontSize: "0.875rem",
    color: "#94a3b8",
  },
  subtitle: {
    fontSize: "0.875rem",
    color: "#64748b",
    margin: "4px 0",
  },
  detailsGroup: {
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px",
    marginTop: "12px",
  },
  ticketsGrid: {
    marginBottom: "12px",
  },
  ticketsLabel: {
    margin: "0 0 8px 0",
    fontSize: "0.95rem",
    color: "#334155",
  },
  numbersContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  numberBadge: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    borderRadius: "6px",
    fontSize: "0.9rem",
    fontWeight: "600",
    fontFamily: "monospace",
  },
  purchaseInfo: {
    marginTop: "8px",
  },
  detailText: {
    margin: "4px 0",
    fontSize: "0.95rem",
    color: "#334155",
  },
  button: {
    width: "100%",
    padding: "12px",
    marginTop: "16px",
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