import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/authService";
import { authApi } from "../api/auth.api";

// Create context container for application shell allocation
const AuthContext = createContext(undefined);

/**
 * AuthProvider component wrapper.
 * Manages reactive global user session memory mapping and auto-hydration hooks.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Automatic session handshake to sync memory with server on application mount.
     */
    async function initializeAuth() {
      const token = localStorage.getItem("token");
      const localUser = AuthService.getCurrentUser();

      if (token && localUser) {
        // Hydrate UI state fast with cached data for premium visual UX
        setUser(localUser);
        setIsAuthenticated(true);

        try {
          // Silent background request to sync state with fresh database data
          const freshProfile = await authApi.getProfile();
          setUser(freshProfile);
          localStorage.setItem("user", JSON.stringify(freshProfile));
        } catch (error) {
          console.error("Session token verification failed, forcing logout:", error);
          AuthService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    }

    initializeAuth();
  }, []);

  /**
   * Trigger login workflow changes down the component tree.
   */
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const data = await AuthService.login(email, password);
      setUser(data.user);
      setIsAuthenticated(true);
      return data;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Trigger clean logout session destruction actions.
   */
  const logoutUser = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook utility to interact with the managed global authentication state.
 * @returns {Object} { user, isAuthenticated, loading, loginUser, logoutUser }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be consumed cleanly inside an AuthProvider scope");
  }
  return context;
}