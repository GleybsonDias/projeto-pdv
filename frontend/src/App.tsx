import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./layouts/MainLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

// Importação das novas páginas
import FrenteCaixa from "./pages/FrenteCaixa";
import Produtos from "./pages/Produtos";
import Clientes from "./pages/Clientes";
import Usuarios from "./pages/Usuarios";

const Dashboard = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-900/50 border border-slate-800 border-dashed rounded-2xl">
      <h1 className="text-3xl font-bold text-slate-300">Dashboard do PDV</h1>
      <p className="text-slate-500 mt-2">
        Os gráficos e relatórios aparecerão aqui.
      </p>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/pdv"
            element={
              <PrivateRoute>
                <MainLayout>
                  <FrenteCaixa />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/produtos"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Produtos />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Clientes />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Usuarios />
                </MainLayout>
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
