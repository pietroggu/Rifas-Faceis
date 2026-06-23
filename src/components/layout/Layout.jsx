import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Header from "./Header";
import "./Layout.css";

/**
 * Layout principal da aplicação
 * Estrutura padrão com sidebar + header + conteúdo
 */
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={styles.container}>
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="main-layout">

        <div className="mobile-header">
          <Header
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>

        <div style={styles.content}>
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
    minHeight: "100vh",
    backgroundColor: "#f5f6fa",
  },
  content: {
    flex: 1,
    padding: "16px",
    maxWidth: "1400px",
    width: "100%",
    margin: "0 auto",
  }
};

export default Layout;