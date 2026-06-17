import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Importação única correta
import logo from "../../assets/logo_branca.png";
import "./Sidebar.css";
import { Home, Ticket, HelpCircle, Lock, User, LogOut } from "lucide-react";

/**
 * Navigation Sidebar component for application layout navigation controls.
 */
function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user, logoutUser } = useAuth(); // <--- EXTRAÇÃO DO USER ADICIONADA AQUI
  const navigate = useNavigate();
  
  const handleLogout = () => {
    setOpen(false);
    logoutUser();
    navigate("/");
  };

  const getNavLinkClass = ({ isActive }) => 
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} className="menuBtn" aria-label="Open navigation menu">
          ☰
        </button>
      )}

      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <img src={logo} alt="Application Logo" className="logo" />

        <nav className="nav">
          <NavLink to="/home" onClick={() => setOpen(false)} className={getNavLinkClass}>
            <Home size={18} /> Home
          </NavLink>

          <NavLink to="/myRaffles" onClick={() => setOpen(false)} className={getNavLinkClass}>
            <Ticket size={18} /> Minhas rifas
          </NavLink>

          <NavLink to="/faq" onClick={() => setOpen(false)} className={getNavLinkClass}>
            <HelpCircle size={18} /> Ajuda
          </NavLink>
          
          <NavLink to="/cart" onClick={() => setOpen(false)} className={getNavLinkClass}>
            🛒 Carrinho
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