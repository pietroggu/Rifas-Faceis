import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

/**
 * Layout principal da aplicação
 * Estrutura padrão com sidebar + header + conteúdo
 */
function Layout() {
  return (
    <div style={styles.container}>
      <Sidebar />

      <div style={styles.main}>
        <Header />

        <div style={styles.content}>
          {/* Aqui entram as páginas */}
          <Outlet />
        </div>

        <Footer />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    backgroundColor: "#f5f6fa",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
  },
};

export default Layout;