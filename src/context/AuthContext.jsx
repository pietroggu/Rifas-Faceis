import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/authService";

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
      const hasToken = AuthService.isAuthenticated();
      const localUser = AuthService.getCurrentUser();

      if (!hasToken) {
        setLoading(false);
        return;
      }

      // Restore session immediately from cache so refresh does not flash "logged out"
      if (localUser) {
        setUser(localUser);
        setIsAuthenticated(true);
      }

      try {
        const freshProfile = await AuthService.syncProfile();
        setUser(freshProfile);
        setIsAuthenticated(true);
      } catch (error) {
        if (AuthService.isAuthError(error)) {
          console.error("Session expired or invalid, clearing local session:", error);
          AuthService.logout();
          setUser(null);
          setIsAuthenticated(false);
        } else if (localUser) {
          // Network/cold-start errors: keep cached session instead of logging out
          console.warn("Profile sync failed, keeping cached session:", error.message);
        } else {
          console.error("Could not restore session without cached user:", error);
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
   * Action trigger to process user credentials and transition interface states.
   * @param {string} email
   * @param {string} password
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
   * Universal command to wipe session data and redirect rendering trees.
   */
  const logoutUser = () => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Synchronizes newly updated user data with the global application state and cache.
   * @param {Object} updatedUser - The revised user dataset returned by the API
   */
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, loginUser, logoutUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook utility to interact safely with the global context instance.
 * @returns {Object} Context reactive parameters and actions
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be consumed cleanly inside an AuthProvider scope");
  }
  return context;
}