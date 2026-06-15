import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo_branca.png";
import "./Sidebar.css";
import { Home, Ticket, HelpCircle, Lock, User, LogOut } from "lucide-react";

/**
 * Navigation Sidebar component for application layout navigation controls.
 * Handles responsive mobile drawer states and global logout triggers.
 */
function Sidebar() {
  const [open, setOpen] = useState(false);
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  /**
   * Destroys active user session state and redirects view back to landing gate.
   */
  const handleLogout = () => {
    setOpen(false);
    logoutUser();
    navigate("/");
  };

  /**
   * Helper utility to cleanly format dynamic dynamic NavLink classes.
   */
  const getNavLinkClass = ({ isActive }) => 
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <>
      {/* Mobile Menu Toggle Trigger */}
      {!open && (
        <button onClick={() => setOpen(true)} className="menuBtn" aria-label="Open navigation menu">
          ☰
        </button>
      )}

      {/* Background Dimmer Dismissal Overlay */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* Structural Sidebar Drawer Container */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <img src={logo} alt="Application Logo" className="logo" />

        {/* Primary Navigation Routing Scopes */}
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

          <NavLink to="/adminDashboard" onClick={() => setOpen(false)} className={getNavLinkClass}>
            <Lock size={18} /> Acesso privado
          </NavLink>
        </nav>

        {/* User Specific Sub-Navigation Profile Anchor */}
        <NavLink to="/profile" onClick={() => setOpen(false)} className="sidebar-link bottom">
          <User size={18} /> Meus dados
        </NavLink>

        {/* Action Button to cleanly terminate active authentication mappings */}
        <button onClick={handleLogout} className="sidebar-link logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </aside>
    </>
  );
}

export default Sidebar;