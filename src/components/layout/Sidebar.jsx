import React from "react";
import { Link } from "react-router-dom";

/**
 * Sidebar de navegação
 */
function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <h2 style={styles.logo}>🎟 Rifa</h2>

      <nav style={styles.nav}>
        <Link style={styles.link} to="/home">🏠 Home</Link>
        <Link style={styles.link} to="/home">🎟 Minhas rifas</Link>
        <Link style={styles.link} to="/home">🆘 Ajuda</Link>

      </nav>
      
      <Link style={styles.link1}to="/home">🎲 Meus dados </Link>
      <Link style={styles.link} to="">🔐 Logout</Link>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    background: "#3B82F6",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  logo: {
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    color: "#fff"
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "19px",
  },
  link1: {
    color: "#fff",
    marginBottom:"3px",
    textDecoration: "none",
    fontSize: "19px",
    marginTop: "auto"
  },
};

export default Sidebar;