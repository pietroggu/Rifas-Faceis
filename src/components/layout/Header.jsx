import React from "react";

/**
 * Header superior
 */
function Header() {
  return (
    <header style={styles.header}>
     

  
    </header>
  );
}

const styles = {
  header: {
    height: "65px",
    background: "#2563EB",
    borderBottom: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    color: "#ffffff",

    position: "sticky", 
    top: 0,
    zIndex: 10,

    width: "100%",
    boxSizing: "border-box",
  },

  title: {
    margin: 0,
    fontSize: "18px",
  },

  user: {
    fontSize: "14px",
  },
};

export default Header;