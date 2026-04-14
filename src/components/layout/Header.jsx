import React from "react";

/**
 * Header superior
 */
function Header() {
  return (
    <header style={styles.header}>
      <h3>Dashboard</h3>

      <div>
        <span style={styles.user}>👤 Usuário</span>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: "60px",
    background: "#fff",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  user: {
    fontSize: "14px",
  },
};

export default Header;