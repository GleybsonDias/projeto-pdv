import axios from "axios";
import { getAuth } from "firebase/auth";

export const api = axios.create({
  baseURL: "http://localhost:8080", // O endereço do teu Spring Boot
});

// Interceptor: Antes de qualquer pedido ir para o backend, ele passa por aqui
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      // O getIdToken() é mágico: ele pega o token atual. Se estiver expirado,
      // ele pede um novo ao Firebase automaticamente antes de devolver!
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
