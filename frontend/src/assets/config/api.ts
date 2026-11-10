import axios from "axios";
import { auth } from "./firebase";

// Cria uma instância do Axios apontando para o teu Spring Boot
const api = axios.create({
  baseURL: "http://localhost:8080",
});

// Interceta todos os pedidos ANTES de saírem para o servidor
api.interceptors.request.use(
  async (config) => {
    // Verifica se há algum utilizador logado no Firebase neste momento
    const user = auth.currentUser;

    if (user) {
      // Pede o token JWT atualizado ao Firebase
      const token = await user.getIdToken();
      // Anexa o token ao cabeçalho de Autorização
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
