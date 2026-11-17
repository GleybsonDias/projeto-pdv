import React from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../assets/config/firebase";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O PrivateRoute vai detetar a saída e redirecionar para /login automaticamente,
      // mas podemos forçar a navegação por segurança.
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#0B0F19] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar (Menu Lateral) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 mr-3">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            PDV System
          </span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            Principal
          </div>

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 font-medium rounded-xl border transition-all ${isActive ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent"}`
            }
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Dashboard
          </NavLink>

          <NavLink
            to="/pdv"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 font-medium rounded-xl border transition-all ${isActive ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent"}`
            }
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Frente de Caixa
          </NavLink>

          <NavLink
            to="/produtos"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 font-medium rounded-xl border transition-all ${isActive ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent"}`
            }
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            Produtos
          </NavLink>

          <NavLink
            to="/clientes"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 font-medium rounded-xl border transition-all ${isActive ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent"}`
            }
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Clientes
          </NavLink>

          <NavLink
            to="/usuarios"
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 font-medium rounded-xl border transition-all ${isActive ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent"}`
            }
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Usuários
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 hover:border-red-500/30 border border-transparent font-medium rounded-xl transition-all"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* Área Central (Main Content) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar (Cabeçalho) */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-8 z-10">
          <h2 className="text-lg font-semibold text-slate-200">
            Painel de Controlo
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-slate-200">
                Operador Caixa
              </span>
              <span className="text-xs text-green-400 font-medium flex items-center justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Caixa Aberto
              </span>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-600 border-2 border-indigo-400 flex items-center justify-center text-sm font-bold shadow-lg shadow-indigo-600/20">
              OP
            </div>
          </div>
        </header>

        {/* Conteúdo da Página (onde o Dashboard vai ser injetado) */}
        <main className="flex-1 overflow-y-auto p-8 relative">{children}</main>
      </div>
    </div>
  );
}
