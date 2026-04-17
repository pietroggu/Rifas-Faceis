import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import logo from "../assets/logo.png";

function Register() {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [telefone, setTelefone] = useState("");
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

    async function handleRegister(e) {
        e.preventDefault();

        const validacao = validar();

        if (Object.keys(validacao).length > 0) {
            setErros(validacao);
            return;
        }

        setErros({});
        setErroGeral("");
        setLoading(true);

        setTimeout(() => {
            navigate("/"); // volta pro login
        }, 500);
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.card}>
                
                {/* 🔥 LOGO + BRAND */}
                <div style={styles.header}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                    <p style={styles.subtitle}>Crie sua conta para participar das rifas</p>
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
                    label="Nome"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    label="Telefone"
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                />

                <Input
                    label="Senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    error={erros.senha}
                />

                <button type="submit" disabled={loading} style={styles.button}>
                    {loading ? "Registrando..." : "Registre-se"}
                </button>

                {/* 🔥 VOLTAR PRO LOGIN */}
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