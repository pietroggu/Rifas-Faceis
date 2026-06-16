import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * AdminRoute — guarda de rota para páginas exclusivas de administradores.
 * Redireciona não autenticados para /.
 * Redireciona autenticados sem role=1 para /home com state accessDenied.
 *
 * @pre  AuthProvider deve envolver este componente na árvore de rotas.
 * @post Somente usuários com user.role === 1 chegam ao Outlet.
 */
function AdminRoute() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={styles.loading}>
        Verificando permissões...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!user || user.role !== 1) {
    return <Navigate to="/home" replace state={{ accessDenied: true }} />;
  }

  return <Outlet />;
}

const styles = {
  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    backgroundColor: "#f5f6fa",
  },
};

export default AdminRoute;