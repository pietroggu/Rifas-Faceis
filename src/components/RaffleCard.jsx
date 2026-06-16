import React from "react";
import { useNavigate } from "react-router-dom";
import RaffleImage from "./RaffleImage";
import { getRaffleImageUrl } from "../utils/raffleImage";
import "./RaffleCard.css";

/**
 * RaffleCard component renders a clickable preview item block for a specific raffle data record.
 */
function RaffleCard({ 
  id, 
  nome,
  imagem,
  imageUrl,
  raffle,
  descricao, 
  valor_numero, 
  categoria, 
  instituicao, 
  quantidade_numeros, 
  data_sorteio 
}) {
  const navigate = useNavigate();
  const resolvedImage = imageUrl || imagem || getRaffleImageUrl(raffle);

  function handleClick() {
    navigate(`/rifa/${id}`);
  }

  /**
   * Formats a standard system date string into Brazilian localized format.
   * @param {string} dateString - Raw timestamp or string from DB
   * @returns {string} Formatted output string (DD/MM/YYYY)
   */
  function formatDate(dateString) {
    if (!dateString) return "";
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) return dateString;
    return parsedDate.toLocaleDateString("pt-BR");
  }

  return (
    <div onClick={handleClick} className="raffle-card">
      <RaffleImage
        src={resolvedImage}
        alt={nome || "Imagem da rifa"}
        className="raffle-card-image"
      />

      <h2 className="raffle-card-title">{nome}</h2>
      
      {categoria && <span className="raffle-card-tag">{categoria}</span>}
      
      <p className="raffle-card-description">{descricao}</p>
      
      {instituicao && <p className="raffle-card-info">🏛 {instituicao}</p>}
      
      <div className="raffle-card-footer">
        <p className="raffle-card-price">💰 R$ {valor_numero?.toFixed(2)}</p>
        <p className="raffle-card-tickets">🎟 {quantidade_numeros} números</p>
      </div>

      {data_sorteio && (
        <p className="raffle-card-date">
          📅 Sorteio: {formatDate(data_sorteio)}
        </p>
      )}
    </div>
  );
}

export default RaffleCard;