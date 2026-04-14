import React from "react";

/**
 * Componente de input reutilizável
 * @param {string} label - Texto do label
 * @param {string} type - Tipo do input
 * @param {string} value - Valor controlado
 * @param {function} onChange - Função de mudança
 * @param {string} error - Mensagem de erro
 */
function Input({ label, type = "text", value, onChange, error }) {
    return (
        <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
                {label}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: error ? "1px solid red" : "1px solid #ccc"
                }}
            />

            {error && (
                <span style={{ color: "red", fontSize: "12px" }}>
                    {error}
                </span>
            )}
        </div>
    );
}

export default Input;