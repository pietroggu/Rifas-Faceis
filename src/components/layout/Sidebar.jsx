import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo_branca.png";

function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* BOTÃO MOBILE */}
      <button onClick={() => setOpen(!open)} style={styles.menuBtn}>
        ☰
      </button>

      {/* SIDEBAR */}
      <aside
        style={{
          ...styles.sidebar,
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <img src={logo} alt="Logo" style={styles.logo} />

        <nav style={styles.nav}>
          <Link style={styles.link} to="/home">🏠 Home</Link>
          <Link style={styles.link} to="/suasrifas">🎟 Minhas rifas</Link>
          <Link style={styles.link} to="/ajudas">🆘 Ajuda</Link>
          <Link style={styles.link} to = "/boss">🔒 Acesso privado</Link>
        </nav>
        
        <Link style={styles.link1} to="/dados">🎲 Meus dados</Link>
        <Link style={styles.link} to="">📤Logout</Link>
      </aside>
    </>
  );
}

const styles = {
  menuBtn: {
    position: "fixed",
    top: "10px",
    left: "10px",
    zIndex: 1000,
    fontSize: "24px",
    background: "#3B82F6",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "240px",
    background: "#3B82F6",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    transition: "0.3s",
    zIndex: 999
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "19px",
  },

  link1: {
    color: "#fff",
    marginBottom: "3px",
    textDecoration: "none",
    fontSize: "19px",
    marginTop: "50px"
  },

  logo: {
    width: "100%",
    maxWidth: "180px",
    margin: "0 auto 25px",
  },
};

export default Sidebar;