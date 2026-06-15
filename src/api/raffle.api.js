import httpClient from "./httpClient";

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
      return response.data;
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
      return response.data;
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
      return response.data;
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