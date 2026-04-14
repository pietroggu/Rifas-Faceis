import React, { useState } from "react";

/**
 * Modal para compra de número da rifa
 */
function PurchaseModal({ open, number, price, onClose, onConfirm }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    if (!open) return null;

    function handleSubmit(e) {
        e.preventDefault();

        if (!name || !phone) {
            alert("Preencha todos os campos!");
            return;
        }

        onConfirm({
            number,
            name,
            phone
        });

        setName("");
        setPhone("");
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2>Comprar número {number}</h2>
                <p>Valor: R$ {price}</p>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                    />

                    <input
                        type="text"
                        placeholder="Telefone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={styles.input}
                    />

                    <div style={styles.actions}>
                        <button type="button" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit">
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    modal: {
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        width: "300px",
        textAlign: "center"
    },
    input: {
        width: "100%",
        padding: "8px",
        margin: "8px 0"
    },
    actions: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "10px"
    }
};

export default PurchaseModal;