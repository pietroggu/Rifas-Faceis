import React from "react";
import { useNavigate } from "react-router-dom";
import "./RaffleCard.css";

/**
 * Componente que representa uma rifa individual
 * @param {Object} props
 * @param {string} props.title - Nome da rifa
 * @param {string} props.description - Descrição da rifa
 * @param {number} props.price - Preço por número
 * @param {number} props.totalNumbers - Quantidade total de números
 */

/**
 * Card de rifa clicável
 */
function RaffleCard({ id, title, description, price, totalNumbers }) {
    const navigate = useNavigate();

    function handleClick() {
        // Redireciona passando o ID
        navigate(`/rifa/${id}`);
    }

    return (
        <div onClick={handleClick} className="raffle-card">
            <h2>{title}</h2>
            <p>{description}</p>
            <p>💰 R$ {price}</p>
            <p>🎟 {totalNumbers} números</p>
        </div>
    );
}

const styles = {
    card: {
        width: "250px",
        padding: "20px",
        borderRadius: "10px",
        background: "#fff",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        cursor: "pointer",
        transition: "0.2s"
    }
    
};

export default RaffleCard;