import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importação única correta
import logo from "../../assets/logo_branca.png";
import "./Sidebar.css";
import { useCart } from "../../context/CartContext";
import { Home, Ticket, HelpCircle, Lock, User, LogOut, ShoppingCart } from "lucide-react";

/**
 * Navigation Sidebar component for application layout navigation controls.
 */
function Sidebar({ open, setOpen }) {
  const { user, logoutUser } = useAuth();
  const { cartItems, clearCart } = useCart();

  const navigate = useNavigate();

  const handleLogout = () => {
    clearCart();
    setOpen(false);
    logoutUser();
    navigate("/");
  };

  const getNavLinkClass = ({ isActive }) => 
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <>

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <img src={logo} alt="Application Logo" className="logo" />

        <div className="user-info">
          <strong>{user?.name || "Visitante"}</strong>
          <span>
            {user?.role === 1 ? "Administrador" : "Usuário"}
          </span>
        </div>

        <nav className="nav">
          <NavLink to="/home" onClick={() => setOpen(false)} className={getNavLinkClass}>
            <Home size={18} /> Home
          </NavLink>

          <NavLink to="/myRaffles" onClick={() => setOpen(false)} className={getNavLinkClass}>
            <Ticket size={18} /> Minhas rifas
          </NavLink>

          <NavLink
            to="/cart"
            onClick={() => setOpen(false)}
            className={getNavLinkClass}
          >
            <ShoppingCart size={18} />
            Carrinho

            {cartItems.length > 0 && (
              <span className="cart-badge">
                {cartItems.length}
              </span>
            )}
          </NavLink>

          <NavLink to="/faq" onClick={() => setOpen(false)} className={getNavLinkClass}>
            <HelpCircle size={18} /> Ajuda
          </NavLink>
          
          

          {/* Renderização condicional agora funciona pois o 'user' está definido */}
          {user && user.role === 1 && (
            <NavLink 
              to="/adminDashboard" 
              onClick={() => setOpen(false)} 
              className={getNavLinkClass}
            >
              <Lock size={18} /> Acesso privado
            </NavLink>
          )}
        </nav>

        <NavLink to="/profile" onClick={() => setOpen(false)} className="sidebar-link bottom">
          <User size={18} /> Meus dados
        </NavLink>

        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;