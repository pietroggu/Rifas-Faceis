import httpClient from "./httpClient";

/**
 * User Resource API Module
 * Manages database records, user registrations, and account administration.
 */
export const userApi = {
  /**
   * Provision and persist a new user account into the database.
   * @param {Object} userData - { name, phone, email, password }
   */
  register: async (userData) => {
    try {
      const response = await httpClient.post("/users/register", userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to register user account");
    }
  },

  /* Future CRUD extensions belong here:
    updateProfile: async (id, payload) => ...
    deleteAccount: async (id) => ...
  */
};