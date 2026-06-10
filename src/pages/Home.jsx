import React, { useEffect, useState } from "react";
import RaffleCard from "../components/RaffleCard";

/**
 * Página principal que lista as rifas buscadas do backend
 */
function Home() {
  const [rifas, setRifas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todas");
  const [ordenacao, setOrdenacao] = useState("padrao");

  useEffect(() => {
    async function fetchRifas() {
      try {
        const response = await fetch("http://localhost:3000/rifas");
        if (!response.ok) {
          throw new Error("Erro ao buscar rifas");
        }
        const data = await response.json();
        setRifas(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRifas();
  }, []);

  const categorias = [
    "todas",
    ...new Set(rifas.map((r) => r.categoria).filter(Boolean)),
  ];

  const rifasFiltradas = rifas
    .filter((rifa) => {
      const termoBusca = busca.toLowerCase();
      const nomeMatch = rifa.nome.toLowerCase().includes(termoBusca);
      const instituicaoMatch = rifa.instituicao
        ? rifa.instituicao.toLowerCase().includes(termoBusca)
        : false;
      const categoriaMatch =
        categoria === "todas" || rifa.categoria === categoria;

      return (nomeMatch || instituicaoMatch) && categoriaMatch;
    })
    .sort((a, b) => {
      if (ordenacao === "menor_preco") {
        return a.valor_numero - b.valor_numero;
      }
      if (ordenacao === "maior_preco") {
        return b.valor_numero - a.valor_numero;
      }
      if (ordenacao === "nome_az") {
        return a.nome.localeCompare(b.nome);
      }
      if (ordenacao === "nome_za") {
        return b.nome.localeCompare(a.nome);
      }
      return 0;
    });

  if (loading) {
    return <p style={styles.center}>Carregando rifas...</p>;
  }

  if (erro) {
    return <p style={styles.erro}>Erro: {erro}</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.center}>🎯 Rifas Disponíveis</h1>

      {/* Barra de pesquisa e filtros */}
      <div style={styles.controles}>
        <input
          type="text"
          placeholder="Pesquisar por nome ou instituição..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={styles.inputBusca}
        />

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          style={styles.select}
        >
          {categorias.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "todas" ? "Todas as categorias" : cat}
            </option>
          ))}
        </select>

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value)}
          style={styles.select}
        >
          <option value="padrao">Ordem padrão</option>
          <option value="menor_preco">Menor preço</option>
          <option value="maior_preco">Maior preço</option>
          <option value="nome_az">Nome A → Z</option>
          <option value="nome_za">Nome Z → A</option>
        </select>
      </div>

      {rifas.length === 0 ? (
        <p style={styles.center}>Nenhuma rifa disponível no momento.</p>
      ) : rifasFiltradas.length === 0 ? (
        <p style={styles.center}>Nenhuma rifa encontrada para essa pesquisa.</p>
      ) : (
        <div style={styles.grid}>
          {rifasFiltradas.map((rifa) => (
            <div style={styles.cardWrapper} key={rifa.id}>
              <RaffleCard
                id={rifa.id}
                nome={rifa.nome}
                descricao={rifa.descricao}
                valor_numero={rifa.valor_numero}
                categoria={rifa.categoria}
                instituicao={rifa.instituicao}
                quantidade_numeros={rifa.quantidade_numeros}
                data_sorteio={rifa.data_sorteio}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  center: {
    textAlign: "center",
    padding: "10px",
    margin: "5px",
  },
  erro: {
    textAlign: "center",
    color: "red",
    marginTop: "20px",
  },
  cardWrapper: {
    flex: "1 1 280px",
    maxWidth: "320px",
    width: "100%",
  },
  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
    marginTop: "20px",
  },
  controles: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginTop: "20px",
    marginBottom: "10px",
  },
  inputBusca: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    minWidth: "280px",
    outline: "none",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
    cursor: "pointer",
    backgroundColor: "#fff",
    outline: "none",
  },
};

export default Home;
