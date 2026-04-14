import React from "react";
import { useParams } from "react-router-dom";

/**
 * Página de detalhes da rifa
 */
function Raffle() {
    const { id } = useParams();

    // Simulação (depois vem do backend)
    const raffle = {
        id,
        title: "Rifa Exemplo",
        totalNumbers: 100,
        soldNumbers: [2, 5, 10, 25] // números já vendidos
    };

    /**
     * Gera todos os números disponíveis
     */
    function gerarNumeros() {
        const numeros = [];

        for (let i = 1; i <= raffle.totalNumbers; i++) {
            numeros.push(i);
        }

        return numeros;
    }

    const numeros = gerarNumeros();

    return (
        <div style={styles.container}>
            <h1>{raffle.title}</h1>

            <div style={styles.grid}>
                {numeros.map((num) => {
                    const vendido = raffle.soldNumbers.includes(num);

                    return (
                        <div
                            key={num}
                            style={{
                                ...styles.number,
                                background: vendido ? "#ccc" : "#4caf50",
                                cursor: vendido ? "not-allowed" : "pointer"
                            }}
                        >
                            {num}
                        </div>
                    );
                })}
            </div>
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
    },
    number: {
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px",
        color: "#fff",
        fontWeight: "bold"
    }
};

export default Raffle;