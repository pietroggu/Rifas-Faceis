import React from "react";

/**
 * Componente de número da rifa
 * @param {number} number
 * @param {boolean} sold
 * @param {Function} onClick
 */
function NumberCard({ number, sold, onClick }) {
    function handleClick() {
        if (!sold && onClick) {
            onClick(number);
        }
    }

    return (
        <div
            onClick={handleClick}
            style={{
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                fontWeight: "bold",
                color: "#fff",
                cursor: sold ? "not-allowed" : "pointer",
                background: sold ? "#bdbdbd" : "#4caf50",
                transition: "0.2s",
                boxShadow: sold
                    ? "none"
                    : "0 2px 6px rgba(0,0,0,0.2)"
            }}
        >
            {number}
        </div>
    );
}

export default NumberCard;