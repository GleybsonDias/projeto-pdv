import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import toast from "react-hot-toast";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  criado_em?: string;
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [processando, setProcessando] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  // Estado para saber se estamos a criar ou a editar (se tiver ID, é edição)
  const [usuarioForm, setUsuarioForm] = useState({
    id: "",
    nome: "",
    email: "",
    senha: "",
    cargo: "OPERADOR",
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      toast.error("Erro ao carregar a lista de utilizadores.");
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNovo = () => {
    setUsuarioForm({
      id: "",
      nome: "",
      email: "",
      senha: "",
      cargo: "OPERADOR",
    });
    setModalAberto(true);
  };

  const abrirModalEditar = (user: Usuario) => {
    setUsuarioForm({
      id: user.id,
      nome: user.nome,
      email: user.email,
      senha: "", // A senha vem vazia por segurança. Só preenche se quiser alterar.
      cargo: user.cargo,
    });
    setModalAberto(true);
  };

  const handleSalvarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setProcessando(true);

      if (usuarioForm.id) {
        // MODO EDIÇÃO (PUT)
        await api.put(`/api/usuarios/${usuarioForm.id}`, usuarioForm);
        toast.success("Usuário atualizado com sucesso!");
      } else {
        // MODO CRIAÇÃO (POST)
        if (!usuarioForm.senha || usuarioForm.senha.length < 6) {
          toast.error(
            "A senha é obrigatória e deve ter 6 caracteres para novos utilizadores.",
          );
          setProcessando(false);
          return;
        }
        await api.post("/api/usuarios", usuarioForm);
        toast.success("Usuário criado com sucesso!");
      }

      setModalAberto(false);
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      toast.error("Erro ao processar a requisição.");
    } finally {
      setProcessando(false);
    }
  };

  const confirmarExclusao = (id: string, nome: string) => {
    setUsuarioParaExcluir({ id, nome });
    setModalExcluirAberto(true);
  };

  const executarExclusao = async () => {
    if (!usuarioParaExcluir) return;

    try {
      setProcessando(true);
      await api.delete(`/api/usuarios/${usuarioParaExcluir.id}`);
      toast.success("Usuário excluído com sucesso!");
      setModalExcluirAberto(false);
      setUsuarioParaExcluir(null);
      carregarUsuarios();
    } catch (error) {
      console.error("Erro ao excluir usuário:", error);
      toast.error("Erro ao excluir o utilizador.");
    } finally {
      setProcessando(false);
    }
  };

  // Filtragem de usuários com base na barra de pesquisa
  const usuariosFiltrados = usuarios.filter(
    (user) =>
      user.nome.toLowerCase().includes(busca.toLowerCase()) ||
      user.email.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="h-full flex flex-col">
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Usuários</h1>
          <p className="text-slate-400">
            Gere os acessos e operadores do sistema
          </p>
        </div>
        <button
          onClick={abrirModalNovo}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
        >
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Novo Usuário
        </button>
      </div>

      {/* CONTAINER PRINCIPAL COM PESQUISA E TABELA (PADRÃO PRODUTOS) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex-1 shadow-xl flex flex-col">
        {/* BARRA DE PESQUISA */}
        <div className="p-4 border-b border-slate-800">
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Pesquisar por nome ou e-mail..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition-all"
            />
          </div>
        </div>

        {/* TABELA */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th className="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Nome
                </th>
                <th className="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  E-mail
                </th>
                <th className="p-4 text-sm font-semibold text-slate-400 uppercase tracking-wider">
                  Cargo
                </th>
                <th className="p-4 text-sm font-semibold text-slate-400 text-right uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    A carregar utilizadores...
                  </td>
                </tr>
              ) : usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Nenhum utilizador encontrado.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-800/30 transition-colors group"
                  >
                    <td className="p-4 text-slate-200 font-medium">
                      {user.nome}
                    </td>
                    <td className="p-4 text-slate-400">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                          user.cargo === "ADMIN"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {user.cargo}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => abrirModalEditar(user)}
                        className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors"
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
                        onClick={() => confirmarExclusao(user.id, user.nome)}
                        className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                        title="Excluir"
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (SERVE PARA CRIAR E EDITAR) */}
      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-xl font-bold text-white">
                {usuarioForm.id ? "Editar Usuário" : "Criar Novo Usuário"}
              </h2>
              <button
                onClick={() => setModalAberto(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSalvarUsuario} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Nome Completo
                </label>
                <input
                  required
                  type="text"
                  value={usuarioForm.nome}
                  onChange={(e) =>
                    setUsuarioForm({ ...usuarioForm, nome: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  E-mail
                </label>
                <input
                  required
                  type="email"
                  value={usuarioForm.email}
                  onChange={(e) =>
                    setUsuarioForm({ ...usuarioForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  {usuarioForm.id
                    ? "Nova Senha (deixa em branco para manter)"
                    : "Senha (mínimo 6 caracteres)"}
                </label>
                <input
                  type="password"
                  minLength={6}
                  required={!usuarioForm.id} // Só é obrigatória na criação
                  value={usuarioForm.senha}
                  onChange={(e) =>
                    setUsuarioForm({ ...usuarioForm, senha: e.target.value })
                  }
                  placeholder={usuarioForm.id ? "••••••••" : ""}
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">
                  Cargo
                </label>
                <select
                  value={usuarioForm.cargo}
                  onChange={(e) =>
                    setUsuarioForm({ ...usuarioForm, cargo: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="OPERADOR">Operador de Caixa</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={processando}
                  className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  {processando ? "A salvar..." : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO */}
      {modalExcluirAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              Excluir Utilizador
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              Tens a certeza que queres excluir{" "}
              <span className="text-slate-200 font-semibold">
                "{usuarioParaExcluir?.nome}"
              </span>
              ? Esta ação é irreversível e apagará o acesso no Firebase.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setModalExcluirAberto(false)}
                className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={processando}
                onClick={executarExclusao}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {processando ? "A excluir..." : "Sim, Excluir"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
