 import httpClient from "./httpClient";

/**
 * Raffle API module
 * Handles all requests related to raffles and ticket slots
 */
export const raffleApi = {
  /**
   * Get all raffles
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
   * Get raffle by ID
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
   * Get all available numbers for a specific raffle
   */
  getNumbers: async (raffleId) => {
    try {
      const response = await httpClient.get(`/raffles/${raffleId}/numeros`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch raffle numbers");
    }
  },

  /**
   * Purchase a specific raffle number
   */
  buyNumber: async (raffleId, number, buyerData) => {
    try {
      const response = await httpClient.post(`/raffles/${raffleId}/numeros/${number}/comprar`, buyerData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to register purchase");
    }
  },

  /**
   * Create a new raffle
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
   * Delete a raffle
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