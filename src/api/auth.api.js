import httpClient from "./httpClient";

/**
 * API layer for authentication endpoints.
 * Handles raw HTTP communication only.
 */
export const authApi = {
  /**
   * Post credentials to exchange for a session token.
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} Response data containing token and user
   */
  login: async (credentials) => {
    try {
      const response = await httpClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Authentication failed");
    }
  },

  /**
   * Fetch current session profile metadata.
   * @returns {Promise<Object>} Logged-in user profile
   */
  getProfile: async () => {
    try {
      const response = await httpClient.get("/auth/me");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch profile");
    }
  },
};