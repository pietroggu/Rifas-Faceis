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
        <Link style={styles.link} to="/">🏠 Home</Link>
        <Link style={styles.link} to="/rifas">🎯 Rifas</Link>
        <Link style={styles.link} to="/login">🔐 Login</Link>
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: "240px",
    background: "#111",
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
  },
  link: {
    color: "#ccc",
    textDecoration: "none",
    fontSize: "16px",
  },
};

export default Sidebar;