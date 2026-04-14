import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import AuthService from "../services/authService";
import logo from "../assets/logo.png";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erros, setErros] = useState({});
    const [loading, setLoading] = useState(false);
    const [erroGeral, setErroGeral] = useState("");

    const navigate = useNavigate();

    function validar() {
        const novosErros = {};

        if (!email) {
            novosErros.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            novosErros.email = "Email inválido";
        }

        if (!senha) {
            novosErros.senha = "Senha é obrigatória";
        } else if (senha.length < 6) {
            novosErros.senha = "Mínimo 6 caracteres";
        }

        return novosErros;
    }

    async function handleLogin(e) {
        e.preventDefault();

        const validacao = validar();

        if (Object.keys(validacao).length > 0) {
            setErros(validacao);
            return;
        }

        setErros({});
        setErroGeral("");
        setLoading(true);

        try {
            const response = await AuthService.login(email, senha);

            AuthService.saveAuth(response);

            navigate("/home");
        } catch (error) {
            setErroGeral(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.card}>
                
                {/* 🔥 LOGO + BRAND */}
                <div style={styles.header}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <h3 className="header"> Login</h3>
                </div>

                {erroGeral && (
                    <div style={styles.errorBox}>
                        {erroGeral}
                    </div>
                )}

                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={erros.email}
                />

                <Input
                    label="Senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    error={erros.senha}
                />

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
        background: "linear-gradient(135deg, #4facfe, #00f2fe)"
    },
    card: {
        background: "#eaebed",
        padding: "40px",
        borderRadius: "12px",
        width: "320px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        animation: "fadeIn 0.3s ease-in-out"
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
    title: {
        margin: "10px 0 5px",
        fontSize: "24px"
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
        background: "#4facfe",
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
    }
};

export default Login;