import httpClient from "./httpClient";

/**
 * API layer for user account management.
 * Handles raw HTTP communication only.
 */
export const userApi = {
  /**
   * Register a new user account.
   * @param {Object} userData - { name, phone, email, password }
   * @returns {Promise<Object>} Created user record
   */
  register: async (userData) => {
    try {
      const response = await httpClient.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Registration failed");
    }
  },
};