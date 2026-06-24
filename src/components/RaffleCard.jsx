import React from "react";
import { useNavigate } from "react-router-dom";
import "./RaffleCard.css";

/**
 * RaffleCard component renders a clickable preview item card for a specific raffle record.
 * Fully aligned with camelCase Prisma model properties and enriched service flags.
 */
function RaffleCard({ 
  id, 
  name,  
  prize, 
  category, 
  ticketPrice, 
  totalTickets, 
  imageUrl,
  formattedPrice,
  salesProgress,
  isSoldOut,
  drawnAt,
  formattedDrawDate
}) {
  const navigate = useNavigate();

  /**
   * Routes the client view to the unique detailed page of the target raffle.
   */
  function handleClick() {
    navigate(`/rifa/${id}`);
  }

  return (
    <div 
      onClick={handleClick} 
      className={`raffle-card ${isSoldOut ? "sold-out" : ""} ${drawnAt ? "drawn" : ""}`}
    >
      {/* Raffle Image Cover Section */}
      <div className="raffle-card-image-wrapper">
        <img 
          src={imageUrl || "https://placehold.co/600x400/e2e8f0/64748b?text=Rifa"} 
          alt={`${name} cover`} 
          className="raffle-card-image"
        />
        {/* Dynamic status badge displayed when tickets are fully sold out */}
        {isSoldOut && <span className="raffle-sold-out-badge">Esgotado</span>}
        {drawnAt && <span className="raffle-drawn-badge">Sorteada</span>}
      </div>

      {/* Main Content Layout Block */}
      <div className="raffle-card-body">
        {category && <span className="raffle-card-tag">{category}</span>}
        
        <h2 className="raffle-card-title">{name}</h2>
        
        <p className="raffle-card-prize">
          🏆 Prêmio: <strong>{prize}</strong>
        </p>
        
        {/* Linear Loading Progress Bar tracking actual sales volume */}
        <div className="raffle-card-progress-section">
          <div className="raffle-card-progress-bar-container">
            <div 
              className="raffle-card-progress-bar" 
              style={{ width: `${Math.min(salesProgress || 0, 100)}%` }}
            ></div>
          </div>
          <span className="raffle-card-progress-text">
            {salesProgress || 0}% Vendido
          </span>
        </div>

        {/* Operational Financial Meta Information Footer */}
        <div className="raffle-card-footer">
          <p className="raffle-card-price">
            {formattedPrice || `R$ ${ticketPrice?.toFixed(2)}`}
          </p>
          <p className="raffle-card-tickets">
            {totalTickets} números
          </p>
        </div>

        {/* Localized target deadline representation string */}
        {formattedDrawDate && (
          <p className="raffle-card-date">
            📅 Sorteio: {formattedDrawDate}
          </p>
        )}
      </div>
    </div>
  );
}

export default RaffleCard;