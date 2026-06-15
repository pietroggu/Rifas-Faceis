import httpClient from "./httpClient";

/**
 * Authentication API Data Layer.
 * Direct communication bridge with backend endpoints. No business logic permitted here.
 */
export const authApi = {
  /**
   * Post user credentials to retrieve a JWT and session data.
   * @param {Object} credentials - Contains { email, password }
   * @returns {Promise<Object>} Backend JSON object response
   */
  login: async (credentials) => {
    try {
      const response = await httpClient.post("/auth/login", credentials);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Invalid authentication credentials");
    }
  },

  /**
   * Fetch full metadata for the currently authenticated session profile.
   * @returns {Promise<Object>} Logged-in user profile entity
   */
  getProfile: async () => {
    try {
      const response = await httpClient.get("/auth/me");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to retrieve session profile");
    }
  },
};