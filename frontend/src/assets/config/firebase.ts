import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAHg9614ZQDPckyraLdtZy9g11QL3Eh_74",
  authDomain: "pdv-system-bebf1.firebaseapp.com",
  projectId: "pdv-system-bebf1",
  storageBucket: "pdv-system-bebf1.firebasestorage.app",
  messagingSenderId: "590082291950",
  appId: "1:590082291950:web:fea482acc856a7973b9bff",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta a instância de autenticação para a usarmos no Login
export const auth = getAuth(app);
