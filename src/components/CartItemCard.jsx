import { Trash2 } from "lucide-react";

function CartItemCard({ raffle, onRemove, onDeleteRaffle }) {

    const unitPrice = raffle.totalPrice / raffle.quantity;

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <span style={styles.badge}>
                    🎟️ {raffle.quantity} números
                </span>

                <button
                    style={styles.deleteRaffleButton}
                    onClick={onDeleteRaffle}
                >
                    <Trash2 size={18} /> Remover rifa
                </button>
            </div>

            <h3 style={styles.raffleName}>
                {raffle.raffleName}
            </h3>

            <div style={styles.section}>
                <span style={styles.label}>
                    Números selecionados
                </span>

                <div style={styles.numbersContainer}>
                    {[...raffle.numbers].sort((a, b) => a - b)
                        .map((number) => (
                            <div
                                key={number}
                                style={styles.numberChip}
                            >
                                <span>#{number}</span>

                                <button
                                    style={styles.removeNumberButton}
                                    onClick={() =>
                                        onRemove(
                                            raffle.raffleId,
                                            number
                                        )
                                    }
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                </div>

                <p style={styles.quantity}>
                    {raffle.quantity} número(s)
                    selecionado(s)
                </p>
            </div>

            <div style={styles.footer}>
                <div>
                    <span style={styles.label}>
                        Valor por número
                    </span>

                    <p style={styles.unitPrice}>
                        {unitPrice.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </p>
                </div>

                <div>
                    <span style={styles.label}>
                        Total
                    </span>

                    <p style={styles.price}>
                        {raffle.totalPrice.toLocaleString(
                            "pt-BR",
                            {
                                style: "currency",
                                currency: "BRL",
                            }
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: "#fff",
        borderRadius: "20px",
        padding: "20px",
        border: "1px solid #e2e8f0",

        transition: "all 0.2s ease",

        cursor: "default",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
    },

    deleteRaffleButton: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",

        border: "none",
        background: "#fee2e2",
        color: "#dc2626",

        padding: "8px 12px",
        borderRadius: "8px",

        cursor: "pointer",
        fontWeight: "600",
        fontSize: "0.9rem",

        transition: "all 0.2s ease",
    },

    deleteRaffleButtonHover: {
        background: "#fecaca",
    },

    badge: {
        backgroundColor: "#dbeafe",
        color: "#2563eb",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "0.8rem",
        fontWeight: "600",
    },

    raffleName: {
        margin: "0 0 20px 0",
        color: "#0f172a",
        fontSize: "1.15rem",
        fontWeight: "700",
    },

    section: {
        marginBottom: "20px",
    },

    label: {
        display: "block",
        fontSize: "0.8rem",
        color: "#64748b",
        marginBottom: "8px",
    },

    footer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },

    price: {
        margin: 0,
        fontSize: "1.3rem",
        fontWeight: "700",
        color: "#10B981",
    },

    numbersContainer: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
    },

    numberChip: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        backgroundColor: "#eff6ff",
        color: "#2563eb",
        padding: "8px 12px",
        borderRadius: "10px",
        fontWeight: "700",
    },

    removeNumberButton: {
        border: "none",
        background: "transparent",
        color: "#dc2626",
        cursor: "pointer",
        fontWeight: "bold",
        padding: 0,

        width: "18px",
        height: "18px",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    quantity: {
        marginTop: "12px",
        color: "#64748b",
        fontSize: "0.9rem",
    },

    unitPrice: {
        margin: 0,
        fontSize: "1rem",
        fontWeight: "600",
        color: "#475569",
    },
};

export default CartItemCard;