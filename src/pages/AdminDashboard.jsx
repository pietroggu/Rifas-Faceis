import React, { useState, useEffect, useRef } from "react";
import RaffleCard from "../components/RaffleCard";
import RaffleService from "../services/raffleService";
import { useAuth } from "../context/AuthContext";

/**
 * AdminDashboard component handles administrative operations, allowing authorized
 * users to create new raffles tied to their session authorId and monitor existing data.
 */
function AdminDashboard() {
  // Retrieve the current authenticated user session from context
  const { user } = useAuth();
  
  // DOM reference to programmatically trigger the hidden native file field
  const fileInputRef = useRef(null);
  
  const [raffles, setRaffles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form state directly mapped to the Prisma schema properties to prevent mismatch errors
  const [newRaffle, setNewRaffle] = useState({
    name: "",
    description: "",
    prize: "",
    category: "",
    ticketPrice: "",
    totalTickets: "",
    drawDate: "",
    imageUrl: "", // Base64 image payload container
  });

  useEffect(() => {
    loadRaffles();
  }, []);

  /**
   * Asynchronously fetches all registered raffles from the service layer to sync the UI grid.
   */
  async function loadRaffles() {
    try {
      setLoading(true);
      const data = await RaffleService.getAllRaffles();
      setRaffles(data);
    } catch (error) {
      console.error("Failed to fetch dashboard raffles:", error);
    } finally {
      setLoading(false);
    }
  }

  /**
   * Intercepts input mutations and applies strict numeric sanitation formatting rules.
   * Prevents non-numeric entries or invalid data patterns from updating state.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} e - Change event.
   */
  function handleInputChange(e) {
    const { name, value } = e.target;
    let sanitizedValue = value;

    if (name === "totalTickets") {
      // Rigid rule for Int: Strip out anything that is not a non-negative integer digit
      sanitizedValue = value.replace(/[^0-9]/g, "");
    } else if (name === "ticketPrice") {
      // Rigid rule for Float: Allow only numbers and a single optional decimal point
      sanitizedValue = value.replace(/[^0-9.]/g, "");
      const splitParts = sanitizedValue.split(".");
      if (splitParts.length > 2) {
        // Drop update action if the user tries to type a secondary decimal period
        return;
      }
    }

    setNewRaffle((prev) => ({ ...prev, [name]: sanitizedValue }));
  }

  /**
   * Reads target local image files, enforces safe sizes, and encodes the stream into a Base64 string.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input file change trigger event.
   */
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security & Payload Threshold Check: Reject image updates heavier than 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem é muito grande! Escolha uma foto de no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Hydrates state with the parsed base64 data asset string
      setNewRaffle((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  /**
   * Validates inputs, formats data types matching Prisma constraints, and triggers creation.
   * @param {React.FormEvent} e - Form submission event.
   */
  async function handleCreateRaffle(e) {
    e.preventDefault();

    const { name, description, prize, category, ticketPrice, totalTickets, drawDate, imageUrl } = newRaffle;

    // Strict validation ensuring all required parameters according to Prisma exist
    if (!name || !prize || !ticketPrice || !totalTickets || !drawDate) {
      alert("Preencha todos os campos obrigatórios (Nome, Prêmio, Preço, Total de Bilhetes e Data)!");
      return;
    }

    // Safety guard verifying an active session context is available
    if (!user || !user.id) {
      alert("Erro: Você precisa estar autenticado para criar uma rifa.");
      return;
    }

    try {
      // Constructs the precise structural model layout expected by your backend service
      const backendPayload = {
        name: name,
        description: description || null,
        prize: prize,
        category: category || null,
        ticketPrice: parseFloat(ticketPrice), // Explicit structural cast to Float
        totalTickets: parseInt(totalTickets, 10), // Explicit structural cast to Int
        drawDate: new Date(drawDate).toISOString(), // Formats browser date to exact ISO DateTime profile
        authorId: Number(user.id), // Associates the model with the active administrator account
        imageUrl: imageUrl || null, // Appends base64 asset attachment string if defined
      };

      await RaffleService.createRaffle(backendPayload);
      alert("Rifa criada com sucesso!");
      
      // Clear all inputs and restore creation panel defaults
      setNewRaffle({
        name: "",
        description: "",
        prize: "",
        category: "",
        ticketPrice: "",
        totalTickets: "",
        drawDate: "",
        imageUrl: "",
      });
      setShowForm(false);
      loadRaffles();
    } catch (error) {
      alert(error.message || "Erro ao criar rifa.");
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Painel Administrativo</h1>

      {/* Accordion view toggler button */}
      <button 
        style={styles.toggleButton} 
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Fechar Formulário" : "Criar Nova Rifa"}
      </button>

      {/* Creation Form Section */}
      {showForm && (
        <form style={styles.form} onSubmit={handleCreateRaffle}>
          <h2 style={styles.formTitle}>Nova Rifa</h2>
          
          {/* Circular Interactive Raffle Cover Image Box (Mirroring Profile UI concept) */}
          <div 
            style={styles.imageWrapper}
            onClick={() => fileInputRef.current?.click()}
            title="Clique para adicionar uma capa para a rifa"
          >
            <img 
              src={newRaffle.imageUrl || "https://placehold.co/600x600/e2e8f0/64748b?text=Rifa"} 
              alt="Raffle Cover Display" 
              style={styles.imageDisplay} 
            />
            <div style={styles.imageOverlayBadge}>
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>

          {/* Hidden reference triggered native file element */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Nome da Rifa *"
            value={newRaffle.name}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="text"
            name="prize"
            placeholder="Prêmio Principal *"
            value={newRaffle.prize}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="text" // Input field type changed to text to fully drive explicit regex filtration logic
            name="ticketPrice"
            placeholder="Preço do Bilhete (Ex: 15.50) *"
            value={newRaffle.ticketPrice}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="text" // Input field type changed to text to fully drive explicit regex filtration logic
            name="totalTickets"
            placeholder="Quantidade Total de Bilhetes *"
            value={newRaffle.totalTickets}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="date"
            name="drawDate"
            value={newRaffle.drawDate}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="text"
            name="category"
            placeholder="Categoria (Opcional)"
            value={newRaffle.category}
            onChange={handleInputChange}
          />
          <textarea
            style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
            name="description"
            placeholder="Descrição detalhada (Opcional)..."
            value={newRaffle.description}
            onChange={handleInputChange}
          />
          
          <button style={styles.submitButton} type="submit">
            Confirmar Criação
          </button>
        </form>
      )}

      {/* Active Records Render Grid */}
      <div style={styles.listSection}>
        <h2 style={styles.sectionTitle}>Rifas Ativas no Sistema</h2>
        {loading ? (
          <p>Carregando dados das rifas...</p>
        ) : raffles.length === 0 ? (
          <p>Nenhuma rifa cadastrada ainda.</p>
        ) : (
          <div style={styles.grid}>
            {raffles.map((raffle) => (
              <div key={raffle.id} style={styles.cardWrapper}>
                <RaffleCard
                  id={raffle.id}
                  name={raffle.name}
                  description={raffle.description}
                  prize={raffle.prize}
                  category={raffle.category}
                  ticketPrice={raffle.ticketPrice}
                  totalTickets={raffle.totalTickets}
                  drawDate={raffle.drawDate}
                  imageUrl={raffle.imageUrl}
                  formattedPrice={raffle.formattedPrice}
                  salesProgress={raffle.salesProgress}
                  isSoldOut={raffle.isSoldOut}
                  formattedDrawDate={raffle.formattedDrawDate}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    textAlign: "center",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  mainTitle: {
    color: "#0f172a",
    marginBottom: "24px",
  },
  toggleButton: {
    padding: "12px 24px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    width: "100%",
    maxWidth: "450px",
    margin: "0 auto 40px auto",
    padding: "24px",
    background: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
    border: "1px solid #e2e8f0",
  },
  formTitle: {
    margin: "0 0 4px 0",
    fontSize: "1.25rem",
    color: "#1e293b",
  },
  imageWrapper: {
    position: "relative",
    width: "100px",
    height: "100px",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  imageDisplay: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #2563EB",
  },
  imageOverlayBadge: {
    position: "absolute",
    bottom: "0px",
    right: "0px",
    background: "#2563EB",
    borderRadius: "50%",
    width: "26px",
    height: "26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)",
    border: "2px solid #ffffff",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    fontSize: "0.95rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontFamily: "inherit",
  },
  submitButton: {
    width: "100%",
    padding: "12px",
    background: "#10B981",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1rem",
    marginTop: "6px",
  },
  listSection: {
    marginTop: "20px",
    paddingTop: "20px",
    borderTop: "2px dashed #cbd5e1",
  },
  sectionTitle: {
    color: "#1e293b",
    marginBottom: "24px",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  cardWrapper: {
    flex: "1 1 280px",
    maxWidth: "320px",
    width: "100%",
  },
};

export default AdminDashboard;