import { authApi } from "../api/auth.api";
import { withRetry } from "../api/retry";

/**
 * Service Layer managing authentication state, persistence, and profile sync.
 */
class AuthService {
  /**
   * Normalizes auth payloads from different backend response shapes.
   * @param {Object} data
   * @returns {{ token: string|null, user: Object|null }}
   */
  static normalizeAuthPayload(data) {
    if (!data || typeof data !== "object") {
      return { token: null, user: null };
    }

    const token = data.token || data.accessToken || data.access_token || null;
    const user = data.user || data.data?.user || null;

    return { token, user };
  }

  /**
   * Normalizes profile payloads from /auth/me.
   * @param {Object} data
   * @returns {Object|null}
   */
  static normalizeUserPayload(data) {
    if (!data || typeof data !== "object") return null;
    if (data.user && typeof data.user === "object") return data.user;
    if (data.email || data.id) return data;
    return null;
  }

  /**
   * Returns true when the server explicitly rejected the session.
   * @param {Error} error
   * @returns {boolean}
   */
  static isAuthError(error) {
    const status = error?.response?.status;
    return status === 401 || status === 403;
  }

  /**
   * Authenticate user credentials and persist session tokens locally.
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object>} Session payload containing token and user metadata
   */
  static async login(email, password) {
    const data = await authApi.login({ email, password });
    const { token, user } = this.normalizeAuthPayload(data);

    if (!token) {
      throw new Error("Authentication failed: no token received");
    }

    if (user) {
      this.saveAuth({ token, user });
      return { token, user };
    }

    localStorage.setItem("token", token);
    const profile = await this.syncProfile();
    return { token, user: profile };
  }

  /**
   * Persist session state securely into localStorage mirrors.
   * @param {Object} authData - Contains { token, user }
   */
  static saveAuth(authData) {
    localStorage.setItem("token", authData.token);
    if (authData.user) {
      localStorage.setItem("user", JSON.stringify(authData.user));
    }
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
    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  }

  /**
   * Fetch a fresh profile state from the server and synchronize local storage.
   * @returns {Promise<Object>} Updated user profile entity
   */
  static async syncProfile() {
    const response = await withRetry(() => authApi.getProfile());
    const freshProfile = this.normalizeUserPayload(response);

    if (!freshProfile) {
      throw new Error("Invalid profile response");
    }

    localStorage.setItem("user", JSON.stringify(freshProfile));
    return freshProfile;
  }
}

export default AuthService;