import React from "react";
import { useNavigate } from "react-router-dom";
import "./RaffleCard.css";

/**
 * Card de rifa clicável
 * @param {number} props.id                 - ID da rifa
 * @param {string} props.nome               - Nome da rifa
 * @param {string} props.descricao          - Descrição da rifa
 * @param {number} props.valor_numero       - Preço por número
 * @param {number} props.quantidade_numeros - Quantidade total de números
 * @param {string} props.categoria          - Categoria da rifa (opcional)
 * @param {string} props.instituicao        - Instituição responsável (opcional)
 * @param {string} props.data_sorteio       - Data do sorteio (opcional)
 */
function RaffleCard({ id, nome, descricao, valor_numero, categoria, instituicao, quantidade_numeros, data_sorteio }) {
    const navigate = useNavigate();

    function handleClick() {
        navigate(`/rifa/${id}`);
    }

    /**
     * Formata a data do banco (YYYY-MM-DD) para DD/MM/AAAA
     * @param {string} data - String de data
     * @returns {string} Data formatada
     */
    function formatarData(data) {
        if (!data) { return ""; }
        const d = new Date(data);
        if (isNaN(d.getTime())) { return data; }
        return d.toLocaleDateString("pt-BR");
    }

    return (
        <div onClick={handleClick} className="raffle-card">
            <h2>{nome}</h2>
            {categoria && <span style={styles.tag}>{categoria}</span>}
            <p>{descricao}</p>
            {instituicao && <p style={styles.info}>🏛 {instituicao}</p>}
            <p>💰 R$ {valor_numero}</p>
            <p>🎟 {quantidade_numeros} números</p>
            {data_sorteio && <p style={styles.data}>📅 Sorteio: {formatarData(data_sorteio)}</p>}
        </div>
    );
}

const styles = {
    tag: {
        display: "inline-block",
        backgroundColor: "#EFF6FF",
        color: "#2563EB",
        fontSize: "12px",
        fontWeight: "600",
        padding: "2px 10px",
        borderRadius: "20px",
        marginBottom: "8px",
    },
    info: {
        fontSize: "13px",
        color: "#555",
        margin: "4px 0",
    },
    data: {
        fontSize: "13px",
        color: "#888",
        marginTop: "8px",
        fontStyle: "italic",
    },
};

export default RaffleCard;
