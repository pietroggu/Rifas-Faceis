import { authApi } from "../api/auth.api";

/**
 * Service Layer managing authentication state, persistence, and profile sync.
 */
class AuthService {
  /**
   * Authenticate user credentials and persist session tokens locally.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Session payload containing token and user metadata
   */
  static async login(email, password) {
    const data = await authApi.login({ email, password });
    if (data?.token) {
      this.saveAuth(data);
    }
    return data;
  }

  /**
   * Persist session state securely into localStorage mirrors.
   * @param {Object} authData - Contains { token, user }
   */
  static saveAuth(authData) {
    localStorage.setItem("token", authData.token);
    localStorage.setItem("user", JSON.stringify(authData.user));
  }

  /**
   * Clear cached session tokens and structures to trigger log out.
   */
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Validate if an active session token exists in local storage.
   * @returns {boolean}
   */
  static isAuthenticated() {
    return !!localStorage.getItem("token");
  }

  /**
   * Retrieve and parse cached local user profile metadata snapshots.
   * @returns {Object|null}
   */
  static getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }

  /**
   * Fetch a fresh profile state from the server and synchronize local storage.
   * @returns {Promise<Object>} Updated user profile entity
   */
  static async syncProfile() {
    const freshProfile = await authApi.getProfile();
    localStorage.setItem("user", JSON.stringify(freshProfile));
    return freshProfile;
  }
}

export default AuthService;