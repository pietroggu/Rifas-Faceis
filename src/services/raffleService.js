/**
 * Serviço responsável por simular chamadas de API de rifas
 */
const raffleService = {
    /**
     * Simula buscar dados de uma rifa pelo ID
     * @param {string} id
     * @returns {Promise<Object>}
     */
    async getRaffleById(id) {
        // Simula delay de API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock de dados
        return {
            id,
            title: "Rifa iPhone 15",
            price: 10,
            totalNumbers: 100,
            soldNumbers: [2, 5, 10, 25, 30, 45, 60]
        };
    }
};

export default raffleService;