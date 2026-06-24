import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TicketService from "../services/ticketService";

function MyRaffles() {
  const navigate = useNavigate();
  const [groupedRaffles, setGroupedRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function fetchUserTickets() {
      try {
        const tickets = await TicketService.getMyPurchasedTickets();
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

  function groupTicketsByRaffle(tickets) {
    if (!Array.isArray(tickets) || tickets.length === 0) return [];

    const raffleMap = new Map();

    tickets.forEach((ticket) => {
      const raffle = ticket.raffle || {};
      const raffleId = raffle.id || ticket.raffleId;
      if (!raffleId) return;

      const ticketNumber = ticket.number ?? ticket.ticketNumber;
      if (!ticketNumber) return;

      if (!raffleMap.has(raffleId)) {
        raffleMap.set(raffleId, {
          id: raffleId,
          name: raffle.name || ticket.raffleName || "Rifa não identificada",
          prize: raffle.prize || "Prêmio não definido",
          imageUrl: raffle.imageUrl || raffle.prizeImage || raffle.image || null,
          ticketPrice: raffle.ticketPrice || 0,
          drawDate: raffle.drawDate,
          totalTickets: raffle.totalTickets || 0,
          drawnAt: raffle.drawnAt || null,
          winnerTicketId: raffle.winnerTicketId || null,
          winnerUser: raffle.winnerUser || null,
          tickets: [],
        });
      }

      const raffleData = raffleMap.get(raffleId);
      raffleData.tickets.push({
        number: ticketNumber,
        id: ticket.id,
        purchasedAt: ticket.purchasedAt,
      });

      if (
        ticket.purchasedAt &&
        (!raffleData.latestPurchase ||
          new Date(ticket.purchasedAt) > new Date(raffleData.latestPurchase))
      ) {
        raffleData.latestPurchase = ticket.purchasedAt;
      }
    });

    return Array.from(raffleMap.values()).sort((a, b) => {
      const dateA = a.latestPurchase ? new Date(a.latestPurchase) : new Date(0);
      const dateB = b.latestPurchase ? new Date(b.latestPurchase) : new Date(0);
      return dateB - dateA;
    });
  }

  function formatDrawDate(dateString) {
    if (!dateString) return "Data não definida";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatPurchaseDate(dateString) {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function sortTicketNumbers(tickets) {
    return [...tickets].sort((a, b) => a.number - b.number);
  }

  /**
   * Determina o status do sorteio em relação ao usuário.
   * Retorna: "won" | "lost" | "pending"
   */
  function getRaffleStatus(raffle) {
    if (!raffle.drawnAt) return "pending";
    const userTicketIds = raffle.tickets.map((t) => t.id);
    const userWon = userTicketIds.includes(raffle.winnerTicketId);
    return userWon ? "won" : "lost";
  }

  function getFilteredRaffles() {
    if (statusFilter === "all") {
      return groupedRaffles;
    }

    return groupedRaffles.filter(
      (raffle) => getRaffleStatus(raffle) === statusFilter
    );
  }

  const filteredRaffles = getFilteredRaffles();

  function countStatus(status) {
    if(status === "all") return groupedRaffles.length;

    return groupedRaffles.filter(
      raffle => getRaffleStatus(raffle) === status
    ).length;
  }

  function getCardStyle(status) {
    if (status === "won") {
      return {
        ...styles.card,
        ...styles.cardWon,
      };
    }

    if (status === "lost") {
      return {
        ...styles.card,
        ...styles.cardLost,
      };
    }

    return {
      ...styles.card,
      ...styles.cardPending,
    };
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Minhas Rifas</h1>

        <div style={styles.list}>
          {[...Array(3)].map((_, index) => (
            <div key={index} style={styles.skeletonCard}>
              <div style={styles.skeletonHeader}></div>

              <div style={styles.skeletonImage}></div>

              <div style={styles.skeletonLine}></div>
              <div style={styles.skeletonLineSmall}></div>

              <div style={styles.skeletonBox}></div>

              <div style={styles.skeletonNumbers}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} style={styles.skeletonBadge}></div>
                ))}
              </div>

              <div style={styles.skeletonLine}></div>
              <div style={styles.skeletonLineSmall}></div>

              <div style={styles.skeletonButton}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <p style={styles.errorText}>Erro: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Minhas Rifas</h1>

      {groupedRaffles.length > 0 && (
        <div style={styles.filters}>

          <button
            style={{
              ...styles.filterButton,
              ...(statusFilter === "all"
                ? styles.filterActive
                : {})
            }}
            onClick={() => setStatusFilter("all")}
          >
            Todas ({countStatus("all")})
          </button>


          <button
            style={{
              ...styles.filterButton,
              ...(statusFilter === "pending"
                ? styles.filterActive
                : {})
            }}
            onClick={() => setStatusFilter("pending")}
          >
            Aguardando ({countStatus("pending")})
          </button>


          <button
            style={{
              ...styles.filterButton,
              ...(statusFilter === "won"
                ? styles.filterActive
                : {})
            }}
            onClick={() => setStatusFilter("won")}
          >
            Ganhas ({countStatus("won")})
          </button>


          <button
            style={{
              ...styles.filterButton,
              ...(statusFilter === "lost"
                ? styles.filterActive
                : {})
            }}
            onClick={() => setStatusFilter("lost")}
          >
            Perdidas ({countStatus("lost")})
          </button>

        </div>
      )}

      {groupedRaffles.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyEmoji}>
            🎟️
          </div>

          <h2 style={styles.emptyTitle}>
            Você ainda não participou de nenhuma rifa
          </h2>

          <p style={styles.emptyDescription}>
            Encontre uma rifa que combine com você e concorra a prêmios incríveis!
          </p>

          <button
            style={styles.button}
            onClick={() => navigate("/")}
          >
            Ver rifas disponíveis
          </button>
        </div>

      ) : filteredRaffles.length === 0 ? (

        <div style={styles.emptyState}>
          <div style={styles.emptyEmoji}>
            🔎
          </div>

          <h2 style={styles.emptyTitle}>
            Nenhuma rifa encontrada filtro
          </h2>

          <p style={styles.emptyDescription}>
            Não existem rifas com esse status.
          </p>

          <button
            style={styles.button}
            onClick={() => setStatusFilter("all")}
          >
            Mostrar todas
          </button>
        </div>

      ) : (
          <div style={styles.list}>

         {filteredRaffles.map((raffle) => {
            const sortedTickets = sortTicketNumbers(raffle.tickets);
            const totalSpent = raffle.ticketPrice * raffle.tickets.length;
            const status = getRaffleStatus(raffle);
            const statusConfig = {
              won:     { label: " Você ganhou!",        style: styles.badgeWon     },
              lost:    { label: " Não foi dessa vez",   style: styles.badgeLost    },
              pending: { label: " Aguardando sorteio",  style: styles.badgePending },
            }[status];

            return (
              <div
                key={raffle.id}
                style={getCardStyle(status)}
              >
                {/* Cabeçalho */}
                <div style={styles.cardHeader}>
                  <h2 style={styles.cardTitle}>{raffle.name}</h2>
                  <span style={statusConfig.style}>{statusConfig.label}</span>
                </div>

                {/* Imagem do prêmio */}
                <RaffleImage imageUrl={raffle.imageUrl} prize={raffle.prize} />

                <p style={styles.subtitle}>
                  <strong>Prêmio:</strong> {raffle.prize}
                </p>
                <p style={styles.subtitle}>
                  <strong>Sorteio:</strong> {formatDrawDate(raffle.drawDate)}
                </p>

                {/* Resultado do sorteio */}
                {status === "won" && (
                  <div style={styles.resultBannerWon}>
                    <div>
                      <p style={styles.resultTitle}>
                        🏆 Parabéns! Você foi o vencedor!
                      </p>
                      <p style={styles.resultSub}>
                        Sorteio realizado em{" "}
                        {formatPurchaseDate(raffle.drawnAt)}
                      </p>
                    </div>
                  </div>
                )}

                {status === "lost" && (
                  <div style={styles.resultBannerLost}>
                    <div>
                      <p style={styles.resultTitleLost}>Não foi dessa vez</p>
                      <p style={styles.resultSubLost}>
                        Sorteio realizado em{" "}
                        {formatPurchaseDate(raffle.drawnAt)}
                        {raffle.winnerUser?.name
                          ? ` · Vencedor: ${raffle.winnerUser.name}`
                          : ""}
                      </p>
                    </div>
                  </div>
                )}

                {/* Números e valores */}
                <div style={styles.detailsGroup}>
                  <div style={styles.ticketsGrid}>
                    <p style={styles.ticketsLabel}>
                      <strong>Números comprados:</strong>
                    </p>
                    <div style={styles.numbersContainer}>
                      {sortedTickets.map((ticket) => (
                        <span
                          key={ticket.id}
                          style={{
                            ...styles.numberBadge,
                            ...(ticket.id === raffle.winnerTicketId
                              ? styles.numberBadgeWinner
                              : {}),
                          }}
                        >
                          #{ticket.number}
                          {ticket.id === raffle.winnerTicketId && " 🏆"}
                          {ticket.id === raffle.winnerTicketId ? "" : ""}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={styles.purchaseInfo}>
                    <p style={styles.detailText}>
                      <strong>Valor por número:</strong>{" "}
                      {formatCurrency(raffle.ticketPrice)}
                    </p>
                    <p style={styles.detailText}>
                      <strong>Total gasto:</strong> {formatCurrency(totalSpent)}
                    </p>
                    {raffle.latestPurchase && (
                      <p style={styles.detailText}>
                        <strong>Última compra:</strong>{" "}
                        {formatPurchaseDate(raffle.latestPurchase)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  style={
                    raffle.drawnAt
                      ? styles.resultButton
                      : styles.button
                  }
                  onClick={() => navigate(`/rifa/${raffle.id}`)}
                >
                  {raffle.drawnAt 
                    ? "Ver resultado do sorteio"
                    : "Ver detalhes da rifa"
                  }
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Componente isolado para a imagem do prêmio.
 * Controla o estado de erro via useState, evitando manipulação direta do DOM.
 */
function RaffleImage({ imageUrl, prize }) {
  const [imgError, setImgError] = useState(false);
  const hasImage = imageUrl && imageUrl.trim() !== "" && !imgError;

  return (
    <div style={styles.prizeImageContainer}>
      {hasImage ? (
        <img
          src={imageUrl}
          alt={`Prêmio: ${prize}`}
          style={styles.prizeImage}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div style={styles.prizeImagePlaceholder}>
          <span style={styles.prizeEmoji}>🎁</span>
          <span style={styles.prizePlaceholderText}>Imagem do prêmio</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    textAlign: "center",
    backgroundColor: "#f5f6fa",
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

  /* ---------- CARD ---------- */
  card: {
    padding: "24px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: "12px",
    textAlign: "left",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    gap: "12px",
    flexWrap: "wrap",
  },
  cardTitle: {
    fontSize: "1.25rem",
    color: "#0f172a",
    margin: "0",
  },

  /* ---------- BADGES DE STATUS ---------- */
  badgeWon: {
    backgroundColor: "#fef9c3",
    color: "#92400e",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "700",
    whiteSpace: "nowrap",
    border: "1px solid #fde68a",
  },
  badgeLost: {
    backgroundColor: "#b13a3a",
    color: "#ffffff",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    border: "1px solid #e2e8f0",
  },
  badgePending: {
    backgroundColor: "#eff6ff",
    color: "#1d4ed8",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    whiteSpace: "nowrap",
    border: "1px solid #bfdbfe",
  },

  /* ---------- BANNERS DE RESULTADO ---------- */
  resultBannerWon: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#fffbeb",
    border: "2px solid #f59e0b",
    borderRadius: "10px",
    padding: "14px 16px",
    margin: "12px 0",
  },
  resultBannerLost: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "10px",
    padding: "12px 16px",
    margin: "12px 0",
  },
  resultTitleLost: {
    margin: 0,
    fontWeight: "700",
    fontSize: "0.95rem",
    color: "#b91c1c",
  },
  resultIcon: {
    fontSize: "1.8rem",
    flexShrink: 0,
  },
  resultTitle: {
    margin: 0,
    fontWeight: "700",
    fontSize: "0.95rem",
    color: "#1e293b",
  },
  resultSub: {
    margin: "2px 0 0",
    fontSize: "0.8rem",
    color: "#64748b",
  },
  resultSubLost: {
    margin: "2px 0 0",
    fontSize: "0.8rem",
    color: "#dc2626",
  },

  /* ---------- IMAGEM ---------- */
  prizeImageContainer: {
    width: "100%",
    height: "200px",
    marginBottom: "16px",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#f1f5f9",
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

  /* ---------- DETALHES ---------- */
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
  numberBadgeWinner: {
    backgroundColor: "#fef9c3",
    color: "#92400e",
    border: "1px solid #fde68a",
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
  },

  filters: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  filterButton: {
    padding: "8px 18px",
    borderRadius: "20px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#475569",
    cursor: "pointer",
    fontWeight: "600",
  },

  filterActive: {
    background: "#2563EB",
    color: "#ffffff",
    borderColor: "#2563EB",
  },

  emptyState: {
    maxWidth: "420px",
    margin: "40px auto",
    padding: "30px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  emptyEmoji: {
    fontSize: "4rem",
    marginBottom: "15px",
  },

  emptyTitle: {
    color: "#1e293b",
    fontSize: "1.3rem",
    marginBottom: "10px",
  },

  emptyDescription: {
    color: "#64748b",
    marginBottom: "25px",
    lineHeight: "1.5",
  },

  resultButton: {
    width: "100%",
    padding: "12px",
    marginTop: "16px",
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.95rem",
  },

  cardWon: {
    border: "2px solid #f59e0b",
    borderTop: "5px solid #f59e0b",
    background: "#fffdf5",
    boxShadow: "0 8px 20px rgba(245,158,11,0.18)",
  },

  cardLost: {
    border: "1px solid #fca5a5",
    borderTop: "5px solid #f87171",
    background: "#fff7f7",
  },

  cardPending: {
    borderTop: "5px solid #2563eb",
  },

  skeletonCard: {
    padding: "24px",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: "12px",
    maxWidth: "600px",
  },

  skeletonHeader: {
    height: "28px",
    width: "50%",
    background: "#e5e7eb",
    borderRadius: "6px",
    marginBottom: "16px",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  skeletonImage: {
    width: "100%",
    height: "200px",
    background: "#e5e7eb",
    borderRadius: "8px",
    marginBottom: "16px",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  skeletonLine: {
    height: "16px",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "10px",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  skeletonLineSmall: {
    height: "14px",
    width: "60%",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "10px",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  skeletonBox: {
    height: "70px",
    background: "#e5e7eb",
    borderRadius: "8px",
    margin: "16px 0",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  skeletonNumbers: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "16px",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  skeletonBadge: {
    width: "50px",
    height: "28px",
    background: "#e5e7eb",
    borderRadius: "6px",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  skeletonButton: {
    width: "100%",
    height: "44px",
    background: "#e5e7eb",
    borderRadius: "8px",
    marginTop: "16px",
    animation: "pulse 1.5s ease-in-out infinite",
  },
};

export default MyRaffles;