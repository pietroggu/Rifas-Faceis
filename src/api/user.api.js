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

  /**
   * Update user profile by their unique identification.
   * Maps directly to the backend route: PUT /api/users/:id
   * @param {string} userId - The unique database ID of the authenticated user
   * @param {Object} userData - Data fields to update (name, phone, address, optional password)
   * @returns {Promise<Object>} Updated user record returned by the server
   */
  updateProfile: async (userId, userData) => {
    try {
      // Dynamic injection of the user ID to match 'router.put("/:id")' on the backend
      const response = await httpClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to update profile information");
    }
  },
};