import React from "react";

/**
 * Rodapé simples
 */
function Footer() {
  return (
    <footer style={styles.footer}>
      <p>© 2026 Rifa App</p>
    </footer>
  );
}

const styles = {
  footer: {
    height: "50px",
    background: "#fff",
    borderTop: "1px solid #ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Footer;