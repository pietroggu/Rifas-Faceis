import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RaffleService from "../services/raffleService";
import UserService from "../services/userService";
import TicketService from "../services/ticketService";

export default function EditRaffle() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState({});
  const [expandedTicket, setExpandedTicket] = useState(null);

  const [form, setForm] = useState({
    name: "",
    prize: "",
    ticketPrice: "",
    totalTickets: "",
    drawDate: "",
    imageUrl: "",
    description: "",
  });
  const [tickets, setTickets] = useState([]); // Nova lista de tickets
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Carrega os dados atuais da rifa e os tickets ao montar
  useEffect(() => {
    async function loadData() {
      try {
        const raffle = await RaffleService.getRaffleById(id);
        setTickets(raffle.tickets || []);

        const uniqueUserIds = [
          ...new Set(
            raffle.tickets
              .filter(t => t.userId)
              .map(t => t.userId)
          )
        ];

        const usersMap = {};

        for (const userId of uniqueUserIds) {
          try {
            const user = await UserService.getUserById(userId);
            usersMap[userId] = user;
          } catch (err) {
            console.error(err);
          }
        }

        setUsers(usersMap);
        console.log("RAFFLE:", raffle);
        console.log("TICKETS:", raffle.tickets);
        setForm({
          name: raffle.name || "",
          prize: raffle.prize || "",
          ticketPrice: raffle.ticketPrice || "",
          totalTickets: raffle.totalTickets || "",
          drawDate: raffle.drawDate ? raffle.drawDate.slice(0, 10) : "",
          imageUrl: raffle.imageUrl || "",
          description: raffle.description || "",
        });
        
        // Se o seu backend já retorna os tickets dentro da rifa:
        if (raffle.tickets) {
          setTickets(raffle.tickets);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await RaffleService.updateRaffle(id, {
        ...form,
        ticketPrice: Number(form.ticketPrice),
        totalTickets: Number(form.totalTickets),
      });
      navigate(`/rifa/${id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  // Função para cancelar um ticket específico
  async function handleCancelTicket(ticketId) {
    if (!window.confirm("Deseja realmente cancelar este ticket? O número voltará a ficar disponível. Tente primeiro entrar em contato com o comprador do número!")) return;
    
    try {
      await TicketService.cancelTicket(ticketId);
      
      // ATUALIZAÇÃO: Garantimos que o ticket seja marcado como cancelado no estado local
      setTickets(prev => prev.map(t => 
        t.id === ticketId 
          ? { ...t, validation: 1, userId: null, purchasedAt: null } 
          : t
      ));
      
      alert("Ticket cancelado com sucesso!");
    } catch (err) {
      alert("Erro ao cancelar ticket: " + err.message);
    }
  }

  if (loading) return <p style={styles.stateText}>Carregando dados da rifa...</p>;

  const fields = [
    { label: "Nome da rifa",         name: "name",         type: "text" },
    { label: "Prêmio",               name: "prize",        type: "text" },
    { label: "Preço por número (R$)", name: "ticketPrice",  type: "number" },
    { label: "Total de números",     name: "totalTickets", type: "number" },
    { label: "Data do sorteio",      name: "drawDate",     type: "date" },
    { label: "URL da imagem",        name: "imageUrl",     type: "text" },
    { label: "Descrição",            name: "description",  type: "text" },
  ];

  // Filtra apenas os tickets que foram vendidos e não estão cancelados
  const soldTickets = tickets.filter(t => t.userId !== null && t.validation === 0);
  const totalSold = soldTickets.length;

  const totalRevenue =
    totalSold * Number(form.ticketPrice || 0);

  const salesPercentage =
    Number(form.totalTickets) > 0
      ? ((totalSold / Number(form.totalTickets)) * 100).toFixed(1)
      : 0;
  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Detalhes da sua rifa</h1>
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>
              {totalSold}
            </span>
            <span style={styles.statLabel}>
              Números vendidos
            </span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statValue}>
              {salesPercentage}%
            </span>
            <span style={styles.statLabel}>
              Vendido
            </span>
          </div>

          <div style={styles.statCard}>
            <span style={styles.statValue}>
              {totalRevenue.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
            <span style={styles.statLabel}>
              Arrecadado
            </span>
          </div>
        </div>
        

      {error && <p style={styles.errorText}>{error}</p>}

      <div style={styles.form}>
        <h3 style={styles.subtitle}>Editar dados da rifa</h3>
        {fields.map(({ label, name, type }) => (
          <div key={name} style={styles.fieldGroup}>
            <label style={styles.label}>{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              style={styles.input}
              min={type === "number" ? "0" : undefined}
            />
          </div>
        ))}

        <div style={styles.buttonRow}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ ...styles.button, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button
            onClick={() => navigate(`/rifa/${id}`)}
            style={styles.cancelButton}
          >
            Voltar
          </button>
        </div>

        {/* SEÇÃO DE CANCELAMENTO DE TICKETS */}
        <div style={styles.ticketSection}>
          <h3 style={styles.sectionTitle}>Tickets Vendidos</h3>
          {soldTickets.length === 0 ? (
            <p style={styles.emptyText}>Nenhum ticket vendido até o momento.</p>
          ) : (
            <ul style={styles.ticketList}>
              {soldTickets.map(ticket => (
                <li
                  key={ticket.id}
                  style={{
                    ...styles.ticketItem,
                    flexDirection: "column",
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setExpandedTicket(
                        expandedTicket === ticket.id ? null : ticket.id
                      )
                    }
                  >
                    <span>
                      Número: <strong>{ticket.number}</strong> (ID: {ticket.id})
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelTicket(ticket.id);
                      }}
                      style={styles.inlineCancelBtn}
                    >
                      Cancelar Ticket
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      const user = users[ticket.userId];

                      const message = `Olá ${user?.name || ""}!

                  Estamos entrando em contato sobre a sua compra da rifa.

                   Número: ${ticket.number}
                   Rifa: ${form.name}
                   Data da compra: ${
                        ticket.purchasedAt
                          ? new Date(ticket.purchasedAt).toLocaleString("pt-BR")
                          : "-"
                      }

                  Ainda não recebemos o comprovante de sua compra, poderia enviá-lo
                  para esse número? Caso não tivermos resposta em 24 horas ou até 1 hora
                  antes da rifa, sua compra será cancelada!`;

                      navigator.clipboard.writeText(message);

                      alert("Mensagem copiada!");
                    }}
                    style={styles.copyButton}
                  > Copiar mensagem para perguntar sobre a compra!</button>

                  {expandedTicket === ticket.id && (
                    <div
                      style={{
                        marginTop: "12px",
                        paddingTop: "12px",
                        borderTop: "1px solid #e2e8f0",
                        fontSize: "0.9rem",
                        color: "#475569",
                      }}
                    >
                      <p>
                        <strong>Comprador:</strong>{" "}
                        {users[ticket.userId]?.name || "Não encontrado"}
                      </p>

                      <p>
                        <strong>Telefone:</strong>{" "}
                        {users[ticket.userId]?.phone ||
                          users[ticket.userId]?.telephone ||
                          users[ticket.userId]?.cellphone ||
                          "-"}
                      </p>

                      <p>
                        <strong>Data da compra:</strong>{" "}
                        {ticket.purchasedAt
                          ? new Date(ticket.purchasedAt).toLocaleString("pt-BR")
                          : "-"}
                      </p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    color: "#1e293b",
    fontSize: "1.75rem",
    marginBottom: "20px",
  },

  subtitle: {
    textAlign: "center",
    color: "#1e293b",
    fontSize: "1.4rem",
    marginBottom: "15px",
  },

  form: {
    maxWidth: "500px",
    width: "100%",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "12px",
    padding: "32px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
    boxSizing: "border-box",
  },

  fieldGroup: {
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#334155",
    fontSize: "0.9rem",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "0.95rem",
    color: "#1e293b",
    boxSizing: "border-box",
    outline: "none",
  },

  buttonRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "28px",
  },

  button: {
    flex: "1 1 180px",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "0.95rem",
    cursor: "pointer",
  },

  cancelButton: {
    flex: "1 1 180px",
    padding: "12px",
    background: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "0.95rem",
    cursor: "pointer",
  },

  errorText: {
    color: "#ef4444",
    textAlign: "center",
    marginBottom: "16px",
    fontWeight: "600",
  },

  stateText: {
    textAlign: "center",
    padding: "40px",
    color: "#64748b",
  },

  /* ---------- ESTATÍSTICAS ---------- */

  statsContainer: {
    maxWidth: "500px",
    margin: "0 auto 24px",
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
  },

  statCard: {
    flex: "1 1 140px",
    minWidth: "140px",
    background: "#fff",
    borderRadius: "12px",
    padding: "16px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
  },

  statValue: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
    wordBreak: "break-word",
  },

  statLabel: {
    marginTop: "4px",
    fontSize: "0.8rem",
    color: "#64748b",
    textAlign: "center",
  },

  /* ---------- TICKETS ---------- */

  ticketSection: {
    marginTop: "40px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "20px",
  },

  sectionTitle: {
    fontSize: "1.1rem",
    color: "#1e293b",
    marginBottom: "15px",
  },

  ticketList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  ticketItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    marginBottom: "8px",
    border: "1px solid #e2e8f0",
    wordBreak: "break-word",
    boxSizing: "border-box",
  },

  inlineCancelBtn: {
    padding: "6px 12px",
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  copyButton: {
    width: "100%",
    padding: "10px 12px",
    background: "#eff6ff",
    color: "#2563eb",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "12px",
    boxSizing: "border-box",
  },

  emptyText: {
    fontSize: "0.85rem",
    color: "#94a3b8",
    textAlign: "center",
  },
};