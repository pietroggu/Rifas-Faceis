import httpClient from "./httpClient";

function unwrapRaffleList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.raffles)) return data.raffles;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function unwrapRaffle(data) {
  if (!data || typeof data !== "object") return data;
  if (data.raffle && typeof data.raffle === "object") return data.raffle;
  if (data.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }
  return data;
}

/**
 * API layer for raffle and ticket slot operations.
 * Handles raw HTTP communication only.
 */
export const raffleApi = {
  /**
   * Fetch all raffles from the server.
   * @returns {Promise<Array>} Raw raffle array
   */
  getAllRaffles: async () => {
    try {
      const response = await httpClient.get("/raffles");
      return unwrapRaffleList(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch raffles");
    }
  },

  /**
   * Fetch a single raffle by ID.
   * @param {string|number} raffleId
   * @returns {Promise<Object>} Raw raffle data
   */
  getById: async (raffleId) => {
    try {
      const response = await httpClient.get(`/raffles/${raffleId}`);
      return unwrapRaffle(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch raffle");
    }
  },

  /**
   * Purchase a specific ticket number.
   * @param {string|number} raffleId
   * @param {number} number
   * @param {Object} buyerData - { name, phone }
   * @returns {Promise<Object>} Purchase confirmation payload
   */
  buyNumber: async (raffleId, number, buyerData) => {
    try {
      const response = await httpClient.post(`/raffles/${raffleId}/numeros/${number}/comprar`, buyerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Transaction failed");
    }
  },

  /**
   * Create a new raffle entry.
   * @param {Object} raffleData
   * @returns {Promise<Object>} Created raffle instance
   */
  create: async (raffleData) => {
    try {
      const response = await httpClient.post("/raffles", raffleData);
      return unwrapRaffle(response.data);
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to create raffle");
    }
  },

  /**
   * Permanently delete a raffle.
   * @param {string|number} raffleId
   * @returns {Promise<Object>} Deletion metrics response
   */
  delete: async (raffleId) => {
    try {
      const response = await httpClient.delete(`/raffles/${raffleId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete raffle");
    }
  },
};
