import React, { useState, useEffect } from "react";
import Input from "../components/Input";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";
import { useNavigate, Navigate, Link, useLocation } from "react-router-dom";

/**
 * Authentication login interface screen.
 * Validates, intercepts credentials forms, and dispatches sessions state modifications hooks.
 */
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isLinkHovered, setIsLinkHovered] = useState(false);

    // Deconstruct dynamic loading triggers and global context dispatcher state
    const { loginUser, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();
    const successMessage = location.state?.successMessage;

    useEffect(() => {
        if (successMessage) {
            window.history.replaceState({}, document.title);
        }
    }, [successMessage]);

    const buttonStyle = {
        ...styles.button,
        background: isButtonHovered ? "#1D4ED8" : "#2563EB",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.8 : 1,
    };

    const registerLinkStyle = {
        ...styles.registerLink,
        textDecoration: isLinkHovered ? "underline" : "none",
    };
    

    if (!loading && isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);

        if (errors.email) {
            setErrors((prev) => ({
                ...prev,
                email: undefined,
            }));
        }
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);

        if (errors.password) {
            setErrors((prev) => ({
                ...prev,
                password: undefined,
            }));
        }
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

                {generalError ? (
                    <div style={styles.errorBox}>
                        {generalError}
                    </div>
                ) : successMessage ? (
                    <div style={styles.successBox}>
                        {successMessage}
                    </div>
                ) : null}

                <Input
                    label="Email"
                    type="email"
                    autoFocus
                    value={email}
                    onChange={handleEmailChange}
                    error={errors.email}
                />

                <Input
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
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

                <button
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    style={buttonStyle}
                >
                    {loading ? "Entrando..." : "Entrar"}
                </button>
                
                <div style={styles.registerContainer}>
                    <span>Não tem conta? </span>
                    <Link
                        to="/register"
                        onMouseEnter={() => setIsLinkHovered(true)}
                        onMouseLeave={() => setIsLinkHovered(false)}
                        style={registerLinkStyle}
                    >
                        Registrar
                    </Link>
                </div>
            </form>
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        minHeight: "100vh",
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
        width: "160px",
        height: "auto",
        objectFit: "contain"
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
        transition: "all 0.2s ease",
    },
    registerContainer: {
        marginTop: "15px",
        textAlign: "center",
        fontSize: "14px"
    },
    registerLink: {
        color: "#2563EB",
        cursor: "pointer",
        fontWeight: "bold",
        textDecoration: "none",
    },

    rememberContainer: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "15px",
        fontSize: "14px"
    },

    checkbox: {
        cursor: "pointer",
        width: "16px",
        height: "16px",
    },

    rememberLabel: {
        cursor: "pointer",
        color: "#333"
    },

    successBox: {
        background: "#DCFCE7",
        color: "#166534",
        padding: "10px",
        borderRadius: "5px",
        marginBottom: "10px",
        fontSize: "14px",
    },
};

export default Login;