import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
/**
 * Sidebar de navegação
 */
function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <img src={logo} alt="Logo" style={styles.logo} ></img>

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
  logo: {
        width: "200px",
        height: "auto",
        objectFit: "contain",
        margin: "0px auto",
        marginBottom: "25px"
    },
};

export default Sidebar;