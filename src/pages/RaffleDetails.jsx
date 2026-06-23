import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Adicionado useNavigate
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; // Importar o CartContext
import NumberCard from "../components/NumberCard";
import PurchaseModal from "../components/PurchaseModal";
import RaffleService from "../services/raffleService";

export default function RaffleDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, cartItems } = useCart(); // Utilizando o Contexto do Carrinho
  const navigate = useNavigate();

  const [raffle, setRaffle] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    async function fetchRaffleData() {
      try {
        setLoading(true);
        setError(null);
        
        const raffleData = await RaffleService.getRaffleById(id);
        setRaffle(raffleData);

        const totalTickets = raffleData.totalTickets || 100;
        const soldTickets = raffleData.tickets || [];

        const generatedGrid = Array.from({ length: totalTickets }, (_, index) => {
          const currentNumber = index + 1;
          const ticket = soldTickets.find((t) => t.number === currentNumber);

          return {
            id: currentNumber,
            number: currentNumber,
            isSold: !!ticket,
            // Adicionamos o estado de validação diretamente ao objeto da grade
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

    if (id) {
      fetchRaffleData();
    }
  }, [id]);

  const handleNumberClick = useCallback((number) => {
    setSelectedNumber(number);
    setModalOpen(true);
  }, []);

  // ALTERADO: Agora adiciona ao carrinho em vez de enviar para a API
  function handleConfirmPurchase(data) {
    addToCart({
      raffleId: id,
      raffleName: raffle.name,
      price: raffle.ticketPrice || 10, //Fallback caso não venha da API
      number: data.number
    });

    setModalOpen(false);
    setCartMessage(`Número ${data.number} adicionado ao carrinho!`);
  }

  if (loading) return <p style={styles.stateText}>Carregando detalhes da rifa...</p>;
  if (error) return <p style={{ ...styles.stateText, color: "#ef4444" }}>{error}</p>;
  if (!raffle) return <p style={styles.stateText}>Rifa não encontrada.</p>;

  return (
    <main style={styles.container}>
      
      <header>
        <h1>{raffle.name}</h1>
        {raffle.description && <p style={styles.description}>{raffle.description}</p>}
      </header>
      {(() => {
        const privilegedUsers = [3, 7];

        const canEdit =
          privilegedUsers.includes(Number(user?.id)) ||
          Number(raffle?.authorId) === Number(user?.id);

        return canEdit ? (
          <div
            style={{
              maxWidth: "500px",
              margin: "0 auto 16px",
              textAlign: "center",
            }}
          >
            <button
              onClick={() => navigate(`/editar-rifa/${id}`)}
              style={{
                padding: "8px 18px",
                background: "#0b9bf5",
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
        {cartMessage && (
          <div style={styles.successAlert}>
            <span style={styles.alertText}>{cartMessage}</span>
            <button 
              onClick={() => setCartMessage("")} 
              style={styles.closeAlertButton}
              title="Fechar aviso"
            >
              ✕
            </button>
          </div>
        )}

      {/* Botão flutuante ou de atalho para ir ao carrinho se houver itens */}
      {cartItems.length > 0 && (
        <button 
          onClick={() => navigate("/cart")} 
          style={{ padding: "10px 20px", marginBottom: "20px", cursor: "pointer", backgroundColor: "#2563EB", color: "#fff", border: "none", borderRadius: "5px" }}
        >
          Ver Carrinho ({cartItems.length})
        </button>
      )}

      <section style={styles.grid} aria-label="Ticket Selection Grid">
        {numbers.map((num) => {
          // Checa se o número já está selecionado/reservado no carrinho global
          const isInCart = cartItems.some(item => item.raffleId === id && item.number === num.number);
          
          return (
            <NumberCard
              key={num.id}
              number={num.number}
              // O ticket fica 'sold' (cinza) apenas se não estiver cancelado (validation === 0)
              sold={(num.isSold && num.validation === 0) || isInCart}
              // Passamos explicitamente o estado de cancelado para o card
              isCancelled={num.validation === 1}
              onClick={handleNumberClick}
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
  container: { padding: "40px 20px", textAlign: "center", backgroundColor: "#f8fafc", minHeight: "100vh" },
  description: { color: "#475569", fontSize: "1.1rem", margin: "10px 0 20px" },
  imageWrapper: { margin: "20px auto", maxWidth: "500px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" },
  image: { width: "100%", height: "auto", display: "block", objectFit: "cover", maxHeight: "300px" },
  metaDetails: { margin: "20px auto", maxWidth: "500px", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "left" },
  stateText: { textAlign: "center", padding: "40px", fontSize: "1.1rem", color: "#64748b" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, 50px)", gap: "10px", justifyContent: "center", marginTop: "30px" },
  successAlert: {
    display: "flex",
    justifyContent: "space-between", // Joga o texto para a esquerda e o X para a direita
    alignItems: "center",            // Alinha verticalmente no meio
    backgroundColor: "#2563EB",      // Azul escuro
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "8px",
    margin: "20px auto",
    maxWidth: "500px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    animation: "fadeInEffect 0.25s ease-in-out forwards"
  },
  alertText: {
    fontWeight: "bold",
    textAlign: "left",
    flex: 1, // Faz o texto ocupar o espaço necessário
  },
  closeAlertButton: {
    background: "none",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginLeft: "15px",
    padding: "0 5px",
    lineHeight: "1",
    opacity: "0.8",
    transition: "opacity 0.2s",
  },
};