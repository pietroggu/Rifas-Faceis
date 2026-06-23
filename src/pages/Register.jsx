import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { userApi } from "../api/user.api";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function Register() {
    // Form state definitions
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [isLinkHovered, setIsLinkHovered] = useState(false);

    const navigate = useNavigate();

    const buttonStyle = {
        ...styles.button,
        background: loading ? "#2563EB" : isButtonHovered ? "#1D4ED8" : "#2563EB",
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.8 : 1,
    };

    const registerLinkStyle = {
        ...styles.registerLink,
        textDecoration: isLinkHovered ? "underline" : "none",
    };

    function validateEmail(email) {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            return "Email é obrigatório";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailRegex.test(trimmedEmail)) {
            return "Email inválido";
        }

        return null;
    }

    function getErrorMessage(error) {
        return (
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Ocorreu um erro inesperado"
        );
    }

    function formatPhone(value) {
        const numbers = value.replace(/\D/g, "");

        if (numbers.length <= 2) {
            return numbers;
        }

        if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        }

        if (numbers.length <= 11) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        }

        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }


    function handleEmailChange(e) {
        const value = e.target.value;

        setEmail(value);
        setGeneralError("");

        const emailError = validateEmail(value);

        setErrors((prev) => ({
            ...prev,
            email: emailError,
        }));
    }

    function handleNameChange(e) {
        setName(e.target.value);

        if (errors.name) {
            setErrors((prev) => ({
                ...prev,
                name: undefined,
            }));
        }
    }

    function handlePhoneChange(e) {
        const formattedPhone = formatPhone(e.target.value);

        setPhone(formattedPhone);
        setGeneralError("");

        const phoneDigits = formattedPhone.replace(/\D/g, "");

        setErrors((prev) => ({
            ...prev,
            phone:
                phoneDigits.length > 0 && phoneDigits.length < 11
                    ? "Telefone inválido"
                    : undefined,
        }));
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);

        if (errors.password || errors.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                password: undefined,
                confirmPassword: undefined,
            }));
        }
    }

    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);

        if (errors.confirmPassword) {
            setErrors((prev) => ({
                ...prev,
                confirmPassword: undefined,
            }));
        }
    }


    /**
     * Validates input fields before registration submission.
     * @returns {Object} Found errors mapping fields to messages
     */
    function validate() {
        const newErrors = {};
        const emailError = validateEmail(email);
        const cleanName = name.trim();

        if (emailError) {
            newErrors.email = emailError;
        }

        if (!cleanName) {
            newErrors.name = "Nome é obrigatório";
        } else if (cleanName.length < 2) {
            newErrors.name = "Nome muito curto";
        }

        const phoneDigits = phone.replace(/\D/g, "");

        if (!phoneDigits) {
            newErrors.phone = "Telefone é obrigatório";
        } else if (phoneDigits.length !== 11) {
            newErrors.phone = "Telefone inválido";
        }

        if (!password) {
            newErrors.password = "Senha é obrigatória";
        } else if (password.length < 6) {
            newErrors.password = "Mínimo 6 caracteres";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Confirme sua senha";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "As senhas não coincidem";
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
                email: email.trim(),
                name: name.trim(),
                phone: phone.replace(/\D/g, ""),
                password,
            });

            setEmail("");
            setName("");
            setPhone("");
            setPassword("");
            setConfirmPassword("");

            // Redirect to login page on success
            navigate("/", {
                state: {
                    successMessage: "Conta criada com sucesso!  Faça login para continuar.",
                },
            }); 
        } catch (error) {
            const message = getErrorMessage(error);

            if (
                message.toLowerCase().includes("email")
            ) {
                setErrors((prev) => ({
                    ...prev,
                    email: message,
                }));
            } else {
                setGeneralError(message);
            }
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
                    autoFocus
                    value={email}
                    onChange={handleEmailChange}
                    error={errors.email}
                />

                <Input
                    label="Nome"
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    error={errors.name}
                />
                
                <Input
                    label="Telefone"
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    error={errors.phone}
                />

                <Input
                    label="Senha"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={errors.password}
                />

                <Input
                    label="Confirmar senha"
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={errors.confirmPassword}
                />

                <button
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => setIsButtonHovered(true)}
                    onMouseLeave={() => setIsButtonHovered(false)}
                    style={buttonStyle}
                >
                    {loading ? "Registrando..." : "Registre-se"}
                </button>

                <div style={styles.registerContainer}>
                    <span>Já tem conta? </span>
                    <Link
                        to="/"
                        onMouseEnter={() => setIsLinkHovered(true)}
                        onMouseLeave={() => setIsLinkHovered(false)}
                        style={registerLinkStyle}
                    >
                        Entrar
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

    subtitle: {
        fontSize: "14px",
        color: "#64748B",
        lineHeight: "20px",
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
    }
};

export default Register;