import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import RaffleService from "../services/raffleService";
import logo from "../assets/logo.png";
import pix from "../assets/pix-image.webp"; // Importação da sua imagem estática

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Estado para o Modal do Pix
    const [pixModalOpen, setPixModalOpen] = useState(false);

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

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
            <div style={styles.card}>
                <img src={logo} alt="Rifas Fáceis" style={styles.logo} />
                <h1 style={styles.title}>Seu Carrinho</h1>

                <div style={styles.numbersContainer}>
                    {cartItems.length === 0 ? (
                        <p style={{ color: "#64748b" }}>Nenhum número selecionado ainda.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div key={`${item.raffleId}-${item.number}`} style={styles.numberItem}>
                                <div>
                                    <small style={{ display: "block", fontSize: "0.75rem", opacity: 0.9 }}>
                                        {item.raffleName}
                                    </small>
                                    <strong>Número #{item.number}</strong>
                                    <span style={{ display: "block", fontSize: "0.85rem" }}>
                                        R$ {item.price.toFixed(2)}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => removeFromCart(item.raffleId, item.number)}
                                    style={styles.removeButton}
                                    title="Remover"
                                >
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div style={styles.summary}>
                    <p>Quantidade total: {cartItems.length}</p>
                    <p>Total: R$ {total.toFixed(2)}</p>
                </div>

                <button
                    style={{ 
                        ...styles.checkoutButton, 
                        backgroundColor: isSubmitting || cartItems.length === 0 ? "#cbd5e1" : "#10B981",
                        color: "#fff"
                    }}
                    onClick={handleOpenPayment}
                    disabled={isSubmitting || cartItems.length === 0}
                >
                    {isSubmitting ? "Processando..." : "Ir para o Pagamento"}
                </button>

                <button
                    style={styles.backButton}
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                >
                    Continuar Comprando
                </button>
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
                                <strong style={styles.infoValue}>R$ {total.toFixed(2)}</strong>
                                <small style={{ color: "#64748b", marginTop: "10px" }}>Beneficiário: Rifa Fácil Ltda</small>
                                <small style={{ color: "#ef4444", marginTop: "5px", fontSize: "0.75rem", fontWeight: "bold" }}>
                                    ⚠️ Digite o valor exato no app do seu banco!
                                </small>
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.confirmPaymentBtn} onClick={handleConfirmPayment}>
                                Confirmar Pagamento
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    page: { minHeight: "100vh", backgroundColor: "#3B82F6", display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" },
    card: { backgroundColor: "#eaebed", borderRadius: "20px", padding: "30px", width: "100%", maxWidth: "500px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
    logo: { width: "120px", marginBottom: "20px" },
    title: { marginBottom: "20px" },
    numbersContainer: { display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", marginBottom: "20px", maxHeight: "250px", overflowY: "auto" },
    numberItem: { backgroundColor: "#3B82F6", color: "#fff", padding: "10px 15px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" },
    removeButton: { background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: "1.1rem", fontWeight: "bold", marginLeft: "10px" },
    summary: { marginBottom: "20px", fontWeight: "bold" },
    checkoutButton: { width: "100%", padding: "12px", border: "none", borderRadius: "10px", cursor: "pointer", marginBottom: "10px", fontWeight: "bold" },
    backButton: { width: "100%", padding: "12px", border: "none", borderRadius: "10px", cursor: "pointer", backgroundColor: "#fff", color: "#3B82F6", fontWeight: "bold" },
    
    modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
    modalContent: { backgroundColor: "#fff", padding: "30px", borderRadius: "15px", width: "90%", maxWidth: "450px", position: "relative", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)" },
    closeModalX: { position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748b" },
    modalTitle: { margin: "0 0 5px 0", color: "#1e293b" },
    modalSubtitle: { margin: "0 0 25px 0", color: "#64748b", fontSize: "0.95rem" },
    pixContainer: { display: "flex", gap: "20px", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "15px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "25px" },
    qrCode: { width: "150px", height: "150px", backgroundColor: "#fff", padding: "5px", borderRadius: "5px", border: "1px solid #cbd5e1", objectFit: "contain" },
    pixInfo: { display: "flex", flexDirection: "column", textAlign: "left" },
    infoLabel: { fontSize: "0.85rem", color: "#64748b" },
    infoValue: { fontSize: "1.6rem", color: "#10B981" },
    modalFooter: { display: "flex", justifyContent: "flex-end", width: "100%" },
    confirmPaymentBtn: { backgroundColor: "#10B981", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "0.95rem", boxShadow: "0 2px 4px rgba(16,185,129,0.2)" }
};

export default Cart;