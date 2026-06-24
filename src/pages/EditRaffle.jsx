import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RaffleService from "../services/raffleService";
import UserService from "../services/userService";
import TicketService from "../services/ticketService";

function EditRaffleSkeleton() {
  return (
    <main style={styles.container}>

      <div style={styles.skeletonTitle}></div>


      {/* Banner sorteio */}
      <div style={styles.skeletonBox}></div>


      {/* Estatísticas */}
      <div style={styles.skeletonStats}>
        <div style={styles.skeletonStat}></div>
        <div style={styles.skeletonStat}></div>
        <div style={styles.skeletonStat}></div>
      </div>


      {/* Formulário */}
      <div style={styles.skeletonForm}>

        <div style={styles.skeletonSubtitle}></div>


        {[1,2,3,4,5,6,7].map(i => (
          <div
            key={i}
            style={styles.skeletonInput}
          />
        ))}


        <div style={styles.skeletonButtons}>
          <div style={styles.skeletonButton}></div>
          <div style={styles.skeletonButton}></div>
        </div>


      </div>

    </main>
  );
}


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
    drawnAt: null,
  });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [confirmAction, setConfirmAction] = useState(null);

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
        setForm({
          name: raffle.name || "",
          prize: raffle.prize || "",
          ticketPrice: raffle.ticketPrice || "",
          totalTickets: raffle.totalTickets || "",
          drawDate: raffle.drawDate ? raffle.drawDate.slice(0, 10) : "",
          imageUrl: raffle.imageUrl || "",
          description: raffle.description || "",
          drawnAt: raffle.drawnAt || null,
        });

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

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Nome da rifa é obrigatório";
    }

    if (!form.prize.trim()) {
      newErrors.prize = "Prêmio é obrigatório";
    }

    if (!form.ticketPrice || Number(form.ticketPrice) <= 0) {
      newErrors.ticketPrice = "Preço deve ser maior que zero";
    }

    if (!form.totalTickets || Number(form.totalTickets) <= 0) {
      newErrors.totalTickets = "Quantidade deve ser maior que zero";
    }

    if (!form.drawDate) {
      newErrors.drawDate = "Data do sorteio é obrigatória";
    }

    return newErrors;
  }

  const [messageTimer,setMessageTimer] = useState(null);

  function showMessage(text,type="success"){
    setMessage(text);
    setMessageType(type);

    if(messageTimer){
      clearTimeout(messageTimer);
    }

    const timer = setTimeout(()=>{
      setMessage(null);
    },4000);

    setMessageTimer(timer);
  }

  async function executeConfirmAction() {

    if(confirmAction.type === "draw"){
      try {
        const winner = await RaffleService.drawRaffle(id);

        setForm(prev => ({
          ...prev,
          drawnAt: new Date().toISOString()
        }));

        showMessage(`🎉 Número vencedor: ${winner.number}`);
      }
      catch(err){
        showMessage(err.message,"error");
      }
    }


    if(confirmAction.type === "cancelTicket"){
      try{
        await TicketService.cancelTicket(confirmAction.ticketId);

        setTickets(prev =>
          prev.map(t =>
            t.id === confirmAction.ticketId
            ? {...t, validation:1,userId:null,purchasedAt:null}
            : t
          )
        );

        showMessage("Ticket cancelado com sucesso!");

      }catch(err){
        showMessage(
          "Erro ao cancelar ticket: "+err.message,
          "error"
        );
      }
    }
    setConfirmAction(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;

    let sanitizedValue = value;

    if (name === "totalTickets") {
      sanitizedValue = value.replace(/[^0-9]/g, "");
    }

    if (name === "ticketPrice") {
      sanitizedValue = value.replace(/[^0-9.]/g, "");

      const parts = sanitizedValue.split(".");
      if (parts.length > 2) {
        return;
      }
    }

    setForm(prev => ({
      ...prev,
      [name]: sanitizedValue,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

    setError(null);
  }

  function handleDraw() {
    setConfirmAction({
      type: "draw",
      message: "Deseja realmente realizar o sorteio?"
    });
  }

  async function handleSave() {

    setErrors({});
    setError(null);

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }


    setSaving(true);

    try {

      await RaffleService.updateRaffle(id, {
        ...form,
        ticketPrice: parseFloat(form.ticketPrice),
        totalTickets: parseInt(form.totalTickets, 10),
        drawDate: new Date(form.drawDate).toISOString(),
      });

      navigate(`/rifa/${id}`);

    } catch (err) {

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Erro ao atualizar rifa"
      );

    } finally {
      setSaving(false);
    }
  }

  async function handleCancelTicket(ticketId) {
    setConfirmAction({
      type: "cancelTicket",
      ticketId,
      message:
        "Deseja realmente cancelar este ticket? O número voltará a ficar disponível."
    });

    return;
  }

  async function copyMessage(message){
    try{
      await navigator.clipboard.writeText(message);
      showMessage("Mensagem copiada para a área de transferência!");
    }
    catch{
      showMessage("Não foi possível copiar a mensagem","error");
    }
  }

  if (loading) return <EditRaffleSkeleton />;

  const fields = [
    { label:"Nome da rifa", name:"name", type:"text" },
    { label:"Prêmio", name:"prize", type:"text" },
    { label:"Preço por número (R$)", name:"ticketPrice", type:"number" },
    { label:"Total de números", name:"totalTickets", type:"number" },
    { label:"Data do sorteio", name:"drawDate", type:"date" },
    { label:"URL da imagem", name:"imageUrl", type:"text" },
  ];

  const soldTickets = tickets.filter(t => t.userId !== null && t.validation === 0);
  const totalSold = soldTickets.length;
  const totalRevenue = totalSold * Number(form.ticketPrice || 0);
  const salesPercentage =
    Number(form.totalTickets) > 0
      ? ((totalSold / Number(form.totalTickets)) * 100).toFixed(1)
      : 0;

  return (
  <>
      {confirmAction && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <p>{confirmAction.message}</p>

            <div style={styles.modalButtons}>
              <button
                style={
                  confirmAction.type === "cancelTicket"
                    ? styles.dangerButton
                    : styles.button
                }
                onClick={executeConfirmAction}
              >
                Confirmar
              </button>

              <button
                style={styles.cancelButton}
                onClick={() => setConfirmAction(null)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}


    <main style={styles.container}>
      <h1 style={styles.title}>Detalhes da sua rifa</h1>

      {message && (
        <div
          style={{
            ...styles.feedback,
            ...(messageType === "error"
              ? styles.feedbackError
              : styles.feedbackSuccess)
          }}
        >
          {message}
        </div>
      )}

      {/* Banner de sorteio realizado ou botão de realizar sorteio */}
      {form.drawnAt ? (
        <div style={styles.drawnBanner}>
          <div style={styles.drawnBannerIcon}></div>
          <div>
            <p style={styles.drawnBannerTitle}>Sorteio realizado</p>
            <p style={styles.drawnBannerDate}>
              {new Date(form.drawnAt).toLocaleString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.drawSection}>
          <p style={styles.drawHint}>A rifa ainda não foi sorteada.</p>
          <button onClick={handleDraw} style={styles.drawButton}>
             Realizar Sorteio
          </button>
        </div>
      )}

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{totalSold}</span>
          <span style={styles.statLabel}>Números vendidos</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statValue}>{salesPercentage}%</span>
          <span style={styles.statLabel}>Vendido</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {totalRevenue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
          <span style={styles.statLabel}>Arrecadado</span>
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
              style={{
                ...styles.input,
                borderColor: errors[name] ? "#ef4444" : "#e2e8f0"
              }}
            />

            {errors[name] && (
              <span style={styles.fieldError}>
                {errors[name]}
              </span>
            )}
          </div>
        ))}

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Descrição</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            style={{
              ...styles.input,
              minHeight:"100px",
              resize:"vertical"
            }}
          />
        </div>

        <div style={styles.buttonRow}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ ...styles.button, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
          <button onClick={() => navigate(`/rifa/${id}`)} style={styles.cancelButton}>
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
                      setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)
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

                      copyMessage(message);
                    }}
                    style={styles.copyButton}
                  >
                    Copiar mensagem para perguntar sobre a compra!
                  </button>

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
    </>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    backgroundColor: "#f5f6fa",
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

  /* ---------- SORTEIO ---------- */

  drawSection: {
    maxWidth: "500px",
    margin: "0 auto 24px",
    background: "#fff",
    borderRadius: "12px",
    padding: "20px 24px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
    boxSizing: "border-box",
  },

  drawHint: {
    margin: 0,
    color: "#64748b",
    fontSize: "0.9rem",
  },

  drawButton: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    fontSize: "0.95rem",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  drawnBanner: {
    maxWidth: "500px",
    margin: "0 auto 24px",
    background: "#f0fdf4",
    border: "1px solid #86efac",
    borderRadius: "12px",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    boxSizing: "border-box",
  },

  drawnBannerIcon: {
    fontSize: "2rem",
    lineHeight: 1,
    flexShrink: 0,
  },

  drawnBannerTitle: {
    margin: 0,
    fontWeight: "700",
    color: "#15803d",
    fontSize: "1rem",
  },

  drawnBannerDate: {
    margin: "2px 0 0",
    color: "#16a34a",
    fontSize: "0.85rem",
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

  /* ---------- FORMULÁRIO ---------- */

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

  feedback: {
    maxWidth: "500px",
    margin: "0 auto 20px",
    padding: "12px 16px",
    borderRadius: "10px",
    fontWeight: "600",
    textAlign: "center",
  },

  feedbackSuccess: {
    background: "#dcfce7",
    color: "#166534",
    border: "1px solid #86efac",
  },

  feedbackError: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
  },

  modalOverlay:{
    position:"fixed",
    inset:0,
    background:"rgba(0,0,0,0.4)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    zIndex:1000,
  },

  modal:{
    background:"#fff",
    padding:"28px",
    borderRadius:"16px",
    maxWidth:"420px",
    width:"90%",
    textAlign:"center",
    boxShadow:"0 20px 40px rgba(0,0,0,0.15)",
  },

  modalButtons:{
    display:"flex",
    gap:"12px",
    marginTop:"20px",
  },

  dangerButton:{
    flex: "1 1 180px",
    padding:"12px",
    background:"#dc2626",
    color:"#fff",
    border:"none",
    borderRadius:"8px",
    fontWeight:"bold",
    cursor:"pointer",
  },

    fieldError:{
    color:"#dc2626",
    fontSize:"0.8rem",
    marginTop:"5px",
    display:"block",
  },

  skeletonTitle:{
    width:"260px",
    height:"32px",
    background:"#e2e8f0",
    borderRadius:"8px",
    margin:"0 auto 24px",
    animation:"pulse 1.5s infinite",
  },


  skeletonBox:{
    maxWidth:"500px",
    height:"80px",
    background:"#e2e8f0",
    borderRadius:"12px",
    margin:"0 auto 24px",
    animation:"pulse 1.5s infinite",
  },


  skeletonStats:{
    maxWidth:"500px",
    margin:"0 auto 24px",
    display:"flex",
    gap:"12px",
  },


  skeletonStat:{
    flex:1,
    height:"80px",
    background:"#e2e8f0",
    borderRadius:"12px",
    animation:"pulse 1.5s infinite",
  },


  skeletonForm:{
    maxWidth:"500px",
    margin:"0 auto",
    background:"#fff",
    borderRadius:"12px",
    padding:"32px",
    boxSizing:"border-box",
  },


  skeletonSubtitle:{
    width:"220px",
    height:"24px",
    background:"#e2e8f0",
    borderRadius:"6px",
    margin:"0 auto 25px",
    animation:"pulse 1.5s infinite",
  },


  skeletonInput:{
    height:"42px",
    background:"#e2e8f0",
    borderRadius:"8px",
    marginBottom:"20px",
    animation:"pulse 1.5s infinite",
  },


  skeletonButtons:{
    display:"flex",
    gap:"12px",
    marginTop:"20px",
  },


  skeletonButton:{
    flex:1,
    height:"45px",
    background:"#e2e8f0",
    borderRadius:"8px",
    animation:"pulse 1.5s infinite",
  },
};