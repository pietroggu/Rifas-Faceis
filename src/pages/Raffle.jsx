import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import raffleService from "../services/raffleService";
import NumberCard from "../components/NumberCard";
import PurchaseModal from "../components/PurchaseModal";

/**
 * Página de detalhes da rifa
 */
function Raffle() {
    const { id } = useParams();

    const [raffle, setRaffle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    /**
     * Carrega dados da rifa
     */
    useEffect(() => {
        async function fetchRaffle() {
            try {
                const data = await raffleService.getRaffleById(id);
                setRaffle(data);
            } catch (error) {
                console.error("Erro ao carregar rifa:", error);
                alert("Erro ao carregar rifa");
            } finally {
                setLoading(false);
            }
        }

        fetchRaffle();
    }, [id]);

    /**
     * Gera números
     */
    function gerarNumeros() {
        if (!raffle) return [];

        return Array.from(
            { length: raffle.totalNumbers },
            (_, i) => i + 1
        );
    }

    /**
     * Clique em número disponível
     */
    function handleNumberClick(number) {
        setSelectedNumber(number);
        setModalOpen(true);
    }

    /**
     * Confirma compra
     */
    function handleConfirmPurchase(data) {
        alert(
            `Compra realizada!\nNúmero: ${data.number}\nNome: ${data.name}`
        );

        setModalOpen(false);
    }

    if (loading) return <p>Carregando...</p>;
    if (!raffle) return <p>Rifa não encontrada</p>;

    const numeros = gerarNumeros();

    return (
        <div style={styles.container}>
            <h1>{raffle.title}</h1>

            <div style={styles.grid}>
                {numeros.map((num) => {
                    const sold = raffle.soldNumbers.includes(num);

                    return (
                        <NumberCard
                            key={num}
                            number={num}
                            sold={sold}
                            onClick={handleNumberClick}
                        />
                    );
                })}
            </div>

            <PurchaseModal
                open={modalOpen}
                number={selectedNumber}
                price={raffle.price}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmPurchase}
            />
        </div>
    );
}

const styles = {
    container: {
        padding: "20px",
        textAlign: "center"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 50px)",
        gap: "10px",
        justifyContent: "center",
        marginTop: "20px"
    }
};

export default Raffle;