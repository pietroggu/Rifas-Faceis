import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NumberCard from "../components/NumberCard";
import PurchaseModal from "../components/PurchaseModal";

function Raffle() {
    const { id } = useParams();

    const [raffle, setRaffle] = useState(null);
    const [numeros, setNumeros] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedNumber, setSelectedNumber] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                // Busca os dados reais da rifa no backend
                const raffleRes = await fetch(`http://localhost:3000/rifas/${id}`);
                const raffleData = await raffleRes.json();
                setRaffle(raffleData);

                // Busca os números da rifa
                const numerosRes = await fetch(`http://localhost:3000/rifas/${id}/numeros`);
                const numerosData = await numerosRes.json();
                setNumeros(numerosData);

            } catch (error) {
                console.error("Erro ao carregar rifa:", error);
                alert("Erro ao carregar rifa");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    function handleNumberClick(number) {
        setSelectedNumber(number);
        setModalOpen(true);
    }

    async function handleConfirmPurchase(data) {
        try {
            const response = await fetch(
                `http://localhost:3000/rifas/${id}/numeros/${data.number}/comprar`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nome: data.name, telefone: data.phone })
                }
            );

            const result = await response.json();

            if (!response.ok) {
                alert(result.erro);
                return;
            }

            alert(`Compra realizada!\nNúmero: ${data.number}\nNome: ${data.name}`);
            setModalOpen(false);

            // Atualiza o número na lista local para aparecer como vendido imediatamente
            setNumeros(prev =>
                prev.map(n =>
                    n.numero === data.number ? { ...n, vendido: 1 } : n
                )
            );

        } catch (err) {
            alert("Erro ao registrar compra. Tente novamente.");
        }
    }

    if (loading) return <p>Carregando...</p>;

    if (!raffle) return <p>Rifa não encontrada</p>;

    return (
        <div style={styles.container}>
            <h1>{raffle.nome}</h1>

            <p>{raffle.descricao}</p>
            
            <p>Instituição responsável: {raffle.instituicao}</p>
            <p>Categoria: {raffle.categoria}</p>
            <p>Valor por número: R$ {raffle.valor_numero}</p>

            <div style={styles.grid}>
                {numeros.map((num) => (
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
                price={raffle.valor_numero}
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
