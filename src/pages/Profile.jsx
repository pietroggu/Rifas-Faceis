import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; 
import { userApi } from "../api/user.api";
import ImageUploader from "../components/ImageUploader";

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
  

  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Manages loading feedback and restricts actions while updating
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  function getErrorMessage(error) {
      return (
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Ocorreu um erro inesperado"
      );
  }
  
  /**
   * Maps text field mutations seamlessly to local component state fields.
   */
  function handleInputChange(e) {
    const { name, value } = e.target;

    setSuccessMessage("");
    setGeneralError("");

    const finalValue =
      name === "phone"
        ? formatBrazilianPhone(value)
        : value;

    setUser((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  }

  function validate() {
    const newErrors = {};

    const trimmedName = user.name.trim();

    if (!trimmedName) {
      newErrors.name = "Nome é obrigatório";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Nome muito curto";
    }

    const phoneDigits = user.phone.replace(/\D/g, "");

    if (!phoneDigits) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (phoneDigits.length !== 11) {
      newErrors.phone = "Telefone inválido";
    }

    if (
      user.password &&
      user.password.length < 6
    ) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    return newErrors;
  }



  /**
   * Handles local file selection, validates constraints, and encodes binary data to a Base64 string.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Native file input change event
   */

  /**
   * Validates state data consistency rules before dispatching record updates upstream to API and context.
   */
  async function handleSaveChanges() {
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setGeneralError("");
    setSuccessMessage("");

    setIsSaving(true);

    try {
      // Assemble standard structural data payload according to updated Prisma definitions
      const payload = {
        name: user.name.trim(),
        phone: user.phone.replace(/\D/g, ""),
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

      setUser((prev) => ({
        ...prev,
        password: "",
      }));

      setErrors({});
      setGeneralError("");
      setSuccessMessage("Perfil atualizado com sucesso!");
      setIsEditing(false);

    } catch (error) {
      setGeneralError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  function handleCancelEdit() {
    setUser({
      name: contextUser.name || "",
      email: contextUser.email || "",
      phone: contextUser.phone
        ? formatBrazilianPhone(contextUser.phone)
        : "",
      address: contextUser.address || "",
      password: "",
      photo:
        contextUser.photo ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          contextUser.name || "User"
        )}`,
    });

    setErrors({});
    setGeneralError("");
    setSuccessMessage("");
    setIsEditing(false);
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Carregando dados do usuário...</p>
      </div>
    );
  }
  if (!contextUser) return <div style={styles.container}><h3 style={{color: "red"}}>Acesso negado. Por favor, faça login.</h3></div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>Meus Dados</h1>

      <div style={styles.cardForm}>
        <h2 style={styles.sectionTitle}>Informações Pessoais</h2>

        {generalError ? (
          <div style={styles.errorBox}>
            {generalError}
          </div>
        ) : successMessage ? (
          <div style={styles.successBox}>
            {successMessage}
          </div>
        ) : null}

        {/* Interactive Interactive Avatar Container */}
        <ImageUploader 
          value={user.photo} 
          onChange={(newValue) => setUser((prev) => ({ ...prev, photo: newValue }))}
          disabled={!isEditing || isSaving}
        />
        {/* Completely hidden native file input controlled via React ref bridges */}

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

          {errors.name && (
            <span style={styles.fieldError}>
              {errors.name}
            </span>
          )}

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
            maxLength={15} 
            value={user.phone}
            onChange={handleInputChange}
            disabled={!isEditing || isSaving}
          />

          {errors.phone && (
            <span style={styles.fieldError}>
              {errors.phone}
            </span>
          )}

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

          {errors.password && (
            <span style={styles.fieldError}>
              {errors.password}
            </span>
          )}
        </div>

        {isEditing ? (
          <div style={styles.buttonGroup}>
            <button
              type="button"
              style={{
                ...styles.saveButton,
                opacity: isSaving ? 0.7 : 1,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "Salvando..." : "Salvar Dados"}
            </button>

            <button
              type="button"
              style={{
                ...styles.cancelButton,
                opacity: isSaving ? 0.7 : 1,
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            style={styles.editButton}
            onClick={() => {
              setGeneralError("");
              setSuccessMessage("");
              setIsEditing(true);
            }}
          >
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
    backgroundColor: "#f5f6fa",
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
    flex: 1,
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

  errorBox: {
    background: "#ffe6e6",
    color: "#cc0000",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontSize: "14px",
    width: "100%",
  },

  successBox: {
    background: "#DCFCE7",
    color: "#166534",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
    fontSize: "14px",
    width: "100%",
  },

  fieldError: {
    color: "#cc0000",
    fontSize: "13px",
    marginBottom: "6px",
    marginTop: "-2px",
  },

  buttonGroup: {
    display: "flex",
    gap: "10px",
    width: "100%",
  },

  cancelButton: {
    flex: 1,
    padding: "14px",
    background: "#EF4444",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  loadingContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    backgroundColor: "#f5f6fa",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #2563EB",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

export default Profile;