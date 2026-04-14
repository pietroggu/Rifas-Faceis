import React from "react";

/**
 * Header superior
 */
function Header() {
  return (
    <header style={styles.header}>
      <h3>Home</h3>

    </header>
  );
}

const styles = {
  header: {
    height: "60px",
    background: "#2563EB",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    color: "#ffffff"
  },
  user: {
    fontSize: "14px",
  },
};

export default Header;