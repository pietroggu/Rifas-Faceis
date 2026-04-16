import React, { useState } from "react";

function Dados() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [editing, setEditing] = useState(true);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  }

  function handleSave() {
    if (!user.name || !user.email || !user.phone) {
      alert("Preencha todos os campos!");
      return;
    }

    setEditing(false);
    console.log("Dados salvos:", user);
  }

  return (
    <div style={styles.container}>
      <h1>Meus Dados</h1>

      <div style={styles.form}>
        <h2>Informações pessoais</h2>

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Nome completo"
          value={user.name}
          onChange={handleChange}
          disabled={!editing}
        />

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          disabled={!editing}
        />

        <input
          style={styles.input}
          type="tel"
          name="phone"
          placeholder="Telefone"
          value={user.phone}
          onChange={handleChange}
          disabled={!editing}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Senha"
          value={user.password}
          onChange={handleChange}
          disabled={!editing}
        />

        {editing ? (
          <button style={styles.saveButton} onClick={handleSave}>
            Salvar dados
          </button>
        ) : (
          <button style={styles.editButton} onClick={() => setEditing(true)}>
            Editar dados
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },

  form: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    maxWidth: "500px",
    marginInline: "auto",
    padding: "30px",
    background: "#f1f5f9",
    borderRadius: "12px",
    minHeight: "350px",
    justifyContent: "center",
  },

  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
  },

  saveButton: {
    padding: "12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  editButton: {
    padding: "12px",
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Dados;