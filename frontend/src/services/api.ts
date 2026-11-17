import axios from "axios";
import { auth } from "../assets/config/firebase"; // Ajusta este caminho se a tua config do firebase estiver noutra pasta

export const api = axios.create({
  baseURL: "http://localhost:8080", // O endereço do teu Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercetor de Requisição: Injeta o token do Firebase automaticamente
api.interceptors.request.use(
  async (config) => {
    // Pega no utilizador atualmente logado no Firebase
    const user = auth.currentUser;

    if (user) {
      // Pede o token fresco ao Firebase (gere automaticamente a renovação se estiver expirado)
      const token = await user.getIdToken();

      // Adiciona o token ao cabeçalho de Autorização
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
