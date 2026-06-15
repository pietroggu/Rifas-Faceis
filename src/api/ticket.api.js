import httpClient from "./httpClient";

/**
 * Ticket API module
 * Handles operations related to raffle tickets
 */
export const ticketApi = {
  /**
   * Get tickets by raffle ID
   */
  getByRaffle: async (raffleId) => {
    try {
      const response = await httpClient.get(`/raffles/${raffleId}/tickets`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch tickets");
    }
  },

  /**
   * Purchase a ticket
   */
  purchase: async (raffleId, ticketData) => {
    try {
      const response = await httpClient.post(
        `/raffles/${raffleId}/tickets`,
        ticketData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to purchase ticket");
    }
  },

  /**
   * Get user tickets
   */
  getMyTickets: async () => {
    try {
      const response = await httpClient.get("/users/me/tickets");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch user tickets");
    }
  },
};