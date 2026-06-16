import httpClient from "./httpClient";

function toApiError(error, fallbackMessage) {
  const wrapped = new Error(
    error.response?.data?.error || error.response?.data?.message || fallbackMessage
  );
  wrapped.response = error.response;
  return wrapped;
}

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
      throw toApiError(error, "Authentication failed");
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
      throw toApiError(error, "Failed to fetch profile");
    }
  },
};