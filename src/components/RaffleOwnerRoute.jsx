import { useEffect, useState } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RaffleService from "../services/raffleService";

export default function RaffleOwnerRoute() {
  const { id } = useParams();
  const { user } = useAuth();

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
        console.error(error);
        setAllowed(false);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [id, user]);

  if (loading) {
    return <p>Carregando...</p>;
  }

  return allowed ? <Outlet /> : <Navigate to="/home" replace />;
}