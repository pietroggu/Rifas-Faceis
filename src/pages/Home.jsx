import React, { useEffect, useState } from "react";
import RaffleCard from "../components/RaffleCard";
import RaffleService from "../services/raffleService"; // Replaced raw API with the business service layer

/**
 * Main marketplace/home page that displays, searches, and filters all available enriched raffles.
 */
function Home() {
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");
  const [sortBy, setSortBy] = useState("padrao");

  useEffect(() => {
    /**
     * Fetches enriched raffle items via the service layer to populate computed UI properties.
     */
    async function fetchRaffles() {
      try {
        // Calling RaffleService instead of raw api handles automatic formatting and metrics injection
        const data = await RaffleService.getAllRaffles();
        setRaffles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRaffles();
  }, []);

  // Dynamically maps unique available categories based on active records
  const categories = [
    "todas",
    ...new Set(raffles.map((r) => r.category).filter(Boolean)),
  ];

  /**
   * In-memory filtering and sorting computation driven by local reactive states.
   */
  const filteredRaffles = raffles
    .filter((raffle) => {
      const searchTerm = search.toLowerCase();
      
      const raffleName = (raffle.name || "").toLowerCase();
      const raffleCategory = raffle.category || "";

      const nameMatch = raffleName.includes(searchTerm);
      const categoryMatch = category === "todas" || raffleCategory === category;

      return nameMatch && categoryMatch;
    })
    .sort((a, b) => {
      const priceA = a.ticketPrice || 0;
      const priceB = b.ticketPrice || 0;
      const nameA = a.name || "";
      const nameB = b.name || "";

      if (sortBy === "menor_preco") return priceA - priceB;
      if (sortBy === "maior_preco") return priceB - priceA;
      if (sortBy === "nome_az") return nameA.localeCompare(nameB);
      if (sortBy === "nome_za") return nameB.localeCompare(nameA);
      return 0;
    });

  if (loading) return <p style={styles.center}>Carregando rifas...</p>;
  if (error) return <p style={styles.errorText}>Erro: {error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.center}>🎯 Rifas Disponíveis</h1>

      {/* Control Filters panel UI element wrapper */}
      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Pesquisar rifas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "todas" ? "Todas as categorias" : cat}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={styles.select}
        >
          <option value="padrao">Ordem padrão</option>
          <option value="menor_preco">Menor preço</option>
          <option value="maior_preco">Maior preço</option>
          <option value="nome_az">Nome A → Z</option>
          <option value="nome_za">Nome Z → A</option>
        </select>
      </div>
      <p style={styles.resultCount}>
        {filteredRaffles.length}{" "}
        {filteredRaffles.length === 1
          ? "rifa encontrada"
          : "rifas encontradas"}
      </p>

      {raffles.length === 0 ? (
        <p style={styles.center}>Nenhuma rifa disponível no momento.</p>
      ) : filteredRaffles.length === 0 ? (
        <p style={styles.center}>Nenhuma rifa encontrada para essa pesquisa.</p>
      ) : (
        /* Render Grid mapping directly to the new structured camelCase component attributes */
        <div style={styles.grid}>
          {filteredRaffles.map((raffle) => (
            <div style={styles.cardWrapper} key={raffle.id}>
              <RaffleCard
                id={raffle.id}
                name={raffle.name}
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
  );
}

const styles = {
  container: { padding: "20px", textAlign: "center", backgroundColor: "#f8fafc", minHeight: "100vh" },
  center: { textAlign: "center", padding: "10px", margin: "5px", color: "#0f172a" },
  errorText: { textAlign: "center", color: "#ef4444", marginTop: "20px", fontWeight: "bold" },
  cardWrapper: { flex: "1 1 280px", maxWidth: "320px", width: "100%" },
  grid: { display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", marginTop: "20px" },
  controls: { display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "20px", marginBottom: "10px" },
  searchInput: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", minWidth: "280px", outline: "none", color: "#334155" },
  select: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", cursor: "pointer", backgroundColor: "#fff", outline: "none", color: "#334155" },
  
  resultCount: {
  textAlign: "center",
  color: "#64748b",
  marginTop: "10px",
  marginBottom: "10px",
  fontSize: "14px",
},
};

export default Home;