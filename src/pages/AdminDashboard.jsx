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
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  function getErrorMessage(error) {
    return (
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Ocorreu um erro inesperado"
    );
  }

  function validate() {
    const newErrors = {};

    if (!newRaffle.name.trim()) {
      newErrors.name = "Nome da rifa é obrigatório";
    }

    if (!newRaffle.prize.trim()) {
      newErrors.prize = "Prêmio é obrigatório";
    }

    if (!newRaffle.ticketPrice || Number(newRaffle.ticketPrice) <= 0) {
      newErrors.ticketPrice = "Preço deve ser maior que zero";
    }

    if (!newRaffle.totalTickets || Number(newRaffle.totalTickets) <= 0) {
      newErrors.totalTickets = "Quantidade deve ser maior que zero";
    }

    if (!newRaffle.drawDate) {
      newErrors.drawDate = "Data do sorteio é obrigatória";
    }

    return newErrors;
  }
  /**
   * Asynchronously fetches all registered raffles from the service layer to sync the UI grid.
   */
  async function loadRaffles() {
    try {
      setLoading(true);

      const data = await RaffleService.getAllRaffles();

      const privilegedUsers = [3, 7];

      const filteredRaffles = privilegedUsers.includes(Number(user?.id))
        ? data
        : data.filter(
            raffle => Number(raffle.authorId) === Number(user?.id)
          );

      setRaffles(filteredRaffles);

    } catch (error) {
      console.error("Failed to fetch dashboard raffles:", error);
    } finally {
      setLoading(false);
    }
  }

    useEffect(() => {
      loadRaffles();
    }, []);


  /**
   * Intercepts input mutations and applies strict numeric sanitation formatting rules.
   * Prevents non-numeric entries or invalid data patterns from updating state.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} e - Change event.
   */
  function handleInputChange(e) {
    const { name, value } = e.target;

    setGeneralError("");
    setSuccessMessage("");

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }

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
      setGeneralError(
        "A imagem é muito grande. Escolha uma foto de até 2MB."
      );
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

    setErrors({});
    setGeneralError("");

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Safety guard verifying an active session context is available
    if (!user || !user.id) {
      setGeneralError(
        "Você precisa estar autenticado para criar uma rifa."
      );
      return;
    }

    setIsCreating(true);

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
      setSuccessMessage("Rifa criada com sucesso!");
      
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
      await loadRaffles();
    } catch (error) {
      setGeneralError(getErrorMessage(error));
    }
    finally {
      setIsCreating(false);
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Painel Administrativo</h1>
      <h4 style={styles.mainTitle}>Atenção, de preferência a colocar o link da imagem do que fazer o upload dela no site, imagens maiores que 1 mb não são suportadas para upload!</h4>

      {generalError ? (
        <div style={styles.errorBox}>
          {generalError}
        </div>
      ) : successMessage ? (
        <div style={styles.successBox}>
          {successMessage}
        </div>
      ) : null}

      {/* Accordion view toggler button */}
      <button 
        style={styles.toggleButton} 
        onClick={() => {
          setGeneralError("");
          setSuccessMessage("");
          setShowForm((prev) => !prev);
        }}
        disabled={loading || isCreating}
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

          {errors.image && (
            <span style={styles.fieldError}>
              {errors.image}
            </span>
          )}

          <input
            style={styles.input}
            type="text"
            name="name"
            placeholder="Nome da Rifa *"
            value={newRaffle.name}
            onChange={handleInputChange}
          />

          {errors.name && (
            <span style={styles.fieldError}>
              {errors.name}
            </span>
          )}

          <input
            style={styles.input}
            type="text"
            name="prize"
            placeholder="Prêmio Principal *"
            value={newRaffle.prize}
            onChange={handleInputChange}
          />

          {errors.prize && (
            <span style={styles.fieldError}>
              {errors.prize}
            </span>
          )}

          <input
            style={styles.input}
            type="text" // Input field type changed to text to fully drive explicit regex filtration logic
            name="ticketPrice"
            placeholder="Preço do Bilhete (Ex: 15.50) *"
            value={newRaffle.ticketPrice}
            onChange={handleInputChange}
          />

          {errors.ticketPrice && (
            <span style={styles.fieldError}>
              {errors.ticketPrice}
            </span>
          )} 

          <input
            style={styles.input}
            type="text" // Input field type changed to text to fully drive explicit regex filtration logic
            name="totalTickets"
            placeholder="Quantidade Total de Bilhetes *"
            value={newRaffle.totalTickets}
            onChange={handleInputChange}
          />

          {errors.totalTickets && (
            <span style={styles.fieldError}>
              {errors.totalTickets}
            </span>
          )}

          <input
            style={styles.input}
            type="date"
            name="drawDate"
            value={newRaffle.drawDate}
            onChange={handleInputChange}
          />

          {errors.drawDate && (
            <span style={styles.fieldError}>
              {errors.drawDate}
            </span>
          )}

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
          
          <button
            style={{
              ...styles.submitButton,
              opacity: isCreating ? 0.7 : 1,
              cursor: isCreating ? "not-allowed" : "pointer",
            }}
            type="submit"
            disabled={isCreating}
          >
            {isCreating ? "Criando..." : "Confirmar Criação"}
          </button>
        </form>
      )}

      {/* Active Records Render Grid */}
      <div style={styles.listSection}>
        <h2 style={styles.sectionTitle}>Rifas Ativas no Sistema</h2>
        {loading ? (
          <div style={styles.grid}>
            {[...Array(6)].map((_, index) => (
              <div key={index} style={styles.skeletonCard}>
                <div style={styles.skeletonImage}></div>
                <div style={styles.skeletonLine}></div>
                <div style={styles.skeletonLineSmall}></div>
                <div style={styles.skeletonLine}></div>
              </div>
            ))}
          </div>
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
    backgroundColor: "#f5f6fa",
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

  skeletonCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    width: "320px",
    border: "1px solid #e2e8f0",
  },

  skeletonImage: {
    width: "100%",
    height: "180px",
    background: "#e5e7eb",
    borderRadius: "8px",
    marginBottom: "12px",
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
    height: "12px",
    width: "60%",
    background: "#e5e7eb",
    borderRadius: "4px",
    marginBottom: "10px",
    animation: "pulse 1.5s ease-in-out infinite",
  },

  errorBox: {
    background: "#ffe6e6",
    color: "#cc0000",
    padding: "10px",
    borderRadius: "5px",
    margin: "0 auto 20px auto",
    fontSize: "14px",
    width: "100%",
    maxWidth: "450px",
  },

  successBox: {
    background: "#DCFCE7",
    color: "#166534",
    padding: "10px",
    borderRadius: "5px",
    margin: "0 auto 20px auto",
    fontSize: "14px",
    width: "100%",
    maxWidth: "450px",
  },

  fieldError: {
    color: "#cc0000",
    fontSize: "13px",
    marginBottom: "6px",
    marginTop: "-2px",
  },
};

export default AdminDashboard;