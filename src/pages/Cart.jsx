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
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [raffleToDelete, setRaffleToDelete] = useState(null);
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [message, setMessage] = useState("");
    
    // Estado para o Modal do Pix
    const [pixModalOpen, setPixModalOpen] = useState(false);

    function showMessage(text) {
        setMessage(text);
        setMessageModalOpen(true);
    }

    function handleRequestDelete(raffle) {
        setRaffleToDelete(raffle);
        setDeleteModalOpen(true);
    }

    function handleConfirmDelete() {
        if (!raffleToDelete) return;

        raffleToDelete.numbers.forEach(number => {
            removeFromCart(
                raffleToDelete.raffleId,
                number
            );
        });

        setDeleteModalOpen(false);
        setRaffleToDelete(null);
    }


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
        if (cartItems.length === 0) {
            showMessage("Seu carrinho está vazio!");
            return;
        }

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

            showMessage("Pagamento enviado! Suas rifas foram reservadas com sucesso.");

            clearCart();

            setTimeout(() => {
                navigate("/");
            }, 8000);
        } catch (error) {
            console.error("Erro na finalização da compra:", error);
            showMessage("Ocorreu um erro ao processar o pagamento. Tente novamente.");
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
                    <div style={styles.alerta}>
                        📲 Após o pagamento envie o comprovante para:
                        <strong> (35) 98424-7532</strong>
                    </div>
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
                                    onDeleteRaffle={() => handleRequestDelete(raffle)}
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
                        <p style={styles.modalSubtitle}>
                            Realize o pagamento via PIX e envie o comprovante para confirmar sua compra.
                        </p>
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
                                <small style={{ 
                                    color: "#ef4444", 
                                    marginTop: "5px", 
                                    fontSize: "0.8rem", 
                                    fontWeight: "bold" 
                                }}>
                                    ⚠️ Realize o PIX com o valor exato informado acima para que sua compra seja identificada corretamente.
                                </small>
                                 <div style={styles.proofAlert}>
                                    <strong>📲 Após o pagamento</strong>

                                    <span>
                                        Envie o comprovante para:
                                    </span>

                                    <strong style={styles.phone}>
                                        (35) 98424-7532
                                    </strong>
                                </div>
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
                                    : "Já enviei o comprovante"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {messageModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.confirmModal}>

                        <h3>
                            Aviso
                        </h3>

                        <p>
                            {message}
                        </p>

                        <button
                            style={styles.confirmPaymentBtn}
                            onClick={() => setMessageModalOpen(false)}
                        >
                            OK
                        </button>

                    </div>
                </div>
            )}

            {deleteModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.confirmModal}>
                        <h3>
                            Remover rifa?
                        </h3>

                        <p>
                            Deseja realmente remover todos os números da rifa
                            <strong>
                                {" "}
                                {raffleToDelete?.raffleName}
                            </strong>
                            ?
                        </p>

                        <div style={styles.confirmActions}>
                            <button
                                style={styles.cancelBtn}
                                onClick={() => setDeleteModalOpen(false)}
                            >
                                Cancelar
                            </button>

                            <button
                                style={styles.deleteBtn}
                                onClick={handleConfirmDelete}
                            >
                                Remover
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
        backgroundColor: "#f5f6fa",
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
    alerta: {
        marginTop: "15px",
        padding: "12px 16px",
        background: "#eff6ff",
        border: "1px solid #bfdbfe",
        borderRadius: "10px",
        color: "#1d4ed8",
        fontSize: "0.95rem",
        fontWeight: "500",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: "20px",
        padding: "32px",
        width: "90%",
        maxWidth: "500px",
        position: "relative",
    },

    confirmModal: {
        background: "#fff",
        padding: "24px",
        borderRadius: "16px",
        width: "90%",
        maxWidth: "420px",
        textAlign: "center",
    },

    confirmActions: {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
        marginTop: "20px",
    },

    cancelBtn: {
        background: "#e2e8f0",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },

    deleteBtn: {
        background: "#ef4444",
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
    },

    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    closeModalX: { position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" },
    modalTitle: { margin: "0 0 5px 0", color: "#1e293b" },
    modalSubtitle: { margin: "0 0 25px 0", color: "#64748b", fontSize: "0.95rem" },
    pixContainer: { display: "flex", gap: "30px", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "25px" },
    qrCode: { width: "170px", height: "170px", backgroundColor: "#fff", padding: "5px", borderRadius: "5px", border: "1px solid #cbd5e1", objectFit: "contain" },
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
        proofAlert: {
        marginTop: "15px",
        padding: "12px",
        background: "#fff7ed",
        border: "1px solid #fdba74",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        textAlign: "center",
        color: "#9a3412",
        fontSize: "0.9rem",
    },

    phone: {
        fontSize: "1.1rem",
        color: "#ea580c",
    },
    
};

export default Cart;
