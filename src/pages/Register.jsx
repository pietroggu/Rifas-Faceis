import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { userApi } from "../api/user.api";
import logo from "../assets/logo.png";

function Register() {
    // Form state definitions
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const navigate = useNavigate();

    /**
     * Validates input fields before registration submission.
     * @returns {Object} Found errors mapping fields to messages
     */
    function validate() {
        const newErrors = {};

        if (!email) {
            newErrors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email inválido";
        }

        if (!password) {
            newErrors.password = "Senha é obrigatória";
        } else if (password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }

        return newErrors;
    }

    /**
     * Handles the registration form submission.
     * @param {Event} e
     */
    async function handleRegister(e) {
        e.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setGeneralError("");
        setLoading(true);

        try {
            // Send payload to real API
            await userApi.register({
                email,
                name,
                phone,
                password
            });

            // Redirect to login page on success
            navigate("/"); 
        } catch (error) {
            setGeneralError(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.card}>
                
                <div style={styles.header}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <p style={styles.subtitle}>Crie sua conta para participar das rifas</p>
                </div>

                {generalError && (
                    <div style={styles.errorBox}>
                        {generalError}
                    </div>
                )}

                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={errors.email}
                />

                <Input
                    label="Nome"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                
                <Input
                    label="Telefone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <Input
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Registrando..." : "Registre-se"}
                </button>

                <div style={styles.registerContainer}>
                    <span>Já tem conta? </span>
                    <span 
                        style={styles.registerLink}
                        onClick={() => navigate("/")}
                    >
                        Entrar
                    </span>
                </div>

            </form>
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#3B82F6"
    },
    card: {
        background: "#eaebed",
        padding: "40px",
        borderRadius: "12px",
        width: "320px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    },
    header: {
        textAlign: "center",
        marginBottom: "20px"
    },
    logo: {
        width: "200px",
        height: "auto",
        objectFit: "contain",
        margin: "0px"
    },
    subtitle: {
        fontSize: "15px",
        color: "#666"
    },
    errorBox: {
        background: "#ffe6e6",
        color: "#cc0000",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "10px",
        fontSize: "14px"
    },
    button: {
        width: "100%",
        padding: "12px",
        background: "#2563EB",
        color: "#eaebed",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    registerContainer: {
        marginTop: "15px",
        textAlign: "center",
        fontSize: "14px"
    },
    registerLink: {
        color: "#4facfe",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

export default Register;