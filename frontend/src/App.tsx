import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";

// Componente temporário para representar a área restrita do sistema
const Dashboard = () => {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard do PDV</h1>
      <p className="text-gray-500 mt-2">
        Área de trabalho principal em construção.
      </p>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública de Login */}
        <Route path="/login" element={<Login />} />

        {/* Rota principal (Dashboard) */}
        <Route path="/" element={<Dashboard />} />

        {/* Redireciona qualquer rota que não exista para o Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
