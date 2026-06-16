import httpClient from "./httpClient";

/**
 * API layer for user account management.
 * Handles raw HTTP communication only.
 * Updated to match new RESTful endpoints.
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
   * Get current authenticated user profile.
   * @returns {Promise<Object>} User profile data
   */
  getProfile: async () => {
    try {
      const response = await httpClient.get("/users/me");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch profile");
    }
  },

  /**
   * Get current user's purchased tickets.
   * @returns {Promise<Array>} Collection of user tickets
   */
  getMyTickets: async () => {
    try {
      const response = await httpClient.get("/users/me/tickets");
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch user tickets");
    }
  },

  /**
   * Update user profile by ID.
   * @param {string} userId - User ID
   * @param {Object} userData - Data fields to update
   * @returns {Promise<Object>} Updated user record
   */
  updateProfile: async (userId, userData) => {
    try {
      const response = await httpClient.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to update profile");
    }
  },

  /**
   * Get user by ID (Administrative use).
   * @param {string} userId
   * @returns {Promise<Object>} User data
   */
  getById: async (userId) => {
    try {
      const response = await httpClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch user");
    }
  },

  /**
   * Delete user by ID (Administrative use).
   * @param {string} userId
   * @returns {Promise<Object>} Deletion confirmation
   */
  delete: async (userId) => {
    try {
      const response = await httpClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to delete user");
    }
  }
};