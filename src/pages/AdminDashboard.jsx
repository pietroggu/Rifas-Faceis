import React, { useState, useEffect } from "react";
import RaffleCard from "../components/RaffleCard";
import RaffleService from "../services/raffleService";

/**
 * AdminDashboard manages administrative actions such as creating new raffles
 * and observing existing active data.
 */
function AdminDashboard() {
  const [raffles, setRaffles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Controlled form state initialized with empty strings
  const [newRaffle, setNewRaffle] = useState({
    title: "",
    price: "",
    totalNumbers: "",
    description: "",
    institution: "",
    date: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    loadRaffles();
  }, []);

  /**
   * Fetches all registered raffles from the centralized service.
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
   * Universal input change handler for the creation form.
   */
  function handleInputChange(e) {
    const { name, value } = e.target;
    setNewRaffle((prev) => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem é muito grande! Escolha uma foto de no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewRaffle((prev) => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  /**
   * Validates, maps payload fields to DB structure, and submits a new raffle.
   */
  async function handleCreateRaffle(e) {
    e.preventDefault();

    const { title, price, totalNumbers, date, description, institution, category, imageUrl } = newRaffle;

    if (!title || !price || !totalNumbers || !date || !description || !institution || !category) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    try {
      // Maps UI state keys directly to backend database structure fields
      const backendPayload = {
        title: title,
        description: description,
        ticketPrice: Number(price),
        category: category,
        institution: institution,
        totalTickets: Number(totalNumbers),
        drawDate: date,
      };

      if (imageUrl) {
        backendPayload.imageUrl = imageUrl;
        backendPayload.imagem = imageUrl;
      }

      await RaffleService.createRaffle(backendPayload);
      alert("Rifa criada com sucesso!");
      
      // Resets input controls and refreshes layout data list
      setNewRaffle({
        title: "",
        price: "",
        totalNumbers: "",
        description: "",
        institution: "",
        date: "",
        category: "",
        imageUrl: "",
      });
      setShowForm(false);
      await loadRaffles();
    } catch (error) {
      alert(error.message || "Erro ao criar rifa.");
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Painel Administrativo</h1>

      {/* Toggle Form Trigger Button */}
      <button 
        style={styles.toggleButton} 
        onClick={() => setShowForm((prev) => !prev)}
      >
        {showForm ? "Fechar Formulário" : "Criar Nova Rifa"}
      </button>

      {/* Creation Form Content View */}
      {showForm && (
        <form style={styles.form} onSubmit={handleCreateRaffle}>
          <h2 style={styles.formTitle}>Nova Rifa</h2>
          
          <input
            style={styles.input}
            type="text"
            name="title"
            placeholder="Título da Rifa"
            value={newRaffle.title}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="number"
            name="price"
            placeholder="Preço por Número (R$)"
            value={newRaffle.price}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="number"
            name="totalNumbers"
            placeholder="Quantidade total de números"
            value={newRaffle.totalNumbers}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="date"
            name="date"
            value={newRaffle.date}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="text"
            name="institution"
            placeholder="Instituição Beneficiada"
            value={newRaffle.institution}
            onChange={handleInputChange}
          />
          <input
            style={styles.input}
            type="text"
            name="category"
            placeholder="Categoria"
            value={newRaffle.category}
            onChange={handleInputChange}
          />
          <textarea
            style={{ ...styles.input, minHeight: "80px", resize: "vertical" }}
            name="description"
            placeholder="Descrição detalhada..."
            value={newRaffle.description}
            onChange={handleInputChange}
          />

          <label style={styles.fileLabel}>
            Imagem do item (opcional)
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={styles.fileInput}
            />
          </label>
          {newRaffle.imageUrl && (
            <img src={newRaffle.imageUrl} alt="Prévia" style={styles.imagePreview} />
          )}
          
          <button style={styles.submitButton} type="submit">
            Confirmar Criação
          </button>
        </form>
      )}

      {/* Registered Raffles Output Grid View */}
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
                  nome={raffle.title || raffle.name || raffle.nome}
                  imagem={raffle.imageUrl || getRaffleImageUrl(raffle)}
                  descricao={raffle.description || raffle.descricao}
                  valor_numero={raffle.ticketPrice ?? raffle.valor_numero}
                  categoria={raffle.category || raffle.categoria}
                  instituicao={raffle.institution || raffle.instituicao}
                  quantidade_numeros={raffle.totalTickets ?? raffle.quantidade_numeros}
                  data_sorteio={raffle.drawDate || raffle.data_sorteio}
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
    margin: "0 0 10px 0",
    fontSize: "1.25rem",
    color: "#1e293b",
  },
  input: {
    padding: "12px",
    fontSize: "0.95rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    outline: "none",
    fontFamily: "inherit",
  },
  fileLabel: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    fontSize: "0.9rem",
    color: "#475569",
    textAlign: "left",
  },
  fileInput: {
    fontSize: "0.85rem",
  },
  imagePreview: {
    width: "100%",
    maxHeight: "180px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  submitButton: {
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