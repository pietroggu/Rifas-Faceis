import React, { useEffect, useState } from "react";
import RaffleCard from "../components/RaffleCard";
import RaffleService from "../services/raffleService";
import { getRaffleImageUrl } from "../utils/raffleImage";

/**
 * Main dashboard page that displays and filters all available raffles.
 */
function Home() {
  const [raffles, setRaffles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");
  const [sortBy, setSortBy] = useState("padrao");

  useEffect(() => {
    async function fetchRaffles() {
      try {
        const data = await RaffleService.getAllRaffles();
        // Fallback check to avoid structural mapping runtime crashes
        setRaffles(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRaffles();
  }, []);

  // Dynamically maps unique available categories based on Prisma Model English key
  const categories = [
    "todas",
    ...new Set(raffles.map((r) => r.category).filter(Boolean)),
  ];

  /**
   * In-memory filtering and sorting engine computed on state mutations.
   */
  const filteredRaffles = raffles
    .filter((raffle) => {
      const searchTerm = search.toLowerCase();
      
      // Aligned fields with your exact Prisma Model structure
      const raffleName = (raffle.name || "").toLowerCase();
      const raffleDescription = (raffle.description || "").toLowerCase();
      const raffleCategory = raffle.category || "";

      const nameMatch = raffleName.includes(searchTerm);
      const descriptionMatch = raffleDescription.includes(searchTerm);
      const categoryMatch = category === "todas" || raffleCategory === category;

      // Allows search matches targeting either the raffle name or its description context
      return (nameMatch || descriptionMatch) && categoryMatch;
    })
    .sort((a, b) => {
      // Numerical sorting references mapped to your schema 'ticketPrice' property
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

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou descrição..."
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

      {raffles.length === 0 ? (
        <p style={styles.center}>Nenhuma rifa disponível no momento.</p>
      ) : filteredRaffles.length === 0 ? (
        <p style={styles.center}>Nenhuma rifa encontrada para essa pesquisa.</p>
      ) : (
        <div style={styles.grid}>
          {filteredRaffles.map((raffle) => (
            <div style={styles.cardWrapper} key={raffle.id}>
              {/* Maps backend properties dynamically into your component parameters */}
              <RaffleCard
                id={raffle.id}
                nome={raffle.name || raffle.title || raffle.nome}
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
  );
}

const styles = {
  container: { padding: "20px", textAlign: "center" },
  center: { textAlign: "center", padding: "10px", margin: "5px" },
  errorText: { textAlign: "center", color: "red", marginTop: "20px" },
  cardWrapper: { flex: "1 1 280px", maxWidth: "320px", width: "100%" },
  grid: { display: "flex", flexWrap: "wrap", gap: "20px", justifyContent: "center", marginTop: "20px" },
  controls: { display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "20px", marginBottom: "10px" },
  searchInput: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", minWidth: "280px", outline: "none" },
  select: { padding: "10px 14px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", cursor: "pointer", backgroundColor: "#fff", outline: "none" },
};

export default Home;