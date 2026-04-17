import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo_branca.png";
import "./Sidebar.css";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BOTÃO */}
      {!open && (
        <button onClick={() => setOpen(true)} className="menuBtn">
          ☰
        </button>
      )}

      {/* OVERLAY */}
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <img src={logo} alt="Logo" className="logo" />

        <nav className="nav">
          <NavLink to="/home" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            Home
          </NavLink>

          <NavLink to="/suasrifas" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            Minhas rifas
          </NavLink>

          <NavLink to="/ajudas" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            Ajuda
          </NavLink>

          <NavLink to="/boss" className={({ isActive }) => "sidebar-link" + (isActive ? " active" : "")}>
            Acesso privado
          </NavLink>
        </nav>

        <NavLink to="/dados" className="sidebar-link bottom">
          Meus dados
        </NavLink>

        <NavLink to="/" className="sidebar-link">
          Logout
        </NavLink>
      </aside>
    </>
  );
}

export default Sidebar;