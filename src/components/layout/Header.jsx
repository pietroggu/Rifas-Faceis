import { Menu } from "lucide-react";

function Header({ onMenuClick }) {
  return (
    <header style={styles.header}>
      <button
        onClick={onMenuClick}
        style={styles.menuButton}
      >
        <Menu size={22} />
      </button>

    </header>
  );
}

const styles = {
  header: {
    height: "60px",
    background: "#2563EB",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "0 16px",
    color: "#fff",

    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  menuButton: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
};

export default Header;