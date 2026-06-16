import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext"; 
import { userApi } from "../api/user.api";

/**
 * Utility helper to apply a live Brazilian phone mask layout: (XX) XXXXX-XXXX or (XX) XXXX-XXXX
 * @param {string} value - Raw input string
 * @returns {string} Formatted phone string
 */
const formatBrazilianPhone = (value) => {
  const digits = value.replace(/\D/g, ""); // Strip all non-numeric characters
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`; // Fits 11-digit mobile standard
};

/**
 * Profile component manages dynamic identity rendering and local state editing mutations.
 */
function Profile() {
  // Extract global session tracking states and synchronization mechanisms from context
  const { user: contextUser, loading, updateUser } = useAuth();
  
  // DOM reference to trigger the hidden native file input programmatically
  const fileInputRef = useRef(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Manages loading feedback and restricts actions while updating
  
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    photo: "",
  });

  /**
   * Effect listener synchronization to hydrate UI inputs as soon as global auth state populates or shifts.
   */
  useEffect(() => {
    if (contextUser) {
      setUser({
        name: contextUser.name || "",
        email: contextUser.email || "",
        phone: contextUser.phone ? formatBrazilianPhone(contextUser.phone) : "", // Apply formatting on load
        address: contextUser.address || "",
        password: "", // Security best practice: Never attempt to expose or pull current password hashes into form states
        photo: contextUser.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(contextUser.name || "User")}`,
      });
    }
  }, [contextUser]);

  /**
   * Maps text field mutations seamlessly to local component state fields.
   */
  function handleInputChange(e) {
    const { name, value } = e.target;
    
    // Intercept phone entry to apply best-practice dynamic formatting mask
    const finalValue = name === "phone" ? formatBrazilianPhone(value) : value;
    
    setUser((prev) => ({ ...prev, [name]: finalValue }));
  }

  /**
   * Programmatically triggers the hidden file picker input when the user clicks the avatar container.
   */
  function handleAvatarClick() {
    if (isEditing && !isSaving) {
      fileInputRef.current?.click();
    }
  }

  /**
   * Handles local file selection, validates constraints, and encodes binary data to a Base64 string.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Native file input change event
   */
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security & Performance Guard: Reject files larger than 2MB to keep payload overhead lightweight
    if (file.size > 2 * 1024 * 1024) {
      alert("A imagem é muito grande! Escolha uma foto de no máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // FileReader converts the image file into a base64 encoded data URL string
      setUser((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  }

  /**
   * Validates state data consistency rules before dispatching record updates upstream to API and context.
   */
  async function handleSaveChanges() {
    // Basic verification guard for essential account details
    if (!user.name.trim() || !user.phone.trim()) {
      alert("Por favor, preencha todos os campos obrigatórios (Nome e Telefone).");
      return;
    }

    setIsSaving(true);

    try {
      // Assemble standard structural data payload according to updated Prisma definitions
      const payload = {
        name: user.name.trim(),
        phone: user.phone.trim(), 
        address: user.address.trim(),
        photo: user.photo, // Passes the Base64 string smoothly over standard JSON
      };

      // Conditionally attach password property only if the user actively modified it
      if (user.password.trim().length > 0) {
        payload.password = user.password;
      }

      // Extract the dynamic user ID from the session context (supports both 'id' and '_id' syntax profiles)
      const userId = contextUser?.id || contextUser?._id;
      if (!userId) {
        throw new Error("User identifier missing from local session context.");
      }

      // 1. Persist modifications permanently via the database API layer passing the ID
      const updatedData = await userApi.updateProfile(userId, payload);

      // 2. Refresh global reactive application memory instantly
      updateUser(updatedData);

      alert("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update process failure:", error);
      alert(error.message || "Erro ao salvar os dados.");
    } finally {
      setIsSaving(false);
    }
  }

  if (loading) return <div style={styles.container}><h3>Carregando dados do usuário...</h3></div>;
  if (!contextUser) return <div style={styles.container}><h3 style={{color: "red"}}>Acesso negado. Por favor, faça login.</h3></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Meus Dados</h1>

      <div style={styles.cardForm}>
        <h2 style={styles.sectionTitle}>Informações Pessoais</h2>

        {/* Interactive Interactive Avatar Container */}
        <div 
          style={{ 
            ...styles.avatarWrapper, 
            cursor: isEditing && !isSaving ? "pointer" : "default",
            opacity: isSaving ? 0.7 : 1 
          }}
          onClick={handleAvatarClick}
          title={isEditing ? "Clique para alterar sua foto de perfil" : ""}
        >
          <img src={user.photo} alt="User Avatar Display" style={styles.avatarImage} />
          
          {/* Visual indicator overlay badge (Magnifying glass lens icon) displayed exclusively during edit mode */}
          {isEditing && (
            <div style={styles.avatarOverlayBadge}>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          )}
        </div>

        {/* Completely hidden native file input controlled via React ref bridges */}
        <input
          ref={fileInputRef}
          type="file"
          name="photoFile"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
          disabled={isSaving}
        />

        <div style={styles.inputsGroup}>
          <label style={styles.label}>Nome Completo *</label>
          <input
            style={styles.input}
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            disabled={!isEditing || isSaving}
          />

          <label style={styles.label}>E-mail da Conta (Não alterável)</label>
          <input
            type="email"
            name="email"
            value={user.email}
            disabled={true} 
            style={{ ...styles.input, backgroundColor: "#e2e8f0", color: "#64748b", cursor: "not-allowed" }}
          />

          <label style={styles.label}>Telefone de Contato *</label>
          <input
            style={styles.input}
            type="tel"
            name="phone"
            placeholder="(11) 99999-9999"
            maxLength="15" 
            value={user.phone}
            onChange={handleInputChange}
            disabled={!isEditing || isSaving}
          />

          <label style={styles.label}>Endereço Residencial</label>
          <input
            style={styles.input}
            type="text"
            name="address"
            value={user.address}
            onChange={handleInputChange}
            disabled={!isEditing || isSaving}
          />

          <label style={styles.label}>Nova Senha (Deixe em branco para manter a atual)</label>
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder={isEditing ? "Digite a nova senha se desejar alterar" : "********"}
            value={user.password}
            onChange={handleInputChange}
            disabled={!isEditing || isSaving}
          />
        </div>

        {isEditing ? (
          <button 
            style={{ ...styles.saveButton, opacity: isSaving ? 0.7 : 1, cursor: isSaving ? "not-allowed" : "pointer" }} 
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Dados"}
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
  avatarWrapper: {
    position: "relative",
    width: "112px",
    height: "112px",
    marginBottom: "24px",
    transition: "transform 0.2s ease, opacity 0.2s ease",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #2563EB",
  },
  avatarOverlayBadge: {
    position: "absolute",
    bottom: "2px",
    right: "2px",
    background: "#2563EB",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.4)",
    border: "2px solid #ffffff",
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