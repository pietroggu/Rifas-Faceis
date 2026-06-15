import { authApi } from "../api/auth.api";

/**
 * Authentication Service Layer.
 * Orchestrates local persistence storage rules and handles clean data formatting workflows.
 */
class AuthService {
  /**
   * Process operational user login state and orchestrate storage triggers.
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<Object>} Authenticated user object and token payload
   */
  static async login(email, password) {
    // Standardized to call authApi directly instead of userApi to prevent architectural layout pollution
    const data = await authApi.login({ email, password });
    
    if (data?.token) {
      this.saveAuth(data);
    }
    
    return data;
  }

  /**
   * Write session variables securely to localStorage.
   * @param {Object} authData - Contains { token, user }
   */
  static saveAuth(authData) {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));
  }

  /**
   * Purge all local persistence session variables to trigger reactive logout.
   */
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Evaluate if a session token key is currently registered locally.
   * @returns {boolean} Authenticated baseline validation state
   */
  static isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  /**
   * Safely look up and parse local user profile snapshots.
   * @returns {Object|null} Cached user metadata object
   */
  static getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}

export default AuthService;