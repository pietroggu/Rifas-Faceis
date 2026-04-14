import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erros, setErros] = useState({});
    const [loading, setLoading] = useState(false);

    // Hook de navegação
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
            novosErros.senha = "Senha deve ter pelo menos 6 caracteres";
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
        setLoading(true);

        try {
            // Simulação de login
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Aqui você normalmente salvaria o token
            localStorage.setItem("auth", "true");

            // 🔥 REDIRECIONAMENTO
            navigate("/home");

        } catch (error) {
            alert("Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.card}>
                <h2 style={{ textAlign: "center" }}>Login</h2>

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
            </form>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5"
    },
    card: {
        background: "#fff",
        padding: "30px",
        borderRadius: "10px",
        width: "300px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
    },
    button: {
        width: "100%",
        padding: "10px",
        background: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    }
};

export default Login;