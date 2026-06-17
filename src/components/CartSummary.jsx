function CartSummary({
    total,
    quantity,
    isSubmitting,
    onCheckout,
    onBack,
}) {
    return (
        <div style={styles.card}>
            <h3 style={styles.title}>
                Resumo do Pedido
            </h3>

            <div style={styles.row}>
                <span>Quantidade de números</span>
                <strong style={styles.rowValue}>
                    {quantity}
                </strong>
            </div>

            <hr style={styles.divider} />

            <div style={styles.totalBox}>
                <span style={styles.totalLabel}>
                    Total a pagar
                </span>

                <p style={styles.totalPrice}>
                    {total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </p>
            </div>

            <div style={styles.paymentMethod}>
                Pagamento via Pix
            </div>

            <button
                style={{
                    ...styles.checkoutButton,
                    ...(isSubmitting || quantity === 0
                        ? styles.checkoutButtonDisabled
                        : {}),
                }}
                onClick={onCheckout}
                disabled={isSubmitting || quantity === 0}
            >
                Finalizar Pedido
            </button>

            <button
                style={styles.backButton}
                onClick={onBack}
            >
                Continuar Comprando
            </button>

            <p style={styles.disclaimer}>
                Após o pagamento, seus números serão registrados automaticamente na rifa.
            </p>
        </div>
    );
}


const styles = {
    title: {
        margin: 0,
        marginBottom: "20px",
        color: "#0f172a",
        fontSize: "1.25rem",
        fontWeight: "700",
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: "20px",
        padding: "24px",
        border: "1px solid #e2e8f0",
        transition: "all 0.2s ease",
        cursor: "default",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    },

    totalPrice: {
        margin: "12px 0 0 0",
        fontSize: "2.4rem",
        fontWeight: "800",
        color: "#10B981",
        lineHeight: 1,
    },

    paymentMethod: {
        marginTop: "20px",
        marginBottom: "20px",
        padding: "12px",
        backgroundColor: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "12px",
        textAlign: "center",
        color: "#2563eb",
        fontWeight: "600",
        fontSize: "0.95rem",
    },

    checkoutButton: {
        width: "100%",
        border: "none",
        borderRadius: "14px",
        padding: "16px",
        color: "#fff",
        fontWeight: "700",
        fontSize: "1rem",
        cursor: "pointer",
        marginTop: "20px",
        backgroundColor: "#10B981",
        boxShadow:
            "0 4px 12px rgba(16,185,129,0.25)",
    },

    backButton: {
        width: "100%",
        marginTop: "12px",
        borderRadius: "14px",
        padding: "14px",
        border: "1px solid #cbd5e1",
        backgroundColor: "#fff",
        color: "#334155",
        fontWeight: "600",
        cursor: "pointer",
    },

    totalBox: {
        background: "linear-gradient(135deg,#ecfdf5,#f0fdf4)",
        border: "1px solid #bbf7d0",
        borderRadius: "14px",
        padding: "16px",
        marginTop: "16px",
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "0.95rem",
        color: "#475569",
    },

    rowValue: {
        fontWeight: "700",
        color: "#0f172a",
    },

    disclaimer: {
        marginTop: "16px",
        fontSize: "0.75rem",
        color: "#94a3b8",
        textAlign: "center",
    },

    checkoutButtonDisabled: {
        backgroundColor: "#cbd5e1",
        cursor: "not-allowed",
        boxShadow: "none",
    },

    divider: {
        border: "none",
        borderTop: "1px solid #e2e8f0",
        margin: "16px 0",
    },
};

export default CartSummary;