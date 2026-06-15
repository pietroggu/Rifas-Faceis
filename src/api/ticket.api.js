import httpClient from "./httpClient";

/**
 * API layer for purchased tickets operations.
 * Handles raw HTTP communication only.
 */
export const ticketApi = {
  /**
   * Fetch all purchased tickets for the currently logged-in account user.
   * @returns {Promise<Array>} Raw collection of user ticket objects
   */
  getUserTickets: async () => {
    try {
      const response = await httpClient.get("/tickets/my-purchases");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch user tickets");
    }
  },
};