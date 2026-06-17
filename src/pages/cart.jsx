import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import RaffleService from "../services/raffleService";
import logo from "../assets/logo.png";

function Cart() {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, clearCart } = useCart();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cálculos dinâmicos baseados no carrinho real
    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

    // Função que processa todas as compras do carrinho
    const handleCheckout = async () => {
        if (cartItems.length === 0) return alert("Seu carrinho está vazio!");
        
        setIsSubmitting(true);
        try {
            // Executa as requisições de compra para cada item do carrinho de forma assíncrona
            // Nota: Se sua API aceitar compras em lote, você pode otimizar isso no futuro.
            const purchasePromises = cartItems.map(item => 
                RaffleService.purchaseNumber(item.raffleId, item.number, {
                    name: user?.name || "Usuário Anonimo",
                    phone: user?.phone || "",
                    userId: user?.id || null, 
                })
            );

            await Promise.all(purchasePromises);

            alert("Todas as compras foram realizadas com sucesso!");
            clearCart(); // Limpa o carrinho pós-compra
            navigate("/"); // Redireciona para a home ou página de sucesso
        } catch (error) {
            console.error("Erro na finalização da compra:", error);
            alert("Ocorreu um erro ao processar uma ou mais compras. Tente novamente.");
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
                    onClick={handleCheckout}
                    disabled={isSubmitting || cartItems.length === 0}
                >
                    {isSubmitting ? "Processando..." : "Finalizar Compra"}
                </button>

                <button
                    style={styles.backButton}
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                >
                    Continuar Comprando
                </button>
            </div>
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
};

export default Cart;