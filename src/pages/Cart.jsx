import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import RaffleService from "../services/raffleService";
import pix from "../assets/pix-image.webp"; // Importação da sua imagem estática
import CartItemCard from "../components/CartItemCard";
import CartSummary from "../components/CartSummary";

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado para o Modal do Pix
    const [pixModalOpen, setPixModalOpen] = useState(false);

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);
    const groupedItems = Object.values(
        cartItems.reduce((acc, item) => {
            if (!acc[item.raffleId]) {
                acc[item.raffleId] = {
                    raffleId: item.raffleId,
                    raffleName: item.raffleName,
                    numbers: [],
                    quantity: 0,
                    totalPrice: 0,
                };
            }

            acc[item.raffleId].numbers.push(item.number);
            acc[item.raffleId].quantity += 1;
            acc[item.raffleId].totalPrice += item.price;

            return acc;
        }, {})
    );

    // Abre o modal de pagamento se houver itens no carrinho
    const handleOpenPayment = () => {
        if (cartItems.length === 0) return alert("Seu carrinho está vazio!");
        setPixModalOpen(true);
    };

    // Função que processa e envia as compras para a API
    const handleConfirmPayment = async () => {
        setIsSubmitting(true);
        setPixModalOpen(false); // Fecha o modal para mostrar o processamento
        
        try {
            const purchasePromises = cartItems.map(item => 
                RaffleService.purchaseNumber(item.raffleId, item.number, {
                    name: user?.name || "Usuário Anonimo",
                    phone: user?.phone || "",
                    userId: user?.id || null, 
                })
            );

            await Promise.all(purchasePromises);

            alert("Pagamento enviado! Suas rifas foram reservadas com sucesso.");
            clearCart(); 
            navigate("/"); 
        } catch (error) {
            console.error("Erro na finalização da compra:", error);
            alert("Ocorreu um erro ao processar o pagamento. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        Carrinho
                    </h1>
                    <p style={styles.subtitle}>
                        {groupedItems.length} rifas • {cartItems.length} números selecionados<br></br>
                        Revise seus números antes de finalizar.
                    </p>
                </div>

                <div style={styles.grid}>
                    <div style={styles.itemsColumn}>
                        {cartItems.length === 0 ? (
                            <div style={styles.emptyState}>
                                <h2>Seu carrinho está vazio</h2>

                                <p>
                                    Você ainda não selecionou nenhum número.
                                </p>

                                <button
                                    style={styles.emptyButton}
                                    onClick={() => navigate("/")}
                                >
                                    Ver Rifas Disponíveis
                                </button>
                            </div>
                        ) : (
                            groupedItems.map((raffle) => (
                                <CartItemCard
                                    key={raffle.raffleId}
                                    raffle={raffle}
                                    onRemove={removeFromCart}
                                />
                            ))
                        )}
                    </div>

                    <div style={styles.summaryColumn}>
                        <CartSummary
                            total={total}
                            quantity={cartItems.length}
                            isSubmitting={isSubmitting}
                            onCheckout={handleOpenPayment}
                            onBack={() => navigate(-1)}
                        />
                    </div>
                </div>
            </div>

            {/* --- MODAL DO PIX --- */}
            {pixModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <button style={styles.closeModalX} onClick={() => setPixModalOpen(false)}>✕</button>
                        
                        <h2 style={styles.modalTitle}>Pagamento via Pix</h2>
                        <p style={styles.modalSubtitle}>Escaneie o QR Code abaixo para pagar</p>
                        
                        <div style={styles.pixContainer}>
                            {/* AJUSTADO AQUI: Agora passa a variável pix sem aspas */}
                            <img 
                                src={pix} 
                                alt="QR Code Pix" 
                                style={styles.qrCode}
                            />
                            
                            <div style={styles.pixInfo}>
                                <span style={styles.infoLabel}>Valor a pagar:</span>
                                <strong>
                                    {total.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </strong>
                                <small style={{ color: "#64748b", marginTop: "10px" }}>Beneficiário: Rifa Fácil Ltda</small>
                                <small style={{ color: "#ef4444", marginTop: "5px", fontSize: "0.75rem", fontWeight: "bold" }}>
                                    ⚠️ Digite o valor exato no app do seu banco!
                                </small>
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button
                                style={styles.confirmPaymentBtn}
                                onClick={handleConfirmPayment}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Processando..."
                                    : "Confirmar Pagamento"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 20px",
    },

    title: {
        margin: 0,
        color: "#0f172a",
        fontSize: "2rem",
        fontWeight: "800",
    },

    modalContent: {
        backgroundColor: "#fff",
        borderRadius: "20px",
        padding: "32px",
        width: "90%",
        maxWidth: "500px",
        position: "relative",
    },

    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    closeModalX: { position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" },
    modalTitle: { margin: "0 0 5px 0", color: "#1e293b" },
    modalSubtitle: { margin: "0 0 25px 0", color: "#64748b", fontSize: "0.95rem" },
    pixContainer: { display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "25px" },
    qrCode: { width: "150px", height: "150px", backgroundColor: "#fff", padding: "5px", borderRadius: "5px", border: "1px solid #cbd5e1", objectFit: "contain" },
    pixInfo: { display: "flex", flexDirection: "column", textAlign: "left" },
    infoLabel: { fontSize: "0.85rem", color: "#64748b" },
    infoValue: { fontSize: "1.6rem", color: "#10B981" },
    modalFooter: { display: "flex", justifyContent: "flex-end", width: "100%" },
    confirmPaymentBtn: { backgroundColor: "#10B981", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 2px 4px rgba(16,185,129,0.2)" },

    container: {
        width: "100%",
        maxWidth: "1400px",
    },

    grid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
    },


    itemsColumn: {
        display: "flex",
        flexDirection: "column",
        flex: "2 1 700px",
        gap: "16px",
    },

    summaryColumn: {
        position: "sticky",
        top: "20px",
        flex: "1 1 320px",
    },

    emptyState: {
        backgroundColor: "#eaebed",
        borderRadius: "20px",
        padding: "40px",
        textAlign: "center",
    },

    emptyButton: {
        marginTop: "20px",
        padding: "14px 20px",
        borderRadius: "12px",
        border: "none",
        backgroundColor: "#2563eb",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
    },

    header: {
        marginBottom: "32px",
    },

    subtitle: {
        margin: "8px 0 0 0",
        color: "#64748b",
        fontSize: "0.95rem",
    },
};

export default Cart;
