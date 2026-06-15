import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Substituted raw API module with dynamic context hook

/**
 * Profile component manages dynamic identity rendering and local state editing mutations.
 */
function Profile() {
  // Extract global session tracking values directly from the centralized authentication engine
  const { user: contextUser, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    photo: "",
  });

  /**
   * Effect listener synchronization to hydrate UI inputs as soon as global auth state populates.
   */
  useEffect(() => {
    if (contextUser) {
      setUser({
        name: contextUser.name || "",
        email: contextUser.email || "",
        phone: contextUser.phone || "",
        address: contextUser.address || "",
        password: "", // Enforce sandboxing security for passwords on state mapping
        photo: contextUser.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser.name || "User")}`,
      });
    }
  }, [contextUser]);

  /**
   * Maps field mutations seamlessly to local component state arrays.
   */
  function handleInputChange(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  /**
   * Validates state data consistency rules before dispatching record integration payloads upstream.
   */
  function handleSaveChanges() {
    if (!user.name || !user.email || !user.phone) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setIsEditing(false);
    /* Future database syncing extensions hook:
      await userApi.updateProfile(user);
    */
    console.log("Updated identity profile payload ready for update sync:", user);
  }

  if (loading) return <div style={styles.container}><h3>Carregando dados do usuário...</h3></div>;
  if (!contextUser) return <div style={styles.container}><h3 style={{color: "red"}}>Acesso negado. Por favor, faça login.</h3></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Meus Dados</h1>

      <div style={styles.cardForm}>
        <h2 style={styles.sectionTitle}>Informações Pessoais</h2>

        <img src={user.photo} alt="User Avatar Display" style={styles.avatarImage} />

        <div style={styles.inputsGroup}>
          <label style={styles.label}>Nome Completo</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <label style={styles.label}>E-mail da Conta</label>
          <input
            style={styles.input}
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            disabled={true} // Enforces data safety locking emails keys indexes
          />

          <label style={styles.label}>Telefone de Contato</label>
          <input
            style={styles.input}
            type="tel"
            name="phone"
            value={user.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <label style={styles.label}>Endereço Residencial</label>
          <input
            style={styles.input}
            type="text"
            name="address"
            value={user.address || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
          />

          <label style={styles.label}>Senha de Acesso</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="********"
            value={user.password}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </div>

        {isEditing ? (
          <button style={styles.saveButton} onClick={handleSaveChanges}>
            Salvar Dados
          </button>
        ) : (
          <button style={styles.editButton} onClick={() => setIsEditing(true)}>
            Editar Dados
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    textAlign: "center",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  mainTitle: {
    color: "#0f172a",
    marginBottom: "30px",
  },
  cardForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    maxWidth: "500px",
    marginInline: "auto",
    padding: "32px 24px",
    background: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: "1.25rem",
    color: "#334155",
    margin: "0 0 20px 0",
  },
  avatarImage: {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "24px",
    border: "3px solid #2563EB",
  },
  inputsGroup: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    gap: "6px",
    marginBottom: "24px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "600",
    color: "#64748b",
    marginTop: "6px",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#f8fafc",
    outline: "none",
    color: "#334155",
  },
  editButton: {
    width: "100%",
    padding: "14px",
    background: "#2563EB",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  saveButton: {
    width: "100%",
    padding: "14px",
    background: "#10B981",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default Profile;