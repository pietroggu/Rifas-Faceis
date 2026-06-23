import httpClient from "./httpClient";

/**
 * API layer for ticket operations.
 * Handles raw HTTP communication only.
 * Updated to match new RESTful endpoints structure.
 */
export const ticketApi = {
  /**
   * Purchase a specific ticket number.
   * @param {Object} purchaseData - { raffleId, number, userId, name?, phone? }
   * @returns {Promise<Object>} Purchase confirmation payload
   */
  purchase: async (purchaseData) => {
    try {
      const response = await httpClient.post("/tickets/purchase", purchaseData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Transaction failed");
    }
  },

  /**
   * Cancel a ticket (Soft delete).
   * @param {string|number} ticketId
   * @returns {Promise<Object>} Updated ticket
   */
  cancel: async (ticketId) => {
    try {
      const response = await httpClient.patch(`/tickets/${ticketId}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to cancel ticket");
    }
  },

  /**
   * Fetch all tickets (Administrative use).
   * @returns {Promise<Array>} Collection of all tickets
   */
  getAll: async () => {
    try {
      const response = await httpClient.get("/tickets");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch tickets");
    }
  },

  /**
   * Fetch a specific ticket by ID.
   * @param {string|number} ticketId
   * @returns {Promise<Object>} Ticket data
   */
  getById: async (ticketId) => {
    try {
      const response = await httpClient.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch ticket");
    }
  },

  /**
   * Update an existing ticket.
   * @param {string|number} ticketId
   * @param {Object} ticketData
   * @returns {Promise<Object>} Updated ticket
   */
  update: async (ticketId, ticketData) => {
    try {
      const response = await httpClient.put(`/tickets/${ticketId}`, ticketData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update ticket");
    }
  },

  /**
   * Delete a ticket.
   * @param {string|number} ticketId
   * @returns {Promise<Object>} Deletion confirmation
   */
  delete: async (ticketId) => {
    try {
      const response = await httpClient.delete(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to delete ticket");
    }
  }
};