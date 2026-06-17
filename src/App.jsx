import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from './context/CartContext';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import RaffleDetails from "./pages/RaffleDetails";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import MyRaffles from "./pages/MyRaffles";
import Cart from "./pages/Cart"; 

/**
 * Main application entry point orchestrating structural routing layout strategies.
 */
function App() {
  return (
    <BrowserRouter>
      {/* Wrapped entire routes layout context framework to inject real-time state listeners */}
      <AuthProvider>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          

          {/* Rotas protegidas — qualquer usuário logado */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/rifa/:id" element={<RaffleDetails />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/myRaffles" element={<MyRaffles />} />
              <Route path="/cart" element={<Cart />} />
            </Route>
          </Route>

          {/* Rotas exclusivas de admin — exige role === 1 */}
          <Route element={<AdminRoute />}>
            <Route element={<Layout />}>
              <Route path="/adminDashboard" element={<AdminDashboard/>} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;