import React, { useState } from "react";

/**
 * Raffle prize image with hotlink-friendly loading and graceful fallback.
 */
function RaffleImage({ src, alt = "Imagem da rifa", className, style }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={className} style={{ ...style, ...fallbackStyle }}>
        Sem imagem
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

const fallbackStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f1f5f9",
  color: "#94a3b8",
  fontSize: "0.85rem",
  fontWeight: 500,
};

export default RaffleImage;
