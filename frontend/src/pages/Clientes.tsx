import React, { useState, useEffect } from "react";
import { api } from "../services/api";

// Tipagem (ajusta os campos se no teu Java estiverem com nomes diferentes, ex: cpfCnpj em vez de documento)
interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  documento: string;
  status: "Ativo" | "Inativo";
  ultimaCompra?: string;
}

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [pesquisa, setPesquisa] = useState("");

  // Estados da API
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  // Busca os clientes ao Spring Boot
  useEffect(() => {
    const carregarClientes = async () => {
      try {
        setLoading(true);
        // Aponta para o endpoint correto do teu backend
        const response = await api.get("/api/clientes");
        setClientes(response.data);
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
        setErro("Não foi possível carregar a lista de clientes.");
      } finally {
        setLoading(false);
      }
    };

    carregarClientes();
  }, []);

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      c.email?.toLowerCase().includes(pesquisa.toLowerCase()) ||
      c.documento?.includes(pesquisa),
  );

  return (
    <div className="h-full flex flex-col">
      {/* Cabeçalho da Página */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Gestão de Clientes
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Gere a tua base de clientes, contactos e histórico.
          </p>
        </div>

        <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Novo Cliente
        </button>
      </div>

      {/* Barra de Ferramentas (Pesquisa e Filtros) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-t-2xl p-4 flex gap-4 items-center">
        <div className="flex-1 relative max-w-md">
          <svg
            className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Pesquisar por nome, email ou CPF/CNPJ..."
            value={pesquisa}
            onChange={(e) => setPesquisa(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Tabela de Clientes */}
      <div className="flex-1 bg-slate-900/80 border-x border-b border-slate-800 rounded-b-2xl overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="px-6 py-4">Cliente</th>
                <th className="px-6 py-4">CPF / CNPJ</th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4">Última Compra</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {/* ESTADO DE LOADING */}
              {loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <svg
                        className="animate-spin h-8 w-8 text-indigo-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-slate-400 font-medium">
                        A carregar clientes...
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {/* ESTADO DE ERRO */}
              {!loading && erro && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl inline-block">
                      {erro}
                    </div>
                  </td>
                </tr>
              )}

              {/* LISTAGEM DE CLIENTES */}
              {!loading && !erro && clientesFiltrados.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              ) : (
                !loading &&
                !erro &&
                clientesFiltrados.map((cliente) => (
                  <tr
                    key={cliente.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-200">
                          {cliente.nome}
                        </span>
                        <span className="text-xs text-slate-500 mt-0.5">
                          {cliente.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">
                      {cliente.documento || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {cliente.telefone || "-"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                          cliente.status === "Ativo"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cliente.status === "Ativo" ? "bg-emerald-400" : "bg-slate-500"}`}
                        ></span>
                        {cliente.status || "Ativo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {cliente.ultimaCompra || "-"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors"
                          title="Editar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                          title="Eliminar"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
