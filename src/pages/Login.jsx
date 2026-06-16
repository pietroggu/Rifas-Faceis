import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

/**
 * Authentication login interface screen.
 * Validates, intercepts credentials forms, and dispatches sessions state modifications hooks.
 */
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    
    // Deconstruct dynamic loading triggers and global context dispatcher state
    const { loginUser, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!loading && isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    /**
     * Client-side validation processor inspecting constraints layout compliance.
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
     * Form submit event interceptor dispatching validation chains and session bindings.
     */
    async function handleLogin(e) {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setGeneralError("");

        try {
            // Triggers context pipeline to execute login, sync state, and persist keys cleanly
            await loginUser(email, password, rememberMe);
            navigate("/home");
        } catch (error) {
            setGeneralError(error.message);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.card}>
                <div style={styles.header}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <h3 className="header">Login</h3>
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
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                />

                <div style={styles.rememberContainer}>
                    <input
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={styles.checkbox}
                    />
                    <label htmlFor="rememberMe" style={styles.rememberLabel}>
                        Manter conectado
                    </label>
                </div>

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Entrando..." : "Entrar"}
                </button>
                
                <div style={styles.registerContainer}>
                    <span>Não tem conta? </span>
                    <span 
                        style={styles.registerLink}
                        onClick={() => navigate("/register")}
                    >
                        Registrar
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
        transition: "0.2s"
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
    },

    rememberContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "15px",
        fontSize: "14px"
    },

    checkbox: {
        cursor: "pointer"
    },

    rememberLabel: {
        cursor: "pointer",
        color: "#333"
    },
};

export default Login;