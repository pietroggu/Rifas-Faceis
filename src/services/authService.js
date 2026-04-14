/**
 * Serviço de autenticação (template)
 * Simula chamadas para API
 */
class AuthService {
    /**
     * Simula login do usuário
     * @param {string} email 
     * @param {string} senha 
     * @returns {Promise<Object>}
     */
    static async login(email, senha) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulação de validação
                if (email === "admin@rifas.com" && senha === "123456") {
                    resolve({
                        token: "fake-jwt-token",
                        user: {
                            nome: "Administrador",
                            email
                        }
                    });
                } else {
                    reject(new Error("Credenciais inválidas"));
                }
            }, 1000);
        });
    }

    /**
     * Salva autenticação no localStorage
     */
    static saveAuth(data) {
        localStorage.setItem("auth", JSON.stringify(data));
    }

    /**
     * Remove autenticação
     */
    static logout() {
        localStorage.removeItem("auth");
    }

    /**
     * Verifica se usuário está logado
     */
    static isAuthenticated() {
        return !!localStorage.getItem("auth");
    }
}

export default AuthService;