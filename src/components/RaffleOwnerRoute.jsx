import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RaffleService from "../services/raffleService";
import Sidebar from "../components/layout/Sidebar"; // Importe seu Sidebar

export default function RaffleOwnerRoute() {
  const { id } = useParams();
  const { user } = useAuth();
  
  // Estado para controlar a abertura da Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      try {
        const raffle = await RaffleService.getRaffleById(id);
        const privilegedUsers = [3, 7];
        const canAccess =
          privilegedUsers.includes(Number(user?.id)) ||
          Number(raffle.authorId) === Number(user?.id);
        setAllowed(canAccess);
      } catch (error) {
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    }
    checkAccess();
  }, [id, user]);

  return (
    <div className="layout-wrapper" style={{ display: "flex" }}>
      {/* Sidebar sempre presente */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <main style={{ flex: 1 }}>
        {/* Barra de carregamento no topo se estiver processando */}
        {loading && <div style={styles.loadingBar}></div>}

        {/* Lógica de permissão */}
        {!loading && !allowed ? (
          <Navigate to="/home" replace />
        ) : (
          /* O Outlet renderiza a página de edição/gestão da rifa */
          <Outlet />
        )}
      </main>
    </div>
  );
}

const styles = {
  loadingBar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "4px",
    backgroundColor: "#3b82f6",
    zIndex: 9999,
  }
};