import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Hooked into unified authentication context
import NumberCard from "../components/NumberCard";
import PurchaseModal from "../components/PurchaseModal";
import RaffleService from "../services/raffleService";
import RaffleImage from "../components/RaffleImage";
import { getRaffleImageUrl } from "../utils/raffleImage";

/**
 * Raffle dashboard grid matrix management component.
 */
function Raffle() {
    const { id } = useParams();
    const { user } = useAuth(); // Extracted reactive user profile context dynamically with zero redundancies

    const [raffle, setRaffle] = useState(null);
    const [numbers, setNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                // Unified request capturing full single raffle data structure parameters
                const raffleData = await RaffleService.getRaffleById(id);
                setRaffle(raffleData);

                // Best Practice: Generate layout matrix dynamically based on single data payload property numbers
                const totalTickets = raffleData.totalTickets || raffleData.total_bilhetes || 100;
                const soldTickets = raffleData.tickets || raffleData.bilhetes || [];

                const generatedGrid = Array.from({ length: totalTickets }, (_, index) => {
                    const currentNumber = index + 1;
                    const isSold = soldTickets.some(
                        (ticket) => (ticket.number ?? ticket.numero) === currentNumber
                    );

                    return {
                        id: currentNumber,
                        numero: currentNumber,
                        vendido: isSold ? 1 : 0
                    };
                });

                setNumbers(generatedGrid);
            } catch (error) {
                console.error("Error building dashboard structural views:", error);
                alert("Erro ao carregar os detalhes da rifa");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchData();
        }
    }, [id]);

    function handleNumberClick(number) {
        setSelectedNumber(number);
        setModalOpen(true);
    }

    async function handleConfirmPurchase(data) {
        try {
            // FIXED: Payload translated cleanly to English models required by Prisma backend properties
            await RaffleService.purchaseNumber(id, data.number, {
                name: data.name,
                phone: data.phone
            });

            alert(`Compra realizada com sucesso!\nNúmero: ${data.number}`);
            setModalOpen(false);

            // Instant mutations state trigger to repaint local item component UI
            setNumbers(prev =>
                prev.map(n =>
                    n.numero === data.number ? { ...n, vendido: 1 } : n
                )
            );
        } catch (err) {
            alert(err.message || "Erro ao registrar compra. Tente novamente.");
        }
    }

    if (loading) return <p style={styles.stateText}>Carregando...</p>;
    if (!raffle) return <p style={styles.stateText}>Rifa não encontrada</p>;

    const imageUrl = raffle.imageUrl || getRaffleImageUrl(raffle);
    const raffleTitle = raffle.nome || raffle.name || raffle.title;

    return (
        <div style={styles.container}>
            <h1>{raffleTitle}</h1>
            <RaffleImage
                src={imageUrl}
                alt={raffleTitle}
                style={styles.raffleImage}
            />
            <p>{raffle.descricao || raffle.description}</p>
            <p>Instituição responsável: {raffle.instituicao || raffle.institution}</p>
            <p>Categoria: {raffle.categoria || raffle.category}</p>
            <p>Valor por número: R$ {(raffle.valor_numero || raffle.ticketPrice || 0).toFixed(2)}</p>

            <div style={styles.grid}>
                {numbers.map((num) => (
                    <NumberCard
                        key={num.id}
                        number={num.numero}
                        sold={num.vendido === 1}
                        onClick={handleNumberClick}
                    />
                ))}
            </div>

            <PurchaseModal
                open={modalOpen}
                number={selectedNumber}
                price={raffle.valor_numero || raffle.ticketPrice}
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmPurchase}
                user={user} // Directly pass global context profile variables downwards safely
            />
        </div>
    );
}

const styles = {
    container: {
        padding: "40px 20px",
        textAlign: "center"
    },
    stateText: {
        textAlign: "center",
        padding: "40px",
        fontSize: "1.1rem",
        color: "#64748b"
    },
    raffleImage: {
        maxWidth: "100%",
        maxHeight: "320px",
        borderRadius: "12px",
        objectFit: "cover",
        margin: "16px auto",
        display: "block",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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