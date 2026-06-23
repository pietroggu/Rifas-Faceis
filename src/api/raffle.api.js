import httpClient from "./httpClient";

/**
 * API layer for raffle operations.
 * Handles raw HTTP communication only.
 * Updated to match new RESTful endpoints.
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
   * Update an existing raffle.
   * @param {string|number} raffleId
   * @param {Object} raffleData
   * @returns {Promise<Object>} Updated raffle instance
   */
  update: async (raffleId, raffleData) => {
    try {
      const response = await httpClient.put(`/raffles/${raffleId}`, raffleData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update raffle");
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
  draw: async (id) => {
    const response = await httpClient.post(
      `/raffles/${id}/draw`
    );

    return response.data;
  },
};