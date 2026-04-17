import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo_branca.png";
import "./Sidebar.css";
import { Home, Ticket, HelpCircle, Lock, User, LogOut } from "lucide-react";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BOTÃO */}
      {!open && (
        <button onClick={() => setOpen(true)} className="menuBtn">
          {open ? "✕" : "☰"}
        </button>
      )}

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <img src={logo} alt="Logo" className="logo" />

        <nav className="nav">
          <NavLink to="/home" onClick={() => setOpen(false)} className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            <Home size={18} /> Home
          </NavLink>

          <NavLink to="/suasrifas" onClick={() => setOpen(false)} className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            <Ticket size={18} /> Minhas rifas
          </NavLink>

          <NavLink to="/ajudas" onClick={() => setOpen(false)} className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            <HelpCircle size={18} /> Ajuda
          </NavLink>

          <NavLink to="/boss" onClick={() => setOpen(false)} className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            <Lock size={18} /> Acesso privado
          </NavLink>
        </nav>

        <NavLink to="/dados" onClick={() => setOpen(false)} className="sidebar-link bottom">
          <User size={18} /> Meus dados
        </NavLink>

        <NavLink to="/" onClick={() => setOpen(false)} className="sidebar-link">
          <LogOut size={18} /> Logout
        </NavLink>
      </aside>
    </>
  );
}

export default Sidebar;